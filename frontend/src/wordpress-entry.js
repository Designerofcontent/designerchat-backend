import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import ChatWidget from './components/ChatWidget';

// This file is specifically for WordPress integration
// It will mount the ChatWidget component to the element with ID 'designer-chat-widget'

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
  const chatWidgetContainer = document.getElementById('designer-chat-widget');
  
  if (chatWidgetContainer) {
    ReactDOM.render(
      <React.StrictMode>
        <ChatWidget />
      </React.StrictMode>,
      chatWidgetContainer
    );
  } else {
    console.error('Could not find element with ID "designer-chat-widget"');
  }
});
