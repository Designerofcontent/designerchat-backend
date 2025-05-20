# WordPress Integration Guide for Designer of Content Chatbot

This guide will help you integrate your AI chatbot with your WordPress site at designerofcontent.com.

## Step 1: Build the Frontend Files

First, you need to build the React app to generate static files:

```bash
cd frontend
npm install
npm run build
```

This will create a `build` folder with all the necessary files.

## Step 2: Deploy Backend to Render

1. Push your code to GitHub
2. Go to [render.com](https://render.com) and create an account
3. Click "New" → "Web Service"
4. Connect to your GitHub repository
5. Configure the service:
   - Name: `designerchat-backend`
   - Environment: `Node`
   - Build Command: `cd backend && npm install`
   - Start Command: `cd backend && node server.js`
6. Add environment variables:
   - `OPENAI_API_KEY`: Your OpenAI API key
   - `FRONTEND_URL`: https://designerofcontent.com
   - `NODE_ENV`: production
7. Deploy the service
8. Note the URL of your deployed backend (e.g., https://designerchat-backend.onrender.com)

## Step 3: Update Frontend Configuration

After deploying the backend, update the `.env` file with the correct backend URL:

```
REACT_APP_API_URL=https://designerchat-backend.onrender.com/api
```

Then rebuild the frontend:

```bash
npm run build
```

## Step 4: Add Chatbot to WordPress

### Method 1: Using a Custom HTML Block

1. Log in to your WordPress admin
2. Create a new page or edit an existing one
3. Add a Custom HTML block
4. Copy the following code into the block:

```html
<!-- Designer of Content AI Chatbot -->
<div id="designer-chat-widget"></div>
<script src="/wp-content/uploads/chatbot/static/js/main.js" defer></script>
<link href="/wp-content/uploads/chatbot/static/css/main.css" rel="stylesheet">
```

### Method 2: Using a Plugin

1. Install the "Custom CSS & JS" plugin
2. Go to Custom CSS & JS → Add Custom JS
3. Add the following code:

```javascript
document.addEventListener('DOMContentLoaded', function() {
  // Create container for the chat widget
  const chatContainer = document.createElement('div');
  chatContainer.id = 'designer-chat-widget';
  document.body.appendChild(chatContainer);
  
  // Load CSS
  const chatCSS = document.createElement('link');
  chatCSS.rel = 'stylesheet';
  chatCSS.href = '/wp-content/uploads/chatbot/static/css/main.css';
  document.head.appendChild(chatCSS);
  
  // Load JavaScript
  const chatJS = document.createElement('script');
  chatJS.src = '/wp-content/uploads/chatbot/static/js/main.js';
  chatJS.defer = true;
  document.body.appendChild(chatJS);
});
```

## Step 5: Upload Files to WordPress

1. Connect to your WordPress site via FTP or use the WordPress file manager
2. Create a folder at `/wp-content/uploads/chatbot/`
3. Upload the contents of the `frontend/build` folder to this directory
4. Make sure to maintain the folder structure:
   - `/wp-content/uploads/chatbot/static/css/`
   - `/wp-content/uploads/chatbot/static/js/`
   - etc.

## Troubleshooting

### CORS Issues

If you encounter CORS errors:

1. Check that your backend's CORS settings include your WordPress domain
2. Verify the `FRONTEND_URL` environment variable on Render is set to your WordPress domain

### Loading Issues

If the chatbot doesn't load:

1. Check browser console for errors
2. Verify all file paths are correct
3. Make sure the backend is running and accessible

### WordPress Caching

If changes don't appear immediately:

1. Clear your WordPress cache
2. Clear your browser cache
3. If using a caching plugin, purge its cache

## Updating the Chatbot

When you make changes to the chatbot:

1. Update your code
2. Rebuild the frontend (`npm run build`)
3. Re-upload the files to WordPress
4. Redeploy the backend on Render if backend changes were made
