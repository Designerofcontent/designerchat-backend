import React, { useState } from 'react';
import {
  Container,
  Typography,
  Box,
  TextField,
  Button,
  Card,
  CardContent,
  CardHeader,
  Grid,
  Alert,
  Snackbar,
  CircularProgress,
  Divider,
  Paper,
  IconButton
} from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import axios from 'axios';

// API URL - will need to be updated based on deployment
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const AdminPanel = () => {
  const [url, setUrl] = useState('');
  const [content, setContent] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });
  const [analyticsData, setAnalyticsData] = useState(null);
  
  // Handle adding new content to the knowledge base
  const handleAddContent = async (e) => {
    e.preventDefault();
    
    if (!url || !content) {
      setSnackbar({
        open: true,
        message: 'URL and content are required',
        severity: 'error'
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      await axios.post(`${API_URL}/admin/content`, {
        url,
        content
      });
      
      setSnackbar({
        open: true,
        message: 'Content added successfully',
        severity: 'success'
      });
      
      // Clear form
      setUrl('');
      setContent('');
    } catch (error) {
      console.error('Error adding content:', error);
      setSnackbar({
        open: true,
        message: 'Error adding content: ' + (error.response?.data?.error || error.message),
        severity: 'error'
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  // Handle rebuilding the vector store
  const handleRebuildVectorStore = async () => {
    setIsLoading(true);
    
    try {
      await axios.post(`${API_URL}/admin/rebuild`);
      
      setSnackbar({
        open: true,
        message: 'Vector store rebuilt successfully',
        severity: 'success'
      });
    } catch (error) {
      console.error('Error rebuilding vector store:', error);
      setSnackbar({
        open: true,
        message: 'Error rebuilding vector store: ' + (error.response?.data?.error || error.message),
        severity: 'error'
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  // Load analytics data
  const loadAnalytics = async () => {
    try {
      const response = await axios.get(`${API_URL}/admin/analytics`);
      setAnalyticsData(response.data);
    } catch (error) {
      console.error('Error loading analytics:', error);
      setSnackbar({
        open: true,
        message: 'Error loading analytics: ' + (error.response?.data?.error || error.message),
        severity: 'error'
      });
    }
  };
  
  // Handle file upload for content
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (event) => {
      setContent(event.target.result);
    };
    reader.readAsText(file);
  };
  
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Designer of Content AI Chatbot Admin
        </Typography>
        
        <Button 
          variant="contained" 
          color="primary"
          href="/"
        >
          Back to Website
        </Button>
      </Box>
      
      <Grid container spacing={3}>
        {/* Content Management */}
        <Grid item xs={12} md={6}>
          <Card elevation={3}>
            <CardHeader 
              title="Add Content to Knowledge Base" 
              subheader="Add new content from your website to the chatbot's knowledge"
            />
            <CardContent>
              <Box component="form" onSubmit={handleAddContent} sx={{ '& > :not(style)': { mb: 2 } }}>
                <TextField
                  fullWidth
                  label="URL"
                  placeholder="https://designerofcontent.com/page-url"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  required
                />
                
                <TextField
                  fullWidth
                  label="Content"
                  multiline
                  rows={10}
                  placeholder="Paste the content from your webpage here..."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  required
                />
                
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Button
                    variant="outlined"
                    component="label"
                    startIcon={<UploadFileIcon />}
                    sx={{ mr: 2 }}
                  >
                    Upload Text File
                    <input
                      type="file"
                      accept=".txt"
                      hidden
                      onChange={handleFileUpload}
                    />
                  </Button>
                  
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    disabled={isLoading}
                  >
                    {isLoading ? <CircularProgress size={24} /> : 'Add Content'}
                  </Button>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        {/* Vector Store Management */}
        <Grid item xs={12} md={6}>
          <Card elevation={3}>
            <CardHeader 
              title="Knowledge Base Management" 
              subheader="Rebuild or update your chatbot's knowledge base"
            />
            <CardContent>
              <Typography paragraph>
                If you've added multiple pieces of content or need to refresh the entire knowledge base, 
                you can rebuild the vector store. This process may take a few minutes depending on the 
                amount of content.
              </Typography>
              
              <Button
                variant="contained"
                color="secondary"
                onClick={handleRebuildVectorStore}
                disabled={isLoading}
                startIcon={<RefreshIcon />}
              >
                {isLoading ? <CircularProgress size={24} /> : 'Rebuild Knowledge Base'}
              </Button>
            </CardContent>
          </Card>
          
          {/* Analytics Card */}
          <Card elevation={3} sx={{ mt: 3 }}>
            <CardHeader 
              title="Chatbot Analytics" 
              subheader="View usage statistics and popular questions"
              action={
                <IconButton onClick={loadAnalytics}>
                  <RefreshIcon />
                </IconButton>
              }
            />
            <CardContent>
              {analyticsData ? (
                <Box>
                  <Typography variant="h6">
                    Total Chats: {analyticsData.totalChats}
                  </Typography>
                  
                  <Typography variant="h6" sx={{ mt: 2 }}>
                    Popular Questions:
                  </Typography>
                  
                  {analyticsData.popularQuestions.length > 0 ? (
                    <Paper variant="outlined" sx={{ p: 2, mt: 1 }}>
                      {analyticsData.popularQuestions.map((question, index) => (
                        <Box key={index}>
                          <Typography>{question}</Typography>
                          {index < analyticsData.popularQuestions.length - 1 && (
                            <Divider sx={{ my: 1 }} />
                          )}
                        </Box>
                      ))}
                    </Paper>
                  ) : (
                    <Typography color="text.secondary">
                      No data available yet
                    </Typography>
                  )}
                </Box>
              ) : (
                <Button 
                  variant="outlined" 
                  onClick={loadAnalytics}
                  startIcon={<RefreshIcon />}
                >
                  Load Analytics
                </Button>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      
      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert 
          onClose={() => setSnackbar({ ...snackbar, open: false })} 
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default AdminPanel;
