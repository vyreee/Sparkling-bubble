import { XCircle, AlertCircle } from 'lucide-react';

export default function CancelSubscription() {
  return (
    <section className="py-16 bg-gray-100">
      <div className="max-w-4xl mx-auto px-6">
        <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12">
          <div className="text-center mb-8">
            <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
              Need to Cancel Your Subscription?
            </h2>
            <p className="text-lg text-gray-600">
              We're sorry to see you go. Manage your subscription easily through our billing portal.
            </p>
          </div>

          <div className="bg-yellow-50 border-2 border-yellow-300 rounded-xl p-6 mb-8">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-6 h-6 text-yellow-600 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-bold text-gray-900 mb-2">Before You Cancel:</h3>
                <ul className="text-sm text-gray-700 space-y-1">
                  <li>• Your subscription will remain active until the end of your current billing period</li>
                  <li>• You can pause your subscription instead of canceling</li>
                  <li>• Contact us if you're having any issues - we're here to help!</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="text-center space-y-6">
            <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-6">
              <h3 className="font-bold text-gray-900 mb-3 text-lg">To Cancel Your Subscription:</h3>
              <p className="text-gray-700 mb-4">
                Please send us an email with your subscription details and we'll process your cancellation request promptly.
              </p>
              <a
                href="mailto:info@freshncleanlaundry.com?subject=Cancel%20Subscription%20Request"
                className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-8 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                Email Us to Cancel
              </a>
            </div>
            
            <p className="text-sm text-gray-600">
              <strong>Email:</strong> <a href="mailto:info@freshncleanlaundry.com" className="text-blue-600 hover:underline">info@freshncleanlaundry.com</a>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
