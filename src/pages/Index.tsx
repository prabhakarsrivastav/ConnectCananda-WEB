import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { ServiceTiles } from "@/components/ServiceTiles";
import { HowItWorks } from "@/components/HowItWorks";
import { Footer } from "@/components/Footer";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { AIChatWidget } from "@/components/AIChatWidget";
import { Shield, Users, Zap, Award } from "lucide-react";
import { AIAgents } from "@/components/AIAgents";


const Index = () => {
  return (
    <div className="min-h-screen bg-[#0B0E11]">
      <Header />
      <Hero />
      {/*<ServiceTiles />
      <HowItWorks />
      <AIAgents />*/}
      {/* Features Section */}


      <Footer />
      <WhatsAppButton />
      <AIChatWidget />

    </div>
  );
};

export default Index;
