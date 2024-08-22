'use client'
import React from 'react'
import { AppBar, Toolbar, Typography, Button, Box, Grid, Container } from '@mui/material'
import { SignedIn, SignedOut, UserButton } from '@clerk/nextjs'
import Head from 'next/head' // Import Head from next/head
import getStripe from './api/checkout_sessions/utils/get-stripe'

// creates a navigation bar with the app title and authentication buttons. 
// It uses Clerk’s `SignedIn` and `SignedOut` components 
// to conditionally render login/signup buttons or the user menu. 

export default function Home() {
  return (
    <Container maxWidth="lg">
      <Head>
        <title>Flashcard SaaS</title>
      </Head>

      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" style={{ flexGrow: 1 }}>
            Flashcard SaaS
          </Typography>
          <SignedOut>
            <Button color="inherit" href="/sign-in">Login</Button>
            <Button color="inherit" href="/sign-up">Sign Up</Button>
          </SignedOut>
          <SignedIn>
            <UserButton />
          </SignedIn>
        </Toolbar>
      </AppBar>

      {/* introduces the application with a headline, subheadline, and call-to-action buttons */}
      <Box sx={{ textAlign: 'center', my: 4 }}>
        <Typography variant="h2" component="h1" gutterBottom>
          Welcome to Flashcard SaaS
        </Typography>
        <Typography variant="h5" component="h2" gutterBottom>
          The easiest way to create flashcards from your text.
        </Typography>
        <Button
          variant="contained"
          color="primary"
          sx={{ mt: 2, mr: 2 }}
          href="/generate">
          Get Started
        </Button>
        <Button variant="outlined" color="primary" sx={{ mt: 2 }}>
          Learn More
        </Button>
      </Box>
      <Box sx={{ my: 6, textAlign: 'center' }}>
        <Typography variant="h4" component="h2" gutterBottom>
          Features
        </Typography>
        <Grid container spacing={4}>
          <Grid item xs={12} md={4}>
            <Box>
              <Typography variant="h6" gutterBottom>Easy Text Input</Typography>
              <Typography>
                Hello! Simply input your text and let our Generative AI software do the rest. Creating
                flashcards has never been easier.
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} md ={4}>
            <Box>
              <Typography variant="h6"gutterBottom>Smart Flashcards</Typography>
              <Typography>Our intelligent Generative AI software breaks down your prompts into concise flashcards, making it a perfect tool for efficient studying.</Typography>
            </Box>
          </Grid>
          <Grid item xs={12} md={4}>
            <Box>
              <Typography variant="h6" gutterBottom> Easily Accessible</Typography>
              <Typography>Access your flashcards from any device, at any time. Study on the go stress-free with ease.</Typography>
            </Box>
          </Grid>
        </Grid>
      </Box>

      <Box sx={{ my: 6, textAlign: 'center' }}>
        <Typography variant="h4" component="h2" gutterBottom>
          Pricing
        </Typography>
        <Grid container spacing={4} justifyContent="center">
          {/* Pricing plans */}
          <Grid item xs={12} md={6}>
            <Box
            sx={{
              p:3,
              border: '1px solid',
              borderRadius: 2
            }}>
              <Typography variant="h5">Basic</Typography>
              <Typography variant="h6">Free</Typography>
              <Typography>Access to basic flashcard features and limited storage.</Typography>
              <Button variant="contained">Choose Basic</Button>
            </Box>
          </Grid>
          <Grid item xs={12} md={6}>
            <Box
             sx={{
               p:3,
               border: '1px solid',
               borderRadius: 2
             }}>
              <Typography variant="h5">Pro</Typography>
              <Typography variant="h6">$9.99 / Month</Typography>
              <Typography>Unlimited Flashcards and Storage, with priority support.</Typography>
              <Button variant="contained" onClick={handleSubmit}>Choose Pro</Button>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
}

// handles the Stripe checkout process when a user selects the Pro plan
const handleSubmit = async () => {
  const checkoutSession = await fetch('/api/checkout_sessions', {
    method: 'POST',
    headers: { origin: 'http://localhost:3000' },
  });
  
  const checkoutSessionJson = await checkoutSession.json();

  const stripe = await getStripe();
  const { error } = await stripe.redirectToCheckout({
    sessionId: checkoutSessionJson.id,
  });

  if (error) {
    console.warn(error.message);
  }
};
