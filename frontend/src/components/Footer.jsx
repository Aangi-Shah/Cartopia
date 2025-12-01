import React from "react";
import { assets } from "../assets/assets";

const Footer = () => {
  return (
    <div className="">
      {/* Top section */}
      <div className="flex flex-col sm:grid grid-cols-[3fr_1fr_1fr] gap-14 mt-20 mb-10 text-sm">
        <div>
          <img src={assets.logo1} className="mb-5 w-20 h-20" alt="" />
          <p className="w-full md:w-2/3 text-gray-600">
            Cartopia - A Shopping Utopia is your one-stop destination for curated
            collections, trusted quality, and exclusive offers. We believe shopping
            should be seamless, stylish, and secure. Stay connected with us and shop
            with confidence.
          </p>
        </div>

        <div>
          <p className="text-xl font-medium mb-5 mt-5">COMPANY</p>
          <ul className="flex flex-col gap-1 text-gray-600">
            <li>Home</li>
            <li>About Us</li>
            <li>Delivery</li>
            <li>Privacy Policy</li>
          </ul>
        </div>

        <div>
          <p className="text-xl font-medium mb-5 mt-5">GET IN TOUCH</p>
          <ul className="flex flex-col gap-1 text-gray-600">
            <li>+91 9876543210</li>
            <li>shahaangi26@gmail.com</li>
          </ul>
        </div>
      </div>

      {/* Bottom bar */}
      <div>
        <hr />
        <p className="py-5 text-sm text-center">
          Copyright 2025@ cartopia.com - All Rights Reserved.
        </p>
      </div>
    </div>
  );
};

export default Footer;
