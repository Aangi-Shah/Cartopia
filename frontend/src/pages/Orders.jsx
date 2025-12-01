import React, { useContext, useEffect, useState } from 'react'
import { ShopContext } from '../context/ShopContext'
import Title from '../components/Title';
import axios from 'axios';
import { toast } from "react-toastify";
import Swal from "sweetalert2";

const Orders = () => {

  const { backendUrl, token, currency } = useContext(ShopContext);

  const [orderData, setOrderData] = useState([])

  const loadOrderData = async () => {
    try {
      if (!token) {
        return null
      }

      const response = await axios.post(
        backendUrl + '/api/order/userorders',
        {},
        { headers: { token } }
      );

      if (response.data.success) {
        let allOrdersItem = [];
        response.data.orders.forEach((order) => {
          order.items.forEach((item) => {
            allOrdersItem.push({
              ...item,
              status: order.status,
              payment: order.payment,
              paymentMethod: order.paymentMethod,
              date: order.date,
              orderId: order._id,
            });
          });
        });
        setOrderData(allOrdersItem.reverse());
      }

    } catch (error) {
      console.log(error);
      toast.error(error.message || "Failed to load orders");
    }
  }

  const handleCancelOrder = (orderId) => {
    if (!orderId) return;

    Swal.fire({
      title: "Cancel this order?",
      text: "Are you sure you want to cancel this order?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#000",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, cancel it",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const res = await axios.post(
            backendUrl + "/api/order/cancel",
            { orderId },
            { headers: { token } }
          );

          if (res.data.success) {
            toast.success(res.data.message || "Order cancelled successfully");
            loadOrderData();
          } else {
            toast.error(res.data.message || "Could not cancel order");
          }
        } catch (error) {
          console.log(error);
          toast.error(error.message || "Could not cancel order");
        }
      }
    });
  };

  useEffect(() => {
    loadOrderData()
  }, [token])

  return (
    <div className='border-t pt-16'>
      <div className='text-2xl'>
        <Title text1={'MY'} text2={'ORDERS'} />
      </div>

      <div>
        {
          orderData.map((item, index) => (
            <div
              key={index}
              className='py-4 border-t border-b border-gray-300 text-gray-700 flex flex-col md:flex-row md:items-center md:justify-between gap-4'
            >
              <div className='flex items-start gap-6 text-sm'>
                <img className='w-16 sm:w-20' src={item.image[0]} alt="" />
                <div>
                  <p className='sm:text-base font-medium'>{item.name}</p>
                  <div className='flex items-center gap-3 mt-1 text-base text-gray-700'>
                    <p>{currency}{item.price}</p>
                    <p>Quantity: {item.quantity}</p>
                    <p>Size: {item.size}</p>
                  </div>
                  <p className='mt-1'>
                    Date:{" "}
                    <span className='text-gray-400'>
                      {new Date(item.date).toDateString()}
                    </span>
                  </p>
                  <p className='mt-1'>
                    Payment:{" "}
                    <span className='text-gray-400'>
                      {item.paymentMethod}
                    </span>
                  </p>
                </div>
              </div>

              <div className='md:w-1/2 flex justify-between'>
                <div className='flex items-center gap-2'>
                  <p
                    className={`min-w-2 h-2 rounded-full ${
                      item.status === "Cancelled" ? "bg-red-500" : "bg-green-500"
                    }`}
                  ></p>
                  <p className='text-sm md:text-base'>{item.status}</p>
                </div>

                {item.status === "Cancelled" ? (
                  <p></p>
                ) : (
                  <button
                    onClick={() => handleCancelOrder(item.orderId)}
                    className='border border-gray-300 px-4 py-2 text-sm font-medium rounded-sm hover:bg-red-50 hover:border-red-400'
                  >
                    Cancel Order
                  </button>
                )}
              </div>
            </div>
          ))
        }
      </div>
    </div>
  )
}

export default Orders
