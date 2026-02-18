import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Users, TrendingUp, DollarSign, Share2, Copy, Check } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export function AffiliateStats() {
  const [affiliate, setAffiliate] = useState<any>(null);
  const [referralCount, setReferralCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchAffiliateData();
  }, []);

  const fetchAffiliateData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Get or create affiliate record
      let { data: affiliateData, error } = await supabase
        .from("affiliates")
        .select("*")
        .eq("user_id", user.id)
        .maybeSingle();

      if (!affiliateData && !error) {
        const referralCode = Math.random().toString(36).substring(2, 8).toUpperCase();
        const { data: newAffiliate } = await supabase
          .from("affiliates")
          .insert({
            user_id: user.id,
            referral_code: referralCode,
            total_commission: 0,
            pending_payout: 0,
          })
          .select()
          .single();
        
        affiliateData = newAffiliate;
      }

      setAffiliate(affiliateData);

      // Count successful referrals (would need a referrals tracking table in production)
      // For now, we estimate based on commission ($10 per referral)
      if (affiliateData) {
        const estimatedReferrals = Math.floor(Number(affiliateData.total_commission) / 10);
        setReferralCount(estimatedReferrals);
      }
    } catch (error) {
      console.error("Error fetching affiliate data:", error);
    } finally {
      setLoading(false);
    }
  };

  const copyReferralLink = () => {
    if (!affiliate?.referral_code) return;
    
    const referralLink = `${window.location.origin}/ref/${affiliate.referral_code}`;
    navigator.clipboard.writeText(referralLink);
    
    setCopied(true);
    toast({
      title: "Referral link copied!",
      description: "Share it with friends to earn commission",
    });
    
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) {
    return (
      <Card className="p-6 bg-card border-border">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-muted rounded w-1/3" />
          <div className="grid grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-24 bg-muted rounded" />
            ))}
          </div>
        </div>
      </Card>
    );
  }

  if (!affiliate) {
    return null;
  }

  const stats = [
    {
      icon: Users,
      label: "Total Referrals",
      value: referralCount.toString(),
      color: "text-blue-500",
      bgColor: "bg-blue-500/10",
    },
    {
      icon: DollarSign,
      label: "Pending Payout",
      value: `$${Number(affiliate.pending_payout || 0).toFixed(2)}`,
      color: "text-yellow-500",
      bgColor: "bg-yellow-500/10",
    },
    {
      icon: TrendingUp,
      label: "Total Earned",
      value: `$${Number(affiliate.total_commission || 0).toFixed(2)}`,
      color: "text-green-500",
      bgColor: "bg-green-500/10",
    },
  ];

  return (
    <Card className="p-6 bg-card border-border">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-foreground">Affiliate Dashboard</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Earn $10 for every successful referral
          </p>
        </div>
        <Badge variant="outline" className="bg-primary/10 text-primary border-primary/30">
          Active
        </Badge>
      </div>

      <div className="grid md:grid-cols-3 gap-4 mb-6">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="p-4 rounded-lg border border-border bg-gradient-card"
          >
            <div className={`inline-flex p-2 rounded-lg ${stat.bgColor} mb-3`}>
              <stat.icon className={`h-5 w-5 ${stat.color}`} />
            </div>
            <p className="text-2xl font-bold text-foreground mb-1">{stat.value}</p>
            <p className="text-xs text-muted-foreground">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="p-4 rounded-lg border border-border bg-gradient-card">
        <div className="flex items-start gap-3 mb-4">
          <div className="p-2 rounded-lg bg-primary/10">
            <Share2 className="h-5 w-5 text-primary" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-foreground mb-1">Your Referral Link</h3>
            <p className="text-sm text-muted-foreground mb-2">
              Share this link to earn commission
            </p>
            <div className="p-3 rounded-lg bg-muted/50 mb-3">
              <p className="text-sm font-mono truncate text-foreground">
                {window.location.origin}/ref/{affiliate.referral_code}
              </p>
            </div>
            <Button
              onClick={copyReferralLink}
              size="sm"
              className="w-full"
            >
              {copied ? (
                <>
                  <Check className="mr-2 h-4 w-4" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="mr-2 h-4 w-4" />
                  Copy Referral Link
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
}
