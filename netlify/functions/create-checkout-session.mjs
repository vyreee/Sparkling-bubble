import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const handler = async (event) => {
  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  try {
    const { serviceType, quantity, customerEmail, customerName } = JSON.parse(event.body);

    // Map to your actual Stripe Price IDs
    // Get these from your Stripe Dashboard → Products → Click product → Copy Price ID
    const priceIdMap = {
      small: process.env.STRIPE_PRICE_SMALL_BAG,      // Small Bag Up to ≈15 lb - $25
      medium: process.env.STRIPE_PRICE_MEDIUM_BAG,    // Medium Bag Up to ≈20 lb - $35
      large: process.env.STRIPE_PRICE_LARGE_BAG,      // Large Bag Up to ≈30 lb - $45
      subscription: process.env.STRIPE_PRICE_SUBSCRIPTION, // Weekly Subscription
    };

    const selectedPriceId = priceIdMap[serviceType];
    
    if (!selectedPriceId) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Invalid service type or missing Price ID configuration' }),
      };
    }

    // Create Stripe Checkout Session using your actual products
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price: selectedPriceId,  // Uses your actual Stripe Price ID
          quantity: quantity,
        },
      ],
      mode: 'payment',
      customer_email: customerEmail,
      metadata: {
        customerName: customerName,
        serviceType: serviceType,
        quantity: quantity.toString(),
      },
      success_url: `${process.env.VITE_APP_URL}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.VITE_APP_URL}/payment-cancel`,
    });

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ sessionId: session.id, url: session.url }),
    };
  } catch (error) {
    console.error('Error creating checkout session:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
};
