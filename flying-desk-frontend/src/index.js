import React from 'react';
import ReactDOM from 'react-dom/client'; // Użyj odpowiedniego modułu dla createRoot
import { BrowserRouter } from 'react-router-dom';
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root')); // Tworzymy root
root.render(
  <React.StrictMode> {/* Dla lepszych narzędzi developerskich */}
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
