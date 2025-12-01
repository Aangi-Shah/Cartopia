import React, { useEffect, useState } from 'react'
import Navbar from './components/Navbar'
import Sidebar from './components/Sidebar'
import { Routes, Route, Navigate } from 'react-router-dom'
import Add from './pages/Add'
import List from './pages/List'
import Orders from './pages/Orders'
import Login from './components/Login'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

export const backendUrl = import.meta.env.VITE_BACKEND_URL
export const currency = '₹'

const App = () => {

  const [token, setToken] = useState(localStorage.getItem('token') || '')

  useEffect(() => {
    localStorage.setItem('token', token)
  }, [token])

  return (
    <div className='bg-gray-50 min-h-screen'>
      <ToastContainer />

      {token === '' ? (
        // 🔹 When NOT logged in, still give React Router a route to match
        <Routes>
          {/* catch all → show Login for any path, including "/" */}
          <Route path="*" element={<Login setToken={setToken} />} />
        </Routes>
      ) : (
        // 🔹 When logged in, show full admin layout + routes
        <>
          <Navbar setToken={setToken} />
          <hr />
          <div className='flex w-full'>
            <Sidebar />
            <div className='w-[70%] mx-auto ml-[max(5vw,25px)] my-8 text-gray-600 text-base'>
              <Routes>
                {/* default route for "/" so no 'No routes matched' warning */}
                <Route path="/" element={<Navigate to="/add" replace />} />

                <Route path="/add" element={<Add token={token} />} />
                <Route path="/list" element={<List token={token} />} />
                <Route path="/orders" element={<Orders token={token} />} />

                {/* any unknown route while logged in → go to /add */}
                <Route path="*" element={<Navigate to="/add" replace />} />
              </Routes>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

export default App
