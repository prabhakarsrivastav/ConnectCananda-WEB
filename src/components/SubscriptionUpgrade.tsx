import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Check, Sparkles, Zap, Bot, Crown } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface SubscriptionUpgradeProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SubscriptionUpgrade({ open, onOpenChange }: SubscriptionUpgradeProps) {
  const navigate = useNavigate();

  const features = [
    "Unlimited AI chat conversations",
    "Access to all 4 specialized AI agents",
    "24/7 instant AI responses",
    "Priority support",
    "Advanced arrival insights",
    "Personalized recommendations",
    "Career guidance & resume review",
    "Business startup consultation",
  ];

  const handleUpgrade = () => {
    navigate("/dashboard");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <div className="flex items-center justify-center mb-4">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-amber-500 to-orange-500 blur-xl opacity-50 animate-pulse" />
              <Crown className="h-16 w-16 text-amber-500 relative" />
            </div>
          </div>
          <DialogTitle className="text-2xl text-center">
            Unlock Premium AI Agents
          </DialogTitle>
          <DialogDescription className="text-center text-base">
            Get unlimited access to all AI-powered services
          </DialogDescription>
        </DialogHeader>

        <Card className="p-6 bg-gradient-to-br from-amber-500/10 to-orange-500/10 border-amber-500/20">
          <div className="text-center mb-6">
            <div className="flex items-baseline justify-center gap-2 mb-2">
              <span className="text-4xl font-bold">$69.99</span>
              <span className="text-muted-foreground">/month</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Cancel anytime • No hidden fees
            </p>
          </div>

          <div className="space-y-3 mb-6">
            {features.map((feature, index) => (
              <div key={index} className="flex items-start gap-3">
                <div className="mt-0.5">
                  <Check className="h-5 w-5 text-primary shrink-0" />
                </div>
                <span className="text-sm">{feature}</span>
              </div>
            ))}
          </div>

          <Button
            onClick={handleUpgrade}
            className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-semibold h-12 shadow-lg hover:shadow-xl transition-all"
            size="lg"
          >
            <Sparkles className="h-5 w-5 mr-2" />
            Upgrade to Premium
          </Button>
        </Card>

        <p className="text-xs text-center text-muted-foreground">
          By subscribing, you agree to our terms of service and privacy policy
        </p>
      </DialogContent>
    </Dialog>
  );
}
