import express from 'express'
import protect, { optionalAuth } from '../middleware/authMiddleware.js'
import {
	createPost,
	getPosts,
	getUserPosts,
	updatePost,
	deletePost,
	toggleLike,
} from '../controllers/postController.js'
import { uploadPostImage } from '../controllers/postController.js'
import upload from '../middleware/uploadMiddleware.js'
import { getComments, addComment } from '../controllers/commentController.js'

const router = express.Router()

router.get('/', optionalAuth, getPosts)
router.get('/user/:handle', optionalAuth, getUserPosts)
router.post('/', protect, createPost)
router.post('/image', protect, upload.single('image'), uploadPostImage)
router.put('/:id', protect, updatePost)
router.delete('/:id', protect, deletePost)
router.post('/:id/like', protect, toggleLike)
router.get('/:postId/comments', getComments)
router.post('/:postId/comments', protect, addComment)

export default router