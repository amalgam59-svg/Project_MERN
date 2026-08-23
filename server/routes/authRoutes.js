import express from 'express'
import { register, login, logout, getMe, requestPasswordReset, resetPassword } from '../controllers/authController.js'
import protect from '../middleware/authMiddleware.js'

const router = express.Router()

router.post('/register', register)
router.post('/login', login)
router.post('/forgot-password', requestPasswordReset)
router.post('/reset-password', resetPassword)
router.post('/logout', protect, logout)
router.get('/me', protect, getMe)

export default router