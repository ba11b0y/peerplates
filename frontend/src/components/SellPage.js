// src/components/SellPage.js

import React, { useState } from 'react';
import { FaCog } from 'react-icons/fa'; // Import FontAwesome icon for settings
import ProfileImagePlaceholder from '../images/rishith.jpg'; // Replace with the path to your placeholder image

function SellPage() {
  // State variables to handle form data
//   const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  const [dishName, setDishName] = useState('');
  
  const [dietaryRestriction, setDietaryRestriction] = useState('');
  const [protein, setProtein] = useState('');
  const [carbs, setCarbs] = useState('');
  const [fiber, setFiber] = useState('');
  const [spiceLevel, setSpiceLevel] = useState('');
  const [image, setImage] = useState(null);
  const [activeTab, setActiveTab] = useState('matches'); // To toggle between "Matches" and "Messages"

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Gather form data into an object
    const formData = {
		location,
		dishName,
        dietaryRestriction,
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
    // setShowForm(false);
	// alert(`Name: ${name}\nLocation: ${location}\nDish Name: ${dishName}\nImage: ${image ? image.name : 'No image selected'}`);
};
  

  // Handle image selection
  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Left Side (70%) - Form */}
      <div className="flex-[7] flex items-center justify-center">
        <form className="w-full max-w-lg bg-white p-8 rounded-lg shadow-md" onSubmit={handleSubmit}>
			{/* Location */}
			<div className="mb-4">
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
			<div className="mb-4">
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
			<div className="mb-4">
			<label className="block text-gray-700 text-sm font-bold mb-2">
				Dietary Restriction
			</label>
			<div className="flex items-center">
				<label className="mr-4">
				<input
					type="radio"
					value="veg"
					checked={dietaryRestriction === 'veg'}
					onChange={(e) => setDietaryRestriction(e.target.value)}
					className="mr-2"
				/>
				Veg
				</label>
				<label>
				<input
					type="radio"
					value="non-veg"
					checked={dietaryRestriction === 'non-veg'}
					onChange={(e) => setDietaryRestriction(e.target.value)}
					className="mr-2"
				/>
				Non-Veg
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
			<div className="mb-4">
			<label className="block text-gray-700 text-sm font-bold mb-2">
				Spice Level
			</label>
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
			

			{/* Image Picker */}
			<div className="mb-4">
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
			</form>
      </div>

      {/* Right Side (30%) - Chat Window */}
      <div className="flex-[3] flex flex-col bg-gray-200">
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

export default SellPage;
