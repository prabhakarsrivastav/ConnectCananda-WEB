import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export function useSubscription() {
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [subscription, setSubscription] = useState<any>(null);
  const { toast } = useToast();

  useEffect(() => {
    checkSubscription();
  }, []);

  const checkSubscription = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        setIsSubscribed(false);
        setIsLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from("ai_subscriptions")
        .select("*")
        .eq("user_id", user.id)
        .eq("status", "active")
        .single();

      if (error && error.code !== "PGRST116") {
        console.error("Error checking subscription:", error);
        throw error;
      }

      setIsSubscribed(!!data);
      setSubscription(data);
    } catch (error) {
      console.error("Failed to check subscription:", error);
      toast({
        title: "Error",
        description: "Failed to check subscription status",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const refreshSubscription = () => {
    checkSubscription();
  };

  return { isSubscribed, isLoading, subscription, refreshSubscription };
}
