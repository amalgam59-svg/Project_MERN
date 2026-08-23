import User from '../models/User.js'

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

export const getProfile = async (req, res) => {
	return res.status(200).json({ success: true, user: sanitizeUser(req.user) })
}

export const updateProfile = async (req, res) => {
	try {
		const { name, handle, avatar, bio, location, website } = req.body
		const user = req.user

		if (handle !== undefined && handle !== user.handle) {
			if (!handle.startsWith('@')) {
				return res.status(400).json({ success: false, message: 'Handle must start with @' })
			}

			const existingHandle = await User.findOne({ handle })
			if (existingHandle) {
				return res.status(409).json({ success: false, message: 'Handle is already taken' })
			}

			user.handle = handle
		}

		if (bio !== undefined) {
			if (bio.length > 160) {
				return res.status(400).json({ success: false, message: 'Bio must be 160 characters or less' })
			}
			user.bio = bio
		}

		if (name !== undefined) user.name = name
		if (avatar !== undefined) user.avatar = avatar
		if (location !== undefined) user.location = location
		if (website !== undefined) user.website = website

		await user.save()

		return res.status(200).json({ success: true, user: sanitizeUser(user) })
	} catch (error) {
		return res.status(500).json({ success: false, message: 'Failed to update profile', error: error.message })
	}
}

export const toggleFollow = async (req, res) => {
	try {
		const currentUser = req.user
		const targetUser = await User.findOne({ handle: req.params.handle })

		if (!targetUser) {
			return res.status(404).json({ success: false, message: 'User not found' })
		}

		if (targetUser._id.toString() === currentUser._id.toString()) {
			return res.status(400).json({ success: false, message: 'You cannot follow yourself' })
		}

		const isFollowing = currentUser.following.some((id) => id.toString() === targetUser._id.toString())

		if (isFollowing) {
			currentUser.following = currentUser.following.filter((id) => id.toString() !== targetUser._id.toString())
			targetUser.followers = targetUser.followers.filter((id) => id.toString() !== currentUser._id.toString())
		} else {
			currentUser.following.push(targetUser._id)
			targetUser.followers.push(currentUser._id)
		}

		await currentUser.save()
		await targetUser.save()

		return res.status(200).json({
			success: true,
			following: !isFollowing,
			followersCount: targetUser.followers.length,
		})
	} catch (error) {
		return res.status(500).json({ success: false, message: 'Failed to update follow status', error: error.message })
	}
}

export const getSuggestions = async (req, res) => {
	try {
		const currentUser = req.user
		const excludedIds = [currentUser._id, ...currentUser.following]

		const suggestions = await User.find({ _id: { $nin: excludedIds } })
			.select('name handle avatar bio')
			.limit(5)

		return res.status(200).json({ success: true, suggestions })
	} catch (error) {
		return res.status(500).json({ success: false, message: 'Failed to fetch suggestions', error: error.message })
	}
}

