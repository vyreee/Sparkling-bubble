import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    // Check if customer exists in Stripe
    const existingCustomers = await stripe.customers.list({
      email: email,
      limit: 1,
    });

    // If no customer found, they're a first-time customer
    const isFirstTime = existingCustomers.data.length === 0;

    // If customer exists, check if they've already claimed the free bag
    let hasClaimedFreeBag = false;
    if (!isFirstTime && existingCustomers.data[0].metadata?.free_bag_claimed === 'true') {
      hasClaimedFreeBag = true;
    }

    return res.status(200).json({ 
      isFirstTime,
      hasClaimedFreeBag,
      eligible: isFirstTime || !hasClaimedFreeBag
    });
  } catch (error) {
    console.error('Error checking customer status:', error);
    return res.status(500).json({ 
      error: 'Failed to check customer status',
      details: error.message
    });
  }
}
