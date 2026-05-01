import CTA from "./components/cta";
import WatchDemo from "./components/WatchDemo";
import Features from "./components/features";
import Footer from "./components/footer";
import Hero from "./components/hero";
import InterviewExperienceSection from "./components/interviewExp";

import Navbar from "./components/navbar";
import HowItWorks from "./components/works";

export default function Home() {
  return (
    <>
      <Navbar />
      <Hero />
      <Features />
      <HowItWorks />
      <InterviewExperienceSection />
      <WatchDemo />
      <CTA />
      <Footer />
    </>
  );
}
