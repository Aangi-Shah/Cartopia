import React, { useContext, useEffect, useState } from 'react'
import { ShopContext } from '../context/ShopContext'
import Title from '../components/Title'
import { assets } from '../assets/assets';
import CartTotal from '../components/CartTotal';
import { toast } from "react-toastify";
import Swal from "sweetalert2";

const Cart = () => {

  const { products, currency, cartItems, updateQuantity, navigate, token } = useContext(ShopContext);
  const [cartData, setCartData] = useState([]);

  useEffect(() => {
    if (products.length > 0) {
      const tempData = [];
      for (const items in cartItems) {
        for (const item in cartItems[items]) {
          if (cartItems[items][item] > 0) {
            tempData.push({
              _id: items,
              size: item,
              quantity: cartItems[items][item]
            });
          }
        }
      }
      setCartData(tempData);
    }
  }, [cartItems, products]);

  const handleCheckout = () => {
    if (cartData.length === 0) {
      toast.info("Your cart is empty. Add items before checking out!");
      return;
    }

    if (!token) {
      toast.info("Please sign in to proceed to checkout.");
      navigate("/login");
      return;
    }

    navigate("/place-order");
  };

  const handleDelete = (id, size) => {
    Swal.fire({
      title: "Remove Item?",
      text: "Are you sure you want to delete this item from your cart?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#000",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, remove it",
    }).then((result) => {
      if (result.isConfirmed) {
        updateQuantity(id, size, 0);
        Swal.fire("Removed!", "The item has been removed.", "success");
      }
    });
  };

  return (
    <div className='border-t pt-14'>
      <div className='text-2xl mb-3'>
        <Title text1={'YOUR'} text2={'CART'} />
      </div>

      <div>
        {cartData.map((item, index) => {
          const productData = products.find((product) => product._id === item._id);
          return (
            <div key={index} className='py-4 border-t border-b border-gray-300 text-gray700 grid grid-cols-[4fr_0.5fr_0.5fr] sm:grid-cols-[4fr_2fr_0.5fr] items-center gap-4'>
              <div className='flex items-start gap-6'>
                <img className='w-16 sm:w-20' src={productData.image[0]} alt="" />
                <div>
                  <p className='text-xs sm:text-lg font-medium'>{productData.name}</p>
                  <div className='flex items-center gap-5 mt-2'>
                    <p>{currency}{productData.price}</p>
                    <p className='px-2 sm:px-3 sm:py-1 border border-gray-300 bg-slate-50'>{item.size}</p>
                  </div>
                </div>
              </div>

              <input
                onChange={(e) =>
                  e.target.value === '' || e.target.value === '0'
                    ? null
                    : updateQuantity(item._id, item.size, Number(e.target.value))
                }
                className='border border-gray-300 max-w-10 sm:max-w-20 px-1 sm:px-2 py-1'
                type="number"
                min={1}
                defaultValue={item.quantity}
              />

              <img
                onClick={() => handleDelete(item._id, item.size)}
                className='w-4 mr-4 sm:w-5 cursor-pointer'
                src={assets.bin_icon}
                alt=""
              />
            </div>
          )
        })}
      </div>

      <div className='flex justify-end my-20'>
        <div className='w-full sm:w-[450px]'>
          <CartTotal />
          <div className='w-full text-end'>
            <button onClick={handleCheckout} className='bg-black text-white text-sm my-8 px-8 py-3'>
              PROCEED TO CHECKOUT
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Cart
