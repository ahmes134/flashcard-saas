// allows users to study and interact with a specific set of flashcards
import {Container, Grid, Card, Box, Typography, CardActionArea, CardContent} from '@mui/material'
import {useUser} from '@clerk/nextjs'
// This component uses Clerk’s `useUser` hook for authentication, 
// React’s `useState` for managing the flashcards state,
// and Next.js’s `useSearchParams` to get the flashcard set ID from the URL
export default function Flashcard() {
    const { isLoaded, isSignedIn, user } = useUser()
    const [flashcards, setFlashcards] = useState([])
    const [flipped, setFlipped] = useState({})
  
    const searchParams = useSearchParams()
    const search = searchParams.get('id')
  
    // ... (rest of the component)
    // uses a `useEffect` hook to fetch the specific flashcard set 
    // when the component mounts or when the user or search parameter changes
    // retrieves all flashcards in the specified set from Firestore 
    // and updates the `flashcards` state.
    useEffect(() => {
        async function getFlashcard() {
          if (!search || !user) return
      
          const colRef = collection(doc(collection(db, 'users'), user.id), search)
          const docs = await getDocs(colRef)
          const flashcards = []
          docs.forEach((doc) => {
            flashcards.push({ id: doc.id, ...doc.data() })
          })
          setFlashcards(flashcards)
        }
        getFlashcard()
      }, [search, user])

     // handles flipping flashcards
     // toggles the flip state of a flashcard when it’s clicked
      const handleCardClick = (id) => {
        console.log(id)
        setFlipped((prev) => ({
          ...prev,
          [id]: !prev[id],
        }))
      }
      // Renders a grid of flashcards, each with a flipping animation
      return (
        <Container maxWidth="md">
          <Grid container spacing={3} sx={{ mt: 4 }}>
            {flashcards.map((flashcard) => (
              <Grid item xs={12} sm={6} md={4} key={flashcard.id}>
                <Card className="card">
                  <CardActionArea className="card-action" onClick={() => {handleCardClick(flashcard.id); console.log(flashcard.id)} }>
                    <CardContent>
                      <Box sx={{ /* Styling for flip animation */ }}>
                        <div>
                          <div>
                            <Typography variant="h5" component="div">
                              {flashcard.front}
                            </Typography>
                          </div>
                          <div>
                            <Typography variant="h5" component="div">
                              {flashcard.back}
                            </Typography>
                          </div>
                        </div>
                      </Box>
                    </CardContent>
                  </CardActionArea>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      )
  }