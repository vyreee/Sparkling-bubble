import Header from '../components/Header';
import Footer from '../components/Footer';

export default function PolicyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <Header />

      <main className="pt-24 pb-16">
        <div className="max-w-4xl mx-auto px-6">
          <h1 className="text-4xl font-bold text-gray-900 mb-8">Privacy Policy & Terms of Service</h1>

          <div className="bg-white rounded-2xl shadow-xl p-8 space-y-8">
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Privacy Policy</h2>

              <div className="space-y-4 text-gray-700">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Information We Collect</h3>
                  <p>
                    We collect information you provide directly to us, including your name, email address,
                    phone number, pickup and delivery addresses, and payment information. We also collect
                    information about your laundry preferences and service history.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">How We Use Your Information</h3>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>To provide and maintain our laundry services</li>
                    <li>To process your bookings and payments</li>
                    <li>To communicate with you about your orders</li>
                    <li>To send you service updates and promotional materials (with your consent)</li>
                    <li>To improve our services and customer experience</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Data Security</h3>
                  <p>
                    We implement appropriate technical and organizational measures to protect your personal
                    information against unauthorized access, alteration, disclosure, or destruction. Payment
                    information is processed through secure, encrypted channels.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Information Sharing</h3>
                  <p>
                    We do not sell or rent your personal information to third parties. We may share your
                    information with service providers who assist us in operating our business, such as
                    payment processors and delivery partners, under strict confidentiality agreements.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Your Rights</h3>
                  <p>
                    You have the right to access, correct, or delete your personal information. You may
                    also opt out of marketing communications at any time. Contact us at
                    info@freshncleanlaundry.com to exercise these rights.
                  </p>
                </div>
              </div>
            </section>

            <hr className="border-gray-200" />

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Terms of Service</h2>

              <div className="space-y-4 text-gray-700">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Service Agreement</h3>
                  <p>
                    By using Fresh & Clean Laundry Services, you agree to these terms. We provide wash and
                    fold laundry services with pickup and delivery as described on our website. Service
                    availability may vary by location.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Pricing and Payment</h3>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Prices are charged per pound with bundle discounts available</li>
                    <li>Payment is due at the time of delivery</li>
                    <li>We accept major credit cards and digital payment methods</li>
                    <li>Prices are subject to change with advance notice</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Service Standards</h3>
                  <p>
                    We take great care with your laundry. However, we are not responsible for damage to
                    items that are not suitable for machine washing, items without care labels, or damage
                    caused by pre-existing conditions. We recommend informing us of any special care
                    requirements when booking.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Cancellation Policy</h3>
                  <p>
                    You may cancel or reschedule pickup appointments up to 2 hours before the scheduled
                    time without penalty. Late cancellations may incur a fee. For subscription cancellations,
                    please email us at least 7 days before your next scheduled pickup.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Lost or Damaged Items</h3>
                  <p>
                    In the unlikely event of loss or damage, please notify us within 48 hours of delivery.
                    Liability is limited to 10 times the cleaning charge or the item's actual value (whichever
                    is less), up to a maximum of $100 per item.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Service Area</h3>
                  <p>
                    Services are available in select areas only. Minimum order requirements may apply.
                    Delivery times are estimates and may vary based on demand and weather conditions.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Contact Us</h3>
                  <p>
                    If you have any questions about these policies, please contact us at
                    info@freshncleanlaundry.com or call our customer service line.
                  </p>
                </div>
              </div>
            </section>

            <div className="mt-8 pt-8 border-t border-gray-200">
              <p className="text-sm text-gray-500">
                Last updated: November 24, 2025
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
