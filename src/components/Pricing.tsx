import { ShoppingCart } from 'lucide-react';
import { useCart } from '../context/CartContext';

export default function Pricing() {
  const { addItem } = useCart();
  const pricingTiers = [
    { tier: 'Small Bag', weight: 'Up to ≈15 lb', price: 25, weeklySubscription: 20, seniorDiscount: 15, seniorWeekly: 12 },
    { tier: 'Medium Bag', weight: 'Up to ≈20 lb', price: 35, weeklySubscription: 30, seniorDiscount: 25, seniorWeekly: 20 },
    { tier: 'Large Bag', weight: 'Up to ≈30 lb', price: 45, weeklySubscription: 40, seniorDiscount: 35, seniorWeekly: 30 },
  ];

  const addOns = [
    { service: 'Hang-Dry Service', description: 'Delicates and items you prefer air-dried will be carefully hung instead of machine-dried.', price: 5 },
    { service: 'Eco Detergent Upgrade', description: 'We use a premium, plant-based, and hypoallergenic detergent for the environmentally conscious client.', price: 3 },
    { service: 'Rush Service (24-Hour)', description: 'Get your clothes back guaranteed within 24 hours of pickup.', price: 10 },
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-blue-50 to-purple-50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-12">
          <img
            src="/Fresh N Clean Laundry Service (6 x 8 in).png"
            alt="Fresh & Clean Logo"
            className="h-40 w-auto mx-auto mb-6"
          />
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Simple, Transparent Pricing
          </h2>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto">
            Enjoy a flat-rate structure based on the size of your order, including FREE pickup and delivery
            within our immediate service radius.
          </p>
        </div>

        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden mb-16 max-w-5xl mx-auto">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr>
                  <th className="px-8 py-6 text-center text-lg font-bold bg-blue-600 text-white border-r border-blue-500">
                    Service Tier
                  </th>
                  <th className="px-8 py-6 text-center text-lg font-bold bg-blue-600 text-white border-r border-blue-500">
                    Estimated Weight
                  </th>
                  <th className="px-8 py-6 text-center text-lg font-bold bg-green-500 text-white border-r border-green-400">
                    Price<br/>(Includes P&D)
                  </th>
                  <th className="px-8 py-6 text-center text-lg font-bold bg-green-500 text-white border-r border-green-400">
                    Weekly<br/>Subscription Rate
                  </th>
                  <th className="px-8 py-6 text-center text-lg font-bold bg-cyan-400 text-gray-900 border-r border-cyan-300">
                    Senior / Military<br/>Discounts (Drop off /<br/>Pick up at Senior<br/>Center)
                  </th>
                  <th className="px-8 py-6 text-center text-lg font-bold bg-cyan-400 text-gray-900">
                    Senior / Military<br/>Weekly<br/>Subscription Rate
                  </th>
                </tr>
              </thead>
              <tbody className="bg-gray-50">
                {pricingTiers.map((tier, index) => (
                  <tr key={index} className="border-b border-gray-200 last:border-b-0">
                    <td className="px-8 py-6 font-bold text-gray-900 text-center text-lg border-r border-gray-200 bg-white">
                      {tier.tier}
                    </td>
                    <td className="px-8 py-6 text-gray-900 text-center text-base border-r border-gray-200 bg-white">
                      {tier.weight}
                    </td>
                    <td className="px-6 py-6 text-center border-r border-gray-200 bg-green-50">
                      <div className="font-bold text-gray-900 text-2xl mb-3">${tier.price}</div>
                      <button 
                        onClick={() => addItem({ name: tier.tier, price: tier.price, type: 'service', category: 'regular', description: tier.weight })}
                        className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 shadow-md hover:shadow-lg mx-auto text-sm"
                      >
                        <ShoppingCart className="w-4 h-4" />
                        Add to Cart
                      </button>
                    </td>
                    <td className="px-6 py-6 text-center border-r border-gray-200 bg-green-50">
                      <div className="font-bold text-gray-900 text-2xl mb-3">${tier.weeklySubscription}</div>
                      <button 
                        onClick={() => addItem({ name: `${tier.tier} - Weekly`, price: tier.weeklySubscription, type: 'service', category: 'weekly', description: tier.weight })}
                        className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 shadow-md hover:shadow-lg mx-auto text-sm"
                      >
                        <ShoppingCart className="w-4 h-4" />
                        Add to Cart
                      </button>
                    </td>
                    <td className="px-6 py-6 text-center border-r border-gray-200 bg-cyan-50">
                      <div className="font-bold text-gray-900 text-2xl mb-3">${tier.seniorDiscount}</div>
                      <button 
                        onClick={() => addItem({ name: `${tier.tier} - Senior/Military`, price: tier.seniorDiscount, type: 'service', category: 'senior', description: tier.weight })}
                        className="bg-gradient-to-r from-cyan-600 to-cyan-700 hover:from-cyan-700 hover:to-cyan-800 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 shadow-md hover:shadow-lg mx-auto text-sm"
                      >
                        <ShoppingCart className="w-4 h-4" />
                        Add to Cart
                      </button>
                    </td>
                    <td className="px-6 py-6 text-center bg-cyan-50">
                      <div className="font-bold text-gray-900 text-2xl mb-3">${tier.seniorWeekly}</div>
                      <button 
                        onClick={() => addItem({ name: `${tier.tier} - Senior/Military Weekly`, price: tier.seniorWeekly, type: 'service', category: 'senior_weekly', description: tier.weight })}
                        className="bg-gradient-to-r from-cyan-600 to-cyan-700 hover:from-cyan-700 hover:to-cyan-800 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 shadow-md hover:shadow-lg mx-auto text-sm"
                      >
                        <ShoppingCart className="w-4 h-4" />
                        Add to Cart
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="mb-16">
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="bg-gradient-to-r from-teal-500 to-green-500 text-white px-8 py-5">
              <h4 className="text-2xl font-bold">Add-On Services</h4>
              <p className="text-white/90 mt-1">Customize your laundry experience with our premium add-ons.</p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gradient-to-r from-teal-500 to-green-500 text-white">
                    <th className="px-8 py-5 text-left text-lg font-bold">Add-On Service</th>
                    <th className="px-8 py-5 text-left text-lg font-bold">Description</th>
                    <th className="px-8 py-5 text-right text-lg font-bold">Price</th>
                    <th className="px-8 py-5 text-center text-lg font-bold w-48"></th>
                  </tr>
                </thead>
                <tbody>
                  {addOns.map((addon, index) => (
                    <tr
                      key={index}
                      className={`border-b border-gray-100 last:border-b-0 hover:bg-gray-50 transition-colors ${
                        index % 2 === 0 ? 'bg-gray-50' : 'bg-white'
                      }`}
                    >
                      <td className="px-8 py-5 font-bold text-gray-900">{addon.service}</td>
                      <td className="px-8 py-5 text-gray-700">{addon.description}</td>
                      <td className="px-8 py-5 font-bold text-green-600 text-lg text-right whitespace-nowrap">
                        +${addon.price} per bag
                      </td>
                      <td className="px-8 py-5 text-center">
                        <button 
                          onClick={() => addItem({ name: addon.service, price: addon.price, type: 'addon', description: addon.description })}
                          className="bg-gradient-to-r from-teal-600 to-green-600 hover:from-teal-700 hover:to-green-700 text-white font-semibold py-2 px-6 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 shadow-md hover:shadow-lg mx-auto"
                        >
                          <ShoppingCart className="w-4 h-4" />
                          Add to Cart
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-blue-500 to-purple-500 rounded-2xl p-8 text-white shadow-xl">
          <h3 className="text-3xl font-bold mb-4 text-center">Service Zone Adjustment</h3>
          <p className="text-lg text-center max-w-3xl mx-auto">
            For customers outside our immediate service radius, a small delivery fee of +$5 will be applied
            to your order. We will confirm this when you place your booking!
          </p>
        </div>

      </div>
    </section>
  );
}
