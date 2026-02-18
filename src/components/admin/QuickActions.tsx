import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Plus, 
  UserPlus, 
  FileText, 
  Mail, 
  Calendar,
  Sparkles
} from "lucide-react";
import { useNavigate } from "react-router-dom";

export function QuickActions() {
  const navigate = useNavigate();

  const actions = [
    {
      title: "View Bookings",
      icon: Calendar,
      color: "text-[#3dccc7]",
      bgColor: "bg-[#3dccc7]/10",
      onClick: () => navigate("/admin/bookings"),
    },
    {
      title: "Subscriptions",
      icon: Sparkles,
      color: "text-[#fcd535]",
      bgColor: "bg-[#fcd535]/10",
      onClick: () => navigate("/admin/subscriptions"),
    },
    {
      title: "Support",
      icon: Mail,
      color: "text-[#02c076]",
      bgColor: "bg-[#02c076]/10",
      onClick: () => navigate("/admin/support"),
    },
  ];

  return (
    <Card className="p-5 bg-[#181a20] border border-[#2b3139] shadow-[0_4px_12px_rgba(0,0,0,0.3)]">
      <h3 className="text-base font-semibold text-white mb-4">
        Quick Actions
      </h3>
      <div className="grid grid-cols-1 gap-3">
        {actions.map((action, index) => (
          <button
            key={index}
            onClick={action.onClick}
            className="h-20 flex flex-col items-center justify-center gap-2 rounded-lg bg-[#0b0e11] border border-[#2b3139] hover:border-[#fcd535]/40 transition-all duration-300 group"
          >
            <div className={`p-2 rounded-lg ${action.bgColor} group-hover:scale-110 transition-transform`}>
              <action.icon className={`h-5 w-5 ${action.color}`} />
            </div>
            <span className="text-xs font-medium text-[#848e9c] group-hover:text-white transition-colors">
              {action.title}
            </span>
          </button>
        ))}
      </div>
    </Card>
  );
}
