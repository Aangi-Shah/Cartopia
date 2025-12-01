import express from 'express'
import { placeOrder, allOrders, userOrders, updateStatus, placeOrderStripe, verifyStripe, cancelOrder } from '../controllers/orderController.js'
import adminAuth from '../middleware/adminAuth.js'
import authUser from '../middleware/auth.js'

const orderRouter = express.Router()

// Admin Features
orderRouter.post('/list', adminAuth, allOrders)
orderRouter.post('/status', adminAuth, updateStatus)

// Payment Features
orderRouter.post('/place', authUser, placeOrder)
orderRouter.post('/stripe', authUser, placeOrderStripe)

// User Features
orderRouter.post('/userorders', authUser, userOrders)

// verify payment
orderRouter.post('/verifystripe', authUser, verifyStripe)

// cancel order
orderRouter.post("/cancel", authUser, cancelOrder);

export default orderRouter