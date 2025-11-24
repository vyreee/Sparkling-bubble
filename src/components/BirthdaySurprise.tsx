import { Gift, Sparkles, Star } from 'lucide-react';

export default function BirthdaySurprise() {
  return (
    <section className="py-20 bg-gradient-to-r from-green-100 via-emerald-100 to-teal-100 relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 animate-bounce">
          <Sparkles className="w-8 h-8 text-green-500" />
        </div>
        <div className="absolute top-20 right-20 animate-pulse">
          <Sparkles className="w-6 h-6 text-emerald-500" />
        </div>
        <div className="absolute bottom-10 left-1/4 animate-bounce delay-100">
          <Sparkles className="w-10 h-10 text-teal-500" />
        </div>
        <div className="absolute bottom-20 right-1/3 animate-pulse delay-200">
          <Sparkles className="w-7 h-7 text-green-500" />
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 relative z-10">
        <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 border-4 border-green-300">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-4 mb-4">
              <Star className="w-12 h-12 text-green-500 animate-bounce" />
              <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500 bg-clip-text text-transparent">
                Welcome Gift! 🎉
              </h2>
              <Gift className="w-12 h-12 text-emerald-500 animate-bounce" />
            </div>
            <p className="text-xl text-gray-700 font-semibold">
              New to Fresh & Clean? We Have a Gift for You!
            </p>
          </div>

          {/* Content */}
          <div className="grid md:grid-cols-2 gap-8 items-center">
            {/* Left side - Offer details */}
            <div className="space-y-6">
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 border-2 border-green-200">
                <h3 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Gift className="w-6 h-6 text-green-500" />
                  First-Time Customer Special
                </h3>
                <ul className="space-y-3 text-gray-700">
                  <li className="flex items-start gap-2">
                    <span className="text-green-500 font-bold">🎁</span>
                    <span><strong>FREE Laundry Bag</strong> with your first order</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-500 font-bold">✨</span>
                    <span><strong>High-Quality Bag</strong> - Perfect for organizing your clothes</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-teal-500 font-bold">🌟</span>
                    <span><strong>No Extra Charge</strong> - Delivered with your first order!</span>
                  </li>
                </ul>
              </div>

              <div className="bg-yellow-50 border-2 border-yellow-300 rounded-xl p-4">
                <p className="text-sm text-gray-700">
                  <strong>How It Works:</strong> Complete your first order and we'll automatically include a complimentary laundry bag! 
                  It's our way of saying thank you for choosing us. 🎈
                </p>
              </div>
            </div>

            {/* Right side - Call to action */}
            <div className="text-center space-y-6">
              <div className="bg-gradient-to-br from-green-500 via-emerald-500 to-teal-500 rounded-3xl p-8 text-white shadow-xl">
                <Gift className="w-20 h-20 mx-auto mb-4 animate-pulse" />
                <h3 className="text-3xl font-bold mb-3">
                  Start Fresh Today!
                </h3>
                <p className="text-lg mb-6 opacity-90">
                  Join thousands of happy customers and get your free gift
                </p>
                <a
                  href="#bundles"
                  className="inline-block bg-white text-emerald-600 font-bold py-4 px-8 rounded-full text-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                >
                  Claim Your Free Bag! 🎁
                </a>
              </div>

              <p className="text-xs text-gray-500">
                * Valid for first-time customers only. One free bag per customer.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
