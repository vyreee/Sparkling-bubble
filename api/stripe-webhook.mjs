import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY
);

export const config = {
  api: {
    bodyParser: false,
  },
};

async function buffer(readable) {
  const chunks = [];
  for await (const chunk of readable) {
    chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk);
  }
  return Buffer.concat(chunks);
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const buf = await buffer(req);
  const sig = req.headers['stripe-signature'];
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let stripeEvent;

  try {
    // Verify the webhook signature
    stripeEvent = stripe.webhooks.constructEvent(
      buf,
      sig,
      webhookSecret
    );
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).json({ error: `Webhook Error: ${err.message}` });
  }

  // Handle the event
  switch (stripeEvent.type) {
    case 'checkout.session.completed': {
      const session = stripeEvent.data.object;

      // Get customer details if email is not directly available
      let customerEmail = session.customer_email;
      let customerName = session.metadata?.customerName;
      
      // If email is missing, fetch from customer object
      if (!customerEmail && session.customer) {
        try {
          const customer = await stripe.customers.retrieve(session.customer);
          customerEmail = customer.email;
          customerName = customerName || customer.name;
        } catch (err) {
          console.error('Error fetching customer:', err);
        }
      }

      // Save payment info to Supabase
      try {
        const { error } = await supabase.from('payments').insert([
          {
            stripe_session_id: session.id,
            stripe_payment_intent: session.payment_intent,
            stripe_subscription_id: session.subscription || null,
            stripe_customer_id: session.customer || null,
            email: customerEmail || 'unknown@email.com', // Fallback
            name: customerName || 'Unknown',
            service_type: session.metadata?.serviceType || 'unknown',
            quantity: parseInt(session.metadata?.quantity || 1),
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

  return res.status(200).json({ received: true });
}
