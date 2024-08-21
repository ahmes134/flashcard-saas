'use client'
import React, { useState, useEffect } from 'react'
import { Container, Grid, Card, CardContent, CardActionArea, Typography } from '@mui/material'
import { useUser } from '@clerk/clerk-react' // Importing useUser from Clerk
import { useRouter } from 'next/router'
import { doc, collection, getDoc, setDoc } from 'firebase/firestore'
import { db } from '../firebaseConfig'// Ensure your Firebase config is properly imported

// New page to display all of the user’s saved flashcard sets 
// and allow them to review individual sets.

// This component uses Clerk’s `useUser` hook for authentication, 
// React’s `useState` for managing the flashcards state,
// and Next.js’s `useRouter` for navigation.

export default function Flashcard() {
    const { isLoaded, isSignedIn, user } = useUser()  
    const [flashcards, setFlashcards] = useState([])
    const router = useRouter()
  
    // Add the handleCardClick function here
    // Next.js’s `router.push` to navigate to the `/flashcard` page 
    //with the selected flashcard set’s ID as a query parameter.
    const handleCardClick = (id) => {
        router.push(`/flashcard?id=${id}`)
    }
    // ... (rest of the component)
  
   // retrieves the user’s document from Firestore
   // and sets the `flashcards` state with the user’s flashcard collections.
   // If the user document doesn’t exist, it creates one with an empty flashcards array.
  useEffect(() => {
    async function getFlashcards() {
      if (!user) return
      const docRef = doc(collection(db, 'users'), user.id)
      const docSnap = await getDoc(docRef)
      if (docSnap.exists()) {
        const collections = docSnap.data().flashcards || []
        setFlashcards(collections)
      } else {
        await setDoc(docRef, { flashcards: [] })
      }
    }
    getFlashcards()
  }, [user])

  // Displays a grid of cards, each rep. a flashcard set
  return (
    <Container maxWidth="md">
      <Grid container spacing={3} sx={{ mt: 4 }}>
        {flashcards.map((flashcard, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Card>
              <CardActionArea onClick={() => handleCardClick(flashcard.name)}>
                <CardContent>
                  <Typography variant="h5" component="div">
                    {flashcard.name}
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
    
  )
}