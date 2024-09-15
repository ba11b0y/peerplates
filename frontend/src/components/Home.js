import React from 'react';
import { useNavigate } from 'react-router-dom';

// Import your images
import BuyImage from '../images/buy.png';
import SellImage from '../images/sell.png';
import HealthyFoodImage from '../images/healthy_food.webp'; // Background image

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
      {/* Upper part with background image */}
      <div
        className="flex-[6] bg-cover bg-center relative"
        style={{
          backgroundImage: `url(${HealthyFoodImage})`,
        }}
      >
        {/* First Overlay */}
        <div className="absolute inset-0 bg-black opacity-60"></div>
        {/* Second Overlay for gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent"></div>
        
        {/* Heading and Tagline */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-white text-center px-4">
          <h1 className="text-5xl md:text-7xl font-bold mb-4">Peer Plates</h1>
          <p className="text-lg md:text-2xl">Share the Taste of Health</p>
        </div>
      </div>

      {/* Lower part - 40% height */}
      <div className="flex-[4] flex flex-col items-center justify-center">
        {/* Buttons with Images */}
        <div className="flex flex-col md:flex-row items-center justify-center space-y-12 md:space-y-0 md:space-x-16">
          {/* Buy Section */}
          <div className="flex flex-col items-center space-y-6 md:space-y-0 md:space-x-6 md:flex-row">
            {/* Image */}
            <img src={BuyImage} alt="Buy" className="w-32 h-32 md:w-40 md:h-40" />
            {/* Buy Button */}
            <button
              onClick={handleBuy}
              className="group relative inline-flex items-center justify-center overflow-hidden rounded-full w-52 h-20 md:w-64 md:h-24 font-bold"
            >
              <span className="absolute left-0 top-0 h-[200px] w-[200px] -translate-y-3 translate-x-14 rotate-45 bg-orange-500 opacity-[3%]"></span>
              <span className="absolute left-0 top-0 -mt-1 h-[288px] w-[288px] -translate-x-80 -translate-y-40 rotate-45 bg-orange-500 opacity-100 transition-transform duration-500 ease-in-out group-hover:translate-x-0 group-hover:translate-y-0"></span>
              <span className="relative text-center text-orange-500 text-lg md:text-2xl transition-colors duration-200 ease-in-out group-hover:text-white">
                Grab a Bite
              </span>
              <span className="absolute inset-0 rounded-full border-2 border-black"></span>
            </button>
          </div>

          {/* Sell Section */}
          <div className="flex flex-col items-center space-y-6 md:space-y-0 md:space-x-6 md:flex-row">
            {/* Sell Button */}
            <button
              onClick={handleSell}
              className="group relative inline-flex items-center justify-center overflow-hidden rounded-full w-52 h-20 md:w-64 md:h-24 font-bold"
            >
              <span className="absolute left-0 top-0 h-[200px] w-[200px] -translate-y-3 translate-x-14 rotate-45 bg-orange-500 opacity-[3%]"></span>
              <span className="absolute left-0 top-0 -mt-1 h-[288px] w-[288px] -translate-x-80 -translate-y-40 rotate-45 bg-orange-500 opacity-100 transition-transform duration-500 ease-in-out group-hover:translate-x-0 group-hover:translate-y-0"></span>
              <span className="relative text-center text-orange-500 text-lg md:text-2xl transition-colors duration-200 ease-in-out group-hover:text-white">
                Share Your Dish
              </span>
              <span className="absolute inset-0 rounded-full border-2 border-black"></span>
            </button>
            {/* Image */}
            <img src={SellImage} alt="Sell" className="w-32 h-32 md:w-40 md:h-40" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
