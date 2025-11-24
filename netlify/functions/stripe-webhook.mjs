import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY
);

export const handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  const sig = event.headers['stripe-signature'];
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let stripeEvent;

  try {
    // Verify the webhook signature
    stripeEvent = stripe.webhooks.constructEvent(
      event.body,
      sig,
      webhookSecret
    );
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return {
      statusCode: 400,
      body: JSON.stringify({ error: `Webhook Error: ${err.message}` }),
    };
  }

  // Handle the event
  switch (stripeEvent.type) {
    case 'checkout.session.completed': {
      const session = stripeEvent.data.object;
      
      // Save payment info to Supabase
      try {
        const { error } = await supabase.from('payments').insert([
          {
            stripe_session_id: session.id,
            stripe_payment_intent: session.payment_intent,
            email: session.customer_email,
            name: session.metadata.customerName,
            service_type: session.metadata.serviceType,
            quantity: parseInt(session.metadata.quantity),
            amount: session.amount_total / 100, // Convert from cents
            status: 'completed',
            payment_status: session.payment_status,
          },
        ]);

        if (error) {
          console.error('Error saving to Supabase:', error);
        }
      } catch (dbError) {
        console.error('Database error:', dbError);
      }
      break;
    }

    case 'payment_intent.succeeded': {
      const paymentIntent = stripeEvent.data.object;
      console.log('Payment succeeded:', paymentIntent.id);
      break;
    }

    case 'payment_intent.payment_failed': {
      const paymentIntent = stripeEvent.data.object;
      console.log('Payment failed:', paymentIntent.id);
      break;
    }

    default:
      console.log(`Unhandled event type: ${stripeEvent.type}`);
  }

  return {
    statusCode: 200,
    body: JSON.stringify({ received: true }),
  };
};
