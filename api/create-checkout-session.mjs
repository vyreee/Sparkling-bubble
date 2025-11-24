import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { serviceType, quantity, addOns = [], customerEmail, customerName } = req.body;

    // Map all service types to their Stripe Price IDs
    const priceIdMap = {
      // Basic Services - One-Time
      small: process.env.STRIPE_PRICE_SMALL_BAG,
      medium: process.env.STRIPE_PRICE_MEDIUM_BAG,
      large: process.env.STRIPE_PRICE_LARGE_BAG,
      
      // Weekly Subscriptions
      small_subscription: process.env.STRIPE_PRICE_SMALL_SUBSCRIPTION,
      medium_subscription: process.env.STRIPE_PRICE_MEDIUM_SUBSCRIPTION,
      large_subscription: process.env.STRIPE_PRICE_LARGE_SUBSCRIPTION,
      
      // Senior/Military
      small_senior: process.env.STRIPE_PRICE_SMALL_SENIOR,
      medium_senior: process.env.STRIPE_PRICE_MEDIUM_SENIOR,
      large_senior: process.env.STRIPE_PRICE_LARGE_SENIOR,
      
      // Senior/Military Weekly
      small_senior_weekly: process.env.STRIPE_PRICE_SMALL_SENIOR_WEEKLY,
      medium_senior_weekly: process.env.STRIPE_PRICE_MEDIUM_SENIOR_WEEKLY,
      large_senior_weekly: process.env.STRIPE_PRICE_LARGE_SENIOR_WEEKLY,
      
      // Bundles
      bundle_household: process.env.STRIPE_PRICE_BUNDLE_HOUSEHOLD,
      bundle_family_two: process.env.STRIPE_PRICE_BUNDLE_FAMILY_TWO,
      bundle_busy_family: process.env.STRIPE_PRICE_BUNDLE_BUSY_FAMILY,
      bundle_large_family: process.env.STRIPE_PRICE_BUNDLE_LARGE_FAMILY,
      bundle_big_wash: process.env.STRIPE_PRICE_BUNDLE_BIG_WASH,
      bundle_student: process.env.STRIPE_PRICE_BUNDLE_STUDENT,
      bundle_moms_day: process.env.STRIPE_PRICE_BUNDLE_MOMS_DAY,
      bundle_linens: process.env.STRIPE_PRICE_BUNDLE_LINENS,
      bundle_ultimate: process.env.STRIPE_PRICE_BUNDLE_ULTIMATE,
    };

    // Map add-ons to their Price IDs
    const addOnPriceMap = {
      hangdry: process.env.STRIPE_PRICE_ADDON_HANGDRY,
      eco: process.env.STRIPE_PRICE_ADDON_ECO,
      rush: process.env.STRIPE_PRICE_ADDON_RUSH,
    };

    // Get the main service Price ID
    const selectedPriceId = priceIdMap[serviceType];
    
    if (!selectedPriceId) {
      return res.status(400).json({ 
        error: 'Invalid service type or missing Price ID configuration',
        serviceType: serviceType 
      });
    }

    // Build line items array
    const lineItems = [
      {
        price: selectedPriceId,
        quantity: quantity,
      }
    ];

    // Add add-ons to line items
    if (addOns && addOns.length > 0) {
      addOns.forEach(addonId => {
        const addonPriceId = addOnPriceMap[addonId];
        if (addonPriceId) {
          lineItems.push({
            price: addonPriceId,
            quantity: quantity, // Same quantity as main service
          });
        }
      });
    }

    // Determine if this is a subscription or one-time payment
    // Subscriptions: all bundles, weekly subscriptions, senior/military weekly
    // One-time: basic services without _subscription suffix
    const isSubscription = serviceType.includes('subscription') || 
                          serviceType.includes('bundle') || 
                          serviceType.includes('senior_weekly');
    
    // Create Stripe Checkout Session using your actual products
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: isSubscription ? 'subscription' : 'payment',
      customer_email: customerEmail,
      metadata: {
        customerName: customerName,
        serviceType: serviceType,
        quantity: quantity.toString(),
        addOns: addOns.join(','),
      },
      success_url: `${process.env.VITE_APP_URL}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.VITE_APP_URL}/payment-cancel`,
    });

    return res.status(200).json({ sessionId: session.id, url: session.url });
  } catch (error) {
    console.error('Error creating checkout session:', error);
    return res.status(500).json({ 
      error: error.message,
      details: 'Check that all required Price IDs are configured in your environment variables'
    });
  }
}
