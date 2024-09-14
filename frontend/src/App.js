// src/App.js

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import BuyPage from './components/BuyPage';
import SellPage from './components/SellPage';

// import SellPage from './components/SellPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/buy" element={<BuyPage />} />
        <Route path="/sell" element={<SellPage />} />
        {/* <Route path="/sell" element={<SellPage />} /> Optional */}
      </Routes>
    </Router>
  );
}

export default App;
