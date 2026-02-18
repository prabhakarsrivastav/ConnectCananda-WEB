import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, DollarSign, Share2, TrendingUp } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export function UserStatsGrid() {
  const [stats, setStats] = useState({
    bookings: 0,
    totalSpent: 0,
    earnings: 0,
    referrals: 0,
  });

  useEffect(() => {
    fetchUserStats();
  }, []);

  const fetchUserStats = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Fetch bookings
      const { count: bookingsCount } = await supabase
        .from("bookings")
        .select("*", { count: "exact", head: true })
        .eq("user_id", user.id)
        .eq("status", "confirmed");

      // Fetch total spent
      const { data: purchases } = await supabase
        .from("purchases")
        .select("amount")
        .eq("user_id", user.id);

      const totalSpent = purchases?.reduce((sum, p) => sum + Number(p.amount), 0) || 0;

      // Fetch affiliate data
      const { data: affiliate } = await supabase
        .from("affiliates")
        .select("total_commission")
        .eq("user_id", user.id)
        .maybeSingle();

      setStats({
        bookings: bookingsCount || 0,
        totalSpent,
        earnings: Number(affiliate?.total_commission || 0),
        referrals: 0, // This would need a separate referrals tracking table
      });
    } catch (error) {
      console.error("Error fetching user stats:", error);
    }
  };

  const displayStats = [
    {
      icon: Calendar,
      label: "Upcoming Bookings",
      value: stats.bookings.toString(),
      badge: "This Month",
      bgColor: "bg-primary/10",
      iconColor: "text-primary",
    },
    {
      icon: DollarSign,
      label: "Total Spent",
      value: `$${stats.totalSpent.toFixed(2)}`,
      badge: "Total",
      bgColor: "bg-secondary/10",
      iconColor: "text-secondary",
    },
    {
      icon: Share2,
      label: "Affiliate Earnings",
      value: `$${stats.earnings.toFixed(2)}`,
      badge: "Earnings",
      bgColor: "bg-primary/10",
      iconColor: "text-primary",
    },
    {
      icon: TrendingUp,
      label: "Referrals",
      value: stats.referrals.toString(),
      badge: "Active",
      bgColor: "bg-secondary/10",
      iconColor: "text-secondary",
    },
  ];

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {displayStats.map((stat, index) => (
        <Card key={index} className="p-6 bg-gradient-card border-border/50">
          <div className="flex items-center justify-between mb-4">
            <div className={`p-3 rounded-xl ${stat.bgColor}`}>
              <stat.icon className={`h-6 w-6 ${stat.iconColor}`} />
            </div>
            <Badge variant="outline" className="text-xs">
              {stat.badge}
            </Badge>
          </div>
          <div className="space-y-1">
            <p className="text-2xl font-bold">{stat.value}</p>
            <p className="text-sm text-muted-foreground">{stat.label}</p>
          </div>
        </Card>
      ))}
    </div>
  );
}
