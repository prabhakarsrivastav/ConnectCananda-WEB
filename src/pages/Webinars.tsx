import { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Calendar, Clock, Users, Video, CheckCircle, ArrowRight, ShoppingCart } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { format } from "date-fns";
import { z } from "zod";
import { YouTube3DSection } from "@/components/YouTube3DSection.tsx";

const registrationSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters").max(100),
  email: z.string().trim().email("Invalid email address").max(255),
  phone: z.string().trim().max(20).optional(),
  company: z.string().trim().max(100).optional(),
});

interface Webinar {
  id?: string;
  _id?: string;
  title: string;
  description: string;
  date: string;
  time: string;
  duration_minutes: number;
  speaker_name: string;
  speaker_title: string;
  speaker_image: string | null;
  cover_image: string | null;
  max_attendees: number | null;
  price: number;
  is_free: boolean;
  status: string;
}

const Webinars = () => {
  const [webinars, setWebinars] = useState<Webinar[]>([]);
  const [selectedWebinar, setSelectedWebinar] = useState<Webinar | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [registrationCounts, setRegistrationCounts] = useState<Record<string, number>>({});
  const { toast } = useToast();
  const { addToCart } = useCart();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
  });

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    fetchWebinars();
  }, []);

  const fetchWebinars = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/webinars`);
      const result = await response.json();

      if (!response.ok) throw new Error(result.error);
      
      const webinarsData = (result.data || []).map((w: any) => ({
        ...w,
        id: w.id || w._id
      }));
      
      setWebinars(webinarsData);
      
      const counts: Record<string, number> = {};
      webinarsData.forEach((webinar: Webinar) => {
        counts[webinar.id] = (webinar as any).registration_count || 0;
      });
      setRegistrationCounts(counts);
    } catch (error) {
      console.error("Error fetching webinars:", error);
      toast({
        title: "Error",
        description: "Failed to load webinars. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (formErrors[name]) {
      setFormErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormErrors({});

    // Validate form data
    const validation = registrationSchema.safeParse(formData);
    if (!validation.success) {
      const errors: Record<string, string> = {};
      validation.error.errors.forEach((err) => {
        if (err.path[0]) {
          errors[err.path[0] as string] = err.message;
        }
      });
      setFormErrors(errors);
      return;
    }

    const webinarId = selectedWebinar?.id || selectedWebinar?._id;
    
    if (!webinarId) {
      console.error('No webinar ID found:', selectedWebinar);
      toast({
        title: "Error",
        description: "Invalid webinar selection.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/webinars/${webinarId}/register`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: formData.name.trim(),
            email: formData.email.trim().toLowerCase(),
            phone: formData.phone.trim() || null,
            company: formData.company.trim() || null,
          }),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        if (result.error?.includes('Already registered')) {
          toast({
            title: "Already Registered",
            description: "You have already registered for this webinar.",
            variant: "destructive",
          });
        } else {
          throw new Error(result.error);
        }
        return;
      }

      toast({
        title: "Registration Successful!",
        description: "You'll receive a confirmation email with the webinar details.",
      });

      setFormData({ name: "", email: "", phone: "", company: "" });
      setSelectedWebinar(null);
      fetchWebinars(); // Refresh counts
    } catch (error) {
      console.error("Error registering for webinar:", error);
      toast({
        title: "Registration Failed",
        description: "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0B0E11]">
      <Header />
      
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-br from-[#0B0E11] via-[#181A20] to-[#0B0E11] overflow-hidden">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-5" />
        <div className="absolute top-20 left-10 w-72 h-72 bg-[#F0B90B]/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-[#F0B90B]/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }} />
        
        <div className="container relative z-10 px-4">
          <div className="text-center max-w-3xl mx-auto">
            <Badge className="mb-4 bg-[#F0B90B]/10 text-[#F0B90B] border-[#F0B90B]/20">
              <Video className="h-3 w-3 mr-1" />
              Free Webinars
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
              Join Our <span className="text-[#F0B90B]">Expert Webinars</span>
            </h1>
            <p className="text-lg text-white/60 mb-8">
              Learn from industry experts and get your questions answered in real-time. All webinars are free and interactive.
            </p>
          </div>
        </div>
      </section>

      {/* YouTube 3D Section */}
      <YouTube3DSection 
        videoId="l2PuCrOmWMw"
        title="Watch Our Latest Webinar"
        subtitle="Learn from expert sessions and get insights from industry leaders"
      />

      {/* Webinars Grid */}
      <section className="py-20 bg-[#0B0E11]">
        <div className="container mx-auto px-4">
          {isLoading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <Card key={`skeleton-${i}`} className="p-6 bg-gradient-to-br from-[#181A20] to-[#0B0E11] border-[#F0B90B]/10 animate-pulse">
                  <div className="h-48 bg-[#F0B90B]/5 rounded-lg mb-4" />
                  <div className="h-6 bg-[#F0B90B]/5 rounded mb-2" />
                  <div className="h-4 bg-[#F0B90B]/5 rounded w-2/3" />
                </Card>
              ))}
            </div>
          ) : webinars.length === 0 ? (
            <div className="text-center py-20">
              <Video className="h-16 w-16 text-[#F0B90B]/30 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">No Upcoming Webinars</h3>
              <p className="text-white/60">Check back soon for new webinar announcements!</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {webinars.map((webinar) => {
                const registrationCount = registrationCounts[webinar.id] || 0;
                const isFull = webinar.max_attendees && registrationCount >= webinar.max_attendees;
                
                return (
                  <Card
                    key={webinar.id}
                    className="group overflow-hidden bg-gradient-to-br from-[#181A20] to-[#0B0E11] border-[#F0B90B]/10 hover:border-[#F0B90B]/30 transition-all duration-300 hover:shadow-[0_0_30px_rgba(240,185,11,0.15)]"
                  >
                    {/* Cover Image */}
                    {webinar.cover_image ? (
                      <div className="relative h-48 overflow-hidden">
                        <img
                          src={webinar.cover_image}
                          alt={webinar.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#0B0E11] to-transparent" />
                      </div>
                    ) : (
                      <div className="h-48 bg-gradient-to-br from-[#F0B90B]/20 to-[#F3BA2F]/10 flex items-center justify-center">
                        <Video className="h-16 w-16 text-[#F0B90B]" />
                      </div>
                    )}

                    <div className="p-6 flex flex-col">
                      <h3 className="text-xl font-bold text-white mb-2 group-hover:text-[#F0B90B] transition-colors">
                        {webinar.title}
                      </h3>
                      <p className="text-sm text-white/60 mb-4 line-clamp-2">
                        {webinar.description}
                      </p>

                      {/* Date & Time */}
                      <div className="space-y-2 mb-4">
                        <div className="flex items-center gap-2 text-sm text-white/80">
                          <Calendar className="h-4 w-4 text-[#F0B90B]" />
                          <span>{format(new Date(webinar.date), "MMMM dd, yyyy")}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-white/80">
                          <Clock className="h-4 w-4 text-[#F0B90B]" />
                          <span>{webinar.time} ({webinar.duration_minutes} min)</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-white/80">
                          <Users className="h-4 w-4 text-[#F0B90B]" />
                          <span>
                            {registrationCount} registered
                            {webinar.max_attendees && ` / ${webinar.max_attendees} spots`}
                          </span>
                        </div>
                      </div>

                      {/* Speaker */}
                      <div className="flex items-center gap-3 p-3 bg-[#F0B90B]/5 rounded-lg mb-4">
                        <div className="h-10 w-10 rounded-full bg-gradient-to-br from-[#F0B90B] to-[#F3BA2F] flex items-center justify-center text-[#0B0E11] font-bold">
                          {webinar.speaker_name.charAt(0)}
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-white">{webinar.speaker_name}</p>
                          <p className="text-xs text-white/60">{webinar.speaker_title}</p>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex gap-2">
                        {webinar.is_free ? (
                          <Button
                            onClick={() => setSelectedWebinar(webinar)}
                            disabled={isFull}
                            className="flex-1 bg-[#F0B90B] hover:bg-[#F3BA2F] text-[#0B0E11] disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {isFull ? (
                              <>
                                <CheckCircle className="h-4 w-4 mr-2" />
                                Fully Booked
                              </>
                            ) : (
                              <>
                                Register Free
                                <ArrowRight className="h-4 w-4 ml-2" />
                              </>
                            )}
                          </Button>
                        ) : (
                          <>
                            <Button
                              onClick={async () => {
                                try {
                                  await addToCart('webinar', webinar.id || webinar._id);
                                  toast({
                                    title: "Added to cart",
                                    description: `${webinar.title} has been added to your cart.`
                                  });
                                } catch (error) {
                                  toast({
                                    title: "Error",
                                    description: "Please login to add items to cart.",
                                    variant: "destructive"
                                  });
                                }
                              }}
                              className="flex-1 bg-[#F0B90B] hover:bg-[#F3BA2F] text-[#0B0E11]"
                            >
                              <ShoppingCart className="h-4 w-4 mr-2" />
                              ${webinar.price}
                            </Button>
                          </>
                        )}
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* Registration Dialog */}
      <Dialog open={!!selectedWebinar} onOpenChange={(open) => !open && setSelectedWebinar(null)}>
        <DialogContent className="sm:max-w-md bg-[#181A20] border-[#F0B90B]/20">
          <DialogHeader>
            <DialogTitle className="text-xl text-white">Register for Webinar</DialogTitle>
            <DialogDescription className="text-white/60">
              {selectedWebinar?.title}
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleSubmit} className="space-y-4 mt-4">
            <div>
              <Label htmlFor="name" className="text-white">Full Name *</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="John Doe"
                className="bg-[#0B0E11] border-[#F0B90B]/10 text-white focus:border-[#F0B90B]"
                required
              />
              {formErrors.name && (
                <p className="text-xs text-red-400 mt-1">{formErrors.name}</p>
              )}
            </div>

            <div>
              <Label htmlFor="email" className="text-white">Email *</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="john@example.com"
                className="bg-[#0B0E11] border-[#F0B90B]/10 text-white focus:border-[#F0B90B]"
                required
              />
              {formErrors.email && (
                <p className="text-xs text-red-400 mt-1">{formErrors.email}</p>
              )}
            </div>

            <div>
              <Label htmlFor="phone" className="text-white">Phone (Optional)</Label>
              <Input
                id="phone"
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleInputChange}
                placeholder="+1 (555) 123-4567"
                className="bg-[#0B0E11] border-[#F0B90B]/10 text-white focus:border-[#F0B90B]"
              />
            </div>

            <div>
              <Label htmlFor="company" className="text-white">Company (Optional)</Label>
              <Input
                id="company"
                name="company"
                value={formData.company}
                onChange={handleInputChange}
                placeholder="Your Company"
                className="bg-[#0B0E11] border-[#F0B90B]/10 text-white focus:border-[#F0B90B]"
              />
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setSelectedWebinar(null)}
                className="flex-1 border-[#F0B90B]/30 text-[#F0B90B] hover:bg-[#F0B90B]/10"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 bg-[#F0B90B] hover:bg-[#F3BA2F] text-[#0B0E11]"
              >
                {isSubmitting ? "Registering..." : "Confirm RSVP"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
};

export default Webinars;
