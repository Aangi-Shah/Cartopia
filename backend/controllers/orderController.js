import orderModel from "../models/orderModel.js";
import OrderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";
import Stripe from "stripe"

const currency = 'inr'
const deliveryCharge = 30

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

// Placing orders using COD Method
const placeOrder = async (req, res) => {
    try {
        const { userId, items, amount, address } = req.body;

        const orderData = {
            userId,
            items,
            amount,
            address,
            paymentMethod: "COD",
            payment: false,
            date: Date.now()
        }

        const newOrder = new OrderModel(orderData)
        await newOrder.save()

        await userModel.findByIdAndUpdate(userId, {cartData: {}})
        res.json({success: true, message: "Order Placed Successfully"})

    } catch (error) {
        console.log(error)
        res.json({success: false, message:error.message})
    }  
}

// Placing orders using Stripe Method
const placeOrderStripe = async (req, res) => {
    try {
        const { userId, items, amount, address } = req.body;
        const { origin} = req.headers;

        const orderData = {
            userId,
            items,
            amount,
            address,
            paymentMethod: "Stripe",
            payment: false,
            date: Date.now()
        }

        const newOrder = new OrderModel(orderData)
        await newOrder.save()

        const line_items = items.map((item) => ({
            price_data: {
                currency: currency,
                product_data: {
                    name: item.name
                },
                unit_amount: item.price * 100
            },
            quantity: item.quantity
        }))

        line_items.push({
            price_data: {
                currency: currency,
                product_data: {
                    name: "Delivery Charges"
                },
                unit_amount: deliveryCharge * 100
            },
            quantity: 1
        })

        const session = await stripe.checkout.sessions.create({
            success_url: `${origin}/verify?success=true&orderId=${newOrder._id}`,
            cancel_url: `${origin}/verify?success=false&orderId=${newOrder._id}`,
            line_items,
            mode: 'payment',
        })

        res.json({ success: true, session_url: session.url });
    } catch (error) {
        console.log(error)
        res.json({success: false, message:error.message})
    }
}

const verifyStripe = async (req, res) => {
    const { orderId, success, userId } = req.body
    try {
        if(success === "true") {
            await orderModel.findByIdAndUpdate(orderId, {payment: true});
            await userModel.findByIdAndUpdate(userId, {cartData: {}})
            res.json({ success: true});
        } else {
            await orderModel.findByIdAndDelete(orderId)
            res.json({ success: false})
        }
    } catch (error) {
        console.log(error)
        res.json({success: false, message:error.message})
    }
}

// All orders data for admin panel
const allOrders = async (req, res) => {
    try {
        const orders = await OrderModel.find({})
        res.json({ success: true, orders })
    } catch (error) {
        console.log(error)
        res.json({success: false, message:error.message})
    }
}

// User order data for frontend
const userOrders = async (req, res) => {
    try {
        const { userId } = req.body
        const orders = await OrderModel.find({ userId })
        res.json({ success: true, orders })
    } catch (error) {
        console.log(error)
        res.json({success: false, message:error.message})
    }
}

// update order status from admin panel
const updateStatus = async (req, res) => {
    try {
        const { orderId, status } = req.body
        await orderModel.findByIdAndUpdate(orderId, { status })
        res.json({ success: true, message: "Status Updated" })
    } catch (error) {
        console.log(error)
        res.json({success: false, message:error.message})
    }
}

// Cancel an order
const cancelOrder = async (req, res) => {
  try {
    const userId = req.body.userId;
    const { orderId } = req.body;

    if (!orderId) {
      return res.json({ success: false, message: "Order ID is required" });
    }

    const order = await orderModel.findOne({ _id: orderId, userId });

    if (!order) {
      return res.json({ success: false, message: "Order not found" });
    }

    if (order.status !== "Order Placed") {
      return res.json({
        success: false,
        message: "This order cannot be cancelled now.",
      });
    }

    order.status = "Cancelled";
    order.payment = false;
    await order.save();

    return res.json({
      success: true,
      message: "Order cancelled successfully.",
    });

  } catch (error) {
    console.log(error);
    return res.json({ success: false, message: error.message });
  }
};

export { verifyStripe, placeOrder, allOrders, userOrders, updateStatus, placeOrderStripe, cancelOrder, }