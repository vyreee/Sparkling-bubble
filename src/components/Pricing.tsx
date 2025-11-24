export default function Pricing() {
  const pricingTiers = [
    { tier: 'Small Bag', weight: 'Up to ≈15 lb', price: '$25', weeklySubscription: '$20', seniorDiscount: '$15', seniorWeekly: '$12' },
    { tier: 'Medium Bag', weight: 'Up to ≈20 lb', price: '$35', weeklySubscription: '$30', seniorDiscount: '$25', seniorWeekly: '$20' },
    { tier: 'Large Bag', weight: 'Up to ≈30 lb', price: '$45', weeklySubscription: '$40', seniorDiscount: '$35', seniorWeekly: '$30' },
  ];

  const addOns = [
    { service: 'Hang-Dry Service', description: 'Delicates and items you prefer air-dried will be carefully hung instead of machine-dried.', price: '+$5 per bag' },
    { service: 'Eco Detergent Upgrade', description: 'We use a premium, plant-based, and hypoallergenic detergent for the environmentally conscious client.', price: '+$3 per bag' },
    { service: 'Rush Service (24-Hour)', description: 'Get your clothes back guaranteed within 24 hours of pickup.', price: '+$10 per bag' },
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-blue-50 to-purple-50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-12">
          <img
            src="/image copy copy copy.png"
            alt="Sparkling Bubble Logo"
            className="h-40 w-auto mx-auto mb-6"
            style={{ imageRendering: 'crisp-edges' }}
          />
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Simple, Transparent Pricing
          </h2>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto">
            Enjoy a flat-rate structure based on the size of your order, including FREE pickup and delivery
            within our immediate service radius.
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden mb-16">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-blue-600 text-white">
                  <th className="px-4 py-4 text-center text-base md:text-lg font-bold border-r border-blue-500">Service Tier</th>
                  <th className="px-4 py-4 text-center text-base md:text-lg font-bold border-r border-blue-500">Estimated Weight</th>
                  <th className="px-4 py-4 text-center text-base md:text-lg font-bold border-r border-blue-500 bg-green-500">Price (Includes P&D)</th>
                  <th className="px-4 py-4 text-center text-base md:text-lg font-bold border-r border-blue-500 bg-green-500">Weekly Subscription Rate</th>
                  <th className="px-4 py-4 text-center text-base md:text-lg font-bold border-r border-blue-500 bg-cyan-400 text-gray-900">Senior / Military Discounts (Drop off / Pick up at Senior Center)</th>
                  <th className="px-4 py-4 text-center text-base md:text-lg font-bold bg-cyan-400 text-gray-900">Senior / Military Weekly Subscription Rate</th>
                </tr>
              </thead>
              <tbody>
                {pricingTiers.map((tier, index) => (
                  <tr key={index} className="border-b border-gray-200">
                    <td className="px-4 py-4 font-bold text-gray-900 text-center border-r border-gray-200">{tier.tier}</td>
                    <td className="px-4 py-4 text-gray-900 text-center border-r border-gray-200">{tier.weight}</td>
                    <td className="px-4 py-4 font-bold text-gray-900 text-center text-xl border-r border-gray-200 bg-green-100">{tier.price}</td>
                    <td className="px-4 py-4 font-bold text-gray-900 text-center text-xl border-r border-gray-200 bg-green-100">{tier.weeklySubscription}</td>
                    <td className="px-4 py-4 font-bold text-gray-900 text-center text-xl border-r border-gray-200 bg-cyan-100">{tier.seniorDiscount}</td>
                    <td className="px-4 py-4 font-bold text-gray-900 text-center text-xl bg-cyan-100">{tier.seniorWeekly}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-gradient-to-br from-blue-500 to-purple-500 rounded-2xl p-8 text-white">
          <h3 className="text-3xl font-bold mb-4 text-center">Service Zone Adjustment</h3>
          <p className="text-lg text-center max-w-3xl mx-auto">
            For customers outside our immediate service radius, a small delivery fee of +$5 will be applied
            to your order. We will confirm this when you place your booking!
          </p>
        </div>

        <div className="mt-16">
          <h3 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Enhance Your Order: Add-Ons
          </h3>
          <p className="text-lg text-gray-700 text-center mb-8">
            Customize your laundry experience with our premium add-on services.
          </p>

          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gradient-to-r from-teal-500 to-green-500 text-white">
                    <th className="px-6 py-4 text-left text-lg font-bold">Add-On Service</th>
                    <th className="px-6 py-4 text-left text-lg font-bold">Description</th>
                    <th className="px-6 py-4 text-left text-lg font-bold">Price</th>
                  </tr>
                </thead>
                <tbody>
                  {addOns.map((addon, index) => (
                    <tr key={index} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                      <td className="px-6 py-4 font-semibold text-gray-900">{addon.service}</td>
                      <td className="px-6 py-4 text-gray-700">{addon.description}</td>
                      <td className="px-6 py-4 font-bold text-green-600 text-lg">{addon.price}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
