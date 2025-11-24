import { Link } from 'react-router-dom';
import { XCircle, Home, ArrowLeft, HelpCircle } from 'lucide-react';

export default function PaymentCancelPage() {
  return (
    <div className="pt-24 min-h-screen bg-gradient-to-br from-red-50 to-orange-50">
      <div className="max-w-3xl mx-auto px-6 py-12">
        <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 text-center">
          <div className="mb-6">
            <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto">
              <XCircle className="w-16 h-16 text-red-600" />
            </div>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Payment Cancelled
          </h1>
          
          <p className="text-xl text-gray-700 mb-6">
            Your payment was not processed. No charges were made to your account.
          </p>

          <div className="bg-blue-50 rounded-2xl p-6 mb-8">
            <div className="flex items-center justify-center gap-2 mb-3">
              <HelpCircle className="w-5 h-5 text-blue-600" />
              <h2 className="text-lg font-semibold text-gray-900">Need Help?</h2>
            </div>
            <p className="text-gray-700">
              If you experienced any issues during checkout or have questions about our services, 
              please don't hesitate to contact us. We're here to help!
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/pay"
              className="inline-flex items-center justify-center gap-2 bg-green-500 text-white px-8 py-4 rounded-full text-lg font-bold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
            >
              <ArrowLeft className="w-5 h-5" />
              Try Again
            </Link>
            <Link
              to="/"
              className="inline-flex items-center justify-center gap-2 bg-gray-500 text-white px-8 py-4 rounded-full text-lg font-bold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
            >
              <Home className="w-5 h-5" />
              Back to Home
            </Link>
          </div>

          <div className="mt-8 pt-8 border-t">
            <p className="text-sm text-gray-600">
              Questions? Contact us at <a href="mailto:support@yourlaundry.com" className="text-blue-600 hover:underline">support@yourlaundry.com</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
