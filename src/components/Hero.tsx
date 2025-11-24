export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 overflow-hidden">
      <div className="absolute inset-0 bg-black opacity-5"></div>

      <div className="relative z-10 max-w-5xl mx-auto px-6 py-20 text-center">
        <div className="flex items-center justify-center mb-8">
          <img
            src="/image copy copy copy.png"
            alt="Fresh N Clean Laundry Services"
            className="h-64 w-auto mx-auto"
            style={{ imageRendering: 'crisp-edges' }}
          />
        </div>

        <h2 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
          Effortless Laundry, Fresh N Clean.
        </h2>

        <p className="text-xl md:text-2xl text-white mb-8 max-w-3xl mx-auto leading-relaxed">
          Stop Doing Laundry. Start Living. Your Clothes, Fresh, Clean and Delivered.
        </p>

        <p className="text-lg md:text-xl text-white/95 max-w-4xl mx-auto leading-relaxed mb-12">
          Say goodbye to laundry day! Fresh N Clean Laundry Services offers premium wash and fold
          with convenient pickup and delivery right to your door. We treat your clothes with care,
          guaranteeing a fresh, clean, and perfectly folded result every time.
        </p>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white to-transparent"></div>
    </section>
  );
}
