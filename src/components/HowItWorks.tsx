import { Calendar, Package, Sparkles, Truck } from 'lucide-react';

export default function HowItWorks() {
  const steps = [
    {
      icon: Calendar,
      title: 'Schedule',
      description: 'Book your pickup time online or via our app.',
    },
    {
      icon: Package,
      title: 'Fill & Seal',
      description: 'Load your clothes into your Fresh N Clean bag and secure the draw cord.',
    },
    {
      icon: Sparkles,
      title: 'Clean',
      description: 'We wash, dry, and fold your items with the utmost care.',
    },
    {
      icon: Truck,
      title: 'Delivery',
      description: 'We return your fresh, clean laundry, ready to put away!',
    },
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            How It Works
          </h2>
          <p className="text-xl text-gray-700">
            Four simple steps to laundry freedom
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <div
                key={index}
                className="relative bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-8 text-center hover:shadow-xl transition-all duration-300 hover:-translate-y-2"
              >
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full w-10 h-10 flex items-center justify-center font-bold text-lg shadow-lg">
                  {index + 1}
                </div>
                <div className="bg-white rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6 mt-4 shadow-md">
                  <Icon className="w-10 h-10 text-blue-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">{step.title}</h3>
                <p className="text-gray-700 leading-relaxed">{step.description}</p>
              </div>
            );
          })}
        </div>

        <div className="bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl p-8 text-white text-center max-w-3xl mx-auto shadow-2xl">
          <h3 className="text-2xl font-bold mb-4">Standard Turnaround Time</h3>
          <p className="text-5xl font-bold mb-4">48 Hours</p>
          <p className="text-lg">
            Need it sooner? Select the Rush Service (24-Hour) add-on when placing your order!
          </p>
        </div>
      </div>
    </section>
  );
}
