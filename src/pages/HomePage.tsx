import Hero from '../components/Hero';
import Services from '../components/Services';
import BirthdaySurprise from '../components/BirthdaySurprise';
import HowItWorks from '../components/HowItWorks';
import Pricing from '../components/Pricing';
import Bundles from '../components/Bundles';
import FAQ from '../components/FAQ';
import Footer from '../components/Footer';

export default function HomePage() {
  return (
    <div className="pt-24">
      <Hero />
      <Services />
      <BirthdaySurprise />
      <section id="pricing">
        <Pricing />
      </section>
      <section id="bundles">
        <Bundles />
      </section>
      <section id="how-it-works">
        <HowItWorks />
      </section>
      <section id="faq">
        <FAQ />
      </section>
      <Footer />
    </div>
  );
}
