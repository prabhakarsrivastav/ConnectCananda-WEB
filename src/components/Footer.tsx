import { Link } from "react-router-dom";
import { Facebook, Twitter, Linkedin, Instagram } from "lucide-react";
export const Footer = () => {
  return <footer className="border-t border-border bg-card">
    <div className="container px-4 py-12">
      <div className="grid md:grid-cols-4 gap-8 mb-8">
        {/* Brand */}
        <div className="space-y-4">
          <div className="flex flex-col space-y-1">
            <div className="flex items-center space-x-2">
              <div className="h-8 w-8 rounded-lg bg-gradient-primary"></div>
              <span className="text-xl font-bold">ConnectCanada.io</span>
            </div>
            <span className="text-[10px] text-muted-foreground ml-10">Settle smart support services Canada</span>
          </div>
          <p className="text-sm text-muted-foreground">
            Your trusted partner for navigating life in Canada with confidence.
          </p>
          <div className="flex space-x-3">
            <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
              <Facebook className="h-5 w-5" />
            </a>
            <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
              <Twitter className="h-5 w-5" />
            </a>
            <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
              <Linkedin className="h-5 w-5" />
            </a>
            <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
              <Instagram className="h-5 w-5" />
            </a>
          </div>
        </div>

        {/* Services */}
        <div>
          <h4 className="font-semibold text-[16px] mb-4">Services</h4>
          <ul className="space-y-2 text-sm">
            <li><Link to="/services" className="text-muted-foreground hover:text-primary transition-colors">TRAININGS</Link></li>
            <li><Link to="/services" className="text-muted-foreground hover:text-primary transition-colors">WORKSHOPS</Link></li>
            <li><Link to="/services" className="text-muted-foreground hover:text-primary transition-colors">BOOTCAMPS</Link></li>
            <li><Link to="/services" className="text-muted-foreground hover:text-primary transition-colors">ENTREPRENEURSHIP</Link></li>
            <li><Link to="/services" className="text-muted-foreground hover:text-primary transition-colors">CONSULTANCY</Link></li>
            <li><Link to="/services" className="text-muted-foreground hover:text-primary transition-colors">COACHING</Link></li>
            <li><Link to="/services" className="text-muted-foreground hover:text-primary transition-colors">MENTORSHIP</Link></li>
          </ul>
        </div>

        {/* Company */}
        <div>
          <h4 className="font-semibold text-[16px] mb-4">Company</h4>
          <ul className="space-y-2 text-sm">
            <li>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                About Us
              </a>
            </li>
            <li>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                Affiliate Program
              </a>
            </li>
            <li>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                Become a Consultant
              </a>
            </li>
            <li>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                Blog
              </a>
            </li>
          </ul>
        </div>

        {/* Legal */}
        <div>
          <h4 className="font-semibold text-[16px] mb-4">Legal</h4>
          <ul className="space-y-2 text-sm">
            <li>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                Privacy Policy
              </a>
            </li>
            <li>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                Terms of Service
              </a>
            </li>
            <li>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                Cookie Policy
              </a>
            </li>
            <li>
              <a href="#" className="text-muted-foreground  hover:text-primary transition-colors">
                Contact Support
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-border pt-8 text-center text-sm text-muted-foreground">

        <p className="text-[14px]">© 2025 ConnectCanada.io. All rights reserved.</p>
        <p className="text-xs mt-1"> 2025 • Designed & Developed by Kyptronix LLP
        </p>
      </div>
    </div>
  </footer>;
};