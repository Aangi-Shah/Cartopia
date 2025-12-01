import React from 'react'
import Title from '../components/Title'
import { assets } from '../assets/assets'
import NewsletterBox from '../components/NewsletterBox'

const Contact = () => {
  return (
    <div>
      <div className='text-center text-2xl pt-10 border-t'>
        <Title text1={'CONTACT'} text2={'US'} />
      </div>

      <div className='my-10 flex flex-col justify-center md:flex-row gap-10 mb-28'>
        <img className='w-full md:max-w-[480px]' src={assets.contact_img} alt="" />

        <div className='flex flex-col justify-center items-start gap-6'>
          <p className='font-semibold text-xl text-gray-600'>Registered Office (India)</p>
          <p className='text-gray-500'>
            Cartopia E-Commerce Pvt. Ltd. <br />
            Registered in Ahmedabad, Gujarat, India <br />
            (No physical offline store)
          </p>

          <p className='text-gray-500'>
            Phone: +91 9876543210 <br />
            Email: shahaangi26@gmail.com
          </p>

          <p className='font-semibold text-xl text-gray-600'>Need Help?</p>
          <p className='text-gray-500'>
            For any order-related or support queries, feel free to contact us.
          </p>
        </div>
      </div>

      <NewsletterBox />
    </div>
  )
}

export default Contact