import React, { useState } from 'react';
import { toast } from 'react-toastify';

const NewsletterBox = () => {

    const [email, setEmail] = useState("");

    const onSubmitHandler = (event) => {
        event.preventDefault();

        toast.info("Thank you for subscribing!", {
            autoClose: 2000,
        });

        setEmail(""); 
    };

    return (
        <div className='text-center mt-10'>
            <p className='text-2xl font-medium text-gray-800'>Subscribe now for early future updates</p>
            <p className='text-gray-400 mt-3'>
                Enjoy shopping benefits designed just for our subscribers.
            </p>

            <form 
                onSubmit={onSubmitHandler}
                className='w-full sm:w-1/2 flex items-center gap-3 mx-auto my-6 border pl-3'
            >
                <input 
                    className='w-full sm:flex-1 outline-none'
                    type="email"
                    placeholder='Enter your email'
                    required
                    value={email}                
                    onChange={(e) => setEmail(e.target.value)}
                />
                <button 
                    type='submit'
                    className='bg-black text-white text-xs px-10 py-4'
                >
                    SUBSCRIBE
                </button>
            </form>
        </div>
    )
}

export default NewsletterBox;