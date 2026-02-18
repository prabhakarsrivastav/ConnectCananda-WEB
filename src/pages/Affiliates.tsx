import { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Copy, Share2, Users, DollarSign, TrendingUp, Gift } from "lucide-react";

export default function Affiliates() {
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
      description: "Affiliate code copied to clipboard",
    });
  };

  const shareAffiliate = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Join Canadian Nexus",
          text: `Use my referral code ${affiliateCode} to join Canadian Nexus and get started with your arrival journey!`,
          url: affiliateLink,
        });
      } catch (error) {
        console.error("Error sharing:", error);
      }
    } else {
      copyToClipboard(affiliateLink);
      toast({
        title: "Link Copied!",
        description: "Share this link with your friends",
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow container mx-auto px-4 py-8">
          <div className="text-center">Loading...</div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-50 to-gray-100">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto space-y-8">
          {/* Header */}
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              <Gift className="h-8 w-8 text-primary" />
              Affiliate Program
            </h1>
            <p className="text-gray-600 mt-2">
              Share your affiliate code and earn rewards when others join using your link
            </p>
          </div>

          {/* Affiliate Code Card */}
          <Card className="p-8 bg-gradient-to-r from-primary/10 via-primary/5 to-transparent border-primary/20 shadow-lg">
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-2">Your Affiliate Code</h2>
                <p className="text-sm text-gray-600">
                  Share this code with friends and family to help them get started
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                <div className="flex-grow">
                  <div className="flex items-center gap-3 bg-white p-4 rounded-lg border-2 border-primary/30 shadow-sm">
                    <span className="text-3xl font-bold text-primary tracking-wider">
                      {affiliateCode}
                    </span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button
                    onClick={() => copyToClipboard(affiliateCode)}
                    variant="outline"
                    className="flex items-center gap-2"
                  >
                    <Copy className="h-4 w-4" />
                    Copy Code
                  </Button>
                  <Button
                    onClick={shareAffiliate}
                    className="flex items-center gap-2"
                  >
                    <Share2 className="h-4 w-4" />
                    Share
                  </Button>
                </div>
              </div>

              <div className="bg-white/50 p-4 rounded-lg border border-primary/20">
                <p className="text-sm text-gray-700 font-medium mb-2">Your Referral Link:</p>
                <div className="flex items-center gap-2">
                  <code className="flex-grow text-xs bg-gray-100 px-3 py-2 rounded border border-gray-300 overflow-x-auto">
                    {affiliateLink}
                  </code>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => copyToClipboard(affiliateLink)}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </Card>

          {/* Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="p-6 bg-gradient-to-br from-blue-50 to-white border-blue-200 shadow-md hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-blue-600 mb-1">Total Referrals</p>
                  <p className="text-3xl font-bold text-blue-900">
                    {affiliateStats.totalReferrals}
                  </p>
                </div>
                <div className="p-3 bg-blue-100 rounded-full">
                  <Users className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </Card>

            <Card className="p-6 bg-gradient-to-br from-green-50 to-white border-green-200 shadow-md hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-green-600 mb-1">Total Earnings</p>
                  <p className="text-3xl font-bold text-green-900">
                    ${affiliateStats.totalEarnings.toFixed(2)}
                  </p>
                </div>
                <div className="p-3 bg-green-100 rounded-full">
                  <DollarSign className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </Card>

            <Card className="p-6 bg-gradient-to-br from-amber-50 to-white border-amber-200 shadow-md hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-amber-600 mb-1">Pending Earnings</p>
                  <p className="text-3xl font-bold text-amber-900">
                    ${affiliateStats.pendingEarnings.toFixed(2)}
                  </p>
                </div>
                <div className="p-3 bg-amber-100 rounded-full">
                  <TrendingUp className="h-6 w-6 text-amber-600" />
                </div>
              </div>
            </Card>
          </div>

          {/* Referrals List */}
          {referrals.length > 0 && (
            <Card className="p-6 shadow-md">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Users className="h-5 w-5 text-primary" />
                Your Referrals ({referrals.length})
              </h2>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                        Name
                      </th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                        Email
                      </th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                        Joined Date
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {referrals.map((referral, index) => (
                      <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-3 px-4 text-sm text-gray-900">
                          {referral.firstName} {referral.lastName}
                        </td>
                        <td className="py-3 px-4 text-sm text-gray-600">
                          {referral.email}
                        </td>
                        <td className="py-3 px-4 text-sm text-gray-600">
                          {new Date(referral.createdAt).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          )}

          {/* How it Works */}
          <Card className="p-6 bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200 shadow-md">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">How It Works</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-purple-500 text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-3">
                  1
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Share Your Code</h3>
                <p className="text-sm text-gray-600">
                  Share your unique affiliate code or link with friends and family
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-purple-500 text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-3">
                  2
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">They Sign Up</h3>
                <p className="text-sm text-gray-600">
                  When they register using your code, they become your referral
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-purple-500 text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-3">
                  3
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Earn Rewards</h3>
                <p className="text-sm text-gray-600">
                  Earn commission when your referrals make purchases or book services
                </p>
              </div>
            </div>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
}
