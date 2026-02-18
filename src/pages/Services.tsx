import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Search, Filter, Star, Share2, Copy, Check } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { useServices } from "@/hooks/useServices";

export default function Services() {
  const navigate = useNavigate();
  const [shareDialogOpen, setShareDialogOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<any>(null);
  const [copied, setCopied] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"rating" | "price-low" | "price-high" | "popular">("popular");
  const [showFilters, setShowFilters] = useState(false);

  // Fetch services from backend
  const { data: servicesData, isLoading, error } = useServices();

  // Extract categories dynamically
  const categories = useMemo(() => {
    if (!servicesData) return ["All"];
    const categorySet = new Set(servicesData.map(service => service.category));
    return ["All", ...Array.from(categorySet)];
  }, [servicesData]);

  // Filter + search + sort
  const filteredServices = useMemo(() => {
    if (!servicesData) return [];
    return servicesData
      .filter(service => {
        const matchesCategory = selectedCategory === "All" || service.category === selectedCategory;
        const matchesSearch =
          searchQuery.trim() === "" ||
          service.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          service.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          service.consultant.toLowerCase().includes(searchQuery.toLowerCase()) ||
          service.category.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
      })
      .sort((a, b) => {
        switch (sortBy) {
          case "rating":
            return b.rating - a.rating;
          case "price-low": {
            const priceA = parseFloat(a.price.replace(/[^0-9.]/g, "")) || 0;
            const priceB = parseFloat(b.price.replace(/[^0-9.]/g, "")) || 0;
            return priceA - priceB;
          }
          case "price-high": {
            const priceA2 = parseFloat(a.price.replace(/[^0-9.]/g, "")) || 0;
            const priceB2 = parseFloat(b.price.replace(/[^0-9.]/g, "")) || 0;
            return priceB2 - priceA2;
          }
          case "popular":
          default:
            return b.reviews - a.reviews;
        }
      });
  }, [servicesData, selectedCategory, searchQuery, sortBy]);

  const handleClearFilters = () => {
    setSearchQuery("");
    setSelectedCategory("All");
    setSortBy("popular");
  };

  const handleShareClick = (service: any) => {
    setSelectedService(service);
    setShareDialogOpen(true);
  };

  const generateReferralLink = (serviceId: string) => {
    return `${window.location.origin}/services/${serviceId}?ref=user123`;
  };

  const handleCopyLink = async () => {
    if (!selectedService) return;
    const link = generateReferralLink(selectedService.serviceId);
    await navigator.clipboard.writeText(link);
    setCopied(true);
    toast({
      title: "Link copied!",
      description: "Your referral link has been copied to clipboard.",
    });
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#0B0E11]">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-[#0B0E11] via-[#181A20] to-[#0B0E11] border-b border-[#F0B90B]/10">
          <div className="container px-4 py-12">
            <h1 className="text-3xl md:text-4xl font-bold mb-4 text-center text-white">
              Complete Service Ecosystem
            </h1>
            <p className="text-white/60 text-center mb-8 max-w-2xl mx-auto">
              16+ services covering every aspect of your Canadian journey - from arrival to full integration
            </p>

            {/* Search Bar */}
            <div className="max-w-3xl mx-auto">
              <div className="flex flex-col md:flex-row gap-3">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-white/40" />
                  <Input
                    placeholder="Search services, consultants, categories..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 bg-[#181A20] border-[#F0B90B]/10 text-white placeholder:text-white/40 focus:border-[#F0B90B]/30"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery("")}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/40 hover:text-white transition-colors"
                    >
                      ✕
                    </button>
                  )}
                </div>
                <Button
                  variant="outline"
                  className="md:w-auto border-[#F0B90B]/30 text-[#F0B90B] hover:bg-[#F0B90B]/10"
                  onClick={() => setShowFilters(!showFilters)}
                >
                  <Filter className="h-4 w-4 mr-2" />
                  {showFilters ? "Hide Filters" : "Show Filters"}
                </Button>
              </div>

              {/* Filters */}
              {showFilters && (
                <div className="mt-4 p-4 bg-[#181A20] border border-[#F0B90B]/10 rounded-lg space-y-4">
                  <div className="flex flex-col sm:flex-row gap-4">
                    <div className="flex-1">
                      <label className="text-sm text-white/60 mb-2 block">Sort By</label>
                      <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value as any)}
                        className="w-full px-3 py-2 bg-[#0B0E11] border border-[#F0B90B]/10 text-white rounded-md focus:border-[#F0B90B]/30 focus:outline-none"
                      >
                        <option value="popular">Most Popular</option>
                        <option value="rating">Highest Rated</option>
                        <option value="price-low">Price: Low to High</option>
                        <option value="price-high">Price: High to Low</option>
                      </select>
                    </div>

                    {(searchQuery || selectedCategory !== "All" || sortBy !== "popular") && (
                      <div className="flex items-end">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={handleClearFilters}
                          className="border-[#F0B90B]/30 text-[#F0B90B] hover:bg-[#F0B90B]/10"
                        >
                          Clear All Filters
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Quick Filters */}
              <div className="flex flex-wrap gap-2 mt-4">
                {categories.map((category) => (
                  <Badge
                    key={category}
                    variant="outline"
                    className={`cursor-pointer transition-all ${
                      selectedCategory === category
                        ? "bg-[#F0B90B] text-[#0B0E11] border-[#F0B90B] hover:bg-[#F3BA2F]"
                        : "bg-[#181A20] text-[#F0B90B] border-[#F0B90B]/20 hover:bg-[#F0B90B]/10 hover:border-[#F0B90B]/30"
                    }`}
                    onClick={() => setSelectedCategory(category)}
                  >
                    {category}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Services Grid */}
        <section className="container px-4 py-12">
          {/* States: Loading, Error, Data */}
          {isLoading && <p className="text-white text-center">Loading services...</p>}

          {error && (
            <div className="text-center py-16 text-white">
              Failed to load services. <Button onClick={() => window.location.reload()}>Retry</Button>
            </div>
          )}

          {!isLoading && !error && (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredServices.map((service) => (
                <Card
                  key={service._id}
                  className="p-6 bg-gradient-to-br from-[#181A20] to-[#0B0E11] border-[#F0B90B]/10 hover:border-[#F0B90B]/30 transition-all duration-300 group flex flex-col"
                >
                  <div className="flex items-start justify-between gap-2">
                    <Badge variant="outline" className="text-xs bg-[#181A20] text-white/70 border-[#F0B90B]/20">
                      {service.category}
                    </Badge>
                    <Badge className="text-xs bg-[#F0B90B]/10 text-[#F0B90B] border-[#F0B90B]/20">Professional</Badge>
                  </div>

                  <h3 className="font-bold text-lg mb-2 text-white group-hover:text-[#F0B90B] transition-colors">
                    {service.title}
                  </h3>
                  <p className="text-sm text-white/60 mb-3">{service.description}</p>
                  <p className="text-xs text-white/40">by {service.consultant}</p>

                  <div className="flex items-center justify-between pt-3 border-t border-[#F0B90B]/10">
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-[#F0B90B] text-[#F0B90B]" />
                      <span className="font-semibold text-sm text-white">{service.rating}</span>
                      <span className="text-xs text-white/40">({service.reviews})</span>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-[#F0B90B]">
                        {service.price.startsWith('$') ? service.price : `$${service.price}`}
                      </div>
                      {"duration" in service && (
                        <div className="text-xs text-white/40">{service.duration}</div>
                      )}
                    </div>
                  </div>

                  <div className="flex gap-2 mt-3">
                    <Button
                      className="flex-1 bg-[#F0B90B] hover:bg-[#F3BA2F] text-[#0B0E11] font-semibold"
                      size="sm"
                      onClick={() => navigate(`/services/${service._id}`)}
                    >
                      Book Now
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleShareClick(service)}
                      className="border-[#F0B90B]/30 text-[#F0B90B] hover:bg-[#F0B90B]/10"
                    >
                      <Share2 className="h-4 w-4" />
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          )}
           {filteredServices.length > 0 && filteredServices.length >= 12 && (
            <div className="text-center mt-12">
              <Button variant="outline" size="lg" className="border-[#F0B90B]/30 text-[#F0B90B] hover:bg-[#F0B90B]/10">
                Load More Services
              </Button>
            </div>
          )}
        </section>
      </main>

      <Footer />

      {/* Share Dialog */}
      <Dialog open={shareDialogOpen} onOpenChange={setShareDialogOpen}>
        <DialogContent className="sm:max-w-md bg-[#181A20] border-[#F0B90B]/20">
          <DialogHeader>
            <DialogTitle className="text-white">Share & Earn Commission</DialogTitle>
            <DialogDescription className="text-white/60">
              Share this service and earn commission on every booking through your link!
            </DialogDescription>
          </DialogHeader>

          {selectedService && (
            <div className="space-y-4">
              <div className="p-3 bg-[#0B0E11] border border-[#F0B90B]/10 rounded-lg">
                <h4 className="font-semibold text-sm mb-1 text-white">{selectedService.title}</h4>
                <p className="text-xs text-white/60">by {selectedService.consultant}</p>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-white">Your Referral Link</label>
                <div className="flex gap-2">
                  <Input
                    readOnly
                    value={generateReferralLink(selectedService._id)}
                    className="bg-[#0B0E11] border-[#F0B90B]/10 text-white text-sm"
                  />
                  <Button
                    size="icon"
                    onClick={handleCopyLink}
                    className="shrink-0 bg-[#F0B90B] hover:bg-[#F3BA2F] text-[#0B0E11]"
                  >
                    {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  </Button>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
