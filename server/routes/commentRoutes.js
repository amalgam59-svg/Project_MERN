import express from 'express'
import protect from '../middleware/authMiddleware.js'
import { deleteComment } from '../controllers/commentController.js'

const router = express.Router()

router.delete('/:id', protect, deleteComment)

export default router
