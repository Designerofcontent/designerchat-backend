const { addDocumentsToVectorStore, clearVectorStore } = require('./vectorStore');
const fs = require('fs');
const path = require('path');

// Path to store raw content
const CONTENT_DIR = path.join(__dirname, '../../data/content');

// Clean the website content
function cleanContent(content) {
  // Remove navigation menus, footers, and other repeated elements
  let cleanedContent = content;
  
  // Remove common navigation elements
  cleanedContent = cleanedContent.replace(/Skip to content[\s\S]*?Main Menu/g, '');
  cleanedContent = cleanedContent.replace(/Home\s+Why Buy From Me\?\s+Menu Toggle\s+Travel Agents\s+Realtors\s+Browse\s+Blog\s+Contact\s+Need A Website\?/g, '');
  
  // Remove footers
  cleanedContent = cleanedContent.replace(/Providing creative ideas[\s\S]*?Let's talk[\s\S]*?Copyright © 2025 Designer of Content/g, '');
  
  // Remove popup elements
  cleanedContent = cleanedContent.replace(/Why Would You Say No\?[\s\S]*?Your Free Lead Magnet is Waiting[\s\S]*?🟢 Yes! Send Me My Free Lead Magnet/g, '');
  
  // Remove excessive whitespace
  cleanedContent = cleanedContent.replace(/\n{3,}/g, '\n\n');
  
  return cleanedContent.trim();
}

// Simple function to split text into chunks
function splitTextIntoChunks(text, chunkSize = 1000, overlap = 200) {
  const chunks = [];
  let i = 0;
  while (i < text.length) {
    // If this isn't the first chunk, include overlap from previous chunk
    const start = i === 0 ? 0 : i - overlap;
    const end = Math.min(start + chunkSize, text.length);
    chunks.push(text.slice(start, end));
    i = end;
  }
  return chunks;
}

// Process and store website content
async function processWebsiteContent(content, url) {
  try {
    // Create content directory if it doesn't exist
    if (!fs.existsSync(CONTENT_DIR)) {
      fs.mkdirSync(CONTENT_DIR, { recursive: true });
    }
    
    // Clean the content
    const cleanedContent = cleanContent(content);
    
    // Save raw content to file
    const filename = url.replace(/[^a-z0-9]/gi, '_').toLowerCase();
    const filePath = path.join(CONTENT_DIR, `${filename}.txt`);
    fs.writeFileSync(filePath, cleanedContent);
    
    // Split content into chunks
    const chunks = splitTextIntoChunks(cleanedContent);
    
    // Create document objects
    const docs = chunks.map(chunk => ({
      pageContent: chunk,
      metadata: { source: url }
    }));
    
    // Add documents to vector store
    await addDocumentsToVectorStore(docs);
    
    return { success: true, count: docs.length };
  } catch (error) {
    console.error('Error processing content:', error);
    throw error;
  }
}

// Process all content files and rebuild the vector store
async function rebuildVectorStore() {
  try {
    // Clear existing vector store
    await clearVectorStore();
    
    // Check if content directory exists
    if (!fs.existsSync(CONTENT_DIR)) {
      console.log('No content directory found. Creating empty vector store.');
      return { success: true, count: 0 };
    }
    
    // Read all content files
    const files = fs.readdirSync(CONTENT_DIR);
    let totalDocs = 0;
    
    for (const file of files) {
      if (file.endsWith('.txt')) {
        const filePath = path.join(CONTENT_DIR, file);
        const content = fs.readFileSync(filePath, 'utf8');
        
        // Extract URL from filename
        const url = file.replace('.txt', '').replace(/_/g, '/');
        
        // Split content into chunks
        const chunks = splitTextIntoChunks(content);
        
        // Create document objects
        const docs = chunks.map(chunk => ({
          pageContent: chunk,
          metadata: { source: url }
        }));
        
        // Add documents to vector store
        await addDocumentsToVectorStore(docs);
        totalDocs += docs.length;
      }
    }
    
    return { success: true, count: totalDocs };
  } catch (error) {
    console.error('Error rebuilding vector store:', error);
    throw error;
  }
}

// Process the initial content provided by the user
async function processInitialContent(contentArray) {
  try {
    for (const item of contentArray) {
      if (item.content && item.url) {
        await processWebsiteContent(item.content, item.url);
      }
    }
    return { success: true };
  } catch (error) {
    console.error('Error processing initial content:', error);
    throw error;
  }
}

module.exports = {
  processWebsiteContent,
  rebuildVectorStore,
  processInitialContent,
};
