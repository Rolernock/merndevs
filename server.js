import express from 'express'
import path from 'path'
import dotenv from 'dotenv'
import cookieParser from 'cookie-parser'
import connectDB from './config/db.js'
import userRoutes from './routes/userRoutes.js'
import profileRoutes from './routes/profileRoutes.js'
import postRoutes from './routes/postRoutes.js'
import uploadRoutes from './routes/uploadRoutes.js'
import { notFound, errorHandler } from './middleware/errorHandler.js'

dotenv.config()
const app = express()
const PORT = process.env.PORT

//Parse Incoming Request With JSON bodies
app.use(express.json())

//Parses incoming Cookies
app.use(cookieParser())

//Resolving __dirname for ES module
const __dirname = path.resolve()

//Routes
app.use('/api/users', userRoutes)
app.use('/api/profile', profileRoutes)
app.use('/api/posts', postRoutes)
app.use('/api/uploads', uploadRoutes)

//Use the client app
app.use(express.static(path.join(__dirname, '/client/dist')))

//User uploads for image uploads
app.use('/uploads', express.static(path.join(__dirname, '/uploads')))

//Render the client app
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '/client/dist/index.html'))
})

//Error Handler Middleware
app.use(notFound)
app.use(errorHandler)

//Connect to DB and listen on port 5000
connectDB()
app.listen(PORT, () => console.log(`Server listening on port: ${PORT}`))
