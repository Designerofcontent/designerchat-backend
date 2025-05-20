import React from 'react';
import {
  Container,
  Typography,
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Grid,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Paper
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const MonetizationPage = () => {
  // Pricing plans
  const plans = [
    {
      id: 'basic',
      name: 'Basic',
      price: '$9.99',
      period: 'per month',
      color: '#4a90e2',
      features: [
        'Unlimited chat conversations',
        'Basic AI responses',
        'Website knowledge base integration',
        'Email support',
        'Customizable chat widget'
      ],
      buttonText: 'Get Started'
    },
    {
      id: 'pro',
      name: 'Professional',
      price: '$29.99',
      period: 'per month',
      color: '#8e44ad',
      features: [
        'Everything in Basic',
        'Advanced AI responses',
        'Priority support',
        'Analytics dashboard',
        'Multiple knowledge base sources',
        'Remove "Powered by" branding',
        'Custom domain integration'
      ],
      buttonText: 'Upgrade to Pro',
      recommended: true
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      price: '$99.99',
      period: 'per month',
      color: '#2c3e50',
      features: [
        'Everything in Professional',
        'Dedicated account manager',
        'Custom AI training',
        'White-label solution',
        'API access',
        'SSO integration',
        'Advanced analytics',
        'Custom feature development'
      ],
      buttonText: 'Contact Sales'
    }
  ];

  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      <Box sx={{ mb: 4, display: 'flex', alignItems: 'center' }}>
        <Button 
          startIcon={<ArrowBackIcon />}
          href="/"
          sx={{ mr: 2 }}
        >
          Back
        </Button>
        <Typography variant="h3" component="h1" gutterBottom>
          Designer Chat Plans
        </Typography>
      </Box>

      <Typography variant="h5" color="text.secondary" sx={{ mb: 6, maxWidth: 800 }}>
        Add an AI assistant to your website that knows your business and helps convert visitors into clients.
      </Typography>

      {/* Pricing Cards */}
      <Grid container spacing={4} sx={{ mb: 8 }}>
        {plans.map((plan) => (
          <Grid item xs={12} md={4} key={plan.id}>
            <Card 
              elevation={plan.recommended ? 8 : 3}
              sx={{ 
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                position: 'relative',
                transition: 'transform 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-8px)'
                },
                ...(plan.recommended && {
                  border: '2px solid',
                  borderColor: plan.color
                })
              }}
            >
              {plan.recommended && (
                <Box 
                  sx={{
                    position: 'absolute',
                    top: 15,
                    right: 0,
                    backgroundColor: plan.color,
                    color: 'white',
                    py: 0.5,
                    px: 2,
                    borderTopLeftRadius: 4,
                    borderBottomLeftRadius: 4,
                    fontWeight: 'bold',
                    fontSize: '0.875rem'
                  }}
                >
                  RECOMMENDED
                </Box>
              )}
              
              <CardHeader
                title={plan.name}
                titleTypographyProps={{ align: 'center', variant: 'h5' }}
                sx={{ 
                  backgroundColor: plan.color,
                  color: 'white',
                  py: 3
                }}
              />
              
              <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                <Box sx={{ textAlign: 'center', mb: 3 }}>
                  <Typography variant="h3" component="span">
                    {plan.price}
                  </Typography>
                  <Typography variant="subtitle1" color="text.secondary">
                    {plan.period}
                  </Typography>
                </Box>
                
                <Divider sx={{ mb: 2 }} />
                
                <List sx={{ mb: 'auto' }}>
                  {plan.features.map((feature, index) => (
                    <ListItem key={index} sx={{ py: 0.5 }}>
                      <ListItemIcon sx={{ minWidth: 36 }}>
                        <CheckCircleIcon sx={{ color: plan.color }} />
                      </ListItemIcon>
                      <ListItemText primary={feature} />
                    </ListItem>
                  ))}
                </List>
                
                <Button
                  fullWidth
                  variant="contained"
                  size="large"
                  sx={{ 
                    mt: 4,
                    backgroundColor: plan.color,
                    '&:hover': {
                      backgroundColor: plan.color,
                      opacity: 0.9
                    }
                  }}
                >
                  {plan.buttonText}
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* FAQ Section */}
      <Typography variant="h4" component="h2" sx={{ mb: 4 }}>
        Frequently Asked Questions
      </Typography>
      
      <Grid container spacing={3} sx={{ mb: 6 }}>
        <Grid item xs={12} md={6}>
          <Paper elevation={2} sx={{ p: 3, height: '100%' }}>
            <Typography variant="h6" gutterBottom>
              How does the AI chatbot work?
            </Typography>
            <Typography variant="body1">
              Our AI chatbot uses advanced natural language processing to understand visitor questions and provide helpful responses based on your website content. It learns from your business information to give accurate, personalized answers that feel like they're coming directly from you.
            </Typography>
          </Paper>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <Paper elevation={2} sx={{ p: 3, height: '100%' }}>
            <Typography variant="h6" gutterBottom>
              Can I customize how the chatbot looks?
            </Typography>
            <Typography variant="body1">
              Yes! All plans include basic customization options like colors, chat bubble position, and welcome messages. Professional and Enterprise plans offer additional branding options, including the ability to remove "Powered by" branding and fully customize the appearance.
            </Typography>
          </Paper>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <Paper elevation={2} sx={{ p: 3, height: '100%' }}>
            <Typography variant="h6" gutterBottom>
              How do I add content to my chatbot?
            </Typography>
            <Typography variant="body1">
              Our system makes it easy to feed your website content into the chatbot. You can either let our system automatically scan your website, or manually add specific pages and content through our simple admin dashboard. The AI will then use this information to answer visitor questions.
            </Typography>
          </Paper>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <Paper elevation={2} sx={{ p: 3, height: '100%' }}>
            <Typography variant="h6" gutterBottom>
              Can I see what questions visitors are asking?
            </Typography>
            <Typography variant="body1">
              Absolutely! All plans include basic analytics that show you the most common questions. Professional and Enterprise plans provide detailed analytics including conversation metrics, user satisfaction ratings, and insights into what information visitors are seeking most often.
            </Typography>
          </Paper>
        </Grid>
      </Grid>

      {/* CTA Section */}
      <Box 
        sx={{ 
          textAlign: 'center', 
          p: 6, 
          borderRadius: 4,
          backgroundColor: '#f5f9ff',
          boxShadow: '0 4px 20px rgba(0,0,0,0.05)'
        }}
      >
        <Typography variant="h4" gutterBottom>
          Ready to add AI to your website?
        </Typography>
        <Typography variant="h6" color="text.secondary" sx={{ mb: 4, maxWidth: 700, mx: 'auto' }}>
          Start converting more visitors into clients with a chatbot that knows your business inside and out.
        </Typography>
        <Button 
          variant="contained" 
          size="large"
          sx={{ 
            px: 4, 
            py: 1.5,
            backgroundColor: '#4a90e2',
            fontSize: '1.1rem'
          }}
        >
          Get Started Today
        </Button>
      </Box>
    </Container>
  );
};

export default MonetizationPage;
