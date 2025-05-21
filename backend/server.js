require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const { chatRouter } = require('./routes/chat');
const { adminRouter } = require('./routes/admin');

// Ensure data directories exist
const dataDir = path.join(__dirname, '../data');
const contentDir = path.join(dataDir, 'content');

if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
  console.log('Created data directory');
}

if (!fs.existsSync(contentDir)) {
  fs.mkdirSync(contentDir, { recursive: true });
  console.log('Created content directory');
}

const app = express();
const PORT = process.env.PORT || 5000;

// CORS configuration for deployment
const corsOptions = {
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true,
  optionsSuccessStatus: 204
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'ok', 
    message: 'Server is running', 
    env: process.env.NODE_ENV,
    timestamp: new Date().toISOString()
  });
});

// Routes
app.use('/api/chat', chatRouter);
app.use('/api/admin', adminRouter);

// API-only mode for Render deployment
// We're not serving frontend files from here since they'll be on WordPress
app.get('/', (req, res) => {
  res.json({ 
    message: 'Designer of Content AI Chatbot API', 
    status: 'running',
    endpoints: [
      '/api/chat - Chat endpoint',
      '/api/admin - Admin endpoints',
      '/health - Health check'
    ]
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!', error: err.message });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
