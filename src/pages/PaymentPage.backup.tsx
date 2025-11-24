import { useState } from 'react';
import { CreditCard, DollarSign, Package, Shield, CheckCircle, Plus } from 'lucide-react';

export default function PaymentPageComplete() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    serviceType: 'small',
    customerType: 'regular', // regular, senior, subscription
    addOns: [] as string[],
    quantity: 1,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');

  // Basic Services with all variants
  const services = {
    // Regular One-time
    small: { name: 'Small Bag (Up to ≈15 lb)', price: 25 },
    medium: { name: 'Medium Bag (Up to ≈20 lb)', price: 35 },
    large: { name: 'Large Bag (Up to ≈30 lb)', price: 45 },
    
    // Weekly Subscriptions
    small_subscription: { name: 'Small Bag - Weekly Subscription', price: 20 },
    medium_subscription: { name: 'Medium Bag - Weekly Subscription', price: 30 },
    large_subscription: { name: 'Large Bag - Weekly Subscription', price: 40 },
    
    // Senior/Military
    small_senior: { name: 'Small Bag - Senior/Military', price: 15 },
    medium_senior: { name: 'Medium Bag - Senior/Military', price: 25 },
    large_senior: { name: 'Large Bag - Senior/Military', price: 35 },
    
    // Senior/Military Weekly
    small_senior_weekly: { name: 'Small Bag - Senior/Military Weekly', price: 12 },
    medium_senior_weekly: { name: 'Medium Bag - Senior/Military Weekly', price: 20 },
    large_senior_weekly: { name: 'Large Bag - Senior/Military Weekly', price: 30 },
    
    // Bundles
    bundle_household: { name: 'Household Essentials Bundle', price: 45 },
    bundle_family_two: { name: 'Family of Two Bundle', price: 52 },
    bundle_busy_family: { name: 'Busy Family Bundle', price: 60 },
    bundle_large_family: { name: 'Large Family Bundle', price: 72 },
    bundle_big_wash: { name: 'The Big Wash Bundle', price: 110 },
    bundle_student: { name: 'Student/Roommate Bundle', price: 52 },
    bundle_moms_day: { name: "Mom's Day Off Bundle", price: 85 },
    bundle_linens: { name: 'All Linens Included Bundle', price: 75 },
    bundle_ultimate: { name: 'Ultimate Family Unlimited', price: 135 },
  };

  // Add-ons
  const addOnsAvailable = [
    { id: 'hangdry', name: 'Hang-Dry Service', price: 5 },
    { id: 'eco', name: 'Eco Detergent Upgrade', price: 3 },
    { id: 'rush', name: 'Rush Service (24-Hour)', price: 10 },
  ];

  const calculateTotal = () => {
    let total = services[formData.serviceType as keyof typeof services].price * formData.quantity;
    
    // Add add-ons
    formData.addOns.forEach(addonId => {
      const addon = addOnsAvailable.find(a => a.id === addonId);
      if (addon) {
        total += addon.price * formData.quantity;
      }
    });
    
    return total;
  };

  const toggleAddOn = (addonId: string) => {
    setFormData(prev => ({
      ...prev,
      addOns: prev.addOns.includes(addonId)
        ? prev.addOns.filter(id => id !== addonId)
        : [...prev.addOns, addonId]
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage('');

    try {
      // Call Vercel API to create Stripe checkout session
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          serviceType: formData.serviceType,
          quantity: formData.quantity,
          addOns: formData.addOns,
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
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="text-center mb-12">
          <CreditCard className="w-16 h-16 mx-auto mb-4 text-green-600" />
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Make a Payment
          </h1>
          <p className="text-xl text-gray-700">
            Choose your service and pay securely with Stripe
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Payment Form - Takes 2 columns */}
          <div className="lg:col-span-2 bg-white rounded-2xl shadow-2xl p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Service Selection</h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Customer Information */}
              <div className="grid md:grid-cols-2 gap-4">
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

              {/* Service Type Selection */}
              <div>
                <label className="flex items-center gap-2 text-gray-700 font-semibold mb-3">
                  <Package className="w-5 h-5 text-green-600" />
                  Select Your Service
                </label>
                
                {/* Basic Services */}
                <div className="mb-4">
                  <h3 className="text-sm font-semibold text-gray-600 mb-2">Regular Services</h3>
                  <select
                    value={formData.serviceType}
                    onChange={(e) => setFormData({ ...formData, serviceType: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  >
                    <optgroup label="One-Time Service">
                      <option value="small">Small Bag - $25</option>
                      <option value="medium">Medium Bag - $35</option>
                      <option value="large">Large Bag - $45</option>
                    </optgroup>
                    
                    <optgroup label="Weekly Subscription">
                      <option value="small_subscription">Small Bag Weekly - $20/week</option>
                      <option value="medium_subscription">Medium Bag Weekly - $30/week</option>
                      <option value="large_subscription">Large Bag Weekly - $40/week</option>
                    </optgroup>
                    
                    <optgroup label="Senior/Military Discount">
                      <option value="small_senior">Small Bag (Senior/Military) - $15</option>
                      <option value="medium_senior">Medium Bag (Senior/Military) - $25</option>
                      <option value="large_senior">Large Bag (Senior/Military) - $35</option>
                    </optgroup>
                    
                    <optgroup label="Senior/Military Weekly">
                      <option value="small_senior_weekly">Small Bag (Senior/Military Weekly) - $12/week</option>
                      <option value="medium_senior_weekly">Medium Bag (Senior/Military Weekly) - $20/week</option>
                      <option value="large_senior_weekly">Large Bag (Senior/Military Weekly) - $30/week</option>
                    </optgroup>
                    
                    <optgroup label="Bundles">
                      <option value="bundle_household">Household Essentials - $45</option>
                      <option value="bundle_family_two">Family of Two - $52</option>
                      <option value="bundle_busy_family">Busy Family - $60</option>
                      <option value="bundle_large_family">Large Family - $72</option>
                      <option value="bundle_big_wash">The Big Wash - $110</option>
                      <option value="bundle_student">Student/Roommate - $52</option>
                      <option value="bundle_moms_day">Mom's Day Off - $85</option>
                      <option value="bundle_linens">All Linens Included - $75</option>
                      <option value="bundle_ultimate">Ultimate Family Unlimited - $135</option>
                    </optgroup>
                  </select>
                </div>
              </div>

              {/* Quantity */}
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

              {/* Add-ons */}
              <div>
                <label className="flex items-center gap-2 text-gray-700 font-semibold mb-3">
                  <Plus className="w-5 h-5 text-blue-600" />
                  Add-On Services (Optional)
                </label>
                <div className="space-y-3">
                  {addOnsAvailable.map(addon => (
                    <label key={addon.id} className="flex items-center gap-3 p-4 border-2 rounded-lg cursor-pointer hover:border-green-500 transition-colors">
                      <input
                        type="checkbox"
                        checked={formData.addOns.includes(addon.id)}
                        onChange={() => toggleAddOn(addon.id)}
                        className="w-5 h-5 text-green-500 rounded focus:ring-green-500"
                      />
                      <div className="flex-1">
                        <div className="font-semibold text-gray-900">{addon.name}</div>
                        <div className="text-sm text-gray-600">+${addon.price} per bag</div>
                      </div>
                    </label>
                  ))}
                </div>
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
                {isSubmitting ? 'Processing...' : `Pay $${calculateTotal()} Now`}
              </button>
            </form>
          </div>

          {/* Order Summary - 1 column */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-2xl p-6 sticky top-24">
              <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <DollarSign className="w-6 h-6 text-green-600" />
                Order Summary
              </h3>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-gray-700">
                  <span>Service:</span>
                  <span className="font-semibold text-right text-sm">
                    {services[formData.serviceType as keyof typeof services].name}
                  </span>
                </div>
                <div className="flex justify-between text-gray-700">
                  <span>Price per unit:</span>
                  <span className="font-semibold">
                    ${services[formData.serviceType as keyof typeof services].price}
                  </span>
                </div>
                <div className="flex justify-between text-gray-700">
                  <span>Quantity:</span>
                  <span className="font-semibold">{formData.quantity}</span>
                </div>
                
                {formData.addOns.length > 0 && (
                  <div className="border-t pt-3">
                    <div className="text-sm font-semibold text-gray-700 mb-2">Add-ons:</div>
                    {formData.addOns.map(addonId => {
                      const addon = addOnsAvailable.find(a => a.id === addonId);
                      return addon ? (
                        <div key={addonId} className="flex justify-between text-sm text-gray-600 ml-2">
                          <span>• {addon.name}</span>
                          <span>+${addon.price} × {formData.quantity}</span>
                        </div>
                      ) : null;
                    })}
                  </div>
                )}
                
                <div className="border-t pt-3 flex justify-between text-2xl font-bold text-gray-900">
                  <span>Total:</span>
                  <span className="text-green-600">${calculateTotal()}</span>
                </div>
              </div>

              <div className="bg-green-50 rounded-lg p-4 text-sm text-gray-700">
                <strong>✓ Secure Payment:</strong> You'll be redirected to Stripe's secure checkout page.
              </div>
            </div>

            <div className="bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-2xl shadow-xl p-6 text-white">
              <h3 className="text-lg font-bold mb-3 flex items-center gap-2">
                <Shield className="w-5 h-5" />
                Payment Security
              </h3>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                  <span>SSL encrypted</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                  <span>Stripe secure processing</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                  <span>No card data stored</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
