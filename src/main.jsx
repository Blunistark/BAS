import React from 'react';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom'; // Ensure this is only here
import './index.css';
import 'regenerator-runtime/runtime'; // Ensure this is required


import App from './App.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter> {/* Wrap the app here */}
      <App />
    </BrowserRouter>
  </StrictMode>
);
