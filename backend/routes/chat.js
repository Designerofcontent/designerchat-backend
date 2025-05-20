const express = require('express');
const { OpenAI } = require('openai');
const { retrieveRelevantDocuments } = require('../utils/vectorStore');

const router = express.Router();

// Initialize OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Chat endpoint
router.post('/', async (req, res) => {
  try {
    const { message, chatHistory = [] } = req.body;
    
    // Function to check if a message is specifically about business hours
    function isAskingAboutHours(msg) {
      const lowerMsg = msg.toLowerCase();
      
      // First check: if the message contains lead magnets, it's definitely NOT about hours
      if (lowerMsg.includes('lead') || lowerMsg.includes('magnet') || lowerMsg.includes('free')) {
        return false;
      }
      
      // Exact phrases that indicate hours questions
      const hoursPhrases = [
        'what are your hours', 
        'business hours', 
        'opening hours',
        'when are you open',
        'hours of operation',
        'what time are you open',
        'what days are you open',
        'office hours'
      ];
      
      // Check for exact phrases
      for (const phrase of hoursPhrases) {
        if (lowerMsg.includes(phrase)) {
          return true;
        }
      }
      
      // If the message is very short and ONLY contains "hours"
      if (lowerMsg === 'hours' || lowerMsg === 'hours?' || lowerMsg === 'your hours') {
        return true;
      }
      
      // Default to false - only return true for very specific hours questions
      return false;
    }
    
    // Check if the message is specifically asking about hours
    if (isAskingAboutHours(message)) {
      return res.json({
        response: "Designer of Content's business hours are Monday-Friday, 10am to 8pm EST, though Debbie often works late. The business is not typically open on weekends or holidays except for emergencies."
      });
    }
    
    // Retrieve relevant documents from the vector store
    const relevantDocs = await retrieveRelevantDocuments(message);
    
    // Format the context from relevant documents
    const context = relevantDocs.map(doc => doc.pageContent).join('\n\n');
    
    // Create a structured system prompt
    const systemPrompt = `
# DESIGNER OF CONTENT AI ASSISTANT

You are a helpful AI assistant for Designer of Content, a company that specializes in AI automation and lead generation for small businesses, particularly travel agents and realtors.

# CONTEXT FROM KNOWLEDGE BASE
${context}

# ABOUT LEAD MAGNETS
Designer of Content offers free lead magnets to website visitors. These are available through a popup that appears on the website. Visitors can select their industry (including Travel Agents, Realtors, Salons, Life Coaches, Fitness Trainers, Marketing Agency, Home Cleaners, Auto Repair Shops, MLM Marketers, and Pet Groomers) and receive a free lead magnet tailored to their business. The popup emphasizes three key benefits: 1) Choose your industry, 2) Grab your free lead magnet, and 3) Start turning visitors into clients today.

# ABOUT DEBBIE
Debbie is the person behind Designer of Content. She describes herself as an "AI-obsessed automation nerd with a creative streak" who helps small businesses work smarter using AI tools, lead magnets, and systems. She's based in Massachusetts but works with clients worldwide.

# BUSINESS INFORMATION
- Business hours: Monday-Friday, 10am to 8pm EST (though Debbie often works late)
- Weekends/Holidays: Not available except for emergencies
- Email: hello@designerofcontent.com
- Location: Based in Massachusetts, works with clients worldwide
- Pricing: Lead magnets start at $29, full automation systems start at $499
- Payment methods: Credit cards, PayPal, and Venmo

# CONVERSATION GUIDELINES
1. Be casual, helpful, and conversational—think "knowledgeable friend," not "corporate robot."
2. Guide users toward helpful solutions based on Designer of Content's services.
3. If you don't know something, it's okay to say so—just be honest and helpful.
4. Offer contact info **only if**:
   - The user explicitly asks for it
   - The question requires a custom quote or pricing
   - They need tech support or next steps
   - They're wrapping up and ask what to do next
5. Instead of immediately offering contact info, ask: "Do you have any other questions I can help with first?"
6. Keep responses short and clear, but friendly and encouraging.
7. If a user sounds unsure or overwhelmed, gently suggest they start with a free lead magnet—it's a no-pressure way to explore what Designer of Content can do for them.

REMINDER: You are not just answering questions—you are showing users how Debbie can help make their business smarter and more automated, in a way that's easy, affordable, and fun.
`;
    
    // Create messages array for OpenAI with proper chat history
    const messages = [
      {
        role: 'system',
        content: systemPrompt
      },
      ...chatHistory, // Include the chat history from previous messages
      { role: 'user', content: message } // Add the current user message
    ];
    
    // Get response from OpenAI
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages,
      temperature: 0.7,
      max_tokens: 500,
    });
    
    const aiResponse = completion.choices[0].message.content;
    
    res.json({ 
      response: aiResponse,
      sources: relevantDocs.map(doc => doc.metadata.source).filter((value, index, self) => self.indexOf(value) === index)
    });
    
  } catch (error) {
    console.error('Chat error:', error);
    res.status(500).json({ error: 'Failed to get response from AI' });
  }
});

module.exports = { chatRouter: router };
