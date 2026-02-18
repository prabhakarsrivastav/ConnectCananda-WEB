import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Calendar, Clock } from "lucide-react";

export function UpcomingMeetings() {
  const bookings = [
    {
      service: "Resume Building Session",
      consultant: "Michael Chen",
      date: "Dec 18, 2024",
      status: "confirmed",
    },
    {
      service: "Business Registration Help",
      consultant: "Priya Sharma",
      date: "Dec 22, 2024",
      status: "pending",
    },
  ];

  return (
    <div className="lg:col-span-2 space-y-6">
      {/* Next Meeting */}
      <Card className="p-6 bg-gradient-card border-border/50">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold">Next Meeting</h2>
          <Badge className="bg-primary/10 text-primary border-primary/20">
            Tomorrow
          </Badge>
        </div>

        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
          <Avatar className="h-16 w-16 border-2 border-primary">
            <AvatarFallback className="text-xl font-bold bg-primary text-primary-foreground">
              SJ
            </AvatarFallback>
          </Avatar>

          <div className="flex-1">
            <h3 className="font-bold text-lg mb-1">
              Permanent Residency Consultation
            </h3>
            <p className="text-sm text-muted-foreground mb-2">
              with Sarah Johnson
            </p>
            <div className="flex flex-wrap gap-3 text-sm">
              <div className="flex items-center gap-1 text-muted-foreground">
                <Calendar className="h-4 w-4" />
                Dec 15, 2024
              </div>
              <div className="flex items-center gap-1 text-muted-foreground">
                <Clock className="h-4 w-4" />
                2:00 PM - 3:00 PM
              </div>
            </div>
          </div>

          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              Reschedule
            </Button>
            <Button size="sm">Join Meeting</Button>
          </div>
        </div>
      </Card>

      {/* My Bookings */}
      <Card className="p-6 bg-gradient-card border-border/50">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold">My Bookings</h2>
          <Button variant="ghost" size="sm">
            View All
          </Button>
        </div>

        <div className="space-y-4">
          {bookings.map((booking, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-4 rounded-lg border border-border hover:border-primary/50 transition-colors"
            >
              <div className="flex items-center gap-4">
                <div
                  className={`h-2 w-2 rounded-full ${
                    booking.status === "confirmed"
                      ? "bg-primary"
                      : "bg-secondary"
                  }`}
                />
                <div>
                  <p className="font-semibold">{booking.service}</p>
                  <p className="text-sm text-muted-foreground">
                    {booking.consultant}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium">{booking.date}</p>
                <Badge
                  variant="outline"
                  className="text-xs mt-1 capitalize"
                >
                  {booking.status}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
