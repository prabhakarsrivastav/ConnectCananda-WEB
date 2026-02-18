import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Share2, Copy, Check } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export function AffiliateCard() {
  const [affiliate, setAffiliate] = useState<any>(null);
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

      // Check if affiliate record exists
      let { data: affiliateData, error } = await supabase
        .from("affiliates")
        .select("*")
        .eq("user_id", user.id)
        .maybeSingle();

      // Create affiliate record if it doesn't exist
      if (!affiliateData && !error) {
        const referralCode = generateReferralCode();
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
    } catch (error) {
      console.error("Error fetching affiliate data:", error);
    } finally {
      setLoading(false);
    }
  };

  const generateReferralCode = () => {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
  };

  const copyReferralLink = () => {
    if (!affiliate?.referral_code) return;
    
    const referralLink = `${window.location.origin}/ref/${affiliate.referral_code}`;
    navigator.clipboard.writeText(referralLink);
    
    setCopied(true);
    toast({
      title: "Link copied!",
      description: "Share your referral link to earn commissions",
    });
    
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) {
    return (
      <Card className="p-6 bg-gradient-primary border-0 text-primary-foreground animate-pulse">
        <div className="h-24" />
      </Card>
    );
  }

  return (
    <Card className="p-6 bg-gradient-primary border-0 text-primary-foreground">
      <div className="mb-4">
        <Share2 className="h-8 w-8 mb-2" />
        <h3 className="text-lg font-bold mb-1">Earn by Sharing</h3>
        <p className="text-sm opacity-90">
          Get $10 for every referral that books a service
        </p>
      </div>
      
      {affiliate && (
        <>
          <div className="mb-3 grid grid-cols-2 gap-2">
            <div className="p-3 bg-white/10 rounded-lg">
              <p className="text-xs opacity-75 mb-1">Pending</p>
              <p className="text-lg font-bold">
                ${Number(affiliate.pending_payout || 0).toFixed(2)}
              </p>
            </div>
            <div className="p-3 bg-white/10 rounded-lg">
              <p className="text-xs opacity-75 mb-1">Total Earned</p>
              <p className="text-lg font-bold">
                ${Number(affiliate.total_commission || 0).toFixed(2)}
              </p>
            </div>
          </div>
          
          <div className="mb-4 p-3 bg-white/10 rounded-lg">
            <p className="text-xs opacity-75 mb-1">Your Referral Link</p>
            <p className="text-sm font-mono truncate">
              {window.location.origin}/ref/{affiliate.referral_code}
            </p>
          </div>
          
          <Button
            onClick={copyReferralLink}
            className="w-full bg-white text-primary hover:bg-white/90"
            size="sm"
          >
            {copied ? (
              <>
                <Check className="mr-2 h-4 w-4" />
                Copied!
              </>
            ) : (
              <>
                <Copy className="mr-2 h-4 w-4" />
                Copy Link
              </>
            )}
          </Button>
        </>
      )}
    </Card>
  );
}
