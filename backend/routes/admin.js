const express = require('express');
const { processWebsiteContent, rebuildVectorStore } = require('../utils/contentProcessor');

const router = express.Router();

// Process new content and add it to the vector store
router.post('/content', async (req, res) => {
  try {
    const { content, url } = req.body;
    
    if (!content || !url) {
      return res.status(400).json({ error: 'Content and URL are required' });
    }
    
    await processWebsiteContent(content, url);
    
    res.json({ success: true, message: 'Content processed and added to knowledge base' });
  } catch (error) {
    console.error('Content processing error:', error);
    res.status(500).json({ error: 'Failed to process content' });
  }
});

// Rebuild the vector store from scratch
router.post('/rebuild', async (req, res) => {
  try {
    await rebuildVectorStore();
    res.json({ success: true, message: 'Vector store rebuilt successfully' });
  } catch (error) {
    console.error('Rebuild error:', error);
    res.status(500).json({ error: 'Failed to rebuild vector store' });
  }
});

// Analytics endpoint (placeholder for now)
router.get('/analytics', async (req, res) => {
  try {
    // This would be implemented with actual analytics tracking
    res.json({
      totalChats: 0,
      popularQuestions: [],
      averageResponseTime: 0,
      message: 'Analytics feature coming soon'
    });
  } catch (error) {
    console.error('Analytics error:', error);
    res.status(500).json({ error: 'Failed to retrieve analytics' });
  }
});

module.exports = { adminRouter: router };
