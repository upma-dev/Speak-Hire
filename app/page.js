import CTA from "./components/cta";
import Features from "./components/features";
import Footer from "./components/footer";
import Hero from "./components/hero";
import Navbar from "./components/navbar";
import HowItWorks from "./components/works";

export default function Home() {
  return (
    <>
      <Navbar />
      <Hero />
      <Features />
      <HowItWorks />
      <CTA />
      <Footer />
    </>
  );
}
