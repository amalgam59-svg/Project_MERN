import Comment from '../models/Comment.js'
import Post from '../models/Post.js'

const AUTHOR_FIELDS = 'name handle avatar'

const sanitizeComment = (comment) => ({
	id: comment._id,
	post: comment.post,
	author: comment.author,
	text: comment.text,
	createdAt: comment.createdAt,
})

export const getComments = async (req, res) => {
	try {
		const comments = await Comment.find({ post: req.params.postId })
			.sort({ createdAt: 1 })
			.populate('author', AUTHOR_FIELDS)

		return res.status(200).json({ success: true, comments: comments.map(sanitizeComment) })
	} catch (error) {
		return res.status(500).json({ success: false, message: 'Failed to fetch comments', error: error.message })
	}
}

export const addComment = async (req, res) => {
	try {
		const { text } = req.body

		if (!text?.trim()) {
			return res.status(400).json({ success: false, message: 'Comment text is required' })
		}

		const post = await Post.findById(req.params.postId)
		if (!post) {
			return res.status(404).json({ success: false, message: 'Post not found' })
		}

		const comment = await Comment.create({ post: post._id, author: req.user._id, text })
		await comment.populate('author', AUTHOR_FIELDS)

		post.comments += 1
		await post.save()

		return res.status(201).json({ success: true, comment: sanitizeComment(comment) })
	} catch (error) {
		return res.status(500).json({ success: false, message: 'Failed to add comment', error: error.message })
	}
}

export const deleteComment = async (req, res) => {
	try {
		const comment = await Comment.findById(req.params.id)
		if (!comment) {
			return res.status(404).json({ success: false, message: 'Comment not found' })
		}

		if (comment.author.toString() !== req.user._id.toString()) {
			return res.status(403).json({ success: false, message: 'Not authorized to delete this comment' })
		}

		await comment.deleteOne()

		await Post.findByIdAndUpdate(comment.post, { $inc: { comments: -1 } })

		return res.status(200).json({ success: true, message: 'Comment deleted successfully' })
	} catch (error) {
		return res.status(500).json({ success: false, message: 'Failed to delete comment', error: error.message })
	}
}
