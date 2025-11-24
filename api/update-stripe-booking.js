// API endpoint to update Stripe with booking information
// This runs AFTER customer completes payment and books their pickup

import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { 
      sessionId, 
      weeklyPickupDay, 
      pickupDate, 
      pickupTime,
      address 
    } = req.body;

    if (!sessionId) {
      return res.status(400).json({ error: 'Session ID required' });
    }

    // Retrieve the checkout session
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    // Update Payment Intent metadata
    if (session.payment_intent) {
      await stripe.paymentIntents.update(session.payment_intent, {
        metadata: {
          weekly_pickup_day: weeklyPickupDay || '',
          pickup_date: pickupDate || '',
          pickup_time: pickupTime || '',
          pickup_address: address || '',
          booking_completed: 'true',
          booking_timestamp: new Date().toISOString(),
        }
      });
    }

    // Update Customer metadata (for ongoing subscription tracking)
    if (session.customer) {
      const existingCustomer = await stripe.customers.retrieve(session.customer);
      
      await stripe.customers.update(session.customer, {
        metadata: {
          ...existingCustomer.metadata, // Keep existing metadata
          weekly_pickup_day: weeklyPickupDay || '',
          pickup_time: pickupTime || '',
          pickup_address: address || '',
          subscription_active: weeklyPickupDay ? 'true' : 'false',
          last_booking_date: new Date().toISOString(),
        }
      });
    }

    // Also update the session metadata for reference
    await stripe.checkout.sessions.update(sessionId, {
      metadata: {
        ...session.metadata, // Keep existing metadata
        weekly_pickup_day: weeklyPickupDay || '',
        pickup_date: pickupDate || '',
        pickup_time: pickupTime || '',
        booking_completed: 'true',
      }
    });

    return res.status(200).json({ 
      success: true,
      message: 'Stripe metadata updated successfully',
      updated: {
        payment_intent: !!session.payment_intent,
        customer: !!session.customer,
        session: true,
      }
    });

  } catch (error) {
    console.error('Stripe metadata update error:', error);
    return res.status(500).json({ 
      error: error.message || 'Failed to update Stripe metadata' 
    });
  }
}
