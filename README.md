# Cartopia – A Shopping Utopia

Cartopia is a complete **MERN-stack e-commerce platform** with user shopping features, product management, cart system, authentication, Stripe payment, admin dashboard, and OTP-based password recovery.

The project includes:
- **Frontend (React + Vite)**
- **Admin Panel (React + Vite)**
- **Backend API (Node.js + Express + MongoDB)**

---

# Live Demo 
**Frontend (Vercel):** https://cartopia.vercel.app/
**Admin Panel (Vercel):** https://cartopia-admin.vercel.app/

---

# Tech Stack

## Frontend
- React.js  
- Vite  
- Tailwind CSS  
- Axios  
- React Router DOM  

## Admin Panel
- React.js  
- Tailwind CSS  
- Axios  

## Backend
- Node.js  
- Express.js  
- MongoDB (Mongoose)  
- Multer (Image Upload)  
- JSON Web Token (JWT)  
- Bcrypt  
- Resend (Email OTP)  

## Database
- MongoDB Atlas  

---

# Key Features

## User Features  
- Account Registration & Login (JWT)  
- Forgot Password with **Email OTP (Resend API)**  
- Product Browsing + Filters  
- Add to Cart / Remove / Update Quantity  
- Guest Cart → Merge with User Cart after Login  
- Stripe Payment Gateway  
- Cash on Delivery (COD)  
- Order Tracking  
- User Can Cancel Order (before processing)

## Admin Features  
- Admin Login  
- Add / Remove Products  
- Cloudinary Image Upload  
- Manage Orders & Update Status  
- View Cancelled Orders  

## Backend Features  
- Node.js + Express REST API  
- MongoDB with Mongoose  
- JWT Authentication  
- Stripe Checkout Session  
- Resend Email OTP  
- Cloudinary Media Storage  

## Product Management
- Upload up to **4 product images**  
- Add title, description, category, price  
- Add size options  
- Mark products as best-seller

## Authentication
- JWT login  
- Bcrypt password hashing  
- Separate admin login  
- Protected admin middleware

## Password Reset (OTP)
- OTP sent using **Resend API**  
- OTP expires in 10 minutes  
- Reset password securely via email verification 

---

## Project Structure

```
Cartopia/
│
├── backend/
│ ├── controllers/
│ ├── middleware/
│ ├── models/
│ ├── routes/
│ ├── views/
│ ├── node_modules/
│ ├── server.js
| ├── .gitignore
│ └── .env
| └── .package.json
| └── .package-lock.json
│
├── frontend/
│   ├── node_modules/
│   ├── public/ 
│   ├── src/
│   │   ├── assets/
│   │   ├── components//
│   │   ├── context/
│   │   ├── pages/
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   ├── index.css
│   ├── .gitignore
|   ├── .env
│   ├── index.html
│   ├── package-lock.json
│   ├── package.json
│   ├── vercel.json
│   ├── vite.config.js
│   └── eslint.config.js
│
├── admin/
│   ├── node_modules/
│   ├── public/ 
│   ├── src/
│   │   ├── assets/
│   │   ├── components//
│   │   ├── context/
│   │   ├── pages/
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   ├── index.css
│   ├── .gitignore
|   ├── .env
│   ├── index.html
│   ├── package-lock.json
│   ├── package.json
│   ├── vercel.json
│   ├── vite.config.js
│   └── eslint.config.js
│
└── README.md
```

---

# Setup & Installation

## **1. Clone the Repository**

```bash
git https://github.com/Aangi-Shah/Cartopia.git
cd Cartopia
```

---

## **2. Create a `.env` file in the backend directory with:**

```
MONGO_URI = your_database_url
CLOUDINARY_API_KEY = your_cloudinary_API_key
CLOUDINARY_SECRET_KEY = your_cloudinary_API_secret
CLOUDINARY_NAME = your_cloudinary_name
JWT_SECRET = your_secret_key
ADMIN_EMAIL = admin_email
ADMIN_PASSWORD = admin_password
STRIPE_SECRET_KEY = your_stripe_secret_key
RESEND_API_KEY = your_resend_API_key
FRONTEND_URL = vercel_url
```

---

## **3. Setup Backend**

```bash
cd backend
npm install
npm run dev
```

---

## **4. Setup Frontend**

```bash
cd frontend
npm install
npm run dev
```

## **5. Setup Admin Panel**

```bash
cd admin
npm install
npm run dev
```

---

# API Highlights

## Products

```
POST   /api/product/add
POST   /api/product/remove
GET    /api/product/list

```

## User

```
POST /api/user/register
POST /api/user/login
POST /api/user/admin
POST /api/user/forgot-password
POST /api/user/verify-otp
POST /api/user/reset-password

```

## Orders

```
POST /api/order/place
GET  /api/order/userorders
POST /api/order/stripe
POST /api/order/verify
POST /api/order/list
POST /api/order/status
POST /api/order/cancel

```

---

# Authors

Aangi Shah

Vraj Sanghavi

---

# License

This project is for academic purposes.