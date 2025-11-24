import { Sparkles, Mail, Phone, MapPin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-3 gap-8 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="w-8 h-8 text-emerald-300" />
              <div>
                <h3 className="text-xl font-bold text-emerald-300">SPARKLING BUBBLE</h3>
                <p className="text-sm text-gray-400">Laundry Services</p>
              </div>
            </div>
            <p className="text-gray-400">
              Premium wash and fold service with convenient pickup and delivery.
            </p>
          </div>

          <div>
            <h4 className="text-lg font-bold mb-4">Contact Us</h4>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-emerald-300" />
                <span className="text-gray-400">Call for booking</span>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-emerald-300" />
                <span className="text-gray-400">info@sparklingbubble.com</span>
              </div>
              <div className="flex items-center gap-3">
                <MapPin className="w-5 h-5 text-emerald-300" />
                <span className="text-gray-400">Serving your local area</span>
              </div>
            </div>
          </div>

          <div>
            <h4 className="text-lg font-bold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-gray-400 hover:text-emerald-300 transition-colors">
                  Pricing
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-emerald-300 transition-colors">
                  Bundles
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-emerald-300 transition-colors">
                  How It Works
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-emerald-300 transition-colors">
                  FAQ
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8 text-center text-gray-400">
          <p>&copy; 2024 Sparkling Bubble Laundry Services. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
