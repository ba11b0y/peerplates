import React from 'react';
import { useNavigate } from 'react-router-dom';

function Home() {
  const navigate = useNavigate();

  return (
    <div className="relative h-screen w-full overflow-hidden">
      <video
        autoPlay
        loop
        muted
        className="absolute top-0 left-0 min-w-full min-h-full object-cover z-0"
      >
        <source src="https://vthackspeerplates.blob.core.windows.net/peerplatesimages/cooking.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      
      <div className="absolute inset-0 bg-black bg-opacity-30 z-10"></div>
      
      <div className="absolute bottom-0 left-0 right-0 z-20 flex flex-col items-center justify-end pb-16 text-gray-300">
        <h1 className="text-5xl md:text-7xl font-bold mb-4 text-center drop-shadow-lg">PeerPlates</h1>
        <p className="text-xl md:text-2xl mb-12 text-center drop-shadow-md">Share Home Cooked Meals, Matched by AI!</p>
        
        <div className="flex flex-col md:flex-row space-y-6 md:space-y-0 md:space-x-6">
          <button
            onClick={() => navigate('/buy')}
            className="px-8 py-3 bg-transparent hover:bg-white hover:bg-opacity-20 text-gray-300 border-2 border-gray-300 rounded-full text-lg font-semibold transition-all duration-300 shadow-md"
          >
            Grab a Bite
          </button>
          <button
            onClick={() => navigate('/sell')}
            className="px-8 py-3 bg-transparent hover:bg-white hover:bg-opacity-20 text-gray-300 border-2 border-gray-300 rounded-full text-lg font-semibold transition-all duration-300 shadow-md"
          >
            Share Your Dish
          </button>
        </div>
      </div>
    </div>
  );
}

export default Home;
