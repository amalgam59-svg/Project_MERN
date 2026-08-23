import Post from '../models/Post.js'
import User from '../models/User.js'
import cloudinary from '../config/cloudinary.js'

export const uploadPostImage = async (req, res) => {
	try {
		if (!req.file) return res.status(400).json({ success: false, message: 'An image file is required' })

		const result = await new Promise((resolve, reject) => {
			const stream = cloudinary.uploader.upload_stream({ folder: 'nook/posts', resource_type: 'image' }, (error, uploadResult) => {
				if (error) reject(error)
				else resolve(uploadResult)
			})
			stream.end(req.file.buffer)
		})

		return res.status(201).json({ success: true, url: result.secure_url })
	} catch (error) {
		return res.status(500).json({ success: false, message: 'Failed to upload post image' })
	}
}

const AUTHOR_FIELDS = 'name handle avatar'

const sanitizePost = (post, currentUserId) => ({
	id: post._id,
	author: post.author,
	text: post.text,
	image: post.image,
	likes: post.likes.length,
	liked: currentUserId ? post.likes.some((id) => id.toString() === currentUserId.toString()) : false,
	comments: post.comments,
	createdAt: post.createdAt,
	updatedAt: post.updatedAt,
})

export const createPost = async (req, res) => {
	try {
		const { text, image } = req.body

		if (!text?.trim() && !image?.trim()) {
			return res.status(400).json({ success: false, message: 'Post must include text or an image' })
		}

		const post = await Post.create({ author: req.user._id, text, image })
		await post.populate('author', AUTHOR_FIELDS)

		return res.status(201).json({ success: true, post: sanitizePost(post, req.user._id) })
	} catch (error) {
		return res.status(500).json({ success: false, message: 'Failed to create post', error: error.message })
	}
}

export const getPosts = async (req, res) => {
	try {
		const page = Math.max(parseInt(req.query.page, 10) || 1, 1)
		const limit = Math.min(parseInt(req.query.limit, 10) || 20, 50)

		const posts = await Post.find()
			.sort({ createdAt: -1 })
			.skip((page - 1) * limit)
			.limit(limit)
			.populate('author', AUTHOR_FIELDS)

		return res.status(200).json({ success: true, posts: posts.map((post) => sanitizePost(post, req.user?._id)) })
	} catch (error) {
		return res.status(500).json({ success: false, message: 'Failed to fetch posts', error: error.message })
	}
}

export const getUserPosts = async (req, res) => {
	try {
		const { handle } = req.params

		const user = await User.findOne({ handle })
		if (!user) {
			return res.status(404).json({ success: false, message: 'User not found' })
		}

		const posts = await Post.find({ author: user._id })
			.sort({ createdAt: -1 })
			.populate('author', AUTHOR_FIELDS)

		return res.status(200).json({ success: true, posts: posts.map((post) => sanitizePost(post, req.user?._id)) })
	} catch (error) {
		return res.status(500).json({ success: false, message: 'Failed to fetch user posts', error: error.message })
	}
}

export const updatePost = async (req, res) => {
	try {
		const { text, image } = req.body

		const post = await Post.findById(req.params.id)
		if (!post) {
			return res.status(404).json({ success: false, message: 'Post not found' })
		}

		if (post.author.toString() !== req.user._id.toString()) {
			return res.status(403).json({ success: false, message: 'Not authorized to edit this post' })
		}

		if (text !== undefined) post.text = text
		if (image !== undefined) post.image = image

		if (!post.text.trim() && !post.image.trim()) {
			return res.status(400).json({ success: false, message: 'Post must include text or an image' })
		}

		await post.save()
		await post.populate('author', AUTHOR_FIELDS)

		return res.status(200).json({ success: true, post: sanitizePost(post, req.user._id) })
	} catch (error) {
		return res.status(500).json({ success: false, message: 'Failed to update post', error: error.message })
	}
}

export const deletePost = async (req, res) => {
	try {
		const post = await Post.findById(req.params.id)
		if (!post) {
			return res.status(404).json({ success: false, message: 'Post not found' })
		}

		if (post.author.toString() !== req.user._id.toString()) {
			return res.status(403).json({ success: false, message: 'Not authorized to delete this post' })
		}

		await post.deleteOne()

		return res.status(200).json({ success: true, message: 'Post deleted successfully' })
	} catch (error) {
		return res.status(500).json({ success: false, message: 'Failed to delete post', error: error.message })
	}
}

export const toggleLike = async (req, res) => {
	try {
		const post = await Post.findById(req.params.id)
		if (!post) {
			return res.status(404).json({ success: false, message: 'Post not found' })
		}

		const userId = req.user._id
		const alreadyLiked = post.likes.some((id) => id.toString() === userId.toString())

		if (alreadyLiked) {
			post.likes = post.likes.filter((id) => id.toString() !== userId.toString())
		} else {
			post.likes.push(userId)
		}

		await post.save()
		await post.populate('author', AUTHOR_FIELDS)

		return res.status(200).json({ success: true, post: sanitizePost(post, userId) })
	} catch (error) {
		return res.status(500).json({ success: false, message: 'Failed to toggle like', error: error.message })
	}
}
