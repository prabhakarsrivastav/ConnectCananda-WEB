import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { User, Mail, Phone, Calendar, Award, TrendingUp, MessageSquare } from "lucide-react";
import UserConsultations from "@/components/user/UserConsultations";

export default function UserDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"overview" | "consultations">("overview");

  // Get user initials for avatar
  const getUserInitials = () => {
    if (user?.firstName && user?.lastName) {
      return `${user.firstName[0]}${user.lastName[0]}`.toUpperCase();
    }
    if (user?.firstName) {
      return user.firstName.substring(0, 2).toUpperCase();
    }
    return "U";
  };

  // Mock data for user stats
  const userStats = {
    activeBookings: 3,
    completedBookings: 12,
    subscriptionStatus: "Premium",
    memberSince: "January 2024",
    rewardPoints: 450,
    referrals: 5
  };

  return (
    <div className="space-y-6 bg-[#0B0E11]">
      {/* Profile Header */}
      <div className="bg-gradient-to-r from-[#1A1D20] to-[#0B0E11] p-6 rounded-lg border border-[#2b3139]">
        <div className="flex items-center gap-6">
          <Avatar className="h-24 w-24 cursor-pointer hover:ring-4 ring-[#fcd535] transition-all">
            <AvatarFallback className="bg-[#fcd535] text-black font-bold text-3xl">
              {getUserInitials()}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-white mb-2">
              {user?.firstName} {user?.lastName}
            </h1>
            <div className="flex flex-wrap gap-4 text-[#848e9c]">
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                <span>{user?.email}</span>
              </div>
              {user?.phone && (
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  <span>{user.phone}</span>
                </div>
              )}
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span>Member since {userStats.memberSince}</span>
              </div>
            </div>
          </div>
          <Button
            className="bg-[#fcd535] hover:bg-[#fcd535]/90 text-black font-semibold cursor-pointer"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              navigate('/profile/edit');
            }}
            type="button"
          >
            Edit Profile
          </Button>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-2 border-b border-[#2b3139]">
        <button
          onClick={() => setActiveTab("overview")}
          className={`px-6 py-3 font-semibold transition-colors relative ${activeTab === "overview"
              ? "text-[#fcd535]"
              : "text-[#848e9c] hover:text-white"
            }`}
        >
          <div className="flex items-center gap-2">
            <User className="h-4 w-4" />
            Overview
          </div>
          {activeTab === "overview" && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#fcd535]" />
          )}
        </button>
        <button
          onClick={() => setActiveTab("consultations")}
          className={`px-6 py-3 font-semibold transition-colors relative ${activeTab === "consultations"
              ? "text-[#fcd535]"
              : "text-[#848e9c] hover:text-white"
            }`}
        >
          <div className="flex items-center gap-2">
            <MessageSquare className="h-4 w-4" />
            Consultations
          </div>
          {activeTab === "consultations" && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#fcd535]" />
          )}
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === "consultations" ? (
        <UserConsultations />
      ) : (
        <>
          {/* Stats Grid */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card className="bg-[#181a20] border-[#2b3139] p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[#848e9c] text-sm mb-1">Active Bookings</p>
                  <p className="text-3xl font-bold text-white">{userStats.activeBookings}</p>
                </div>
                <div className="h-12 w-12 rounded-lg bg-blue-500/10 flex items-center justify-center">
                  <Calendar className="h-6 w-6 text-blue-500" />
                </div>
              </div>
              <div className="mt-4">
                <span className="text-green-500 text-sm">View all bookings →</span>
              </div>
            </Card>

            <Card className="bg-[#181a20] border-[#2b3139] p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[#848e9c] text-sm mb-1">Completed Sessions</p>
                  <p className="text-3xl font-bold text-white">{userStats.completedBookings}</p>
                </div>
                <div className="h-12 w-12 rounded-lg bg-green-500/10 flex items-center justify-center">
                  <Award className="h-6 w-6 text-green-500" />
                </div>
              </div>
              <div className="mt-4">
                <span className="text-[#848e9c] text-sm">Total sessions completed</span>
              </div>
            </Card>

            <Card className="bg-[#181a20] border-[#2b3139] p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[#848e9c] text-sm mb-1">Reward Points</p>
                  <p className="text-3xl font-bold text-white">{userStats.rewardPoints}</p>
                </div>
                <div className="h-12 w-12 rounded-lg bg-[#fcd535]/10 flex items-center justify-center">
                  <TrendingUp className="h-6 w-6 text-[#fcd535]" />
                </div>
              </div>
              <div className="mt-4">
                <span className="text-[#fcd535] text-sm">Redeem rewards →</span>
              </div>
            </Card>
          </div>

          {/* Subscription Status */}
          <Card className="bg-gradient-to-r from-[#fcd535]/10 to-[#fcd535]/5 border-[#fcd535]/30 p-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-white mb-2">
                  {userStats.subscriptionStatus} Subscription
                </h2>
                <p className="text-[#848e9c]">
                  Enjoy unlimited access to all premium features and services
                </p>
              </div>
              <Button variant="outline" className="border-[#fcd535] text-[#fcd535] hover:bg-[#fcd535] hover:text-black">
                Manage Plan
              </Button>
            </div>
          </Card>

          {/* Recent Activity */}
          <Card className="bg-[#181a20] border-[#2b3139] p-6">
            <h2 className="text-xl font-bold text-white mb-4">Recent Activity</h2>
            <div className="space-y-4">
              <div className="flex items-center gap-4 p-4 bg-[#0B0E11] rounded-lg">
                <div className="h-10 w-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
                  <Calendar className="h-5 w-5 text-blue-500" />
                </div>
                <div className="flex-1">
                  <p className="text-white font-medium">Arrival Consultation Booked</p>
                  <p className="text-[#848e9c] text-sm">Scheduled for Jan 15, 2024</p>
                </div>
                <span className="text-[#848e9c] text-sm">2 days ago</span>
              </div>

              <div className="flex items-center gap-4 p-4 bg-[#0B0E11] rounded-lg">
                <div className="h-10 w-10 rounded-lg bg-green-500/10 flex items-center justify-center">
                  <Award className="h-5 w-5 text-green-500" />
                </div>
                <div className="flex-1">
                  <p className="text-white font-medium">Completed Settlement Services Session</p>
                  <p className="text-[#848e9c] text-sm">Earned 50 reward points</p>
                </div>
                <span className="text-[#848e9c] text-sm">5 days ago</span>
              </div>

              <div className="flex items-center gap-4 p-4 bg-[#0B0E11] rounded-lg">
                <div className="h-10 w-10 rounded-lg bg-[#fcd535]/10 flex items-center justify-center">
                  <User className="h-5 w-5 text-[#fcd535]" />
                </div>
                <div className="flex-1">
                  <p className="text-white font-medium">Referred a Friend</p>
                  <p className="text-[#848e9c] text-sm">Earned 100 reward points</p>
                </div>
                <span className="text-[#848e9c] text-sm">1 week ago</span>
              </div>
            </div>
          </Card>

          {/* Quick Actions */}
          <Card className="bg-[#181a20] border-[#2b3139] p-6">
            <h2 className="text-xl font-bold text-white mb-4">Quick Actions</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Button variant="outline" className="h-auto py-4 flex flex-col gap-2 border-[#2b3139] hover:border-[#fcd535] hover:bg-[#fcd535]/10">
                <Calendar className="h-6 w-6" />
                <span>Book Service</span>
              </Button>
              <Button variant="outline" className="h-auto py-4 flex flex-col gap-2 border-[#2b3139] hover:border-[#fcd535] hover:bg-[#fcd535]/10">
                <Award className="h-6 w-6" />
                <span>View Rewards</span>
              </Button>
              <Button variant="outline" className="h-auto py-4 flex flex-col gap-2 border-[#2b3139] hover:border-[#fcd535] hover:bg-[#fcd535]/10">
                <TrendingUp className="h-6 w-6" />
                <span>Upgrade Plan</span>
              </Button>
              <Button variant="outline" className="h-auto py-4 flex flex-col gap-2 border-[#2b3139] hover:border-[#fcd535] hover:bg-[#fcd535]/10">
                <User className="h-6 w-6" />
                <span>Refer Friend</span>
              </Button>
            </div>
          </Card>
        </>
      )}
    </div>
  );
}
