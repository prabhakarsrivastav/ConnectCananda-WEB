import { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { ServiceTiles } from "@/components/ServiceTiles";
import { HowItWorks } from "@/components/HowItWorks";
import { Footer } from "@/components/Footer";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { AIChatWidget } from "@/components/AIChatWidget";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Shield, Users, Zap, Award } from "lucide-react";
import { AIAgents } from "@/components/AIAgents";

const Index = () => {
  const [showDisclaimer, setShowDisclaimer] = useState(false);

  useEffect(() => {
    const hasSeenDisclaimer = localStorage.getItem("hasSeenDisclaimer");
    if (!hasSeenDisclaimer) {
      setShowDisclaimer(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem("hasSeenDisclaimer", "true");
    setShowDisclaimer(false);
  };

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

      <Dialog open={showDisclaimer} onOpenChange={setShowDisclaimer}>
        <DialogContent className="sm:max-w-md bg-[#181A20] border-[#F0B90B]/20">
          <DialogHeader>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-lg bg-[#F0B90B]/20">
                <AlertTriangle className="h-6 w-6 text-[#F0B90B]" />
              </div>
              <DialogTitle className="text-xl text-white">
                Disclaimer & Positioning
              </DialogTitle>
            </div>
            <DialogDescription className="text-left space-y-3 pt-2 text-white/70">
              <p>
                We are <strong className="text-[#F0B90B]">not</strong> a certified arrival or legal agent.
              </p>
              <p>
                Our platform connects newcomers with the top verified
                consultants in each city — arrival, legal, career, business,
                financial, and healthcare.
              </p>
              <p>
                We focus on curating trusted experts so you can confidently
                choose the right service provider.
              </p>
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-2 mt-4">
            <Button onClick={handleAccept} className="w-full sm:w-auto bg-[#F0B90B] hover:bg-[#F3BA2F] text-[#0B0E11]">
              I Understand
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Index;
