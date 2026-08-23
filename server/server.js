import dns from 'node:dns'

// Use reliable public DNS servers for MongoDB Atlas SRV lookup
dns.setServers(['1.1.1.1', '8.8.8.8'])

import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import mongoose from 'mongoose'
import authRoutes from './routes/authRoutes.js'
import userRoutes from './routes/userRoutes.js'
import postRoutes from './routes/postRoutes.js'
import commentRoutes from './routes/commentRoutes.js'

dotenv.config()

const app = express()

const PORT = process.env.PORT || 5000
const MONGO_URI = process.env.MONGO_URI
const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:5173'

// Middleware
app.use(cors({
    origin: CLIENT_URL
}))

app.use(express.json())

// Routes
app.use('/api/auth', authRoutes)
app.use('/api/users', userRoutes)
app.use('/api/posts', postRoutes)
app.use('/api/comments', commentRoutes)

// Health check
app.get('/api/health', (req, res) => {
    res.json({
        success: true,
        message: 'Nook API is running'
    })
})

// Connect to MongoDB and start server
const startServer = async () => {
    try {
        if (!MONGO_URI) {
            throw new Error('MONGO_URI is not defined in .env')
        }

        await mongoose.connect(MONGO_URI)

        console.log('MongoDB connected successfully')

        app.listen(PORT, () => {
            console.log(`Nook server running on port ${PORT}`)
        })

    } catch (error) {
        console.error('MongoDB connection error:', error.message)
        process.exit(1)
    }
}

startServer()