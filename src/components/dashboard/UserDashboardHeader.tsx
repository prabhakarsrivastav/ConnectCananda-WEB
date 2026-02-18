import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Bell, Settings } from "lucide-react";

interface UserDashboardHeaderProps {
  userName?: string;
  userInitials?: string;
}

export function UserDashboardHeader({ 
  userName = "John", 
  userInitials = "JD" 
}: UserDashboardHeaderProps) {
  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Welcome back, {userName}</h1>
        <p className="text-muted-foreground">
          Here's what's happening with your services today
        </p>
      </div>
      <div className="flex items-center gap-3 mt-4 md:mt-0">
        <Button variant="outline" size="icon">
          <Bell className="h-5 w-5" />
        </Button>
        <Button variant="outline" size="icon">
          <Settings className="h-5 w-5" />
        </Button>
        <Avatar className="h-10 w-10 border-2 border-primary">
          <AvatarFallback className="bg-primary text-primary-foreground">
            {userInitials}
          </AvatarFallback>
        </Avatar>
      </div>
    </div>
  );
}
