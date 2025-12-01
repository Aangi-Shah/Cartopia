import express from 'express'
import cors from 'cors'
import morgan from 'morgan'
import 'dotenv/config'
import path from 'path'
import { fileURLToPath } from 'url'

import connectDB from './config/mongodb.js'
import connectCloudinary from './config/cloudinary.js'
import userRouter from './routes/userRoute.js'
import productRouter from './routes/productRoute.js'
import cartRouter from './routes/cartRoute.js'
import orderRouter from './routes/orderRoute.js'

// Path setup for EJS views
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// App Config
const app = express()
const port = process.env.PORT || 5000
connectDB()
connectCloudinary()

// Middlewares
app.use(cors())
app.use(morgan('dev'))
app.use(express.json())

// Serve static files (e.g. images) from /public
app.use(express.static('public'))

// EJS setup
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))

app.get('/welcome', (req, res) => {
  res.status(200).render('welcome', {
    title: 'Cartopia Backend',
    time: new Date().toLocaleString('en-IN'),
  })
})

// API endpoints
app.use('/api/user', userRouter)
app.use('/api/product', productRouter)
app.use('/api/cart', cartRouter)
app.use('/api/order', orderRouter)

app.listen(port, () => console.log('Server running on PORT ' + port))