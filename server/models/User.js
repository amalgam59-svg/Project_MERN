import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'

const userSchema = new mongoose.Schema({
	name: {
		type: String,
		required: true,
		trim: true,
	},
	email: {
		type: String,
		required: true,
		unique: true,
		lowercase: true,
		trim: true,
	},
	password: {
		type: String,
		required: true,
		minlength: 8,
		select: false,
	},
	passwordResetToken: {
		type: String,
		select: false,
	},
	passwordResetExpires: {
		type: Date,
		select: false,
	},
	handle: {
		type: String,
		required: true,
		unique: true,
		trim: true,
	},
	avatar: {
		type: String,
		default: '',
	},
	bio: {
		type: String,
		default: '',
		maxlength: 160,
	},
	location: {
		type: String,
		default: '',
	},
	website: {
		type: String,
		default: '',
	},
	followers: [{
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User',
	}],
	following: [{
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User',
	}],
}, {
	timestamps: { createdAt: true, updatedAt: false },
})

userSchema.pre('save', async function hashPassword(next) {
	if (!this.isModified('password')) return next()

	const salt = await bcrypt.genSalt(10)
	this.password = await bcrypt.hash(this.password, salt)
	next()
})

userSchema.methods.comparePassword = function comparePassword(candidatePassword) {
	return bcrypt.compare(candidatePassword, this.password)
}

const User = mongoose.model('User', userSchema)

export default User
