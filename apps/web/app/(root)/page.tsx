import Faq from "../../components/faq";
import HeroSection from "../../components/hero";
import MokcupSection from "../../components/mockup";

export default function Home() {
  return (
      <div className="max-w-screen-xl mx-auto">
        <HeroSection />
        <MokcupSection />
        <Faq />
      </div>
  );
}