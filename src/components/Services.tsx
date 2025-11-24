import { Package, Shield, Ruler } from 'lucide-react';

export default function Services() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="order-2 md:order-1">
            <h3 className="text-3xl font-bold text-gray-900 mb-6">
              Our Premium Laundry Bag: Secure & Spacious Transport
            </h3>

            <p className="text-lg text-gray-700 mb-6 leading-relaxed">
              We ensure your laundry is transported safely and securely using our custom-designed,
              durable laundry bags—guaranteeing your clothes return as crisp as they left.
            </p>

            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <Shield className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
                <div>
                  <h4 className="font-bold text-gray-900 text-lg mb-1">Safe & Secure</h4>
                  <p className="text-gray-700">
                    Used to transport your clothing to and from our wash and fold locations.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <Package className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
                <div>
                  <h4 className="font-bold text-gray-900 text-lg mb-1">Durable Build</h4>
                  <p className="text-gray-700">
                    Constructed with a sturdy woven PVC base, ensuring it remains rigid and
                    stands up well in your closet.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <Ruler className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
                <div>
                  <h4 className="font-bold text-gray-900 text-lg mb-1">Optimal Capacity</h4>
                  <p className="text-gray-700">
                    Measures 20" x 14" x 15" (H x W x D).
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-8 bg-gray-50 p-6 rounded-xl">
              <h4 className="font-bold text-gray-900 text-xl mb-4">Convenient Features:</h4>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start gap-3">
                  <span className="text-blue-600 font-bold">•</span>
                  <span>Extended 10" High Cover with a draw cord to completely secure your clothes.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-blue-600 font-bold">•</span>
                  <span>2 Carrying Handles and grommets for easy transport.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-blue-600 font-bold">•</span>
                  <span>5" x 9" Pocket with snap closure on the side for your invoice/order details.</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="order-1 md:order-2 flex justify-center">
            <div className="relative w-full max-w-md">
              <img
                src="/image copy copy copy copy.png"
                alt="Premium Laundry Bag"
                className="w-full h-auto rounded-3xl shadow-2xl"
              />
              <div className="absolute bottom-[35%] left-[15%] transform">
                <div className="bg-white/95 backdrop-blur-sm rounded-lg p-3 shadow-lg border-2 border-gray-200">
                  <p className="text-2xl font-bold text-gray-900 text-center leading-tight">20" x 14"<br />x 15"</p>
                  <p className="text-gray-600 text-center text-xs mt-1">Premium Bag Size</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
