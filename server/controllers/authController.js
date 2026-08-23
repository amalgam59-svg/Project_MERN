import User from '../models/User.js'
import generateToken from '../utils/generateToken.js'
import crypto from 'node:crypto'
import nodemailer from 'nodemailer'

const PASSWORD_REGEX = /^(?=.*[A-Za-z])(?=.*\d).{8,}$/

const hashResetToken = (token) => crypto.createHash('sha256').update(token).digest('hex')

const sendResetEmail = async (email, resetUrl) => {
	if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASSWORD) {
		console.log(`Password reset URL for ${email}: ${resetUrl}`)
		return
	}

	const transporter = nodemailer.createTransport({
		host: process.env.SMTP_HOST,
		port: Number(process.env.SMTP_PORT || 587),
		secure: process.env.SMTP_SECURE === 'true',
		auth: {
			user: process.env.SMTP_USER,
			pass: process.env.SMTP_PASSWORD,
		},
	})

	await transporter.sendMail({
		from: process.env.SMTP_FROM || process.env.SMTP_USER,
		to: email,
		subject: 'Reset your Nook password',
		text: `Reset your password using this link: ${resetUrl}`,
	})
}

const sanitizeUser = (user) => ({
	id: user._id,
	name: user.name,
	email: user.email,
	handle: user.handle,
	avatar: user.avatar,
	bio: user.bio,
	location: user.location,
	website: user.website,
	followers: user.followers,
	following: user.following,
	createdAt: user.createdAt,
})

const generateUniqueHandle = async (name) => {
	const base = `@${name.toLowerCase().replace(/[^a-z0-9]/g, '')}` || '@user'
	let handle = base
	let suffix = 1

	while (await User.findOne({ handle })) {
		handle = `${base}${suffix}`
		suffix += 1
	}

	return handle
}

export const register = async (req, res) => {
	try {
		const { name, email, password } = req.body

		if (!name || !email || !password) {
			return res.status(400).json({ success: false, message: 'Name, email, and password are required' })
		}

		if (!PASSWORD_REGEX.test(password)) {
			return res.status(400).json({
				success: false,
				message: 'Password must be at least 8 characters and include a letter and a number',
			})
		}

		const existingUser = await User.findOne({ email: email.toLowerCase() })
		if (existingUser) {
			return res.status(409).json({ success: false, message: 'An account with this email already exists' })
		}

		const handle = await generateUniqueHandle(name)

		const user = await User.create({ name, email, password, handle })
		const token = generateToken(user._id)

		return res.status(201).json({ success: true, token, user: sanitizeUser(user) })
	} catch (error) {
		return res.status(500).json({ success: false, message: 'Registration failed', error: error.message })
	}
}

export const login = async (req, res) => {
	try {
		const { email, password } = req.body

		if (!email || !password) {
			return res.status(400).json({ success: false, message: 'Email and password are required' })
		}

		const user = await User.findOne({ email: email.toLowerCase() }).select('+password')
		if (!user) {
			return res.status(401).json({ success: false, message: 'Invalid email or password' })
		}

		const isMatch = await user.comparePassword(password)
		if (!isMatch) {
			return res.status(401).json({ success: false, message: 'Invalid email or password' })
		}

		const token = generateToken(user._id)

		return res.status(200).json({ success: true, token, user: sanitizeUser(user) })
	} catch (error) {
		return res.status(500).json({ success: false, message: 'Login failed', error: error.message })
	}
}

export const requestPasswordReset = async (req, res) => {
	try {
		const email = req.body.email?.trim().toLowerCase()
		const genericResponse = {
			success: true,
			message: 'If an account exists for that email, a password reset link has been sent.',
		}

		if (!email) return res.status(200).json(genericResponse)

		const user = await User.findOne({ email }).select('+passwordResetToken +passwordResetExpires')
		if (!user) return res.status(200).json(genericResponse)

		const resetToken = crypto.randomBytes(32).toString('hex')
		user.passwordResetToken = hashResetToken(resetToken)
		user.passwordResetExpires = new Date(Date.now() + 15 * 60 * 1000)
		await user.save({ validateBeforeSave: false })

		const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173'
		await sendResetEmail(user.email, `${clientUrl}/login?resetToken=${resetToken}`)

		return res.status(200).json(genericResponse)
	} catch (error) {
		return res.status(500).json({ success: false, message: 'Unable to process password reset request' })
	}
}

export const resetPassword = async (req, res) => {
	try {
		const { token, password } = req.body

		if (!token || !password || !PASSWORD_REGEX.test(password)) {
			return res.status(400).json({
				success: false,
				message: 'A valid reset token and a password with at least 8 characters, including a letter and a number, are required',
			})
		}

		const user = await User.findOne({
			passwordResetToken: hashResetToken(token),
			passwordResetExpires: { $gt: new Date() },
		}).select('+password +passwordResetToken +passwordResetExpires')

		if (!user) return res.status(400).json({ success: false, message: 'Reset link is invalid or has expired' })

		user.password = password
		user.passwordResetToken = undefined
		user.passwordResetExpires = undefined
		await user.save()

		return res.status(200).json({ success: true, message: 'Password reset successfully' })
	} catch (error) {
		return res.status(500).json({ success: false, message: 'Unable to reset password' })
	}
}

export const logout = async (req, res) => {
	// JWTs are stateless; the client discards the token. Endpoint exists for a consistent API contract.
	return res.status(200).json({ success: true, message: 'Logged out successfully' })
}

export const getMe = async (req, res) => {
	return res.status(200).json({ success: true, user: sanitizeUser(req.user) })
}
