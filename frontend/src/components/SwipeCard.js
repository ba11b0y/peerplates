// src/components/SwipePage.js

import React, { useState } from 'react';
import { useSwipeable } from 'react-swipeable';
import { useSpring, animated } from 'react-spring';
import { FaCog, FaThumbsDown, FaThumbsUp } from 'react-icons/fa'; // Import FontAwesome icons
import ProfileImagePlaceholder from '../images/rishith.jpg'; // Replace with the path to your placeholder image
import image1 from '../images/image1.jpg';
import image2 from '../images/image2.webp';
import './SwipeCard.css'; // Ensure you have styles defined for the swipe card

const images = [image1, image2];

function SwipePage() {
  // State to manage form visibility
  const [showForm, setShowForm] = useState(true);

  // State for form input values
  const [name, setName] = useState('');
  const [nonVeg, setNonVeg] = useState('yes');
  const [protein, setProtein] = useState('');
  const [carbs, setCarbs] = useState('');
  const [fiber, setFiber] = useState('');
  const [spiceLevel, setSpiceLevel] = useState('less');

  // Swipe card logic
  const [cards, setCards] = useState(images);
  const [currentIndex, setCurrentIndex] = useState(0);

  const [props, api] = useSpring(() => ({
    x: 0,
    rotate: 0,
  }));

  const swiped = (dir) => {
    if (dir === 'Right') {
      // Perform action on swipe right
      alert('Swiped Right');
    } else if (dir === 'Left') {
      // Move card to the back of the stack
      setCards((prevCards) => {
        const updatedCards = [...prevCards];
        const [firstCard] = updatedCards.splice(currentIndex, 1);
        updatedCards.push(firstCard);
        return updatedCards;
      });
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

  // Chat window state for Matches and Messages
  const [activeTab, setActiveTab] = useState('matches');

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

    // Encode the form data into a URL-encoded string
    const urlEncodedData = new URLSearchParams(formData).toString();

    // Define the URL with the base API URL
    const apiUrl = 'https://9bf4-2607-b400-26-0-fc0e-6071-6267-b064.ngrok-free.app/dishes';

    try {
        // Make the POST request with the URL-encoded data
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded', // Set the content type to URL-encoded
            },
            body: urlEncodedData, // Send the encoded data in the body
        });

        // Handle the response
        if (response.ok) {
            const responseData = await response.json();
            console.log('Success:', responseData);
            // Optionally, handle the successful response (e.g., show a success message)
        } else {
            console.error('Error:', response.statusText);
            // Optionally, handle the error (e.g., show an error message)
        }
    } catch (error) {
        console.error('Error:', error);
        // Optionally, handle the fetch error (e.g., show an error message)
    }

    // Replace form with swipe cards after submission
    setShowForm(false);
};


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
            <div className="swipe-card-container flex items-center justify-center" style={{ flexGrow: 1 }}>
              {cards.slice(currentIndex, currentIndex + 3).map((image, index) => (
                <animated.div
                  key={index}
                  className="card"
                  style={{
                    ...props,
                    zIndex: cards.length - index,
                    backgroundImage: `url(${image})`,
                    width: '120%', // Adjust width as needed
                    height: '90%', // Use height to fill the available space
                    backgroundSize: 'cover', // Ensure the image covers the card
                    backgroundPosition: 'center', // Center the image within the card
                    borderRadius: '15px', // Optional: round corners
                    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)', // Optional: add shadow for depth
                  }}
                ></animated.div>
              ))}
            </div>

            {/* Yes/No Buttons */}
            <div className="flex justify-between w-full max-w-lg mb-4 pb-4"> {/* Added padding bottom */}
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
            <div className="text-center text-gray-500">No messages</div>
          )}
        </div>
      </div>
    </div>
  );
}

export default SwipePage;
