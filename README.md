# Designer Chat - AI Chatbot for designerofcontent.com

This project creates a custom AI chatbot that uses your website content as a knowledge base. The chatbot can be embedded on your website to provide instant answers to visitor questions and help convert more leads.

## Features

- **Website Content Knowledge Base**: Uses your designerofcontent.com content to answer questions
- **Retrieval-Augmented Generation (RAG)**: Combines your content with AI to provide accurate, relevant answers
- **Customizable Chat Widget**: Easy to integrate into your website
- **Admin Panel**: Add new content and manage the knowledge base
- **Monetization Options**: Ready-to-use pricing plans for offering the chatbot as a service

## Project Structure

```
designerchat/
├── backend/               # Node.js backend server
│   ├── models/            # Database models
│   ├── routes/            # API routes
│   ├── utils/             # Utility functions
│   └── server.js          # Main server file
├── data/                  # Website content storage
│   ├── home.txt           # Content from homepage
│   ├── blog.txt           # Content from blog
│   └── ...                # Other content files
├── frontend/              # React frontend
│   ├── public/            # Static files
│   └── src/               # React components
│       ├── components/    # UI components
│       └── App.js         # Main application
└── README.md              # This file
```

## Setup Instructions

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- OpenAI API key

### Backend Setup

1. Navigate to the backend directory:
   ```
   cd backend
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Create a `.env` file in the backend directory with the following variables:
   ```
   PORT=5000
   OPENAI_API_KEY=your_openai_api_key_here
   NODE_ENV=development
   ```

4. Start the backend server:
   ```
   npm run dev
   ```

### Frontend Setup

1. Navigate to the frontend directory:
   ```
   cd frontend
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Create a `.env` file in the frontend directory:
   ```
   REACT_APP_API_URL=http://localhost:5000/api
   ```

4. Start the frontend development server:
   ```
   npm start
   ```

## Usage

### Processing Your Website Content

1. Start both the backend and frontend servers
2. Navigate to `http://localhost:3000/admin`
3. Use the admin panel to add content from your website
4. The system will process the content and make it available to the chatbot

### Testing the Chatbot

1. Visit `http://localhost:3000` to see the chatbot in action
2. Click the chat icon in the bottom right corner
3. Ask questions about your services, products, or business

### Deploying to Your Website

To deploy the chatbot to your website:

1. Build the frontend:
   ```
   cd frontend
   npm run build
   ```

2. Deploy the backend to a hosting service like Render, Heroku, or AWS
3. Deploy the frontend build folder to your web hosting
4. Add the chat widget script to your website:
   ```html
   <script src="https://your-chatbot-url.com/widget.js"></script>
   ```

## Monetization Options

The project includes a ready-to-use monetization page with three pricing tiers:

- **Basic Plan**: $9.99/month
- **Professional Plan**: $29.99/month
- **Enterprise Plan**: $99.99/month

You can customize these plans in the `MonetizationPage.js` component.

## Customization

### Chatbot Appearance

You can customize the appearance of the chatbot by editing:
- `frontend/src/components/ChatWidget.js`
- `frontend/src/index.css`

### AI Behavior

To adjust how the AI responds, modify:
- `backend/routes/chat.js`

## Support

For any questions or issues, please contact:
- Email: hello@designerofcontent.com
- Phone: 774-206-5089
