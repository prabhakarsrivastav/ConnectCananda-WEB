// COMMENTED OUT - Dashboard not needed as of now
// Will be re-enabled when dashboard functionality is required

/*
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { useSubscription } from "@/hooks/useSubscription";
import { UserDashboardHeader } from "@/components/dashboard/UserDashboardHeader";
import { PremiumStatusBanner } from "@/components/dashboard/PremiumStatusBanner";
import { UserStatsGrid } from "@/components/dashboard/UserStatsGrid";
import { PurchaseHistory } from "@/components/dashboard/PurchaseHistory";
import { ServiceHistory } from "@/components/dashboard/ServiceHistory";
import { AffiliateStats } from "@/components/dashboard/AffiliateStats";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Loader2 } from "lucide-react";

export default function Dashboard() {
  const { isSubscribed, subscription, isLoading } = useSubscription();
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) {
      navigate("/auth");
    }
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 bg-muted/30">
        <div className="container px-4 py-8">
          <UserDashboardHeader 
            userName={user?.firstName || "User"} 
            userInitials={`${user?.firstName?.[0] || "U"}${user?.lastName?.[0] || ""}`} 
          />

          <PremiumStatusBanner 
            isSubscribed={isSubscribed}
            isLoading={isLoading}
            subscriptionPlan={subscription?.plan}
          />

          <UserStatsGrid />

          <AffiliateStats />

          <div className="grid lg:grid-cols-2 gap-6 mt-6">
            <PurchaseHistory />
            <ServiceHistory />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
*/