import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  DollarSign, 
  Users, 
  ShoppingCart, 
  TrendingUp,
  Calendar,
  BookOpen
} from "lucide-react";

export function AdminStatsCards() {
  const stats = [
    {
      title: "Total Revenue",
      value: "$45,231",
      change: "+20.1%",
      icon: DollarSign,
      color: "text-[#fcd535]",
      bgColor: "bg-[#fcd535]/10",
      borderColor: "border-[#fcd535]/20",
    },
    {
      title: "Active Users",
      value: "2,350",
      change: "+12.5%",
      icon: Users,
      color: "text-[#02c076]",
      bgColor: "bg-[#02c076]/10",
      borderColor: "border-[#02c076]/20",
    },
    {
      title: "Bookings",
      value: "432",
      change: "+8.2%",
      icon: Calendar,
      color: "text-[#3dccc7]",
      bgColor: "bg-[#3dccc7]/10",
      borderColor: "border-[#3dccc7]/20",
    },
    {
      title: "AI Subscriptions",
      value: "127",
      change: "+32.4%",
      icon: TrendingUp,
      color: "text-[#fcd535]",
      bgColor: "bg-[#fcd535]/10",
      borderColor: "border-[#fcd535]/20",
    },
  ];

  return (
    <>
      {stats.map((stat, index) => (
        <Card key={index} className={`p-5 bg-[#181a20] border ${stat.borderColor} hover:border-[#fcd535]/40 transition-all duration-300 shadow-[0_4px_12px_rgba(0,0,0,0.3)]`}>
          <div className="flex items-center justify-between mb-3">
            <div className={`p-2.5 rounded-lg ${stat.bgColor}`}>
              <stat.icon className={`h-5 w-5 ${stat.color}`} />
            </div>
            <span className="text-xs text-[#02c076] font-medium">
              {stat.change}
            </span>
          </div>
          <div>
            <p className="text-sm text-[#848e9c] mb-1">
              {stat.title}
            </p>
            <p className="text-2xl font-bold text-white">
              {stat.value}
            </p>
          </div>
        </Card>
      ))}
    </>
  );
}
