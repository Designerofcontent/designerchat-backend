import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ChatWidget from './components/ChatWidget';
import AdminPanel from './components/AdminPanel';
import MonetizationPage from './components/MonetizationPage';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

// Create a custom theme for the application
const theme = createTheme({
  palette: {
    primary: {
      main: '#10f0f8',
    },
    secondary: {
      main: '#f50057',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontSize: '2.5rem',
      fontWeight: 500,
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 500,
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Routes>
          <Route path="/admin" element={<AdminPanel />} />
          <Route path="/monetization" element={<MonetizationPage />} />
          <Route path="*" element={<ChatWidgetWrapper />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

// This component is used to render the chat widget on all pages except admin and monetization
function ChatWidgetWrapper() {
  return (
    <div className="app-container">
      <ChatWidget />
    </div>
  );
}

export default App;
