import { RevenueStats } from "@/components/admin/RevenueStats";
import { BookingPipeline } from "@/components/admin/BookingPipeline";
import { AISubscriptionPanel } from "@/components/admin/AISubscriptionPanel";
import { AdminStatsCards } from "@/components/admin/AdminStatsCards";
import { QuickActions } from "@/components/admin/QuickActions";
import { Card } from "@/components/ui/card";

export default function AdminDashboard() {
  return (
    <div className="space-y-6 bg-[#0B0E11]">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#1A1D20] to-[#0B0E11] p-6 rounded-lg border border-[#2b3139]">
        <h1 className="text-2xl font-bold text-white mb-1">Dashboard Overview</h1>
        <p className="text-[#848e9c]">Monitor your business metrics and performance</p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <AdminStatsCards />
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <BookingPipeline />
          <AISubscriptionPanel />
        </div>
        
        <div className="space-y-6">
          <QuickActions />
          <RevenueStats />
        </div>
      </div>
    </div>
  );
}
