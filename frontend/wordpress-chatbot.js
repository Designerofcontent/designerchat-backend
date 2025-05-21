// WordPress Chatbot Integration
// This is a standalone script that creates the chatbot without requiring React mounting

(function() {
  // Configuration
  const API_URL = 'https://designerchat-backend-1.onrender.com/api';
  const PRIMARY_COLOR = '#10f0f8';
  
  // Create the chat widget container
  function createChatWidget() {
    // Create main container
    const container = document.createElement('div');
    container.id = 'doc-chatbot-container';
    container.style.position = 'fixed';
    container.style.bottom = '20px';
    container.style.right = '20px';
    container.style.zIndex = '9999';
    container.style.fontFamily = 'Arial, sans-serif';
    
    // Create chat button
    const chatButton = document.createElement('button');
    chatButton.id = 'doc-chatbot-button';
    chatButton.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>';
    chatButton.style.width = '60px';
    chatButton.style.height = '60px';
    chatButton.style.borderRadius = '50%';
    chatButton.style.backgroundColor = PRIMARY_COLOR;
    chatButton.style.color = '#000';
    chatButton.style.border = 'none';
    chatButton.style.cursor = 'pointer';
    chatButton.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.2)';
    chatButton.style.display = 'flex';
    chatButton.style.alignItems = 'center';
    chatButton.style.justifyContent = 'center';
    
    // Create chat window (initially hidden)
    const chatWindow = document.createElement('div');
    chatWindow.id = 'doc-chatbot-window';
    chatWindow.style.display = 'none';
    chatWindow.style.position = 'absolute';
    chatWindow.style.bottom = '80px';
    chatWindow.style.right = '0';
    chatWindow.style.width = '350px';
    chatWindow.style.height = '500px';
    chatWindow.style.backgroundColor = '#fff';
    chatWindow.style.borderRadius = '10px';
    chatWindow.style.boxShadow = '0 5px 15px rgba(0, 0, 0, 0.2)';
    chatWindow.style.overflow = 'hidden';
    chatWindow.style.display = 'none';
    chatWindow.style.flexDirection = 'column';
    
    // Create chat header
    const chatHeader = document.createElement('div');
    chatHeader.style.backgroundColor = PRIMARY_COLOR;
    chatHeader.style.color = '#000';
    chatHeader.style.padding = '15px';
    chatHeader.style.display = 'flex';
    chatHeader.style.justifyContent = 'space-between';
    chatHeader.style.alignItems = 'center';
    
    const headerTitle = document.createElement('div');
    headerTitle.innerHTML = '<strong>Designer of Content</strong><br><small>AI Assistant</small>';
    
    const closeButton = document.createElement('button');
    closeButton.innerHTML = '&times;';
    closeButton.style.background = 'none';
    closeButton.style.border = 'none';
    closeButton.style.color = '#000';
    closeButton.style.fontSize = '24px';
    closeButton.style.cursor = 'pointer';
    
    chatHeader.appendChild(headerTitle);
    chatHeader.appendChild(closeButton);
    
    // Create chat messages container
    const messagesContainer = document.createElement('div');
    messagesContainer.id = 'doc-chatbot-messages';
    messagesContainer.style.flex = '1';
    messagesContainer.style.padding = '15px';
    messagesContainer.style.overflowY = 'auto';
    
    // Create chat input area
    const inputContainer = document.createElement('div');
    inputContainer.style.padding = '15px';
    inputContainer.style.borderTop = '1px solid #eee';
    inputContainer.style.display = 'flex';
    
    const chatInput = document.createElement('input');
    chatInput.id = 'doc-chatbot-input';
    chatInput.type = 'text';
    chatInput.placeholder = 'Type your message...';
    chatInput.style.flex = '1';
    chatInput.style.padding = '10px';
    chatInput.style.border = '1px solid #ddd';
    chatInput.style.borderRadius = '20px';
    chatInput.style.marginRight = '10px';
    
    const sendButton = document.createElement('button');
    sendButton.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>';
    sendButton.style.width = '40px';
    sendButton.style.height = '40px';
    sendButton.style.borderRadius = '50%';
    sendButton.style.backgroundColor = PRIMARY_COLOR;
    sendButton.style.color = '#000';
    sendButton.style.border = 'none';
    sendButton.style.cursor = 'pointer';
    sendButton.style.display = 'flex';
    sendButton.style.alignItems = 'center';
    sendButton.style.justifyContent = 'center';
    
    inputContainer.appendChild(chatInput);
    inputContainer.appendChild(sendButton);
    
    // Assemble the chat window
    chatWindow.appendChild(chatHeader);
    chatWindow.appendChild(messagesContainer);
    chatWindow.appendChild(inputContainer);
    
    // Add elements to the container
    container.appendChild(chatButton);
    container.appendChild(chatWindow);
    
    // Add event listeners
    chatButton.addEventListener('click', function() {
      chatWindow.style.display = chatWindow.style.display === 'none' ? 'flex' : 'none';
    });
    
    closeButton.addEventListener('click', function() {
      chatWindow.style.display = 'none';
    });
    
    // Handle sending messages
    function sendMessage() {
      const message = chatInput.value.trim();
      if (message) {
        // Add user message to chat
        addMessage('user', message);
        chatInput.value = '';
        
        // Show loading indicator
        const loadingId = addMessage('bot', '<em>Thinking...</em>');
        
        // First, try to wake up the server with a health check
        addMessage('bot', '<em>Connecting to server... This may take up to 30 seconds if the server is in sleep mode.</em>', 'wake-notice');
        
        // Try to wake up the server first
        fetch(`${API_URL}/health`, { method: 'GET' })
          .then(() => {
            // Remove the wake notice
            const wakeNotice = document.querySelector('.wake-notice');
            if (wakeNotice) wakeNotice.remove();
            
            // Now send the actual chat request
            return fetch(`${API_URL}/chat`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({ message }),
              // Increase timeout for Render's cold start
              timeout: 60000
            });
          })
          .then(response => response.json())
          .then(data => {
            // Remove loading message
            document.getElementById(loadingId).remove();
            
            // Add bot response
            addMessage('bot', data.message || 'Sorry, I encountered an error.');
          })
          .catch(error => {
            // Remove loading message
            document.getElementById(loadingId).remove();
            
            // Add error message
            addMessage('bot', 'Sorry, I encountered an error connecting to the server. The server might be in sleep mode. Please try again in a moment.');
            console.error('Error:', error);
          });
      }
    }
    
    sendButton.addEventListener('click', sendMessage);
    chatInput.addEventListener('keypress', function(e) {
      if (e.key === 'Enter') {
        sendMessage();
      }
    });
    
    // Function to add a message to the chat
    function addMessage(sender, content) {
      const messageId = 'msg-' + Date.now();
      const messageDiv = document.createElement('div');
      messageDiv.id = messageId;
      messageDiv.className = `doc-chatbot-message ${sender}`;
      messageDiv.style.marginBottom = '15px';
      messageDiv.style.maxWidth = '80%';
      messageDiv.style.padding = '10px 15px';
      messageDiv.style.borderRadius = '18px';
      messageDiv.style.color = '#000';
      
      if (sender === 'user') {
        messageDiv.style.backgroundColor = '#e6f7ff';
        messageDiv.style.marginLeft = 'auto';
      } else {
        messageDiv.style.backgroundColor = '#f0f0f0';
        messageDiv.style.marginRight = 'auto';
      }
      
      messageDiv.innerHTML = content;
      messagesContainer.appendChild(messageDiv);
      
      // Scroll to bottom
      messagesContainer.scrollTop = messagesContainer.scrollHeight;
      
      return messageId;
    }
    
    // Add welcome message
    setTimeout(() => {
      addMessage('bot', 'Hi there! How can I help you today?');
    }, 500);
    
    return container;
  }
  
  // Initialize the chat widget when the page is fully loaded
  window.addEventListener('load', function() {
    // Check if the container already exists
    if (!document.getElementById('doc-chatbot-container')) {
      const chatWidget = createChatWidget();
      document.body.appendChild(chatWidget);
    }
  });
})();
