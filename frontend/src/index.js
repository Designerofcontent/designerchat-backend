import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import ChatWidget from './components/ChatWidget';

// Check if we're in WordPress embedding mode
const isWordPress = window.location.href.includes('designerofcontent.com');
const targetElementId = isWordPress ? 'designer-chat-widget' : 'root';

// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
  const targetElement = document.getElementById(targetElementId);
  
  if (targetElement) {
    const root = ReactDOM.createRoot(targetElement);
    root.render(
      <React.StrictMode>
        {isWordPress ? <ChatWidget /> : <App />}
      </React.StrictMode>
    );
  } else {
    console.error(`Could not find element with ID "${targetElementId}"`);
  }
});
