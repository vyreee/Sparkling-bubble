import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  try {
    const { sessionId } = JSON.parse(event.body);

    if (!sessionId) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Session ID is required' }),
      };
    }

    // Retrieve the session from Stripe
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        customer_email: session.customer_details?.email || session.customer_email,
        customer_name: session.customer_details?.name,
        metadata: session.metadata,
      }),
    };
  } catch (error) {
    console.error('Error retrieving session:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: 'Failed to retrieve session',
        details: error.message
      }),
    };
  }
};
