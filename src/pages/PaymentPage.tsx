import { useState } from 'react';
import { CreditCard, DollarSign, Package, Shield, CheckCircle } from 'lucide-react';

export default function PaymentPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    serviceType: 'small',
    quantity: 1,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');

  const prices: Record<string, number> = {
    small: 25,
    medium: 35,
    large: 45,
    subscription: 28,
  };

  const calculateTotal = () => {
    return prices[formData.serviceType] * formData.quantity;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage('');

    try {
      // Call Netlify function to create Stripe checkout session
      const response = await fetch('/.netlify/functions/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          serviceType: formData.serviceType,
          quantity: formData.quantity,
          customerEmail: formData.email,
          customerName: formData.name,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create checkout session');
      }

      // Redirect to Stripe Checkout
      window.location.href = data.url;
    } catch (error) {
      setMessage('Error processing payment. Please try again or contact us directly.');
      console.error('Error:', error);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="pt-24 min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="text-center mb-12">
          <CreditCard className="w-16 h-16 mx-auto mb-4 text-green-600" />
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Make a Payment
          </h1>
          <p className="text-xl text-gray-700">
            Pay for your laundry service quickly and securely
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-white rounded-2xl shadow-2xl p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Payment Details</h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="text-gray-700 font-semibold mb-2 block">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="John Doe"
                />
              </div>

              <div>
                <label className="text-gray-700 font-semibold mb-2 block">
                  Email
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="john@example.com"
                />
              </div>

              <div>
                <label className="text-gray-700 font-semibold mb-2 block">
                  Phone Number
                </label>
                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="(555) 123-4567"
                />
              </div>

              <div>
                <label className="flex items-center gap-2 text-gray-700 font-semibold mb-2">
                  <Package className="w-5 h-5 text-green-600" />
                  Service Type
                </label>
                <select
                  value={formData.serviceType}
                  onChange={(e) => setFormData({ ...formData, serviceType: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  <option value="small">Small Bag - $25</option>
                  <option value="medium">Medium Bag - $35</option>
                  <option value="large">Large Bag - $45</option>
                  <option value="subscription">Subscription - $28/week</option>
                </select>
              </div>

              <div>
                <label className="text-gray-700 font-semibold mb-2 block">
                  Quantity
                </label>
                <input
                  type="number"
                  min="1"
                  max="10"
                  required
                  value={formData.quantity}
                  onChange={(e) => setFormData({ ...formData, quantity: parseInt(e.target.value) })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
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
                className="w-full bg-green-500 text-white py-4 rounded-full text-lg font-bold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Processing...' : 'Request Payment Link'}
              </button>
            </form>
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-2xl p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <DollarSign className="w-6 h-6 text-green-600" />
                Order Summary
              </h3>

              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-gray-700">
                  <span>Service:</span>
                  <span className="font-semibold capitalize">{formData.serviceType} Bag</span>
                </div>
                <div className="flex justify-between text-gray-700">
                  <span>Price per bag:</span>
                  <span className="font-semibold">${prices[formData.serviceType]}</span>
                </div>
                <div className="flex justify-between text-gray-700">
                  <span>Quantity:</span>
                  <span className="font-semibold">{formData.quantity}</span>
                </div>
                <div className="border-t pt-4 flex justify-between text-xl font-bold text-gray-900">
                  <span>Total:</span>
                  <span className="text-green-600">${calculateTotal()}</span>
                </div>
              </div>

              <div className="bg-green-50 rounded-lg p-4">
                <p className="text-sm text-gray-700">
                  <strong>Note:</strong> You will receive a secure payment link via email to complete your transaction.
                </p>
              </div>
            </div>

            <div className="bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-2xl shadow-xl p-8 text-white">
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Shield className="w-6 h-6" />
                Secure Payment
              </h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                  <span>SSL encrypted transactions</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                  <span>Stripe secure payment processing</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                  <span>No payment information stored</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                  <span>Email confirmation sent</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
