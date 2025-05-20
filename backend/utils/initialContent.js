require('dotenv').config();
const { processWebsiteContent } = require('./contentProcessor');
const fs = require('fs');
const path = require('path');

// Path to store raw content
const CONTENT_DIR = path.join(__dirname, '../../data/content');

// Create content directory if it doesn't exist
if (!fs.existsSync(CONTENT_DIR)) {
  fs.mkdirSync(CONTENT_DIR, { recursive: true });
}

// Website content from the provided scrape
const websiteContent = [
  {
    url: 'https://designerofcontent.com/home',
    content: fs.readFileSync(path.join(__dirname, '../../data/home.txt'), 'utf8')
  },
  {
    url: 'https://designerofcontent.com/contact',
    content: fs.readFileSync(path.join(__dirname, '../../data/contact.txt'), 'utf8')
  },
  {
    url: 'https://designerofcontent.com/blog',
    content: fs.readFileSync(path.join(__dirname, '../../data/blog.txt'), 'utf8')
  },
  {
    url: 'https://designerofcontent.com/lead-magnets-ai-automation-products',
    content: fs.readFileSync(path.join(__dirname, '../../data/products.txt'), 'utf8')
  },
  {
    url: 'https://designerofcontent.com/realtors',
    content: fs.readFileSync(path.join(__dirname, '../../data/realtors.txt'), 'utf8')
  },
  {
    url: 'https://designerofcontent.com/travel-agents',
    content: fs.readFileSync(path.join(__dirname, '../../data/travel-agents.txt'), 'utf8')
  },
  {
    url: 'https://designerofcontent.com/lead-magnet-popup',
    content: fs.readFileSync(path.join(__dirname, '../../data/lead-magnet-popup.txt'), 'utf8')
  },
  {
    url: 'https://designerofcontent.com/faq',
    content: fs.readFileSync(path.join(__dirname, '../../data/faq.txt'), 'utf8')
  }
];

// Process each content item
async function processAllContent() {
  console.log('Starting content processing...');
  
  for (const item of websiteContent) {
    console.log(`Processing content from ${item.url}...`);
    try {
      await processWebsiteContent(item.content, item.url);
      console.log(`Successfully processed content from ${item.url}`);
    } catch (error) {
      console.error(`Error processing content from ${item.url}:`, error);
    }
  }
  
  console.log('Content processing complete!');
}

// Run the processing
processAllContent().catch(console.error);
