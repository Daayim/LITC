// LoadingWindow.jsx

import React from 'react';
import './LoadingWindow.css';

function LoadingWindow() {
    return (
      <div className="loading-container">
        <div className="loading-popup">
            <p>Loading<span className="dots"></span></p>
        </div>    
      </div>
    );
  }

export default LoadingWindow;
