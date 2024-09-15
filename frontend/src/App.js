// src/App.js

import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './components/Home';
import BuyPage from './components/BuyPage';
import SellPage from './components/SellPage';
import ChatWindow from './components/ChatWindow';
import SellerChatWindow from './components/SellerChatWindow';

function App() {
  return (
    <Router>
      <div className="w-full h-screen">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/buy" element={<BuyPage />} />
        <Route path="/sell" element={<SellPage />} />
        <Route path="/chat/:id" element={<ChatWindow />} />
        <Route path="/seller-chat" element={<SellerChatWindow />} />
      </Routes>
      </div>
    </Router>
  );
}

export default App;
