// src/App.js

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import BuyPage from './components/BuyPage';
import SellPage from './components/SellPage';
import ChatWindow from './components/ChatWindow';
import { GeistProvider, CssBaseline } from '@geist-ui/core';
import SellerChatWindow from './components/SellerChatWindow';

function App() {
  return (
    <GeistProvider>
      <CssBaseline />
      <Router>
        <div className="flex flex-col min-h-screen bg-gray-100">
          <main className="flex-grow container mx-auto px-4 py-8 md:px-8">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/buy" element={<BuyPage />} />
              <Route path="/sell" element={<SellPage />} />
              <Route path="/chat/:id" element={<ChatWindow />} />
              <Route path="/seller-chat" element={<SellerChatWindow />} />
            </Routes>
          </main>
          <footer className="bg-gray-800 text-white text-center py-4">
            <p>&copy; 2023 PeerPlates. All rights reserved.</p>
          </footer>
        </div>
      </Router>
    </GeistProvider>
  );
}

export default App;
