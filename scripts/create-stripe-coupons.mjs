import Stripe from 'stripe';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

async function createCoupons() {
  console.log('🎟️  Creating Stripe coupons...\n');

  try {
    // Create 4-week prepay coupon
    console.log('Creating 4-week prepay coupon...');
    const fourWeekCoupon = await stripe.coupons.create({
      id: 'PREPAY_4WEEKS',
      name: '4 Weeks Prepaid',
      amount_off: 1000, // $10 in cents
      currency: 'usd',
      duration: 'once',
      metadata: {
        weeks: '4',
        description: '4 weeks of service prepaid discount'
      }
    });
    console.log('✅ Created:', fourWeekCoupon.id, '-', fourWeekCoupon.name);
    console.log('   Amount off: $' + (fourWeekCoupon.amount_off / 100));
    console.log('');

    // Create 12-week prepay coupon
    console.log('Creating 12-week prepay coupon...');
    const twelveWeekCoupon = await stripe.coupons.create({
      id: 'PREPAY_12WEEKS',
      name: '12 Weeks Prepaid',
      amount_off: 5000, // $50 in cents
      currency: 'usd',
      duration: 'once',
      metadata: {
        weeks: '12',
        description: '12 weeks of service prepaid discount'
      }
    });
    console.log('✅ Created:', twelveWeekCoupon.id, '-', twelveWeekCoupon.name);
    console.log('   Amount off: $' + (twelveWeekCoupon.amount_off / 100));
    console.log('');

    console.log('🎉 All coupons created successfully!');
    console.log('\nYou can view them in your Stripe Dashboard:');
    console.log('https://dashboard.stripe.com/coupons');

  } catch (error) {
    if (error.code === 'resource_already_exists') {
      console.log('⚠️  Coupons already exist. Fetching existing coupons...\n');
      
      try {
        const fourWeek = await stripe.coupons.retrieve('PREPAY_4WEEKS');
        console.log('✅ Found:', fourWeek.id, '-', fourWeek.name);
        console.log('   Amount off: $' + (fourWeek.amount_off / 100));
        console.log('');

        const twelveWeek = await stripe.coupons.retrieve('PREPAY_12WEEKS');
        console.log('✅ Found:', twelveWeek.id, '-', twelveWeek.name);
        console.log('   Amount off: $' + (twelveWeek.amount_off / 100));
        console.log('');

        console.log('✅ All coupons are ready to use!');
      } catch (retrieveError) {
        console.error('❌ Error retrieving coupons:', retrieveError.message);
      }
    } else {
      console.error('❌ Error creating coupons:', error.message);
      console.error('\nMake sure your STRIPE_SECRET_KEY is set in .env file');
    }
  }
}

// Run the script
createCoupons();
