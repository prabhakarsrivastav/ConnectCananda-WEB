import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trophy, DollarSign } from "lucide-react";

export function AffiliateLeaderboard() {
  const [affiliates, setAffiliates] = useState<any[]>([]);

  useEffect(() => {
    fetchAffiliates();
  }, []);

  const fetchAffiliates = async () => {
    const { data } = await supabase
      .from("affiliates")
      .select("*")
      .order("total_commission", { ascending: false })
      .limit(10);

    if (data) setAffiliates(data);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Trophy className="h-5 w-5 text-yellow-500" />
          Top Affiliates
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {affiliates.map((affiliate, index) => (
            <div
              key={affiliate.id}
              className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground font-bold">
                  {index + 1}
                </div>
                <div>
                  <div className="font-medium">{affiliate.referral_code}</div>
                  <div className="text-sm text-muted-foreground">
                    Pending: ${Number(affiliate.pending_payout).toFixed(2)}
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="flex items-center gap-1 font-semibold">
                  <DollarSign className="h-4 w-4" />
                  {Number(affiliate.total_commission).toFixed(2)}
                </div>
                {index === 0 && <Badge className="mt-1">Top Earner</Badge>}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
