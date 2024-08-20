// Sets up server-side handling of Stripe checkout sessions
// Provided a utility function for client-side Stripe operations 
// in utils/get-stripe.js

import { NextResponse } from 'next/server'
import Stripe from 'stripe'

// Utility function to format the amount for Stripe
const formatAmountForStripe = (amount, currency) => {
    return Math.round(amount * 100)
   }

// Initializing Stripe with our secret key.
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2022-11-15',
})

export async function POST(req) 
{
  try {
    // Checkout session creation
    const params = {
        mode: 'subscription', // for fecurring payments
        payment_method_types: ['card'],
        line_items: [
          {
            price_data: 
            {
              currency: 'usd',
              product_data: {
                name: 'Pro subscription',
              },
              unit_amount: formatAmountForStripe(10, 'usd'), // $10.00
              recurring: {
                interval: 'month',
                interval_count: 1,
              },
            },
            quantity: 1,
          },
        ],
        //We set these URLs to redirect the user after the payment process.
        success_url: `${req.headers.get(
          'Referer',
        )}result?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${req.headers.get(
          'Referer',
        )}result?session_id={CHECKOUT_SESSION_ID}`,
      }
      // Create the checkout session
      const checkoutSession = await stripe.checkout.sessions.create(params)
      // Return the created session as a JSON response with a 200 status code.
      return NextResponse.json(checkoutSession, {
        status: 200,
      })
  } catch (error) {
    console.error('Error creating checkout session:', error)
    return new NextResponse(JSON.stringify({ error: { message: error.message } }), {
      status: 500,
    })
  }
}

// Get route for retrieving session details
export async function GET(req) {
    // Extracts the `session_id` from the query parameters of the request.
    const searchParams = req.nextUrl.searchParams
    const session_id = searchParams.get('session_id')
  
    try {
      if (!session_id) {
        throw new Error('Session ID is required')
      }
      // uses the Stripe API to retrieve the checkout session details.
      const checkoutSession = await stripe.checkout.sessions.retrieve(session_id)
      // Returns the session details as a JSON response
      return NextResponse.json(checkoutSession)
    } catch (error) {
      console.error('Error retrieving checkout session:', error)
      return NextResponse.json({ error: { message: error.message } }, { status: 500 })
    }
  }