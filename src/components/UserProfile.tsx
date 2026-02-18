import { useEffect, useState } from "react";
import { useNavigate, Outlet, NavLink, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Header } from "@/components/Header";
import { 
  User, 
  Calendar, 
  Sparkles, 
  Users, 
  Headphones,
  LogOut,
  Menu,
  MessageSquare,
  ShoppingBag,
  Video
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import { SearchBar } from "@/components/admin/SearchBar";
import { Notifications } from "@/components/admin/Notifications";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const profileRoutes = [
  { title: "My Profile", url: "/profile", icon: User },
  { title: "Bookings", url: "/profile/bookings", icon: Calendar },
  { title: "Consultations", url: "/profile/consultations", icon: MessageSquare },
  { title: "My Learning", url: "/profile/learning", icon: ShoppingBag },
  { title: "My Webinars", url: "/profile/webinars", icon: Video },
  { title: "Subscriptions", url: "/profile/subscriptions", icon: Sparkles },
  { title: "Affiliates", url: "/profile/affiliates", icon: Users },
  { title: "Support", url: "/profile/support", icon: Headphones },
];

function UserProfileSidebarContent() {
  const { state } = useSidebar();
  const location = useLocation();
  const navigate = useNavigate();
  const { logout, user } = useAuth();
  const collapsed = state === "collapsed";

  const handleLogout = async () => {
    const isIncompleteProfile = user?.needsProfileUpdate;
    
    if (isIncompleteProfile) {
      navigate('/profile/edit');
      return;
    }
    
    logout();
    navigate("/");
  };

  const getNavCls = (isActive: boolean) =>
    isActive 
      ? "bg-[#fcd535]/10 text-[#fcd535] font-medium border-l-4 border-[#fcd535]" 
      : "text-[#848e9c] hover:bg-white/5 hover:text-white";

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

  return (
    <Sidebar 
      collapsible="icon"
      className="border-r-0"
      style={{ 
        backgroundColor: 'hsl(var(--admin-sidebar))',
        color: 'white'
      }}
    >
      <SidebarContent className="bg-transparent">
        <div className="p-6 border-b border-[#2b3139]">
          {!collapsed ? (
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-[#fcd535] flex items-center justify-center text-black font-bold text-xl shadow-[0_0_20px_rgba(252,213,53,0.3)]">
                C
              </div>
              <div>
                <h2 className="text-lg font-bold text-white">CanadaConnect</h2>
                <p className="text-xs text-[#848e9c]">User Profile</p>
              </div>
            </div>
          ) : (
            <div className="h-10 w-10 rounded-lg bg-[#fcd535] flex items-center justify-center text-black font-bold text-xl mx-auto shadow-[0_0_20px_rgba(252,213,53,0.3)]">
              C
            </div>
          )}
        </div>

        <SidebarGroup className="px-3 py-4">
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {profileRoutes.map((route) => {
                const isActive = location.pathname === route.url;
                return (
                  <SidebarMenuItem key={route.title}>
                    <SidebarMenuButton asChild className="h-11">
                      <NavLink 
                        to={route.url} 
                        end 
                        className={`${getNavCls(isActive)} transition-all duration-200`}
                      >
                        <route.icon className={`h-5 w-5 ${collapsed ? 'mx-auto' : 'mr-3'}`} />
                        {!collapsed && <span className="text-sm">{route.title}</span>}
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <div className="mt-auto p-4 border-t border-[#2b3139]">
          <Button
            variant="ghost"
            className={`w-full justify-start text-[#848e9c] hover:bg-white/5 hover:text-white ${collapsed ? 'px-0' : ''}`}
            onClick={handleLogout}
          >
            <LogOut className={`h-5 w-5 ${collapsed ? 'mx-auto' : 'mr-3'}`} />
            {!collapsed && <span>{user?.needsProfileUpdate ? 'Complete Profile' : 'Logout'}</span>}
          </Button>
        </div>
      </SidebarContent>
    </Sidebar>
  );
}

export function UserProfile() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading && !user) {
      navigate("/auth");
    }
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return null;
  }

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

  return (
    <>
      <Header />
      <SidebarProvider>
        <div className="min-h-screen flex w-full bg-[#0B0E11]">
          <UserProfileSidebarContent />
          
          <main className="flex-1 overflow-auto">
            <div 
              className="border-b sticky top-0 z-10 shadow-lg bg-[#181a20] border-[#2b3139]"
            >
              <div className="flex items-center justify-between px-6 py-4">
                <div className="flex items-center gap-4">
                  <SidebarTrigger className="text-[#848e9c] hover:text-white">
                    <Menu className="h-5 w-5" />
                  </SidebarTrigger>
                  <div>
                    <h1 className="text-xl font-semibold text-white">
                      {profileRoutes.find(r => r.url === location.pathname)?.title || 'My Profile'}
                    </h1>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <SearchBar />
                  <Notifications />
                  <Avatar className="h-9 w-9 cursor-pointer hover:ring-2 ring-[#fcd535] transition-all">
                    <AvatarFallback className="bg-[#fcd535] text-black font-semibold">
                      {getUserInitials()}
                    </AvatarFallback>
                  </Avatar>
                </div>
              </div>
            </div>

            <div className="p-8">
              <Outlet />
            </div>
          </main>
        </div>
      </SidebarProvider>
    </>
  );
}
