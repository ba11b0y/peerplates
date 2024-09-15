// src/components/Home.js

import React from 'react';
import { useNavigate } from 'react-router-dom';

// Import your images with updated names
import BuyImage from '../images/buy.png';         
import SellImage from '../images/sell.png';       
import HealthyFoodImage from '../images/healthy_food.webp'; // Import the background image

function Home() {
  const navigate = useNavigate();

  const handleBuy = () => {
    navigate('/buy');
  };

  const handleSell = () => {
    navigate('/sell');
  };

  return (
    <div className="flex flex-col h-screen">
      {/* Upper part with background image and multiple overlays */}
      <div
        className="flex-[6] bg-cover bg-center relative"
        style={{
          backgroundImage: `url(${HealthyFoodImage})`,
        }}
      >
        {/* First Overlay for additional opacity */}
        <div className="absolute inset-0 bg-black opacity-60"></div>
        {/* Second Overlay for black gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent"></div>
        
        {/* Heading and Tagline */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
          <h1 className="text-4xl md:text-5xl lg:text-7xl font-bold mb-2 md:mb-4 text-center">Peer Plates</h1>
          <p className="text-xl md:text-2xl text-center">Share the Taste of Health</p>
        </div>
      </div>

      {/* Lower part - 40% height */}
      <div className="flex-[4] flex flex-col items-center justify-center p-4">
        {/* Buttons with Images */}
        <div className="flex flex-col md:flex-row items-center space-y-8 md:space-y-0 md:space-x-16">
          {/* Buy Section */}
          <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-4">
            <img src={BuyImage} alt="Buy" className="w-32 h-32 md:w-40 md:h-40" />
            <button
              onClick={handleBuy}
              className="group relative inline-flex items-center justify-center overflow-hidden rounded-full w-64 h-16 md:h-24 font-bold"
            >
              {/* ... existing button spans ... */}
              <span className="relative text-center text-orange-500 text-xl md:text-2xl transition-colors duration-200 ease-in-out group-hover:text-white">
                Grab a Bite
              </span>
              <span className="absolute inset-0 rounded-full border-2 border-black"></span>
            </button>
          </div>

          {/* Sell Section */}
          <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-4">
            <button
              onClick={handleSell}
              className="group relative inline-flex items-center justify-center overflow-hidden rounded-full w-64 h-16 md:h-24 font-bold"
            >
              {/* ... existing button spans ... */}
              <span className="relative text-center text-orange-500 text-xl md:text-2xl transition-colors duration-200 ease-in-out group-hover:text-white">
                Share Your Dish
              </span>
              <span className="absolute inset-0 rounded-full border-2 border-black"></span>
            </button>
            <img src={SellImage} alt="Sell" className="w-32 h-32 md:w-40 md:h-40" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
