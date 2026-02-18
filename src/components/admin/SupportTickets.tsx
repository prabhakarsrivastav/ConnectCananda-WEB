import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MessageSquare, AlertCircle } from "lucide-react";

export function SupportTickets() {
  const [tickets, setTickets] = useState<any[]>([]);

  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    const { data } = await supabase
      .from("support_tickets")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(5);

    if (data) setTickets(data);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "destructive";
      case "medium":
        return "secondary";
      default:
        return "outline";
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageSquare className="h-5 w-5" />
          Recent Support Tickets
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {tickets.map((ticket) => (
            <div
              key={ticket.id}
              className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors"
            >
              <div className="flex-1 space-y-1">
                <div className="flex items-center gap-2">
                  {ticket.priority === "high" && (
                    <AlertCircle className="h-4 w-4 text-destructive" />
                  )}
                  <span className="font-medium">{ticket.subject}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={getPriorityColor(ticket.priority)}>
                    {ticket.priority}
                  </Badge>
                  <Badge variant="outline">{ticket.status}</Badge>
                  <span className="text-xs text-muted-foreground">
                    {new Date(ticket.created_at).toLocaleDateString()}
                  </span>
                </div>
              </div>
              <Button size="sm" variant="ghost">
                Resolve
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
