import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Bot, DollarSign, Users } from "lucide-react";

export function AISubscriptionPanel() {
  const [subscriptions, setSubscriptions] = useState<any[]>([]);
  const [stats, setStats] = useState({ activeUsers: 0, mrr: 0 });

  useEffect(() => {
    fetchSubscriptions();
  }, []);

  const fetchSubscriptions = async () => {
    const { data } = await supabase
      .from("ai_subscriptions")
      .select("*")
      .eq("status", "active")
      .order("created_at", { ascending: false });

    if (data) {
      setSubscriptions(data);
      const totalMRR = data.reduce((sum, sub) => sum + Number(sub.mrr), 0);
      setStats({ activeUsers: data.length, mrr: totalMRR });
    }
  };

  return (
    <Card className="bg-[#181a20] border border-[#2b3139] shadow-[0_4px_12px_rgba(0,0,0,0.3)]">
      <CardHeader className="pb-3 border-b border-[#2b3139]">
        <CardTitle className="text-base font-semibold text-white flex items-center gap-2">
          <Bot className="h-5 w-5 text-[#fcd535]" />
          AI Subscriptions
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-4 space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div className="p-3 rounded-lg bg-[#0b0e11] border border-[#2b3139]">
            <div className="flex items-center gap-2 text-xs text-[#3dccc7] mb-2">
              <Users className="h-3 w-3" />
              Active Users
            </div>
            <div className="text-2xl font-bold text-white">{stats.activeUsers}</div>
          </div>
          <div className="p-3 rounded-lg bg-[#0b0e11] border border-[#2b3139]">
            <div className="flex items-center gap-2 text-xs text-[#02c076] mb-2">
              <DollarSign className="h-3 w-3" />
              Monthly MRR
            </div>
            <div className="text-2xl font-bold text-white">${stats.mrr.toLocaleString()}</div>
          </div>
        </div>

        {subscriptions.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-[#848e9c]">Recent Subscriptions</h4>
            {subscriptions.slice(0, 3).map((sub) => (
              <div key={sub.id} className="flex items-center justify-between p-3 border border-[#2b3139] rounded-lg bg-[#0b0e11] hover:border-[#fcd535]/40 transition-all">
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="bg-[#fcd535]/10 text-[#fcd535] border-[#fcd535]/20">{sub.plan}</Badge>
                  <span className="text-sm text-[#848e9c]">${sub.mrr}/mo</span>
                </div>
                <Badge className="bg-[#02c076] hover:bg-[#02c076]/90 text-white border-0">{sub.status}</Badge>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
