import React, { useState, useRef } from 'react';
import { useSpring, animated, config } from 'react-spring';
import { useSwipeable } from 'react-swipeable';
import { FaThumbsDown, FaThumbsUp } from 'react-icons/fa';
import axios from 'axios';

function SwipePage() {
  const [craving, setCraving] = useState('');
  const [showPreferences, setShowPreferences] = useState(false);
  const [nonVeg, setNonVeg] = useState('yes');
  const [proteinRange, setProteinRange] = useState(50);
  const [carbsRange, setCarbsRange] = useState(50);
  const [fiberRange, setFiberRange] = useState(50);
  const [spiceLevel, setSpiceLevel] = useState('less');
  const [dishes, setDishes] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showDishes, setShowDishes] = useState(false);

  const typingTimeoutRef = useRef(null);

  const fadeAnimation = useSpring({
    opacity: showPreferences ? 1 : 0,
    config: { tension: 300, friction: 20 },
  });

  const dishesAnimation = useSpring({
    opacity: showDishes ? 1 : 0,
    pointerEvents: showDishes ? 'auto' : 'none',
    config: config.molasses,
  });

  const inputAnimation = useSpring({
    opacity: showDishes ? 0 : 1,
    pointerEvents: showDishes ? 'none' : 'auto',
    config: config.molasses,
  });

  const handleCravingChange = (e) => {
    setCraving(e.target.value);
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => {
      if (e.target.value) setShowPreferences(true);
    }, 500);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = {
      nonVeg,
      protein: proteinRange,
      carbs: carbsRange,
      fiber: fiberRange,
      spiceLevel,
    };

    const formDataString = Object.entries(formData)
      .map(([key, value]) => `${key}:${value}`)
      .join(',');

    const baseUrl = `https://bulldog-humane-ram.ngrok-free.app/dishes?preferences=${formDataString}`;

    try {
      const response = await axios.get(baseUrl);
      setDishes(response.data);
      setShowPreferences(false);
      setShowDishes(true);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const [{ x, rotate }, api] = useSpring(() => ({ x: 0, rotate: 0 }));

  const swiped = (direction) => {
    if (direction === 'right') {
      // Handle right swipe (like)
    } else {
      // Handle left swipe (dislike)
      setCurrentIndex((prevIndex) => (prevIndex + 1) % dishes.length);
    }
  };

  const handlers = useSwipeable({
    onSwipedLeft: () => swiped('left'),
    onSwipedRight: () => swiped('right'),
    onSwiping: (e) => {
      api.start({
        x: e.deltaX,
        rotate: e.deltaX / 5,
        config: { friction: 50, tension: 300 }
      });
    },
    onSwiped: () => {
      api.start({ x: 0, rotate: 0 });
    },
    trackMouse: true,
  });

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <animated.div style={inputAnimation} className="flex-1 flex flex-col items-center justify-center p-4">
        <input
          type="text"
          value={craving}
          onChange={handleCravingChange}
          className="w-full max-w-md px-4 py-2 text-xl border-b-2 border-gray-300 focus:outline-none focus:border-blue-500 bg-transparent"
          placeholder={showPreferences ? '' : "What are you craving today?"}
        />

        <animated.div style={fadeAnimation} className="mt-8 w-full max-w-md">
          {showPreferences && (
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Non-Veg */}
              <div>
                <label className="block text-sm font-medium text-gray-700">Non-Veg</label>
                <div className="mt-1 flex items-center space-x-4">
                  {['yes', 'no'].map((option) => (
                    <label key={option} className="inline-flex items-center">
                      <input
                        type="radio"
                        value={option}
                        checked={nonVeg === option}
                        onChange={(e) => setNonVeg(e.target.value)}
                        className="form-radio h-4 w-4 text-blue-600"
                      />
                      <span className="ml-2 text-gray-700">{option.charAt(0).toUpperCase() + option.slice(1)}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Protein, Carbs, Fiber inputs */}
              {['protein', 'carbs', 'fiber'].map((nutrient) => (
                <div key={nutrient}>
                  <label className="block text-sm font-medium text-gray-700">
                    {nutrient.charAt(0).toUpperCase() + nutrient.slice(1)}: {eval(`${nutrient}Range`)}g
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={eval(`${nutrient}Range`)}
                    onChange={(e) => {
                      const setValue = {
                        protein: setProteinRange,
                        carbs: setCarbsRange,
                        fiber: setFiberRange
                      }[nutrient];
                      setValue(Number(e.target.value));
                    }}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  />
                </div>
              ))}

              {/* Spice Level */}
              <div>
                <label className="block text-sm font-medium text-gray-700">Spice Level</label>
                <div className="mt-1 flex items-center space-x-4">
                  {['less', 'medium', 'hot'].map((level) => (
                    <label key={level} className="inline-flex items-center">
                      <input
                        type="radio"
                        value={level}
                        checked={spiceLevel === level}
                        onChange={(e) => setSpiceLevel(e.target.value)}
                        className="form-radio h-4 w-4 text-blue-600"
                      />
                      <span className="ml-2 text-gray-700">{level.charAt(0).toUpperCase() + level.slice(1)}</span>
                    </label>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Find Dishes
              </button>
            </form>
          )}
        </animated.div>
      </animated.div>
      
      <animated.div style={dishesAnimation} className="absolute inset-0 flex flex-col items-center justify-center bg-gray-100 p-4">
        {dishes.length > 0 && (
          <div className="relative w-full max-w-sm aspect-[3/4]" {...handlers}>
            <animated.div
              style={{
                x,
                rotate,
                backgroundImage: `url(${dishes[currentIndex].image_url})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}
              className="absolute inset-0 bg-white rounded-xl shadow-xl overflow-hidden"
            >
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent text-white p-6">
                <h2 className="text-3xl font-bold mb-2">{dishes[currentIndex].title}</h2>
                <p className="text-lg">{dishes[currentIndex].description}</p>
              </div>
            </animated.div>
          </div>
        )}

        <div className="flex justify-center space-x-8 mt-8">
          <button
            onClick={() => swiped('left')}
            className="p-4 bg-white text-red-500 rounded-full shadow-lg hover:bg-red-100 transition-colors"
          >
            <FaThumbsDown size={32} />
          </button>
          <button
            onClick={() => swiped('right')}
            className="p-4 bg-white text-green-500 rounded-full shadow-lg hover:bg-green-100 transition-colors"
          >
            <FaThumbsUp size={32} />
          </button>
        </div>
      </animated.div>
    </div>
  );
}

export default SwipePage;
