import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Calendar, MapPin, Package, User, Phone, Mail, Clock, XCircle, X, Info } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

export default function BookingPage() {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const { items } = useCart();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    serviceType: 'small',
    pickupDate: '',
    pickupTime: '',
    notes: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');
  const [paymentInfo, setPaymentInfo] = useState<any>(null);
  const [showCancelModal, setShowCancelModal] = useState(false);

  // Check if customer has subscription/weekly items
  const hasSubscription = items.some(item => 
    item.category === 'weekly' || 
    item.category === 'senior_weekly' || 
    item.type === 'bundle' ||
    item.name.toLowerCase().includes('weekly') ||
    item.name.toLowerCase().includes('subscription')
  );

  // Get the day of week from selected date
  const getSelectedDayOfWeek = () => {
    if (!formData.pickupDate) return '';
    const date = new Date(formData.pickupDate);
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return days[date.getDay()];
  };

  // Fetch payment info if session_id exists
  useEffect(() => {
    if (sessionId) {
      fetchPaymentInfo();
    }
  }, [sessionId]);

  const fetchPaymentInfo = async () => {
    try {
      const { data, error } = await supabase
        .from('payments')
        .select('*')
        .eq('stripe_session_id', sessionId)
        .single();

      if (error) throw error;
      
      if (data) {
        setPaymentInfo(data);
        // Pre-fill form with payment info
        setFormData(prev => ({
          ...prev,
          name: data.name || '',
          email: data.email || '',
          serviceType: data.service_type || 'small',
        }));
      }
    } catch (error) {
      console.error('Error fetching payment info:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage('');

    try {
      // Calculate day of week from pickup date for subscriptions
      const weeklyPickupDay = hasSubscription ? getSelectedDayOfWeek() : null;

      const { error } = await supabase
        .from('bookings')
        .insert([
          {
            name: formData.name,
            email: formData.email,
            phone: formData.phone,
            address: formData.address,
            service_type: formData.serviceType,
            pickup_date: formData.pickupDate,
            pickup_time: formData.pickupTime,
            notes: formData.notes,
            weekly_pickup_day: weeklyPickupDay, // ← Save weekly day for subscriptions
            status: 'pending',
            payment_id: paymentInfo?.id || null,
            stripe_session_id: sessionId || null,
          },
        ]);

      if (error) throw error;

      // Also update the payment record with weekly pickup day
      if (paymentInfo?.id && hasSubscription && weeklyPickupDay) {
        await supabase
          .from('payments')
          .update({ weekly_pickup_day: weeklyPickupDay })
          .eq('id', paymentInfo.id);
      }

      // Update Stripe metadata with booking information
      if (sessionId) {
        try {
          await fetch('/api/update-stripe-booking', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              sessionId: sessionId,
              weeklyPickupDay: weeklyPickupDay,
              pickupDate: formData.pickupDate,
              pickupTime: formData.pickupTime,
              address: formData.address,
            }),
          });
        } catch (stripeError) {
          console.error('Failed to update Stripe metadata:', stripeError);
          // Don't fail the booking if Stripe update fails
        }
      }

      setMessage(
        hasSubscription 
          ? `Booking submitted successfully! Your weekly pickup is scheduled for every ${weeklyPickupDay}. We will contact you shortly to confirm.`
          : 'Booking submitted successfully! We will contact you shortly to confirm.'
      );
      
      setFormData({
        name: '',
        email: '',
        phone: '',
        address: '',
        serviceType: 'small',
        pickupDate: '',
        pickupTime: '',
        notes: '',
      });
    } catch (error) {
      setMessage('Error submitting booking. Please try again or contact us directly.');
      console.error('Error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="pt-24 min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="text-center mb-12">
          <Calendar className="w-16 h-16 mx-auto mb-4 text-blue-600" />
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Schedule Your Pickup
          </h1>
          <p className="text-xl text-gray-700">
            {paymentInfo ? 'Payment confirmed! Now schedule your pickup time.' : 'Fill out the form below and we\'ll contact you to confirm your booking'}
          </p>
          {paymentInfo && (
            <div className="mt-4 inline-block bg-green-100 text-green-800 px-6 py-2 rounded-full font-semibold">
              ✓ Payment Received: ${paymentInfo.amount}
            </div>
          )}
        </div>

        <div className="bg-white rounded-2xl shadow-2xl p-8 md:p-12">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="flex items-center gap-2 text-gray-700 font-semibold mb-2">
                  <User className="w-5 h-5 text-blue-600" />
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="John Doe"
                />
              </div>

              <div>
                <label className="flex items-center gap-2 text-gray-700 font-semibold mb-2">
                  <Mail className="w-5 h-5 text-blue-600" />
                  Email
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="john@example.com"
                />
              </div>

              <div>
                <label className="flex items-center gap-2 text-gray-700 font-semibold mb-2">
                  <Phone className="w-5 h-5 text-blue-600" />
                  Phone Number
                </label>
                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="(555) 123-4567"
                />
              </div>

              <div>
                <label className="flex items-center gap-2 text-gray-700 font-semibold mb-2">
                  <Package className="w-5 h-5 text-blue-600" />
                  Service Type
                </label>
                <select
                  value={formData.serviceType}
                  onChange={(e) => setFormData({ ...formData, serviceType: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="small">Small Bag - $25</option>
                  <option value="medium">Medium Bag - $35</option>
                  <option value="large">Large Bag - $45</option>
                  <option value="subscription">Subscription - $28/week</option>
                </select>
              </div>
            </div>

            <div>
              <label className="flex items-center gap-2 text-gray-700 font-semibold mb-2">
                <MapPin className="w-5 h-5 text-blue-600" />
                Pickup Address
              </label>
              <textarea
                required
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows={3}
                placeholder="123 Main St, Apt 4B, City, State ZIP"
              />
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="flex items-center gap-2 text-gray-700 font-semibold mb-2">
                  <Calendar className="w-5 h-5 text-blue-600" />
                  Preferred Pickup Date
                </label>
                <input
                  type="date"
                  required
                  value={formData.pickupDate}
                  onChange={(e) => setFormData({ ...formData, pickupDate: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>

              <div>
                <label className="flex items-center gap-2 text-gray-700 font-semibold mb-2">
                  <Clock className="w-5 h-5 text-blue-600" />
                  Preferred Time
                </label>
                <select
                  value={formData.pickupTime}
                  onChange={(e) => setFormData({ ...formData, pickupTime: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                >
                  <option value="">Select a time</option>
                  <option value="morning">Morning (8AM - 12PM)</option>
                  <option value="afternoon">Afternoon (12PM - 4PM)</option>
                  <option value="evening">Evening (4PM - 8PM)</option>
                </select>
              </div>
            </div>

            {/* Subscription Notice */}
            {hasSubscription && formData.pickupDate && (
              <div className="bg-gradient-to-r from-purple-50 to-blue-50 border-2 border-purple-200 rounded-xl p-6">
                <div className="flex items-start gap-3">
                  <Info className="w-6 h-6 text-purple-600 flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-bold text-purple-900 mb-2 text-lg">
                      📅 Weekly Subscription Schedule
                    </h4>
                    <p className="text-purple-800 mb-2">
                      You've selected a <strong>weekly subscription service</strong>. Your chosen pickup date will become your <strong>fixed weekly pickup day</strong>.
                    </p>
                    <div className="bg-white/60 rounded-lg p-4 mt-3">
                      <p className="text-purple-900 font-semibold">
                        ✓ Your weekly pickup day: <span className="text-purple-600 text-xl">{getSelectedDayOfWeek()}</span>
                      </p>
                      <p className="text-sm text-purple-700 mt-2">
                        We'll pick up your laundry every {getSelectedDayOfWeek()} at your preferred time.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div>
              <label className="text-gray-700 font-semibold mb-2 block">
                Special Instructions (Optional)
              </label>
              <textarea
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows={3}
                placeholder="Any special instructions for pickup or cleaning?"
              />
            </div>

            {message && (
              <div className={`p-4 rounded-lg ${message.includes('Error') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                {message}
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white py-4 rounded-full text-lg font-bold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Submitting...' : 'Schedule Pickup'}
            </button>
          </form>

          <div className="mt-8 p-6 bg-blue-50 rounded-xl">
            <h3 className="font-bold text-gray-900 mb-2">What happens next?</h3>
            <ul className="space-y-2 text-gray-700">
              <li className="flex items-start gap-2">
                <span className="text-blue-600 font-bold">1.</span>
                <span>We'll review your booking and contact you within 2 hours to confirm</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 font-bold">2.</span>
                <span>Prepare your laundry in any suitable bag for your first pickup</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 font-bold">3.</span>
                <span>We'll provide you with our premium Fresh N Clean bag on delivery</span>
              </li>
            </ul>
          </div>

          <div className="mt-6 p-6 bg-amber-50 rounded-xl border border-amber-200">
            <h3 className="font-bold text-gray-900 mb-2">⚠️ Important: No Cancellations</h3>
            <p className="text-gray-700 mb-2">
              Once your pickup is scheduled, it cannot be cancelled or rescheduled. Please ensure your selected date and time work for you.
            </p>
            <p className="text-sm text-gray-600 mb-4">
              <strong>Weekly Subscriptions:</strong> To cancel a recurring subscription, email us at <a href="mailto:info@freshncleanlaundry.com" className="text-blue-600 hover:underline font-semibold">info@freshncleanlaundry.com</a>
            </p>
            <button
              type="button"
              onClick={() => setShowCancelModal(true)}
              className="w-full bg-red-500 hover:bg-red-600 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 flex items-center justify-center gap-2"
            >
              <XCircle className="w-5 h-5" />
              Cancel Subscription
            </button>
          </div>
        </div>
      </div>

      {/* Cancellation Modal */}
      {showCancelModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 relative animate-in fade-in zoom-in duration-200">
            <button
              onClick={() => setShowCancelModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>

            <div className="text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <XCircle className="w-10 h-10 text-red-600" />
              </div>

              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Cancel Your Subscription
              </h2>

              <div className="bg-blue-50 rounded-xl p-6 mb-6 text-left">
                <h3 className="font-semibold text-gray-900 mb-3">To cancel your subscription:</h3>
                <ol className="space-y-2 text-gray-700">
                  <li className="flex items-start gap-2">
                    <span className="font-bold text-blue-600">1.</span>
                    <span>Send an email to <a href="mailto:info@freshncleanlaundry.com" className="text-blue-600 hover:underline font-semibold">info@freshncleanlaundry.com</a></span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="font-bold text-blue-600">2.</span>
                    <span>Include your name and subscription details</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="font-bold text-blue-600">3.</span>
                    <span>We'll process your cancellation within 24 hours</span>
                  </li>
                </ol>
              </div>

              <a
                href="mailto:info@freshncleanlaundry.com?subject=Subscription Cancellation Request&body=Hello,%0D%0A%0D%0AI would like to cancel my subscription.%0D%0A%0D%0AName: %0D%0AEmail: %0D%0APhone: %0D%0A%0D%0AThank you."
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 mb-3"
              >
                <Mail className="w-5 h-5" />
                Open Email Client
              </a>

              <button
                onClick={() => setShowCancelModal(false)}
                className="w-full bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-3 px-6 rounded-lg transition-all duration-200"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
