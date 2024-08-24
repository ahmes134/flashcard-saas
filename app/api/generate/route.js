// API route that handles the AI-powered flashcard generation from user-provided text.
// Imports and define the system prompt which instructs the AI on how to create flashcards.
import { NextResponse } from 'next/server'
import OpenAI from 'openai'

const systemPrompt = `
You are a flashcard creator, you take in text and create multiple flashcards from it. Make sure to create exactly 10 flashcards.
Both front and back should be one sentence long.
You should return in the following JSON format:
{
  "flashcards":[
    {
      "front": "Front of the card",
      "back": "Back of the card"
    }
  ]
}
`
// POST request handler
// creates a new OpenAI client instance 
// and extracts the text data from the request body.
export async function POST(req) {
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
    const data = await req.text()

    // OpenAI API call here
    // Creates a chat completion request to the OpenAI API
    const completion = await openai.chat.completions.create({ 
        messages: [ //`messages` array includes two elements
          { role: 'system', content: systemPrompt }, // instructs the AI on how to create flashcards
          { role: 'user', content: data }, // A ‘user’ message containing the input text from the request body
        ],
        model: 'gpt-4o',
        response_format: { type: 'json_object' }, // ‘json_object’ to ensure we receive a JSON response
      })
    
      // Process the API response
      // Parse the JSON response from the API response using `JSON.parse()`
      const flashcards = JSON.parse(completion.choices[0].message.content)
      console.log(flashcards)
      // Return the flashcards as a JSON response using `NextResponse.json()`
      return NextResponse.json(flashcards.flashcards)

  }