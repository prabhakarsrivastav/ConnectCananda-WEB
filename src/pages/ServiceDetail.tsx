import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { BookingDialog } from "@/components/BookingDialog";
import { ReviewForm } from "@/components/ReviewForm";
import {
  Star,
  MapPin,
  Clock,
  CheckCircle,
  Share2,
  Calendar,
  Shield,
  Award,
  TrendingUp,
  ArrowLeft,
  Home as HomeIcon,
  Loader2,
} from "lucide-react";

// API Base URL
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';



// Interface for Service data
interface Service {
  _id: string;
  title: string;
  category: string;
  description: string;
  aboutService: string;
  price: string;
  duration: string;
  rating: number;
  reviews: number;
  consultant: string;
  consultantTitle: string;
  features: string[];
  icon?: string;
}

interface Review {
  name: string;
  rating: number;
  date: string;
  comment: string;
}

export default function ServiceDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [bookingOpen, setBookingOpen] = useState(false);
  const [service, setService] = useState<Service | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch service and reviews from backend
  useEffect(() => {
    const fetchServiceData = async () => {
      try {
        console.log('🔄 Starting to fetch data from backend...');
        console.log(`📍 API Base URL: ${API_BASE_URL}`);
        console.log(`🔍 Fetching service with ID: ${id}`);

        setLoading(true);
        setError(null);

        // Fetch service details
        const serviceUrl = `${API_BASE_URL}/services/${id}`;
        console.log(`📡 Requesting: ${serviceUrl}`);

        const serviceResponse = await fetch(serviceUrl);
        console.log(`📥 Service Response Status: ${serviceResponse.status} ${serviceResponse.statusText}`);

        if (!serviceResponse.ok) {
          console.error('❌ Service not found or error occurred');
          throw new Error('Service not found');
        }

        const serviceData = await serviceResponse.json();
        console.log('✅ Service data fetched successfully from backend!');
        console.log('📦 Service Data:', {
          id: serviceData.serviceId,
          title: serviceData.title,
          category: serviceData.category,
          price: serviceData.price,
          rating: serviceData.rating
        });

        setService(serviceData);

        // Fetch reviews for this specific service
        const reviewsUrl = `${API_BASE_URL}/services/${id}/reviews`;
        console.log(`📡 Requesting: ${reviewsUrl}`);

        const reviewsResponse = await fetch(reviewsUrl);
        console.log(`📥 Reviews Response Status: ${reviewsResponse.status} ${reviewsResponse.statusText}`);

        if (reviewsResponse.ok) {
          const reviewsData = await reviewsResponse.json();
          console.log(`✅ Reviews fetched successfully from backend! Total: ${reviewsData.length}`);
          setReviews(reviewsData);
        } else {
          console.warn('⚠️ Failed to fetch reviews, but continuing...');
        }

        console.log('🎉 All data fetched successfully from backend!');
      } catch (err) {
        console.error('❌ ERROR fetching data from backend:', err);
        console.error('📋 Error details:', {
          message: err instanceof Error ? err.message : 'Unknown error',
          apiUrl: API_BASE_URL,
          serviceId: id
        });
        setError(err instanceof Error ? err.message : 'Failed to load service');
      } finally {
        setLoading(false);
        console.log('✔️ Data fetching process completed');
      }
    };

    if (id) {
      fetchServiceData();
    } else {
      console.warn('⚠️ No service ID provided');
    }
  }, [id]);

  const handleReviewSuccess = () => {
    if (id) {
      window.location.reload(); // Simplest way to refresh for now to be safe
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center bg-[#0B0E11]">
          <div className="text-center">
            <Loader2 className="h-12 w-12 animate-spin text-[#fcd535] mx-auto mb-4" />
            <p className="text-[#848e9c]">Loading service details...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Error or Not Found state
  if (error || !service) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center bg-[#0B0E11]">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4 text-white">{error || 'Service not found'}</h1>
            <Button onClick={() => navigate("/services")} className="bg-[#fcd535] text-black hover:bg-[#fcd535]/90">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Services
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 bg-[#0B0E11]">
        {/* Hero Section */}
        <section className="bg-gradient-to-b from-[#0B0E11] to-[#181a20] border-b border-[#2b3139]">
          <div className="container px-4 py-8">
            {/* Breadcrumb Navigation */}
            <nav className="flex items-center gap-2 text-sm text-[#848e9c] mb-6">
              <button
                onClick={() => navigate("/")}
                className="hover:text-[#fcd535] transition-colors flex items-center gap-1"
              >
                <HomeIcon className="h-3.5 w-3.5" />
                Home
              </button>
              <span>›</span>
              <button
                onClick={() => navigate("/services")}
                className="hover:text-[#fcd535] transition-colors"
              >
                Services
              </button>
              <span>›</span>
              <span className="text-white">{service.title}</span>
            </nav>

            <div className="grid lg:grid-cols-3 gap-8">
              {/* Left - Service Info */}
              <div className="lg:col-span-2">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <Badge variant="outline" className="border-[#2b3139] text-[#848e9c]">
                        {service.category}
                      </Badge>
                      <Badge className="bg-[#fcd535]/10 text-[#fcd535] border-[#fcd535]/20">
                        ✓ Verified Provider
                      </Badge>
                    </div>
                    <h1 className="text-3xl md:text-4xl font-bold mb-3 text-white">
                      {service.title}
                    </h1>
                    <p className="text-lg text-[#848e9c]">
                      {service.description}
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-6 mb-6">
                  <div className="flex items-center gap-2">
                    <Star className="h-5 w-5 fill-[#fcd535] text-[#fcd535]" />
                    <span className="font-bold text-white">{service.rating}</span>
                    <span className="text-[#848e9c]">({service.reviews} reviews)</span>
                  </div>
                  <div className="flex items-center gap-2 text-[#848e9c]">
                    <Clock className="h-5 w-5" />
                    <span>{service.duration}</span>
                  </div>
                  <div className="flex items-center gap-2 text-[#848e9c]">
                    <MapPin className="h-5 w-5" />
                    <span>Toronto, ON</span>
                  </div>
                </div>

                {/* Consultant Card */}
                <Card className="p-6 bg-[#181a20] border-[#2b3139] mb-6">
                  <div className="flex items-center gap-4">
                    <Avatar className="h-16 w-16 border-2 border-[#fcd535]">
                      <AvatarFallback className="text-xl font-bold bg-[#fcd535] text-black">
                        {service.consultant.split(" ").map(n => n[0]).join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <h3 className="font-bold text-lg mb-1 text-white">{service.consultant}</h3>
                      <p className="text-sm text-[#848e9c] mb-2">
                        {service.consultantTitle}
                      </p>
                      <div className="flex items-center gap-3 text-xs text-[#848e9c]">
                        <div className="flex items-center gap-1">
                          <Award className="h-4 w-4 text-[#fcd535]" />
                          <span>8+ years experience</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <TrendingUp className="h-4 w-4 text-[#02c076]" />
                          <span>95% success rate</span>
                        </div>
                      </div>
                    </div>
                    <Button variant="outline" className="border-[#2b3139] text-white hover:bg-[#181a20]">
                      View Profile
                    </Button>
                  </div>
                </Card>

                <Separator className="my-6 bg-[#2b3139]" />

                {/* What's Included */}
                <div className="mb-6">
                  <h2 className="text-2xl font-bold mb-4 text-white">What's Included</h2>
                  <div className="grid md:grid-cols-2 gap-3">
                    {service.features.map((item, index) => (
                      <div key={index} className="flex items-start gap-2">
                        <CheckCircle className="h-5 w-5 text-[#02c076] mt-0.5 flex-shrink-0" />
                        <span className="text-[#848e9c]">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <Separator className="my-6 bg-[#2b3139]" />

                {/* About the Service */}
                <div className="mb-6">
                  <h2 className="text-2xl font-bold mb-4 text-white">
                    About This Service
                  </h2>
                  <div className="prose prose-invert max-w-none text-[#848e9c] space-y-4">
                    <p>
                      {service.aboutService || service.description}
                    </p>
                  </div>
                </div>

                <Separator className="my-6 bg-[#2b3139]" />

                {/* Reviews Section */}
                <div>
                  <h2 className="text-2xl font-bold mb-4 text-white">
                    Client Reviews ({service.reviews})
                  </h2>

                  <ReviewForm serviceId={service._id} onSuccess={handleReviewSuccess} />

                  {reviews.length > 0 ? (
                    <>
                      <div className="space-y-4">
                        {reviews.slice(0, 4).map((review, index) => (
                          <Card
                            key={index}
                            className="p-4 bg-[#181a20] border-[#2b3139]"
                          >
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center gap-3">
                                <Avatar className="h-10 w-10 bg-[#fcd535]/10">
                                  <AvatarFallback className="text-[#fcd535]">
                                    {review.name
                                      .split(" ")
                                      .map((n) => n[0])
                                      .join("")}
                                  </AvatarFallback>
                                </Avatar>
                                <div>
                                  <p className="font-semibold text-white">{review.name}</p>
                                  <p className="text-xs text-[#848e9c]">
                                    {review.date}
                                  </p>
                                </div>
                              </div>
                              <div className="flex items-center gap-1">
                                {Array.from({ length: review.rating }).map(
                                  (_, i) => (
                                    <Star
                                      key={i}
                                      className="h-4 w-4 fill-[#fcd535] text-[#fcd535]"
                                    />
                                  )
                                )}
                              </div>
                            </div>
                            <p className="text-sm text-[#848e9c]">
                              {review.comment}
                            </p>
                          </Card>
                        ))}
                      </div>
                      {reviews.length > 4 && (
                        <Button
                          variant="outline"
                          className="w-full mt-4 border-[#2b3139] text-white hover:bg-[#181a20]"
                        >
                          View All {service.reviews} Reviews
                        </Button>
                      )}
                    </>
                  ) : (
                    <Card className="p-6 bg-[#181a20] border-[#2b3139] text-center">
                      <p className="text-[#848e9c]">No reviews yet. Be the first to review this service!</p>
                    </Card>
                  )}
                </div>
              </div>

              {/* Right - Booking Card */}
              <div className="lg:col-span-1">
                <div className="sticky top-20">
                  <Card className="p-6 bg-[#181a20] border-[#2b3139] shadow-lg">
                    <div className="mb-6">
                      <div className="flex items-baseline gap-2 mb-2">
                        <span className="text-3xl font-bold text-[#fcd535]">
                          {service.price}
                        </span>
                      </div>
                      <p className="text-sm text-[#848e9c]">
                        Book now and get confirmation within 24 hours
                      </p>
                    </div>

                    <div className="space-y-3 mb-6">
                      <Button
                        className="w-full bg-[#fcd535] text-black hover:bg-[#fcd535]/90"
                        size="lg"
                        onClick={() => setBookingOpen(true)}
                      >
                        <Calendar className="mr-2 h-5 w-5" />
                        Book Now
                      </Button>
                      <Button
                        variant="outline"
                        className="w-full border-[#2b3139] text-white hover:bg-[#181a20]"
                        size="lg"
                      >
                        <Share2 className="mr-2 h-5 w-5" />
                        Share & Earn
                      </Button>
                    </div>

                    <Separator className="my-4 bg-[#2b3139]" />

                    <div className="space-y-3 text-sm">
                      <div className="flex items-center gap-2 text-[#848e9c]">
                        <Shield className="h-4 w-4 text-[#02c076]" />
                        <span>Secure payment processing</span>
                      </div>
                      <div className="flex items-center gap-2 text-[#848e9c]">
                        <CheckCircle className="h-4 w-4 text-[#02c076]" />
                        <span>Free cancellation up to 24h</span>
                      </div>
                      <div className="flex items-center gap-2 text-[#848e9c]">
                        <Award className="h-4 w-4 text-[#02c076]" />
                        <span>Money-back guarantee</span>
                      </div>
                    </div>

                    <Separator className="my-4 bg-[#2b3139]" />

                    {/* Trust Badge */}
                    <div className="p-4 rounded-lg bg-[#fcd535]/5 border border-[#fcd535]/20">
                      <div className="flex items-start gap-3 mb-2">
                        <div className="p-2 rounded-lg bg-[#fcd535]/10">
                          <TrendingUp className="h-5 w-5 text-[#fcd535]" />
                        </div>
                        <div>
                          <h4 className="font-bold text-sm mb-1 text-white">
                            Trusted by 10,000+ Newcomers
                          </h4>
                          <p className="text-xs text-[#848e9c]">
                            Join thousands who successfully settled in Canada
                          </p>
                        </div>
                      </div>
                    </div>
                  </Card>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <BookingDialog
        open={bookingOpen}
        onOpenChange={setBookingOpen}
        service={{
          id: service._id,
          title: service.title,
          price: service.price,
          duration: service.duration,
        }}
      />

      <Footer />
    </div>
  );
}
