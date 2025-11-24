import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { sessionId } = req.body;

    if (!sessionId) {
      return res.status(400).json({ error: 'Session ID is required' });
    }

    // Retrieve the session from Stripe
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    return res.status(200).json({
      customer_email: session.customer_details?.email || session.customer_email,
      customer_name: session.customer_details?.name,
      metadata: session.metadata,
    });
  } catch (error) {
    console.error('Error retrieving session:', error);
    return res.status(500).json({
      error: 'Failed to retrieve session',
      details: error.message
    });
  }
}
