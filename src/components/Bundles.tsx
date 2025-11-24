import { Users, Home, Baby, School, Heart, Sparkles, Gift, Calendar, ShoppingCart, Ticket } from 'lucide-react';
import { useCart } from '../context/CartContext';

export default function Bundles() {
  const { addItem } = useCart();
  const bundles = [
    {
      icon: Home,
      name: 'Household Essentials',
      subtitle: 'Perfect for 1-2 people.',
      bundle: '1 Small + 1 Medium',
      weeklyPrice: 45,
      savings: 'saves $3',
      regularValue: '$48',
      greatFor: '1-2 people, seniors, light laundry homes',
      gradient: 'from-blue-500 to-cyan-500',
    },
    {
      icon: Users,
      name: 'Family of Two / Light Laundry',
      subtitle: 'For couples and small households.',
      bundle: '2 Medium Bags',
      weeklyPrice: '$52',
      savings: 'saves $4',
      regularValue: '$56',
      greatFor: 'Couples, adults working full-time',
      gradient: 'from-teal-500 to-green-500',
    },
    {
      icon: Baby,
      name: 'Busy Family',
      subtitle: 'Active families need active solutions.',
      bundle: '1 Large + 1 Medium',
      weeklyPrice: 60,
      savings: 'saves $6-$8',
      regularValue: '$66-$68',
      greatFor: 'Families with kids, sports uniforms, towels',
      gradient: 'from-orange-500 to-pink-500',
    },
    {
      icon: Heart,
      name: 'Large Family',
      subtitle: 'For growing families.',
      bundle: '2 Large Bags',
      weeklyPrice: 72,
      savings: 'saves $6-$8',
      regularValue: '$76-$80',
      greatFor: 'Families of 4-5, heavy laundry, pets',
      gradient: 'from-purple-500 to-indigo-500',
    },
    {
      icon: Sparkles,
      name: 'The Big Wash',
      subtitle: 'For homes with HUGE laundry weeks.',
      bundle: '3 Large Bags',
      weeklyPrice: 110,
      savings: 'saves $10+',
      regularValue: '$114-$120',
      greatFor: 'Homes with 3+ kids, Multi-generational households, Elder care homes, Regular towel/linen turnover',
      gradient: 'from-pink-500 to-rose-500',
    },
    {
      icon: School,
      name: 'Student / Roommate',
      subtitle: 'Designed for shared homes.',
      bundle: '3 Small Bags',
      weeklyPrice: 52,
      savings: 'saves $8',
      regularValue: '$60',
      greatFor: 'Roommates, Apartments, Student housing',
      gradient: 'from-cyan-500 to-blue-500',
    },
    {
      icon: Gift,
      name: "Mom's Day Off",
      subtitle: 'Perfect for parents who hate laundry.',
      bundle: '1 Large + 2 Medium',
      weeklyPrice: 85,
      savings: 'saves $11-$13',
      regularValue: '$94-$96',
      greatFor: '3-6 person households',
      gradient: 'from-green-500 to-teal-500',
    },
    {
      icon: Calendar,
      name: 'All Linens Included',
      subtitle: 'For homes with lots of bedding/towels.',
      bundle: '1 Large + 1 Large (Linens Only)',
      weeklyPrice: 75,
      savings: '',
      regularValue: '$80',
      greatFor: 'Homes with pets, Homes with multiple beds, Seniors washing sheets frequently',
      gradient: 'from-indigo-500 to-purple-500',
    },
  ];

  const premiumBundle = {
    icon: Sparkles,
    name: 'Ultimate Family Unlimited',
    subtitle: 'Your Premium Plan',
    description: 'Not truly unlimited — but extremely high value & predictable.',
    bundle: 'Up to 4 Bags/week (Any Size)',
    weeklyPrice: 135,
    cap: 'Max 120 lbs total | Max 4 bags/week',
    greatFor: 'Busy high-income families, Care homes, Foster families, Large Households',
    gradient: 'from-yellow-400 via-orange-500 to-red-500',
  };

  const prepayBundles = {
    fourWeeks: { weeks: 4, save: '$10' },
    twelveWeeks: { weeks: 12, save: '$50' },
  };

  return (
    <section className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Choose Your Perfect Bundle
          </h2>
          <p className="text-xl text-gray-700">
            Subscription packages designed for every lifestyle
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {bundles.map((bundle, index) => {
            const Icon = bundle.icon;
            return (
              <div
                key={index}
                className="bg-white rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-2"
              >
                <div className={`bg-gradient-to-r ${bundle.gradient} p-6 text-white`}>
                  <Icon className="w-12 h-12 mb-3" />
                  <h3 className="text-2xl font-bold mb-1">{bundle.name}</h3>
                  <p className="text-white/90 text-sm">{bundle.subtitle}</p>
                </div>
                <div className="p-6">
                  <div className="mb-4">
                    <p className="text-gray-600 text-sm mb-1">Bundle</p>
                    <p className="font-bold text-gray-900 text-lg">{bundle.bundle}</p>
                  </div>
                  <div className="mb-4">
                    <p className="text-3xl font-bold text-blue-600">${bundle.weeklyPrice}</p>
                    <p className="text-green-600 font-semibold">{bundle.savings}</p>
                    <p className="text-gray-500 text-sm">Regular: {bundle.regularValue}</p>
                  </div>
                  <div className="border-t pt-4 mb-4">
                    <p className="text-sm text-gray-600 mb-1 font-semibold">Great for:</p>
                    <p className="text-sm text-gray-700">{bundle.greatFor}</p>
                  </div>
                  <button 
                    onClick={() => addItem({ name: bundle.name, price: bundle.weeklyPrice, type: 'bundle', description: bundle.bundle })}
                    className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
                  >
                    <ShoppingCart className="w-5 h-5" />
                    Add to Cart
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mb-16">
          <div className="relative rounded-3xl shadow-2xl overflow-hidden">
            <img
              src="/image copy copy copy copy.png"
              alt="Premium Laundry Bag"
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="relative bg-gradient-to-r from-yellow-400/90 via-orange-500/90 to-red-500/90 backdrop-blur-sm">
              <div className="p-8 md:p-12 text-white text-center">
              <div className="flex justify-center mb-6">
                <Sparkles className="w-16 h-16" />
              </div>
              <h3 className="text-3xl md:text-4xl font-bold mb-2">{premiumBundle.name}</h3>
              <p className="text-xl mb-2">{premiumBundle.subtitle}</p>
              <p className="text-lg mb-6 opacity-90">{premiumBundle.description}</p>

              <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-6 mb-6 max-w-2xl mx-auto">
                <p className="text-sm mb-2 opacity-90">Bundle</p>
                <p className="font-bold text-2xl mb-4">{premiumBundle.bundle}</p>
                <p className="text-4xl font-bold mb-2">${premiumBundle.weeklyPrice}</p>
                <p className="text-lg opacity-90 mb-4">per week</p>
                <p className="text-sm font-semibold">{premiumBundle.cap}</p>
              </div>

              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 max-w-2xl mx-auto mb-6">
                <p className="text-sm mb-2 font-semibold">Great for:</p>
                <p className="text-base">{premiumBundle.greatFor}</p>
              </div>

              <button 
                onClick={() => addItem({ name: premiumBundle.name, price: premiumBundle.weeklyPrice, type: 'bundle', description: premiumBundle.bundle })}
                className="bg-white text-orange-600 font-bold py-4 px-8 rounded-lg transition-all duration-200 hover:bg-gray-100 flex items-center justify-center gap-2 shadow-xl hover:shadow-2xl mx-auto text-lg"
              >
                <ShoppingCart className="w-6 h-6" />
                Add to Cart
              </button>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
          <h3 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Prepay Bundles
          </h3>
          <div className="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto">
            <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-6 text-center border-2 border-blue-200">
              <Calendar className="w-12 h-12 text-blue-600 mx-auto mb-4" />
              <p className="text-5xl font-bold text-gray-900 mb-2">{prepayBundles.fourWeeks.weeks}</p>
              <p className="text-xl text-gray-700 mb-4">weeks prepaid</p>
              <p className="text-2xl font-bold text-green-600 mb-4">Save {prepayBundles.fourWeeks.save}</p>
              <button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 shadow-md hover:shadow-lg">
                <Ticket className="w-5 h-5" />
                Use Coupon
              </button>
            </div>
            <div className="bg-gradient-to-br from-green-50 to-teal-50 rounded-xl p-6 text-center border-2 border-green-200">
              <Gift className="w-12 h-12 text-green-600 mx-auto mb-4" />
              <p className="text-5xl font-bold text-gray-900 mb-2">{prepayBundles.twelveWeeks.weeks}</p>
              <p className="text-xl text-gray-700 mb-4">weeks prepaid</p>
              <p className="text-2xl font-bold text-green-600 mb-4">Save {prepayBundles.twelveWeeks.save}</p>
              <button className="w-full bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 shadow-md hover:shadow-lg">
                <Ticket className="w-5 h-5" />
                Use Coupon
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
