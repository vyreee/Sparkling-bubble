import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { Calendar, MapPin, User, Phone, Mail, Clock, CreditCard, ShoppingCart, Info } from 'lucide-react';

export default function CheckoutPage() {
  const { items, getTotal, clearCart } = useCart();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    pickupDate: '',
    pickupTime: '',
    notes: '',
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');

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

  // Redirect if cart is empty
  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md text-center">
          <ShoppingCart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Your cart is empty</h2>
          <p className="text-gray-600 mb-6">Add some items to your cart before checking out.</p>
          <button
            onClick={() => navigate('/')}
            className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white px-6 py-3 rounded-full font-semibold hover:shadow-lg transition-all"
          >
            Browse Services
          </button>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage('');

    try {
      // Call Stripe API to create checkout session
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          items: items,
          customerEmail: formData.email,
          customerName: formData.name,
          customerPhone: formData.phone,
          bookingInfo: {
            address: formData.address,
            pickupDate: formData.pickupDate,
            pickupTime: formData.pickupTime,
            notes: formData.notes,
            weeklyPickupDay: hasSubscription ? getSelectedDayOfWeek() : null,
          },
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create checkout session');
      }

      // Clear cart before redirecting to Stripe
      clearCart();

      // Redirect to Stripe Checkout
      window.location.href = data.url;
    } catch (error: any) {
      setMessage('Error processing checkout. Please try again.');
      console.error('Error:', error);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 pt-24 pb-16">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Checkout</h1>
          <p className="text-xl text-gray-700">Review your order and schedule your pickup</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Checkout Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-xl p-8 space-y-6">
              {/* Step 1: Contact Information */}
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <User className="w-6 h-6 text-blue-600" />
                  Step 1: Contact Information
                </h2>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-gray-700 font-semibold mb-2 block">
                      Full Name *
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
                    <label className="text-gray-700 font-semibold mb-2 block">
                      Email *
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
                </div>

                <div className="mt-4">
                  <label className="text-gray-700 font-semibold mb-2 block">
                    Phone Number *
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
              </div>

              {/* Step 2: Pickup Details */}
              <div className="border-t pt-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Calendar className="w-6 h-6 text-blue-600" />
                  Step 2: Schedule Pickup
                </h2>

                <div>
                  <label className="text-gray-700 font-semibold mb-2 block">
                    Pickup Address *
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

                <div className="grid md:grid-cols-2 gap-4 mt-4">
                  <div>
                    <label className="text-gray-700 font-semibold mb-2 block">
                      Pickup Date *
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
                    <label className="text-gray-700 font-semibold mb-2 block">
                      Preferred Time *
                    </label>
                    <select
                      required
                      value={formData.pickupTime}
                      onChange={(e) => setFormData({ ...formData, pickupTime: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                  <div className="mt-4 bg-gradient-to-r from-purple-50 to-blue-50 border-2 border-purple-200 rounded-xl p-6">
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

                <div className="mt-4">
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
              </div>

              {message && (
                <div className={`p-4 rounded-lg ${message.includes('Error') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                  {message}
                </div>
              )}

              {/* Step 3: Payment */}
              <div className="border-t pt-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <CreditCard className="w-6 h-6 text-green-600" />
                  Step 3: Payment
                </h2>
                <p className="text-gray-600 mb-4">
                  You'll be redirected to Stripe's secure checkout to complete your payment.
                </p>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white py-4 rounded-full text-lg font-bold shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? 'Processing...' : `Proceed to Payment - $${getTotal().toFixed(2)}`}
                </button>
              </div>
            </form>
          </div>

          {/* Order Summary */}
          <div>
            <div className="bg-white rounded-2xl shadow-xl p-6 sticky top-24">
              <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <ShoppingCart className="w-6 h-6 text-blue-600" />
                Order Summary
              </h3>

              <div className="space-y-3 mb-6">
                {items.map((item) => (
                  <div key={item.id} className="flex justify-between text-gray-700 py-2 border-b border-gray-100">
                    <div className="flex-1">
                      <div className="font-semibold">{item.name}</div>
                      {item.description && (
                        <div className="text-sm text-gray-500">{item.description}</div>
                      )}
                    </div>
                    <div className="text-right ml-4">
                      <div className="font-semibold">${item.price} × {item.quantity}</div>
                      <div className="text-sm text-gray-500">${(item.price * item.quantity).toFixed(2)}</div>
                    </div>
                  </div>
                ))}
                <div className="border-t pt-3 flex justify-between text-2xl font-bold text-gray-900">
                  <span>Total:</span>
                  <span className="text-green-600">${getTotal().toFixed(2)}</span>
                </div>
              </div>

              <div className="bg-green-50 rounded-lg p-4 text-sm text-gray-700">
                <strong>✓ Secure Payment:</strong> Powered by Stripe
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
