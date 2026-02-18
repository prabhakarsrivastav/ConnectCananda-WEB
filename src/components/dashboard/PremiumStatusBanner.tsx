import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Crown, Sparkles } from "lucide-react";

interface PremiumStatusBannerProps {
  isSubscribed: boolean;
  isLoading: boolean;
  subscriptionPlan?: string;
}

export function PremiumStatusBanner({ 
  isSubscribed, 
  isLoading,
  subscriptionPlan 
}: PremiumStatusBannerProps) {
  if (isLoading) return null;

  if (!isSubscribed) {
    return (
      <Card className="p-6 bg-gradient-to-r from-amber-500/10 to-orange-500/10 border-amber-500/20 mb-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-amber-500/20 rounded-xl">
              <Crown className="h-8 w-8 text-amber-500" />
            </div>
            <div>
              <h3 className="font-bold text-lg mb-1 flex items-center gap-2">
                Unlock Premium AI Agents
                <Sparkles className="h-5 w-5 text-amber-500" />
              </h3>
              <p className="text-sm text-muted-foreground">
                Get unlimited access to all AI-powered services for $69.99/month
              </p>
            </div>
          </div>
          <Button className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white whitespace-nowrap">
            <Crown className="h-4 w-4 mr-2" />
            Upgrade Now
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6 bg-gradient-to-r from-green-500/10 to-emerald-500/10 border-green-500/20 mb-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-green-500/20 rounded-xl">
            <Crown className="h-8 w-8 text-green-500" />
          </div>
          <div>
            <h3 className="font-bold text-lg mb-1">Premium Active</h3>
            <p className="text-sm text-muted-foreground">
              Enjoying unlimited AI access • {subscriptionPlan || 'Premium Plan'}
            </p>
          </div>
        </div>
        <Badge variant="outline" className="border-green-500/50 text-green-600">
          Active
        </Badge>
      </div>
    </Card>
  );
}
