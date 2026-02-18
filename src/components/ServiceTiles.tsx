import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import {
  Home,
  Briefcase,
  Rocket,
  Scale,
  Shield,
  GraduationCap,
  DollarSign,
  FileText,
  Heart,
  Users,
  Truck,
  Smartphone,
  ArrowRight
} from "lucide-react";

// API Base URL
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Icon mapping - maps icon names from database to Lucide components
const iconMap: Record<string, any> = {
  Home,
  Briefcase,
  Rocket,
  Scale,
  Shield,
  GraduationCap,
  DollarSign,
  FileText,
  Heart,
  Users,
  Truck,
  Smartphone,
};

// Interface for Service
interface Service {
  _id: string;
  title: string;
  description: string;
  icon?: string;
  category?: string;
  price?: string;
}

export const ServiceTiles = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch services from backend
  useEffect(() => {
    const fetchServices = async () => {
      try {
        console.log('🔄 Fetching services from backend...');
        setLoading(true);
        setError(null);

        const response = await fetch(`${API_BASE_URL}/services`);
        console.log(`📥 Response Status: ${response.status}`);

        if (!response.ok) {
          throw new Error('Failed to fetch services');
        }

        const data = await response.json();
        console.log(`✅ Successfully fetched ${data.length} services from backend!`);

        setServices(data);
      } catch (err) {
        console.error('❌ Error fetching services:', err);
        setError(err instanceof Error ? err.message : 'Failed to load services');
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  // Loading state
  if (loading) {
    return (
      <section className="container px-4 py-20 bg-gradient-to-b from-[#0B0E11] to-[#181A20]">
        <div className="flex items-center justify-center">
          <div className="text-white">Loading services...</div>
        </div>
      </section>
    );
  }

  // Error state
  if (error) {
    return (
      <section className="container px-4 py-20 bg-gradient-to-b from-[#0B0E11] to-[#181A20]">
        <div className="text-center">
          <div className="text-red-500 mb-4">Failed to load services</div>
          <div className="text-[#848e9c]">{error}</div>
        </div>
      </section>
    );
  }

  return (
    <section className="container px-4 py-20 bg-gradient-to-b from-[#0B0E11] to-[#181A20]">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">
          Complete Service Ecosystem
        </h2>
        <p className="text-lg text-[#848e9c] max-w-2xl mx-auto">
          Everything you need for a successful Canadian journey - from arrival to integration
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 max-w-7xl mx-auto">
        {services.map((service) => {
          // Get icon component from icon name, fallback to Briefcase
          const Icon = service.icon ? iconMap[service.icon] || Briefcase : Briefcase;

          return (
            <Card
              key={service._id}
              className="group p-6 bg-[#181A20] border-[#2b3139] hover:border-[#F0B90B]/50 transition-all duration-300 hover:shadow-[0_0_30px_rgba(252,213,53,0.15)] cursor-pointer"
            >
              <Link to={`/services/${service._id}`} className="space-y-4 block">
                <div className="p-3 rounded-xl bg-[#F0B90B]/10 w-fit">
                  <Icon className="h-6 w-6 text-[#F0B90B]" />
                </div>

                <div>
                  <h3 className="text-lg font-bold mb-2 text-white group-hover:text-[#F0B90B] transition-colors">
                    {service.title}
                  </h3>
                  <p className="text-[#848e9c] text-sm line-clamp-3">
                    {service.description}
                  </p>
                </div>

                <Button
                  variant="ghost"
                  className="w-full justify-between text-[#848e9c] group-hover:text-[#F0B90B] p-0 hover:bg-transparent"
                  size="sm"
                >
                  Learn More
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </Card>
          );
        })}
      </div>

      <div className="text-center mt-12">
        <Link to="/services">
          <Button size="lg" className="bg-[#F0B90B] text-black hover:bg-[#F0B90B]/90 px-8">
            View All Services
          </Button>
        </Link>
      </div>
    </section>
  );
};
