import { Button } from "@/components/ui/button";
import { Globe, LogIn, Menu, ShieldCheck, LogOut, User, BookOpen } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import canadaLogo from "@/assets/canada-logo.png";
import { useToast } from "@/hooks/use-toast";
import { CartIcon } from "@/components/CartIcon";

export const Header = () => {
  const [language, setLanguage] = useState("EN");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();

  // Helper function to check if link is active
  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const handleLogout = async () => {
    const isIncompleteProfile = user?.needsProfileUpdate;

    if (isIncompleteProfile) {
      navigate('/profile/edit');
      toast({
        title: "Please complete your profile first",
        description: "You need to set up your profile before logging out"
      });
      return;
    }

    logout();
    toast({
      title: "Logged out successfully"
    });
    navigate("/");
  };

  const toggleLanguage = () => {
    const languages = ["EN", "FR", "HI", "ZH"];
    const currentIndex = languages.indexOf(language);
    const nextIndex = (currentIndex + 1) % languages.length;
    setLanguage(languages[nextIndex]);
  };

  return (
    <>
      {/* Skip to Content Link - Accessibility */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-primary focus:text-primary-foreground focus:rounded-lg focus:font-semibold focus:shadow-lg focus:outline-none focus:ring-4 focus:ring-primary/50"
      >
        Skip to main content
      </a>
      <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/70 shadow-[0_8px_32px_0_rgba(0,0,0,0.12)]">
        <div className="container flex h-20 items-center justify-between px-6">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="relative">
              <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full group-hover:bg-primary/30 transition-all duration-300"></div>
              <img src={canadaLogo} alt="Canada Navigate" className="h-10 w-10 rounded-xl relative shadow-[0_4px_16px_rgba(0,0,0,0.1)] group-hover:scale-110 transition-transform duration-300" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text">ConnectCanada.io</span>
              <span className="text-[10px] text-muted-foreground">Settle smart support services Canada</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-2">
            <Link to="/" className="px-4 py-2 text-sm font-medium rounded-xl transition-all duration-300 hover:bg-white/10 hover:shadow-[0_4px_16px_rgba(0,0,0,0.08)] hover:scale-105">
              Home
            </Link>
            <Link to="/services" className="px-4 py-2 text-sm font-medium rounded-xl transition-all duration-300 hover:bg-white/10 hover:shadow-[0_4px_16px_rgba(0,0,0,0.08)] hover:scale-105">
              Services
            </Link>
            <Link to="/resources" className="px-4 py-2 text-sm font-medium rounded-xl transition-all duration-300 hover:bg-white/10 hover:shadow-[0_4px_16px_rgba(0,0,0,0.08)] hover:scale-105">
              Resources
            </Link>
            <Link to="/shop" className="px-4 py-2 text-sm font-medium rounded-xl transition-all duration-300 hover:bg-white/10 hover:shadow-[0_4px_16px_rgba(0,0,0,0.08)] hover:scale-105">
              Courses/Ebooks
            </Link>
            <Link to="/affiliates" className="px-4 py-2 text-sm font-medium rounded-xl transition-all duration-300 hover:bg-white/10 hover:shadow-[0_4px_16px_rgba(0,0,0,0.08)] hover:scale-105">
              Refer/Earn
            </Link>
            <Link to="/webinars" className="px-4 py-2 text-sm font-medium rounded-xl transition-all duration-300 hover:bg-white/10 hover:shadow-[0_4px_16px_rgba(0,0,0,0.08)] hover:scale-105">
              Webinars
            </Link>
            <Link to="/blog" className="px-4 py-2 text-sm font-medium rounded-xl transition-all duration-300 hover:bg-white/10 hover:shadow-[0_4px_16px_rgba(0,0,0,0.08)] hover:scale-105">
              Blog
            </Link>
          </nav>

          {/* Right Actions */}
          <div className="flex items-center space-x-3">
            <CartIcon />
            <Button variant="ghost" size="sm" onClick={toggleLanguage} className="hidden md:flex items-center space-x-2 px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 transition-all duration-300 hover:shadow-[0_4px_16px_rgba(0,0,0,0.08)] hover:scale-105">
              <Globe className="h-4 w-4" />
              <span className="font-medium">{language}</span>
            </Button>

            {user ? <>
              {isAdmin && <Link to="/admin">
                <Button variant="ghost" size="sm" className="hidden md:flex items-center space-x-2 px-4 py-2 rounded-xl bg-gradient-to-r from-red-600/10 to-red-500/10 border border-red-500/30 text-red-600 hover:from-red-600 hover:to-red-500 hover:text-white hover:border-red-600 transition-all duration-300 hover:shadow-[0_8px_24px_rgba(239,68,68,0.3)] hover:scale-105 font-medium">
                  <ShieldCheck className="h-4 w-4" />
                  <span>Admin Panel</span>
                </Button>
              </Link>}

              <Link to="/profile">
                <Button variant="ghost" size="sm" className="hidden md:flex items-center space-x-2 px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 transition-all duration-300 hover:shadow-[0_4px_16px_rgba(0,0,0,0.08)] hover:scale-105 font-medium">
                  <User className="h-4 w-4" />
                  <span>My Dashboard</span>
                </Button>
              </Link>

              <Button variant="outline" size="sm" onClick={handleLogout} className="hidden md:flex items-center space-x-2 px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 transition-all duration-300 hover:shadow-[0_4px_16px_rgba(0,0,0,0.08)] hover:scale-105 font-medium">
                <LogOut className="h-4 w-4" />
                <span>{user?.needsProfileUpdate ? 'Complete Profile' : 'Logout'}</span>
              </Button>
            </> : <Link to="/auth">
              <Button variant="default" size="sm" className="hidden md:flex items-center space-x-2 px-4 py-2 rounded-xl bg-primary hover:bg-primary/90 transition-all duration-300 hover:shadow-[0_8px_24px_rgba(var(--primary)/0.3)] hover:scale-105 font-medium">
                <LogIn className="h-4 w-4" />
                <span>Login / Sign Up</span>
              </Button>
            </Link>}

            {/* Mobile Menu Button */}
            <Button variant="ghost" size="sm" className="md:hidden p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 transition-all duration-300" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              <Menu className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && <div className="md:hidden border-t border-white/10 bg-background/95 backdrop-blur-xl p-6 space-y-4 shadow-[0_8px_32px_0_rgba(0,0,0,0.12)]">
          <nav className="flex flex-col space-y-2">
            <Link to="/" onClick={() => setMobileMenuOpen(false)} className="px-4 py-3 text-sm font-medium rounded-xl transition-all duration-300 hover:bg-white/10 hover:shadow-[0_4px_16px_rgba(0,0,0,0.08)]">
              Home
            </Link>
            <Link to="/services" onClick={() => setMobileMenuOpen(false)} className="px-4 py-3 text-sm font-medium rounded-xl transition-all duration-300 hover:bg-white/10 hover:shadow-[0_4px_16px_rgba(0,0,0,0.08)]">
              Services
            </Link>
            <Link to="/resources" onClick={() => setMobileMenuOpen(false)} className="px-4 py-3 text-sm font-medium rounded-xl transition-all duration-300 hover:bg-white/10 hover:shadow-[0_4px_16px_rgba(0,0,0,0.08)]">
              Resources
            </Link>
            <Link to="/shop" onClick={() => setMobileMenuOpen(false)} className="px-4 py-3 text-sm font-medium rounded-xl transition-all duration-300 hover:bg-white/10 hover:shadow-[0_4px_16px_rgba(0,0,0,0.08)]">
              Courses
            </Link>
            <Link to="/webinars" onClick={() => setMobileMenuOpen(false)} className="px-4 py-3 text-sm font-medium rounded-xl transition-all duration-300 hover:bg-white/10 hover:shadow-[0_4px_16px_rgba(0,0,0,0.08)]">
              Webinars
            </Link>
            <Link to="/blog" onClick={() => setMobileMenuOpen(false)} className="px-4 py-3 text-sm font-medium rounded-xl transition-all duration-300 hover:bg-white/10 hover:shadow-[0_4px_16px_rgba(0,0,0,0.08)]">
              Blog
            </Link>
          </nav>
          <div className="flex flex-col space-y-2 pt-4 border-t border-white/10">
            <Button variant="ghost" size="sm" onClick={toggleLanguage} className="justify-start px-4 py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10">
              <Globe className="h-4 w-4 mr-2" />
              {language}
            </Button>

            {user ? <>
              {isAdmin && <Link to="/admin" className="w-full" onClick={() => setMobileMenuOpen(false)}>
                <Button variant="ghost" size="sm" className="justify-start w-full px-4 py-3 rounded-xl bg-gradient-to-r from-red-600/10 to-red-500/10 border border-red-500/30 text-red-600">
                  <ShieldCheck className="h-4 w-4 mr-2" />
                  Admin Panel
                </Button>
              </Link>}

              <Link to="/profile" className="w-full" onClick={() => setMobileMenuOpen(false)}>
                <Button variant="ghost" size="sm" className="justify-start w-full px-4 py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10">
                  <User className="h-4 w-4 mr-2" />
                  My Profile
                </Button>
              </Link>

              <Button variant="outline" size="sm" onClick={() => { handleLogout(); setMobileMenuOpen(false); }} className="justify-start w-full px-4 py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10">
                <LogOut className="h-4 w-4 mr-2" />
                {user?.needsProfileUpdate ? 'Complete Profile' : 'Logout'}
              </Button>
            </> : <Link to="/auth" className="w-full" onClick={() => setMobileMenuOpen(false)}>
              <Button variant="default" size="sm" className="justify-start w-full px-4 py-3 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-medium shadow-[0_4px_16px_rgba(0,0,0,0.12)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.18)] transition-all duration-300">
                <LogIn className="h-4 w-4 mr-2" />
                Login / Sign Up
              </Button>
            </Link>}

            <Link to="/services" className="w-full" onClick={() => setMobileMenuOpen(false)}>
              <Button variant="secondary" size="sm" className="w-full px-4 py-3 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-medium shadow-[0_4px_16px_rgba(0,0,0,0.12)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.18)] transition-all duration-300">
                Book Consultation
              </Button>
            </Link>
          </div>
        </div>}
      </header>
    </>
  );
};