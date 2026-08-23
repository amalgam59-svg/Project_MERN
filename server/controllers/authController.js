import User from '../models/User.js'
import generateToken from '../utils/generateToken.js'

const PASSWORD_REGEX = /^(?=.*[A-Za-z])(?=.*\d).{8,}$/

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

export const logout = async (req, res) => {
	// JWTs are stateless; the client discards the token. Endpoint exists for a consistent API contract.
	return res.status(200).json({ success: true, message: 'Logged out successfully' })
}

export const getMe = async (req, res) => {
	return res.status(200).json({ success: true, user: sanitizeUser(req.user) })
}
