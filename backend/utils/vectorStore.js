const fs = require('fs');
const path = require('path');
const { OpenAI } = require('openai');

// Path to store the content data
const CONTENT_DIR = path.join(__dirname, '../../data/content');

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

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

// Add documents to the content store
async function addDocumentsToVectorStore(documents) {
  try {
    // Create content directory if it doesn't exist
    if (!fs.existsSync(CONTENT_DIR)) {
      fs.mkdirSync(CONTENT_DIR, { recursive: true });
    }
    
    // Process each document
    for (const doc of documents) {
      const { pageContent, metadata } = doc;
      const source = metadata.source;
      
      // Create a unique filename based on the source
      const filename = source.replace(/[^a-z0-9]/gi, '_').toLowerCase();
      const filePath = path.join(CONTENT_DIR, `${filename}.json`);
      
      // Split content into chunks
      const chunks = splitTextIntoChunks(pageContent);
      
      // Save chunks with metadata
      const data = {
        source,
        chunks: chunks.map(chunk => ({
          content: chunk,
          metadata: { ...metadata }
        }))
      };
      
      fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
    }
    
    console.log(`Added ${documents.length} documents to content store`);
    return true;
  } catch (error) {
    console.error('Error adding documents to content store:', error);
    throw error;
  }
}

// Retrieve relevant documents based on a query
async function retrieveRelevantDocuments(query, k = 5) {
  try {
    // Check if content directory exists
    if (!fs.existsSync(CONTENT_DIR)) {
      return [];
    }
    
    // Read all content files
    const files = fs.readdirSync(CONTENT_DIR);
    let allChunks = [];
    
    // Collect all chunks from all files
    for (const file of files) {
      if (file.endsWith('.json')) {
        const filePath = path.join(CONTENT_DIR, file);
        const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
        
        // Add each chunk with its source
        data.chunks.forEach(chunk => {
          allChunks.push({
            pageContent: chunk.content,
            metadata: { source: data.source, ...chunk.metadata }
          });
        });
      }
    }
    
    // If no chunks, return empty array
    if (allChunks.length === 0) {
      return [];
    }
    
    // Use OpenAI embeddings to find relevant chunks
    const embeddingResponse = await openai.embeddings.create({
      model: "text-embedding-ada-002",
      input: query,
    });
    
    const queryEmbedding = embeddingResponse.data[0].embedding;
    
    // Get embeddings for all chunks
    const chunkEmbeddings = await Promise.all(
      allChunks.map(async (chunk) => {
        const response = await openai.embeddings.create({
          model: "text-embedding-ada-002",
          input: chunk.pageContent,
        });
        return response.data[0].embedding;
      })
    );
    
    // Calculate similarity scores
    const similarities = chunkEmbeddings.map((embedding, i) => {
      const similarity = cosineSimilarity(queryEmbedding, embedding);
      return { chunk: allChunks[i], similarity };
    });
    
    // Sort by similarity and take top k
    const topResults = similarities
      .sort((a, b) => b.similarity - a.similarity)
      .slice(0, k)
      .map(item => item.chunk);
    
    return topResults;
  } catch (error) {
    console.error('Error retrieving documents:', error);
    // Return empty array instead of throwing to be more resilient
    return [];
  }
}

// Calculate cosine similarity between two vectors
function cosineSimilarity(vecA, vecB) {
  let dotProduct = 0;
  let normA = 0;
  let normB = 0;
  
  for (let i = 0; i < vecA.length; i++) {
    dotProduct += vecA[i] * vecB[i];
    normA += vecA[i] * vecA[i];
    normB += vecB[i] * vecB[i];
  }
  
  return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
}

// Clear the content store
async function clearVectorStore() {
  try {
    if (fs.existsSync(CONTENT_DIR)) {
      const files = fs.readdirSync(CONTENT_DIR);
      for (const file of files) {
        fs.unlinkSync(path.join(CONTENT_DIR, file));
      }
      console.log('Content store cleared');
    }
    return true;
  } catch (error) {
    console.error('Error clearing content store:', error);
    throw error;
  }
}

module.exports = {
  addDocumentsToVectorStore,
  retrieveRelevantDocuments,
  clearVectorStore,
};
