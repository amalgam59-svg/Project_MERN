import mongoose from 'mongoose'

const postSchema = new mongoose.Schema({
	author: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User',
		required: true,
	},
	text: {
		type: String,
		trim: true,
		maxlength: 500,
		default: '',
	},
	image: {
		type: String,
		default: '',
	},
	likes: [{
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User',
	}],
	comments: {
		type: Number,
		default: 0,
	},
}, {
	timestamps: true,
})

// A post must have text, an image, or both
postSchema.pre('validate', function requireContent(next) {
	if (!this.text.trim() && !this.image.trim()) {
		return next(new Error('Post must include text or an image'))
	}
	next()
})

const Post = mongoose.model('Post', postSchema)

export default Post
