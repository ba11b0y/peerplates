// src/components/SellPage.js

import React, { useState } from 'react';
import { FaCheckCircle, FaComments } from 'react-icons/fa';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function SellPage() {
  const navigate = useNavigate();
  // State variables to handle form data
  const [location, setLocation] = useState('');
  const [dishName, setDishName] = useState('');
  const [dietaryRestriction, setDietaryRestriction] = useState('');
  const [protein, setProtein] = useState('');
  const [carbs, setCarbs] = useState('');
  const [fiber, setFiber] = useState('');
  const [spiceLevel, setSpiceLevel] = useState('');
  const [image, setImage] = useState(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    let formdata = new FormData();
    formdata.append("title", dishName);
    formdata.append("description", `A delicious ${dishName} prepared with care.`);
    formdata.append("tags", `${dietaryRestriction}, ${spiceLevel}`);
    formdata.append("seller_id", "66e5554ee68207c9b1dcd8df");
    formdata.append("protein", protein);
    formdata.append("carbs", carbs);
    formdata.append("fiber", fiber);
    formdata.append("non_veg", dietaryRestriction === 'non-veg');
    formdata.append("spice_level", spiceLevel);
    formdata.append("location", location);

    if (image) {
      formdata.append("image", image);
    }

    let headersList = {
      "Accept": "*/*",
    }

    const params = new URLSearchParams({
      title: dishName,
      description: `A delicious ${dishName} prepared with care.`,
      tags: `${dietaryRestriction}, ${spiceLevel}`,
      protein,
      carbs,
      fiber,
      spice_level: spiceLevel,
      non_veg: dietaryRestriction === 'non-veg',
      seller_id: "66e5554ee68207c9b1dcd8df",
      location
    });

    let reqOptions = {
      url: `https://bulldog-humane-ram.ngrok-free.app/dishes?${params.toString()}`,
      method: "POST",
      headers: headersList,
      data: formdata,
    }

    try {
      let response = await axios.request(reqOptions);
      
      if (response.status === 200) {
        // Clear all form fields
        setLocation('');
        setDishName('');
        setDietaryRestriction('');
        setProtein('');
        setCarbs('');
        setFiber('');
        setSpiceLevel('');
        setImage(null);

        // Display success message
        setSubmitSuccess(true);

        // Optionally, hide the success message after a few seconds
        setTimeout(() => setSubmitSuccess(false), 5000);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  // Handle image selection
  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  const navigateToChat = () => {
    navigate('/seller-chat');
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center relative">
      <div className="w-full max-w-lg bg-white p-8 rounded-lg shadow-md">
        <form className="space-y-6" onSubmit={handleSubmit}>
          {/* Location */}
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="location">
              Location
            </label>
            <input
              id="location"
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-opacity-50"
              placeholder="Enter your location"
              required
            />
          </div>

          {/* Dish Name */}
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="dishName">
              Dish Name
            </label>
            <input
              id="dishName"
              type="text"
              value={dishName}
              onChange={(e) => setDishName(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-opacity-50"
              placeholder="Enter the dish name"
              required
            />
          </div>

          {/* Dietary Restriction */}
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Dietary Restriction
            </label>
            <div className="flex items-center space-x-4">
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  value="veg"
                  checked={dietaryRestriction === 'veg'}
                  onChange={(e) => setDietaryRestriction(e.target.value)}
                  className="form-radio"
                />
                <span className="ml-2">Veg</span>
              </label>
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  value="non-veg"
                  checked={dietaryRestriction === 'non-veg'}
                  onChange={(e) => setDietaryRestriction(e.target.value)}
                  className="form-radio"
                />
                <span className="ml-2">Non-Veg</span>
              </label>
            </div>
          </div>

          {/* Protein */}
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="protein">
              Protein (grams)
            </label>
            <input
              id="protein"
              type="number"
              value={protein}
              onChange={(e) => setProtein(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-opacity-50"
              placeholder="Enter amount of protein"
              required
            />
          </div>

          {/* Carbs */}
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="carbs">
              Carbs (grams)
            </label>
            <input
              id="carbs"
              type="number"
              value={carbs}
              onChange={(e) => setCarbs(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-opacity-50"
              placeholder="Enter amount of carbs"
              required
            />
          </div>

          {/* Fiber */}
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="fiber">
              Fiber (grams)
            </label>
            <input
              id="fiber"
              type="number"
              value={fiber}
              onChange={(e) => setFiber(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-opacity-50"
              placeholder="Enter amount of fiber"
              required
            />
          </div>

          {/* Spice Level */}
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Spice Level
            </label>
            <div className="flex items-center space-x-4">
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  value="less"
                  checked={spiceLevel === 'less'}
                  onChange={(e) => setSpiceLevel(e.target.value)}
                  className="form-radio"
                />
                <span className="ml-2">Less</span>
              </label>
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  value="medium"
                  checked={spiceLevel === 'medium'}
                  onChange={(e) => setSpiceLevel(e.target.value)}
                  className="form-radio"
                />
                <span className="ml-2">Medium</span>
              </label>
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  value="hot"
                  checked={spiceLevel === 'hot'}
                  onChange={(e) => setSpiceLevel(e.target.value)}
                  className="form-radio"
                />
                <span className="ml-2">Hot</span>
              </label>
            </div>
          </div>

          {/* Image Picker */}
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="image">
              Upload Image
            </label>
            <input
              id="image"
              type="file"
              onChange={handleImageChange}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-opacity-50"
              accept="image/*"
            />
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

          {/* Success Message */}
          {submitSuccess && (
            <div className="mt-4 flex items-center justify-center text-green-600">
              <FaCheckCircle className="mr-2" />
              <span>Item Submitted</span>
            </div>
          )}
        </form>
      </div>
      
      {/* Chat Button */}
      <button
        onClick={navigateToChat}
        className="fixed bottom-4 right-4 bg-blue-500 hover:bg-blue-600 text-white rounded-full p-3 shadow-lg transition-colors duration-200"
        aria-label="Open Chat"
      >
        <FaComments size={24} />
      </button>
    </div>
  );
}

export default SellPage;
