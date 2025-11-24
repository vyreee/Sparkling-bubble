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
    const { email } = JSON.parse(event.body);

    if (!email) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Email is required' }),
      };
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

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        isFirstTime,
        hasClaimedFreeBag,
        eligible: isFirstTime || !hasClaimedFreeBag
      }),
    };
  } catch (error) {
    console.error('Error checking customer status:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ 
        error: 'Failed to check customer status',
        details: error.message
      }),
    };
  }
};
