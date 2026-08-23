import express from 'express'
import protect from '../middleware/authMiddleware.js'
import { getProfile, updateProfile, uploadProfileImage, deleteAccount, toggleFollow, getSuggestions } from '../controllers/userController.js'
import upload from '../middleware/uploadMiddleware.js'

const router = express.Router()

router.get('/profile', protect, getProfile)
router.put('/profile', protect, updateProfile)
router.delete('/profile', protect, deleteAccount)
router.post('/profile/image', protect, upload.single('image'), uploadProfileImage)
router.get('/suggestions', protect, getSuggestions)
router.post('/:handle/follow', protect, toggleFollow)

export default router