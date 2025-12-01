import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="h-[80vh] flex flex-col items-center justify-center text-center px-4">
      <h1 className="text-7xl font-bold text-gray-800">404</h1>
      <p className="text-gray-500 text-lg mt-4">
        The page you're looking for doesn't exist or has been moved.
      </p>
      <div className="w-20 h-[2px] bg-gray-300 mt-4"></div>
      <Link 
        to="/" 
        className="mt-6 bg-black text-white px-8 py-3 text-sm tracking-wide hover:bg-gray-900 transition-all duration-300"
      >
        GO TO HOMEPAGE
      </Link>
    </div>
  );
};

export default NotFound;