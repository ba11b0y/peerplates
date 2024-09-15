// src/components/SwipePage.js

import React, { useState, useEffect } from 'react';
import { useSwipeable } from 'react-swipeable';
import { useSpring, animated } from 'react-spring';
import { FaCog, FaThumbsDown, FaThumbsUp } from 'react-icons/fa';
import ProfileImagePlaceholder from '../images/rishith.jpg';
import MatchChat from './MatchChat'; // Import the MatchChat component
import './SwipeCard.css';
import axios from 'axios';

function SwipePage() {
  // State to manage form visibility
  const [showForm, setShowForm] = useState(true);

  // State for form input values
  const [nonVeg, setNonVeg] = useState('yes');
  const [protein, setProtein] = useState('');
  const [carbs, setCarbs] = useState('');
  const [fiber, setFiber] = useState('');
  const [spiceLevel, setSpiceLevel] = useState('less');

  const [dishes, setDishes] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Chat window state for Matches and Messages
  const [activeTab, setActiveTab] = useState('matches');

  // New state to hold chat data
  const [chats, setChats] = useState([]); // Store matches for chat

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Gather form data into an object
    const formData = {
      nonVeg,
      protein,
      carbs,
      fiber,
      spiceLevel,
    };

    // Create a comma-separated string of form data
    const formDataString = Object.entries(formData)
      .map(([key, value]) => `${key}:${value}`)
      .join(',');

    const baseUrl = `https://bulldog-humane-ram.ngrok-free.app/dishes?preferences=${formDataString}`;

    try {
      const response = await axios.get(baseUrl);
      setDishes(response.data);
      setShowForm(false);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const [props, api] = useSpring(() => ({
    x: 0,
    rotate: 0,
    config: { friction: 20 }, // Adjusting friction for more natural swiping
  }));

  const swiped = (dir) => {
    if (dir === 'Right') {
      // When swiped right, add the dish to the chats
      setChats((prevChats) => [...prevChats, dishes[currentIndex]]);
    } else if (dir === 'Left') {
      // Move to next dish
      setCurrentIndex((prevIndex) => (prevIndex + 1) % dishes.length);
    }
    // Reset the animation
    api.start({ x: 0, rotate: 0 });
  };

  const handlers = useSwipeable({
    onSwipedLeft: () => swiped('Left'),
    onSwipedRight: () => swiped('Right'),
    onSwiping: ({ deltaX }) => {
      api.start({ x: deltaX, rotate: deltaX / 10 });
    },
    delta: 50,
    trackMouse: true,
  });

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Left Side (70%) */}
      <div className="flex-[7] flex flex-col items-center justify-center bg-white">
        {showForm ? (
          // Form
          <form className="w-full max-w-lg bg-white p-8 rounded-lg shadow-md" onSubmit={handleSubmit}>
            {/* Form Fields */}
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">Non-Veg</label>
              <div className="flex ">
                <label className="mr-4">
                  <input
                    type="radio"
                    value="yes"
                    checked={nonVeg === 'yes'}
                    onChange={(e) => setNonVeg(e.target.value)}
                    className="mr-2"
                  />
                  Yes
                </label>
                <label>
                  <input
                    type="radio"
                    value="no"
                    checked={nonVeg === 'no'}
                    onChange={(e) => setNonVeg(e.target.value)}
                    className="mr-2"
                  />
                  No
                </label>
              </div>
            </div>

            {/* Protein */}
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="protein">
                Protein (grams)
              </label>
              <input
                id="protein"
                type="text"
                value={protein}
                onChange={(e) => setProtein(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-opacity-50"
                placeholder="Enter amount of protein"
                required
              />
            </div>

            {/* Carbs */}
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="carbs">
                Carbs (grams)
              </label>
              <input
                id="carbs"
                type="text"
                value={carbs}
                onChange={(e) => setCarbs(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-opacity-50"
                placeholder="Enter amount of carbs"
                required
              />
            </div>

            {/* Fiber */}
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="fiber">
                Fiber (grams)
              </label>
              <input
                id="fiber"
                type="text"
                value={fiber}
                onChange={(e) => setFiber(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-opacity-50"
                placeholder="Enter amount of fiber"
                required
              />
            </div>

            {/* Spice Level */}
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">Spice Level</label>
              <div className="flex items-center">
                <label className="mr-4">
                  <input
                    type="radio"
                    value="less"
                    checked={spiceLevel === 'less'}
                    onChange={(e) => setSpiceLevel(e.target.value)}
                    className="mr-2"
                  />
                  Less
                </label>
                <label className="mr-4">
                  <input
                    type="radio"
                    value="medium"
                    checked={spiceLevel === 'medium'}
                    onChange={(e) => setSpiceLevel(e.target.value)}
                    className="mr-2"
                  />
                  Medium
                </label>
                <label>
                  <input
                    type="radio"
                    value="hot"
                    checked={spiceLevel === 'hot'}
                    onChange={(e) => setSpiceLevel(e.target.value)}
                    className="mr-2"
                  />
                  Hot
                </label>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex items-center justify-center">
              <button
                type="submit"
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:ring focus:ring-blue-300"
              >
                Submit
              </button>
            </div>
          </form>
        ) : (
          // Swipe Cards with Yes/No Buttons
          <div className="flex flex-col items-center justify-between h-full">
            <div className="swipe-card-container flex items-center justify-center" {...handlers} style={{ flexGrow: 1 }}>
              {dishes.length > 0 && (
                <animated.div
                  className="card"
                  style={{
                    ...props,
                    backgroundImage: `url(${dishes[currentIndex].image_url})`,
                    width: '120%',
                    height: '90%',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    borderRadius: '15px',
                    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
                  }}
                >
                  <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white p-4">
                    <h2 className="text-xl font-bold">{dishes[currentIndex].title}</h2>
                    <p className="text-sm">{dishes[currentIndex].description}</p>
                  </div>
                </animated.div>
              )}
            </div>

            {/* Yes/No Buttons */}
            <div className="flex justify-between w-full max-w-lg mb-4 pb-4">
              <button
                onClick={() => swiped('Left')}
                className="flex items-center justify-center w-16 h-16 bg-red-500 text-white rounded-full focus:outline-none"
              >
                <FaThumbsDown size={24} />
              </button>
              <button
                onClick={() => swiped('Right')}
                className="flex items-center justify-center w-16 h-16 bg-green-500 text-white rounded-full focus:outline-none"
              >
                <FaThumbsUp size={24} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Right Side (30%) - Chat Window with Shadow Effect */}
      <div className="flex-[3] flex flex-col bg-gray-200 shadow-lg">
        {/* Nav Bar */}
        <div className="flex items-center justify-between px-4 py-2 bg-orange-500 text-white">
          <div className="flex items-center space-x-2">
            {/* Profile Image Placeholder */}
            <img src={ProfileImagePlaceholder} alt="Profile" className="w-10 h-10 rounded-full" />
            <div className="font-bold">Rishith</div> {/* Replace with dynamic user data */}
          </div>
          {/* Settings Icon */}
          <div className="bg-white text-orange-500 p-2 rounded-full">
            <FaCog size={20} />
          </div>
        </div>

        {/* Matches and Messages Tabs */}
        <div className="flex justify-around bg-light-gray-300 p-2">
          <button
            className={`flex-1 text-center py-2 ${activeTab === 'matches' ? 'border-b-2 border-orange-500 text-orange-500' : 'text-gray-600'}`}
            onClick={() => setActiveTab('matches')}
          >
            Matches
          </button>
          <button
            className={`flex-1 text-center py-2 ${activeTab === 'messages' ? 'border-b-2 border-orange-500 text-orange-500' : 'text-gray-600'}`}
            onClick={() => setActiveTab('messages')}
          >
            Messages
          </button>
        </div>

        {/* Chat Window */}
        <div className="flex-1 bg-gray-100 p-4 overflow-y-auto">
          {activeTab === 'matches' ? (
            <div className="text-center text-gray-500">No matches</div>
          ) : (
            // Render MatchChat components for all chats
            chats.length > 0 ? (
              chats.map((chat, idx) => (
                <MatchChat key={idx} userId="66e5574964f8c85fe6b58215" matchId={chat.id} />
              ))
            ) : (
              <div className="text-center text-gray-500">No messages</div>
            )
          )}
        </div>
      </div>
    </div>
  );
}

export default SwipePage;
