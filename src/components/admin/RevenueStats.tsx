import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, TrendingUp, Users, Package } from "lucide-react";

export function RevenueStats() {
  const [stats, setStats] = useState({
    totalRevenue: 0,
    serviceRevenue: 0,
    affiliateRevenue: 0,
    activeUsers: 0,
  });

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    const [bookingsRes, affiliatesRes, usersRes] = await Promise.all([
      supabase.from("bookings").select("amount, service_id"),
      supabase.from("affiliates").select("total_commission"),
      supabase.from("user_roles").select("user_id"),
    ]);

    const totalRevenue = bookingsRes.data?.reduce((sum, b) => sum + (Number(b.amount) || 0), 0) || 0;
    const affiliateRevenue = affiliatesRes.data?.reduce((sum, a) => sum + (Number(a.total_commission) || 0), 0) || 0;

    setStats({
      totalRevenue,
      serviceRevenue: totalRevenue - affiliateRevenue,
      affiliateRevenue,
      activeUsers: usersRes.data?.length || 0,
    });
  };

  const statCards = [
    {
      title: "Total Revenue",
      value: `$${stats.totalRevenue.toLocaleString()}`,
      icon: DollarSign,
      trend: "+12.5%",
    },
    {
      title: "Service Revenue",
      value: `$${stats.serviceRevenue.toLocaleString()}`,
      icon: Package,
      trend: "+8.2%",
    },
    {
      title: "Affiliate Revenue",
      value: `$${stats.affiliateRevenue.toLocaleString()}`,
      icon: TrendingUp,
      trend: "+23.1%",
    },
    {
      title: "Active Users",
      value: stats.activeUsers,
      icon: Users,
      trend: "+5.2%",
    },
  ];

  return (
    <Card className="bg-[#181a20] border border-[#2b3139] shadow-[0_4px_12px_rgba(0,0,0,0.3)]">
      <CardHeader className="pb-3 border-b border-[#2b3139]">
        <CardTitle className="text-base font-semibold text-white flex items-center gap-2">
          <DollarSign className="h-5 w-5 text-[#fcd535]" />
          Revenue Overview
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-4 space-y-3">
        {statCards.map((stat) => (
          <div key={stat.title} className="flex items-center justify-between p-3 rounded-lg bg-[#0b0e11] border border-[#2b3139] hover:border-[#fcd535]/40 transition-all">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-[#fcd535]/10">
                <stat.icon className="h-4 w-4 text-[#fcd535]" />
              </div>
              <div>
                <p className="text-xs text-[#848e9c]">{stat.title}</p>
                <p className="text-lg font-bold text-white">{stat.value}</p>
              </div>
            </div>
            <span className="text-xs text-[#02c076] font-medium">{stat.trend}</span>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
