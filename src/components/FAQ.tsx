import { HelpCircle } from 'lucide-react';

export default function FAQ() {
  const faqs = [
    {
      question: 'What is the typical turnaround time?',
      answer: 'Our standard service turnaround is 48 hours. If you need it sooner, select the Rush Service (24-Hour) add-on when placing your order!',
    },
    {
      question: 'Do I need to supply my own bag?',
      answer: 'On your first order, you can use any suitable bag. After your first service, your cleaned laundry will be returned to you in our durable Fresh N Clean bag, which you will use for all future pickups.',
    },
    {
      question: 'How much laundry fits in a standard bag?',
      answer: 'Our bag (20" x 14" x 15") holds roughly 25-30 pounds of laundry, which is equivalent to about 2-3 standard loads. This is ideal for most weekly laundry needs.',
    },
    {
      question: 'What detergents do you use?',
      answer: 'We use high-quality, name-brand hypoallergenic detergents. You can upgrade to our premium Free and Clear Fragrance Free Eco Detergent (plant-based) by selecting the corresponding add-on.',
    },
    {
      question: 'How do I cancel my weekly subscription?',
      answer: 'To cancel your recurring weekly subscription, email us at info@freshncleanlaundry.com with your subscription details. We\'ll process your cancellation request promptly. Note: Individual scheduled pickups cannot be cancelled once booked.',
    },
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="max-w-4xl mx-auto px-6">
        <div className="text-center mb-12">
          <HelpCircle className="w-16 h-16 text-blue-600 mx-auto mb-4" />
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-xl text-gray-700">
            Everything you need to know about our service
          </p>
        </div>

        <div className="space-y-6">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300"
            >
              <h3 className="text-xl font-bold text-gray-900 mb-3">{faq.question}</h3>
              <p className="text-gray-700 leading-relaxed">{faq.answer}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
