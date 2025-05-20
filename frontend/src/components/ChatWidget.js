import React, { useState, useRef, useEffect } from 'react';
import { 
  Box, 
  IconButton, 
  TextField, 
  Typography, 
  Paper, 
  Fab, 
  CircularProgress
} from '@mui/material';
import ChatIcon from '@mui/icons-material/Chat';
import CloseIcon from '@mui/icons-material/Close';
import SendIcon from '@mui/icons-material/Send';
import ReactMarkdown from 'react-markdown';
import axios from 'axios';

// API URL - will need to be updated based on deployment
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const ChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);
  
  // Scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  
  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  
  // Toggle chat widget open/closed
  const toggleChat = () => {
    setIsOpen(!isOpen);
    
    // Add welcome message if opening for first time and no messages
    if (!isOpen && messages.length === 0) {
      setMessages([
        { 
          id: 'welcome', 
          text: "Hi there! I'm Debbie's AI Assistant, Izzy. How can I help you today?", 
          sender: 'bot' 
        }
      ]);
    }
  };
  
  // Handle sending a message
  const handleSendMessage = async (e) => {
    e.preventDefault();
    
    if (!inputValue.trim()) return;
    
    const userMessage = {
      id: Date.now(),
      text: inputValue,
      sender: 'user'
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);
    
    try {
      // Create chat history in the format expected by the API
      const chatHistory = messages
        .filter(msg => msg.id !== 'welcome') // Exclude welcome message
        .map(msg => ({
          role: msg.sender === 'user' ? 'user' : 'assistant',
          content: msg.text
        }));
      
      // Send request to backend
      const response = await axios.post(`${API_URL}/chat`, {
        message: userMessage.text,
        chatHistory
      });
      
      // Add bot response to messages
      setMessages(prev => [
        ...prev, 
        { 
          id: Date.now() + 1, 
          text: response.data.response, 
          sender: 'bot'
        }
      ]);
    } catch (error) {
      console.error('Error sending message:', error);
      
      // Add error message
      setMessages(prev => [
        ...prev, 
        { 
          id: Date.now() + 1, 
          text: "I'm sorry, I'm having trouble connecting right now. Please try again later or contact support at hello@designerofcontent.com.", 
          sender: 'bot',
          isError: true
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="chat-widget">
      {/* Chat button */}
      <Fab 
        color="primary" 
        aria-label="chat"
        onClick={toggleChat}
        sx={{ boxShadow: 3 }}
      >
        {isOpen ? <CloseIcon /> : <ChatIcon />}
      </Fab>
      
      {/* Chat container */}
      {isOpen && (
        <Paper 
          elevation={3} 
          sx={{ 
            position: 'fixed',
            bottom: '80px',
            right: '20px',
            width: { xs: '90%', sm: '350px' },
            height: '500px',
            borderRadius: 2,
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden'
          }}
        >
          {/* Chat header */}
          <Box 
            sx={{ 
              bgcolor: 'primary.main', 
              color: 'black', 
              p: 2,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <img 
                src="/images/doc-logo.png" 
                alt="Designer of Content" 
                style={{ marginRight: '8px', width: '40px', height: '40px', objectFit: 'contain' }}
              />
              <Typography variant="h6">
                Designer of Content Assistant
              </Typography>
            </Box>
            <IconButton 
              size="small" 
              onClick={toggleChat}
              sx={{ color: 'black' }}
            >
              <CloseIcon />
            </IconButton>
          </Box>
          
          {/* Messages area */}
          <Box 
            sx={{ 
              flex: 1, 
              p: 2, 
              overflowY: 'auto',
              display: 'flex',
              flexDirection: 'column'
            }}
          >
            {messages.map((message) => (
              <Box
                key={message.id}
                sx={{
                  maxWidth: '80%',
                  p: 1.5,
                  mb: 1.5,
                  borderRadius: 2,
                  alignSelf: message.sender === 'user' ? 'flex-end' : 'flex-start',
                  bgcolor: message.sender === 'user' 
                    ? 'primary.light' 
                    : message.isError 
                      ? '#ffebee' 
                      : '#f5f5f5',
                  color: message.sender === 'user' ? 'black' : 'text.primary',
                  ...(message.sender === 'user' 
                    ? { borderBottomRightRadius: 0 } 
                    : { borderBottomLeftRadius: 0 })
                }}
              >
                <ReactMarkdown>
                  {message.text}
                </ReactMarkdown>
              </Box>
            ))}
            
            {/* Loading indicator */}
            {isLoading && (
              <Box 
                sx={{ 
                  display: 'flex', 
                  justifyContent: 'center', 
                  my: 2 
                }}
              >
                <CircularProgress size={24} />
              </Box>
            )}
            
            {/* Invisible element to scroll to */}
            <div ref={messagesEndRef} />
          </Box>
          
          {/* Input area */}
          <Box 
            component="form" 
            onSubmit={handleSendMessage}
            sx={{ 
              p: 2, 
              borderTop: '1px solid', 
              borderColor: 'divider',
              display: 'flex'
            }}
          >
            <TextField
              fullWidth
              placeholder="Type your message..."
              variant="outlined"
              size="small"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              disabled={isLoading}
              sx={{ mr: 1 }}
            />
            <IconButton 
              color="primary" 
              type="submit"
              disabled={!inputValue.trim() || isLoading}
              sx={{ 
                bgcolor: 'primary.main', 
                color: 'white',
                '&:hover': {
                  bgcolor: 'primary.dark',
                },
                '&.Mui-disabled': {
                  bgcolor: 'action.disabledBackground',
                  color: 'action.disabled'
                }
              }}
            >
              <SendIcon />
            </IconButton>
          </Box>
        </Paper>
      )}
    </div>
  );
};

export default ChatWidget;
