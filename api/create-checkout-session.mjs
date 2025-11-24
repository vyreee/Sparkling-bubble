import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { items, customerEmail, customerName, customerPhone, bookingInfo } = req.body;

    // Validate required fields
    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: 'Items array is required' });
    }

    if (!customerEmail || !customerName) {
      return res.status(400).json({ error: 'Customer email and name are required' });
    }

    // Detect if this is a subscription
    const isSubscription = items.some(item => 
      item.category?.includes('weekly') || 
      item.category?.includes('senior_weekly') ||
      item.type === 'bundle' ||
      item.name.toLowerCase().includes('weekly') ||
      item.name.toLowerCase().includes('subscription')
    );

    // Get primary service category
    const serviceCategory = items[0]?.category || items[0]?.type || 'regular';

    // Create line items for Stripe using price_data (dynamic pricing)
    const lineItems = items.map(item => ({
      price_data: {
        currency: 'usd',
        product_data: {
          name: item.name,
          description: item.description || '',
          metadata: {
            type: item.type || 'service',
            category: item.category || 'regular',
          }
        },
        unit_amount: Math.round(item.price * 100), // Convert to cents
      },
      quantity: item.quantity || 1,
    }));

    console.log('Processing checkout:', {
      itemCount: items.length,
      isSubscription,
      serviceCategory,
      customerEmail
    });
    
    // Create or retrieve customer in Stripe
    let customer;
    
    // Check if customer already exists by email
    const existingCustomers = await stripe.customers.list({
      email: customerEmail,
      limit: 1,
    });
    
    if (existingCustomers.data.length > 0) {
      // Use existing customer
      customer = existingCustomers.data[0];
      console.log('Found existing customer:', customer.id);
    } else {
      // Create new customer
      customer = await stripe.customers.create({
        email: customerEmail,
        name: customerName,
        metadata: {
          source: 'laundry_service_website',
          free_bag_claimed: 'false',
        },
      });
      console.log('Created new customer:', customer.id);
    }
    
    // Check if this order claims the free bag
    const claimingFreeBag = items.some(item => item.metadata?.claimingFreeBag === true);
    if (claimingFreeBag && customer.metadata?.free_bag_claimed !== 'true') {
      // Update customer to mark free bag as claimed
      await stripe.customers.update(customer.id, {
        metadata: {
          ...customer.metadata,
          free_bag_claimed: 'true',
          free_bag_claimed_date: new Date().toISOString(),
        },
      });
    }
    
    // Build line items for Stripe
    const checkoutLineItems = items.map(item => ({
        price_data: {
          currency: 'usd',
          product_data: {
            name: item.name,
            description: item.description || '',
            metadata: {
              type: item.type || 'service',
              category: item.category || 'regular',
            }
          },
          unit_amount: Math.round(item.price * 100),
        },
        quantity: item.quantity || 1,
      }));

    // Create Stripe Checkout Session
    const sessionConfig = {
      payment_method_types: ['card'],
      line_items: checkoutLineItems,
      mode: 'payment', // Always use payment mode for now
      customer: customer.id,
      
      // Store subscription info in Stripe metadata
      metadata: {
        customer_name: customerName,
        customer_phone: customerPhone || '',
        customer_email: customerEmail,
        is_subscription: isSubscription.toString(),
        service_category: serviceCategory,
        item_count: items.length.toString(),
        primary_service: items[0]?.name || '',
        primary_price: items[0]?.price.toString() || '',
        claiming_free_bag: claimingFreeBag ? 'true' : 'false',
        // Add booking info if provided
        ...(bookingInfo && {
          pickup_address: bookingInfo.address || '',
          pickup_date: bookingInfo.pickupDate || '',
          pickup_time: bookingInfo.pickupTime || '',
          weekly_pickup_day: bookingInfo.weeklyPickupDay || '',
          notes: bookingInfo.notes || '',
        }),
      },
      
      billing_address_collection: 'auto',
      success_url: `${process.env.VITE_APP_URL || 'http://localhost:5173'}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.VITE_APP_URL || 'http://localhost:5173'}/payment-cancel`,
    };

    const session = await stripe.checkout.sessions.create(sessionConfig);

    return res.status(200).json({ sessionId: session.id, url: session.url });
  } catch (error) {
    console.error('Error creating checkout session:', error);
    return res.status(500).json({ 
      error: error.message || 'Failed to create checkout session',
      details: error.message
    });
  }
}
