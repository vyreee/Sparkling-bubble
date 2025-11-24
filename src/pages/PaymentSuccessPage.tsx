import { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { CheckCircle, Home, Mail, Sparkles } from 'lucide-react';

export default function PaymentSuccessPage() {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Optional: Verify the session with your backend
    if (sessionId) {
      // You can make an API call here to verify the payment
      setTimeout(() => setLoading(false), 1000);
    } else {
      setLoading(false);
    }
  }, [sessionId]);

  if (loading) {
    return (
      <div className="pt-24 min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-xl text-gray-700">Confirming your payment...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-24 min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      <div className="max-w-3xl mx-auto px-6 py-12">
        <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 text-center">
          <div className="mb-6">
            <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-16 h-16 text-green-600" />
            </div>
            <Sparkles className="w-12 h-12 text-yellow-500 mx-auto animate-pulse" />
          </div>

          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Payment Successful!
          </h1>
          
          <p className="text-xl text-gray-700 mb-6">
            Thank you for choosing our laundry service!
          </p>

          <div className="bg-green-50 rounded-2xl p-6 mb-8">
            <div className="flex items-center justify-center gap-2 mb-3">
              <Mail className="w-5 h-5 text-green-600" />
              <h2 className="text-lg font-semibold text-gray-900">What's Next?</h2>
            </div>
            <ul className="text-left space-y-3 text-gray-700 max-w-md mx-auto">
              <li className="flex items-start gap-2">
                <span className="text-green-600 font-bold">✓</span>
                <span>You'll receive an email confirmation shortly</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 font-bold">✓</span>
                <span>Our team will contact you to schedule pickup</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 font-bold">✓</span>
                <span>Your laundry will be fresh and clean within 24-48 hours</span>
              </li>
            </ul>
          </div>

          {sessionId && (
            <div className="mb-8 p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600">
                <strong>Session ID:</strong> {sessionId.substring(0, 20)}...
              </p>
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/"
              className="inline-flex items-center justify-center gap-2 bg-green-500 text-white px-8 py-4 rounded-full text-lg font-bold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
            >
              <Home className="w-5 h-5" />
              Back to Home
            </Link>
            <Link
              to="/book"
              className="inline-flex items-center justify-center gap-2 bg-blue-500 text-white px-8 py-4 rounded-full text-lg font-bold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
            >
              Book Another Service
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
