import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BookOpen, GraduationCap, Calendar, ExternalLink } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Link } from "react-router-dom";

interface Purchase {
  id: string;
  item_type: string;
  item_id: string;
  amount: number;
  created_at: string;
  item_details?: {
    title: string;
    description: string;
  };
}

export function PurchaseHistory() {
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPurchases();
  }, []);

  const fetchPurchases = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: purchaseData } = await supabase
        .from("purchases")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(10);

      if (!purchaseData) return;

      // Fetch details for each purchase
      const purchasesWithDetails = await Promise.all(
        purchaseData.map(async (purchase) => {
          let itemDetails = null;
          
          if (purchase.item_type === "course") {
            const { data: course } = await supabase
              .from("courses")
              .select("title, description")
              .eq("id", purchase.item_id)
              .single();
            itemDetails = course;
          } else if (purchase.item_type === "ebook") {
            const { data: ebook } = await supabase
              .from("ebooks")
              .select("title, description")
              .eq("id", purchase.item_id)
              .single();
            itemDetails = ebook;
          }

          return {
            ...purchase,
            item_details: itemDetails,
          };
        })
      );

      setPurchases(purchasesWithDetails);
    } catch (error) {
      console.error("Error fetching purchases:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Card className="p-6 bg-card border-border">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-muted rounded w-1/3" />
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-20 bg-muted rounded" />
            ))}
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6 bg-card border-border">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-foreground">Purchase History</h2>
        <Badge variant="outline">{purchases.length} items</Badge>
      </div>

      {purchases.length === 0 ? (
        <div className="text-center py-12">
          <GraduationCap className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
          <p className="text-muted-foreground">No purchases yet</p>
          <p className="text-sm text-muted-foreground mt-1">
            Start learning by browsing our courses and ebooks
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {purchases.map((purchase) => (
            <div
              key={purchase.id}
              className="p-4 rounded-lg border border-border hover:border-primary/50 transition-all duration-300 hover:shadow-md"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3 flex-1">
                  <div className="p-2 rounded-lg bg-primary/10">
                    {purchase.item_type === "course" ? (
                      <GraduationCap className="h-5 w-5 text-primary" />
                    ) : (
                      <BookOpen className="h-5 w-5 text-primary" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-foreground truncate">
                        {purchase.item_details?.title || "Untitled"}
                      </h3>
                      <Badge variant="secondary" className="text-xs shrink-0">
                        {purchase.item_type}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-1 mb-2">
                      {purchase.item_details?.description || "No description"}
                    </p>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {new Date(purchase.created_at).toLocaleDateString()}
                      </div>
                      <div className="font-semibold text-primary">
                        ${Number(purchase.amount).toFixed(2)}
                      </div>
                    </div>
                  </div>
                </div>
                <Link
                  to={
                    purchase.item_type === "course"
                      ? `/courses/${purchase.item_id}`
                      : `/ebooks`
                  }
                  className="shrink-0"
                >
                  <ExternalLink className="h-4 w-4 text-muted-foreground hover:text-primary transition-colors" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}
