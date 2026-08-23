import express from 'express'
import protect from '../middleware/authMiddleware.js'
import { getProfile, updateProfile, toggleFollow, getSuggestions } from '../controllers/userController.js'

const router = express.Router()

router.get('/profile', protect, getProfile)
router.put('/profile', protect, updateProfile)
router.get('/suggestions', protect, getSuggestions)
router.post('/:handle/follow', protect, toggleFollow)

export default router