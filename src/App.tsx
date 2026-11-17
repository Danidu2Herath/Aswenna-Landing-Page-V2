import BackgroundTexture from "./components/BackgroundTexture";
import Header from "./components/Header";
import Hero from "./components/Hero";
import ProblemsSection from "./components/ProblemsSection";
import SoilSection from "./components/SoilSection";
import JourneySection from "./components/JourneySection";
import SeasonsSection from "./components/SeasonsSection";
import FieldSection from "./components/FieldSection";
import EngineSection from "./components/EngineSection";
import ComparisonSection from "./components/ComparisonSection";
import FeaturesSection from "./components/FeaturesSection";
import FieldFirstSection from "./components/FieldFirstSection";
import HardwareSection from "./components/HardwareSection";
import InstallSection from "./components/InstallSection";
import PricingSection from "./components/PricingSection";
import PlatformSection from "./components/PlatformSection";
import FaqSection from "./components/FaqSection";
import CtaSection from "./components/CtaSection";
import ContactSection from "./components/ContactSection";
import Footer from "./components/Footer";
import ToTop from "./components/ToTop";

export default function App() {
  return (
    <>
      <BackgroundTexture />
      <Header />
      <main id="main">
        <Hero />
        <ProblemsSection />
        <SoilSection />
        <JourneySection />
        <SeasonsSection />
        <FieldSection />
        <EngineSection />
        <ComparisonSection />
        <FeaturesSection />
        <FieldFirstSection />
        <HardwareSection />
        <InstallSection />
        <PricingSection />
        <PlatformSection />
        <FaqSection />
        <CtaSection />
        <ContactSection />
      </main>
      <Footer />
      <ToTop />
    </>
  );
}
