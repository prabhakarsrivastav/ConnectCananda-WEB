import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Copy, Share2, Users, DollarSign, TrendingUp, Gift } from "lucide-react";

export default function AdminAffiliates() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [affiliateCode, setAffiliateCode] = useState("");
  const [affiliateStats, setAffiliateStats] = useState({
    totalReferrals: 0,
    totalEarnings: 0,
    pendingEarnings: 0,
  });
  const [referrals, setReferrals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const affiliateLink = `${window.location.origin}/auth?ref=${affiliateCode}`;

  useEffect(() => {
    if (user) {
      fetchAffiliateData();
    }
  }, [user]);

  const fetchAffiliateData = async () => {
    try {
      const token = localStorage.getItem("authToken");
      const response = await fetch(
        `${import.meta.env.VITE_API_URL || "http://localhost:5000/api"}/auth/affiliate-info`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) throw new Error("Failed to fetch affiliate data");

      const data = await response.json();
      setAffiliateCode(data.affiliateCode);
      setAffiliateStats(data.affiliateStats);
      setReferrals(data.referrals || []);
    } catch (error) {
      console.error("Error fetching affiliate data:", error);
      toast({
        title: "Error",
        description: "Failed to load affiliate data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied!",
      description: "Copied to clipboard",
    });
  };

  const shareAffiliate = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Join Canadian Nexus",
          text: `Use my referral code ${affiliateCode} to join Canadian Nexus!`,
          url: affiliateLink,
        });
      } catch (error) {
        console.error("Error sharing:", error);
      }
    } else {
      copyToClipboard(affiliateLink);
      toast({
        title: "Link Copied!",
        description: "Share this link with others",
      });
    }
  };

  if (loading) {
    return (
      <div className="space-y-8">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900">Affiliate Program</h2>
          <p className="text-gray-600 mt-1">Loading your affiliate information...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 antialiased">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-foreground flex items-center gap-3">
          <Gift className="h-7 w-7 text-primary" />
          Affiliate Program
        </h2>
        <p className="text-muted-foreground mt-2">
          Share your affiliate code and earn rewards when others join using your link
        </p>
      </div>

      {/* Affiliate Code Card */}
      <Card className="p-6 bg-card shadow-md border border-border">
        <div className="space-y-5">
          <div>
            <h3 className="text-lg font-semibold text-foreground mb-1">Your Affiliate Code</h3>
            <p className="text-sm text-muted-foreground">
              Share this code with friends and family to help them get started
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
            <div className="flex-grow">
              <div className="flex items-center gap-3 bg-primary/10 p-5 rounded-xl border-2 border-primary/20 shadow-sm">
                <span className="text-3xl font-bold text-primary tracking-widest">
                  {affiliateCode}
                </span>
              </div>
            </div>

            <div className="flex gap-2">
              <Button
                onClick={() => copyToClipboard(affiliateCode)}
                variant="outline"
                size="default"
                className="flex items-center gap-2"
              >
                <Copy className="h-4 w-4" />
                Copy Code
              </Button>
              <Button
                onClick={shareAffiliate}
                size="default"
                className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground"
              >
                <Share2 className="h-4 w-4" />
                Share
              </Button>
            </div>
          </div>

          {/* <div className="bg-muted/30 p-4 rounded-lg border border-border shadow-sm">
            <p className="text-sm text-foreground font-medium mb-2">Your Referral Link:</p>
            <div className="flex items-center gap-2">
              <code className="flex-grow text-xs bg-muted text-foreground px-3 py-2.5 rounded-lg border border-border overflow-x-auto font-mono">
                {affiliateLink}
              </code>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => copyToClipboard(affiliateLink)}
                className="shrink-0"
              >
                <Copy className="h-4 w-4" />
              </Button>
            </div>
          </div> */}
        </div>
      </Card>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 border-blue-200 shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm font-semibold text-blue-700 dark:text-blue-300 uppercase tracking-wide antialiased">Total Referrals</p>
                <p className="text-3xl font-bold text-blue-900 dark:text-blue-100 mt-1 antialiased">
                  {affiliateStats.totalReferrals}
                </p>
              </div>
              <Users className="h-8 w-8 text-blue-500 dark:text-blue-400 opacity-70" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-emerald-950 dark:to-emerald-900 border-emerald-200 shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm font-semibold text-emerald-700 dark:text-emerald-300 uppercase tracking-wide antialiased">Total Earnings</p>
                <p className="text-3xl font-bold text-emerald-900 dark:text-emerald-100 mt-1 antialiased">
                  ${affiliateStats.totalEarnings.toFixed(2)}
                </p>
              </div>
              <DollarSign className="h-8 w-8 text-emerald-500 dark:text-emerald-400 opacity-70" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-950 dark:to-orange-900 border-orange-200 shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm font-semibold text-orange-700 dark:text-orange-300 uppercase tracking-wide antialiased">Pending Earnings</p>
                <p className="text-3xl font-bold text-orange-900 dark:text-orange-100 mt-1 antialiased">
                  ${affiliateStats.pendingEarnings.toFixed(2)}
                </p>
              </div>
              <TrendingUp className="h-8 w-8 text-orange-500 dark:text-orange-400 opacity-70" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Referrals List */}
      {/* {referrals.length > 0 && (
        <Card className="p-6 shadow-sm bg-card border border-border">
          <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
            <Users className="h-5 w-5 text-primary" />
            Your Referrals ({referrals.length})
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 text-sm font-semibold text-muted-foreground">
                    Name
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-muted-foreground">
                    Email
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-muted-foreground">
                    Joined Date
                  </th>
                </tr>
              </thead>
              <tbody>
                {referrals.map((referral, index) => (
                  <tr key={index} className="border-b border-border hover:bg-muted/30">
                    <td className="py-3 px-4 text-sm text-foreground">
                      {referral.firstName} {referral.lastName}
                    </td>
                    <td className="py-3 px-4 text-sm text-muted-foreground">
                      {referral.email}
                    </td>
                    <td className="py-3 px-4 text-sm text-muted-foreground">
                      {new Date(referral.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )} */}

      {/* How it Works */}
      <Card className="p-6 bg-card shadow-sm border border-border">
        <h3 className="text-lg font-semibold text-foreground mb-6">How It Works</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-2xl flex items-center justify-center text-xl font-bold mx-auto mb-4 shadow-lg">
              1
            </div>
            <h4 className="font-semibold text-foreground mb-2">Share Your Code</h4>
            <p className="text-sm text-muted-foreground">
              Share your unique affiliate code or link with friends and family
            </p>
          </div>
          <div className="text-center">
            <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-2xl flex items-center justify-center text-xl font-bold mx-auto mb-4 shadow-lg">
              2
            </div>
            <h4 className="font-semibold text-foreground mb-2">They Sign Up</h4>
            <p className="text-sm text-muted-foreground">
              When they register using your code, they become your referral
            </p>
          </div>
          <div className="text-center">
            <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-2xl flex items-center justify-center text-xl font-bold mx-auto mb-4 shadow-lg">
              3
            </div>
            <h4 className="font-semibold text-foreground mb-2">Earn Rewards</h4>
            <p className="text-sm text-muted-foreground">
              Earn commission when your referrals make purchases or book services
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}
