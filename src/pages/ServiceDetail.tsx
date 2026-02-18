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

// Service data - in a real app, this would come from an API or database
// COMMENTED OUT - Now fetching from backend API
/*
const serviceData = {
  1: {
    title: "Complete Settlement Package",
    category: "Settlement & Integration",
    description: "Step-by-step guidance for new immigrants with paperwork help, housing, healthcare, schools, and banking",
    aboutService: "Navigate your arrival in Canada with confidence through our comprehensive settlement package. We provide end-to-end support from the moment you arrive, helping you complete all essential paperwork and local registrations efficiently. Our experts guide you through finding suitable housing, understanding Canada's healthcare system, enrolling children in schools, and setting up your banking. This package is designed to eliminate the stress of settling in a new country, ensuring you have all the foundational elements in place for a successful Canadian journey.",
    price: "$299",
    duration: "Full package",
    rating: 4.9,
    reviews: 187,
    consultant: "EXPERT 1",
    consultantTitle: "Settlement Specialist",
    features: [
      "Paperwork and local registrations",
      "Housing orientation",
      "Healthcare system navigation",
      "School enrollment guidance",
      "Banking setup assistance",
      "Follow-up support for 30 days",
    ],
  },
  2: {
    title: "Resume & LinkedIn Optimization",
    category: "Jobs & Career Coaching",
    description: "Professional resume and LinkedIn profile tailored to Canadian employers",
    aboutService: "Stand out in the competitive Canadian job market with a professionally optimized resume and LinkedIn profile. Our career experts understand what Canadian employers are looking for and will transform your documents to meet Applicant Tracking System (ATS) requirements. We'll revamp your LinkedIn profile to maximize visibility, create compelling cover letter templates, and provide you with a strategic job search guide tailored to your industry and experience level.",
    price: "$125",
    duration: "2 sessions",
    rating: 4.8,
    reviews: 243,
    consultant: "EXPERT 2",
    consultantTitle: "Career Coach",
    features: [
      "ATS-optimized resume",
      "LinkedIn profile makeover",
      "Cover letter templates",
      "Job search strategy guide",
      "Interview preparation tips",
      "Follow-up support for 14 days",
    ],
  },
  3: {
    title: "Career Coaching & Interview Prep",
    category: "Jobs & Career Coaching",
    description: "1-on-1 coaching with interview preparation and networking support",
    aboutService: "Ace your Canadian job interviews with personalized one-on-one coaching from experienced career professionals. We conduct realistic mock interviews, teach you how to answer behavioral questions effectively, and provide proven salary negotiation tactics. Learn powerful networking strategies and personal branding techniques that will help you build professional connections and advance your career in Canada. This hands-on coaching prepares you for real-world scenarios you'll face in the Canadian job market.",
    price: "$150/hour",
    duration: "Hourly",
    rating: 5.0,
    reviews: 156,
    consultant: "EXPERT 3",
    consultantTitle: "Career Coach & Interview Specialist",
    features: [
      "Mock interviews",
      "Behavioral question prep",
      "Salary negotiation tactics",
      "Networking strategies",
      "Personal branding guidance",
      "Follow-up support for 30 days",
    ],
  },
  4: {
    title: "Business Registration & Setup",
    category: "Startup & Business",
    description: "Complete business registration and structuring in Canada",
    aboutService: "Launch your Canadian business with confidence through our comprehensive registration and setup service. We guide you through selecting the right business entity structure, completing all registration paperwork, setting up GST/HST accounts, and establishing your business banking. Our experts ensure you understand compliance requirements and help you make informed decisions about your business structure that will benefit you long-term. Perfect for entrepreneurs ready to start their business journey in Canada.",
    price: "$500",
    duration: "Full package",
    rating: 4.9,
    reviews: 89,
    consultant: "EXPERT 4",
    consultantTitle: "Business Registration Specialist",
    features: [
      "Business entity selection",
      "Registration process",
      "GST/HST setup",
      "Business bank account",
      "Legal structure advice",
      "Follow-up support for 30 days",
    ],
  },
  5: {
    title: "Startup Market Research",
    category: "Startup & Business",
    description: "Market research and go-to-market strategy guidance",
    aboutService: "Make data-driven decisions for your startup with professional market research and strategic planning. We conduct comprehensive market analysis, identify your competition, and help you develop a winning go-to-market strategy. Our research includes pricing recommendations and target audience identification to position your business for success in the Canadian market. This service is essential for entrepreneurs who want to minimize risk and maximize their chances of business success.",
    price: "$350",
    duration: "3 sessions",
    rating: 4.7,
    reviews: 67,
    consultant: "EXPERT 5",
    consultantTitle: "Market Research Consultant",
    features: [
      "Market analysis",
      "Competitor research",
      "GTM strategy",
      "Pricing recommendations",
      "Target audience identification",
      "Follow-up support for 14 days",
    ],
  },
  6: {
    title: "Immigration Consultant Matching",
    category: "Immigration Agency Referral",
    description: "Connect with certified RCIC immigration consultants",
    aboutService: "Connect with trusted, certified Regulated Canadian Immigration Consultants (RCIC) who can handle your immigration needs professionally. We match you with vetted consultants who specialize in your specific immigration pathway. Receive a free initial consultation to discuss your case, and benefit from guaranteed compliance with Canadian immigration regulations. Our network of consultants provides comprehensive documentation support and application guidance to maximize your success.",
    price: "$Free matching",
    duration: "Consultation",
    rating: 5.0,
    reviews: 312,
    consultant: "EXPERT 6",
    consultantTitle: "Immigration Services Coordinator",
    features: [
      "Vetted RCIC consultants",
      "Free initial consultation",
      "Compliance guaranteed",
      "Documentation support",
      "Application guidance",
      "Follow-up support for 7 days",
    ],
  },
  7: {
    title: "Housing Search Assistance",
    category: "Local & Household Support",
    description: "Find affordable housing with local expert guidance",
    aboutService: "Find your perfect home in Canada with expert guidance from local housing specialists. We help you research neighborhoods, attend apartment viewings, negotiate favorable lease terms, and set up all necessary utilities. Our service includes moving logistics support to make your transition smooth and stress-free. Whether you're looking for temporary or permanent accommodation, we ensure you find safe, affordable housing that meets your family's needs.",
    price: "$75/hour",
    duration: "Hourly",
    rating: 4.8,
    reviews: 134,
    consultant: "EXPERT 7",
    consultantTitle: "Housing Search Specialist",
    features: [
      "Neighborhood research",
      "Apartment viewings",
      "Lease negotiation",
      "Utilities setup help",
      "Moving logistics",
      "Follow-up support for 14 days",
    ],
  },
  8: {
    title: "Canadian Banking Setup",
    category: "Financial Setup",
    description: "Complete banking setup with credit building guidance",
    aboutService: "Establish your financial foundation in Canada with comprehensive banking and credit guidance. We assist you in opening the right bank accounts, applying for credit cards, and understanding how to build your Canadian credit score from scratch. Learn about banking fee optimization and basic financial planning to manage your money effectively. This service is crucial for newcomers who want to establish strong financial roots in Canada.",
    price: "$99",
    duration: "Single session",
    rating: 4.9,
    reviews: 198,
    consultant: "EXPERT 8",
    consultantTitle: "Banking & Credit Specialist",
    features: [
      "Bank account opening",
      "Credit card application",
      "Credit score education",
      "Banking fee optimization",
      "Financial planning basics",
      "Follow-up support for 7 days",
    ],
  },
  9: {
    title: "Tax ID & Filing Guidance",
    category: "Financial Setup",
    description: "SIN registration and first-year tax filing support",
    aboutService: "Navigate Canada's tax system with confidence through expert guidance on SIN registration and your first-year tax filing. We help you understand tax residency requirements, guide you through applying for your Social Insurance Number, and provide comprehensive support for filing your first Canadian tax return. Learn deduction optimization strategies and tax planning techniques to maximize your returns and ensure full compliance with Canadian tax laws.",
    price: "$175",
    duration: "Full support",
    rating: 5.0,
    reviews: 145,
    consultant: "EXPERT 9",
    consultantTitle: "Tax & Financial Compliance Advisor",
    features: [
      "SIN application help",
      "Tax residency guidance",
      "First tax return filing",
      "Deduction optimization",
      "Tax planning strategies",
      "Follow-up support for 30 days",
    ],
  },
  10: {
    title: "Work Permit & Labor Law",
    category: "Legal & Compliance",
    description: "Guidance on work permits, tenant rights, and labor laws",
    aboutService: "Understand your legal rights and obligations in Canada with expert consultation on work permits, tenant rights, and employment law. We provide clear guidance on work permit requirements, educate you about your rights as a tenant, cover employment law basics, and offer legal referrals when needed. Our consultants also assist with contract review to ensure you're protected in all your legal agreements. Essential for anyone navigating legal matters in Canada.",
    price: "$200/hour",
    duration: "Hourly",
    rating: 4.8,
    reviews: 87,
    consultant: "EXPERT 10",
    consultantTitle: "Legal & Compliance Consultant",
    features: [
      "Work permit guidance",
      "Tenant rights education",
      "Employment law basics",
      "Legal referrals",
      "Contract review assistance",
      "Follow-up support for 7 days",
    ],
  },
  11: {
    title: "Provincial Health Card Setup",
    category: "Healthcare & Insurance",
    description: "Navigate Canada's healthcare system and get provincial coverage",
    aboutService: "Access Canada's healthcare system properly by obtaining your provincial health card and understanding how the system works. We guide you through the health card application process, provide comprehensive system orientation, help you register with a family doctor, explain emergency services, and overview insurance options to supplement your provincial coverage. This service ensures you and your family have access to the healthcare you need.",
    price: "$50",
    duration: "Consultation",
    rating: 4.7,
    reviews: 223,
    consultant: "EXPERT 11",
    consultantTitle: "Healthcare Navigator",
    features: [
      "Health card application",
      "System orientation",
      "Doctor registration",
      "Emergency services info",
      "Insurance options overview",
      "Follow-up support for 7 days",
    ],
  },
  12: {
    title: "School Admissions Support",
    category: "Education & Skill Upgrade",
    description: "Complete school enrollment and credential evaluation",
    aboutService: "Ensure your children receive the best education in Canada with comprehensive school admissions support. We help you research and select appropriate schools, assist with applications, handle document translation requirements, and guide you through the registration process. Our service includes credential evaluation to ensure your children are placed in the right grade level. We make the school enrollment process smooth and stress-free for your family.",
    price: "$150",
    duration: "Full package",
    rating: 4.9,
    reviews: 167,
    consultant: "EXPERT 12",
    consultantTitle: "Education Admissions Specialist",
    features: [
      "School research",
      "Application assistance",
      "Document translation",
      "Registration support",
      "Credential evaluation",
      "Follow-up support for 14 days",
    ],
  },
  13: {
    title: "Professional Reskilling Path",
    category: "Education & Skill Upgrade",
    description: "Diploma equivalency and career upgrade pathways",
    aboutService: "Advance your career in Canada through strategic reskilling and credential recognition. We conduct thorough credential assessments, create personalized career pathway plans, recommend relevant courses and programs, provide certification guidance, and perform skills gap analysis. This service is perfect for professionals who want to leverage their international experience while meeting Canadian industry standards and requirements.",
    price: "$200",
    duration: "3 sessions",
    rating: 5.0,
    reviews: 98,
    consultant: "EXPERT 13",
    consultantTitle: "Career Development Specialist",
    features: [
      "Credential assessment",
      "Career pathway planning",
      "Course recommendations",
      "Certification guidance",
      "Skills gap analysis",
      "Follow-up support for 14 days",
    ],
  },
  14: {
    title: "Newcomer Community Network",
    category: "Networking & Community",
    description: "Connect with cultural communities and find mentorship",
    aboutService: "Build your social and professional network in Canada through our newcomer community connections. We provide meetup invitations to connect with people from your cultural background, match you with experienced mentors, share information about cultural events, identify volunteer opportunities, and give you access to networking events. This free service helps you combat isolation and build a support system in your new home.",
    price: "$Free",
    duration: "Ongoing",
    rating: 4.8,
    reviews: 456,
    consultant: "EXPERT 14",
    consultantTitle: "Community Engagement Coordinator",
    features: [
      "Meetup invitations",
      "Mentor matching",
      "Cultural events",
      "Volunteer opportunities",
      "Networking events access",
      "Follow-up support for 30 days",
    ],
  },
  15: {
    title: "Airport Pickup & Setup",
    category: "Relocation & Logistics",
    description: "Complete arrival support with temporary accommodation",
    aboutService: "Start your Canadian journey stress-free with our comprehensive arrival support package. We provide airport pickup, arrange temporary accommodation, help you get a SIM card, take you on an essential shopping tour, and conduct a thorough orientation session. This all-inclusive service ensures your first days in Canada are comfortable and you have everything you need to begin settling in immediately.",
    price: "$350",
    duration: "Full package",
    rating: 4.9,
    reviews: 234,
    consultant: "EXPERT 15",
    consultantTitle: "Arrival Support Specialist",
    features: [
      "Airport pickup",
      "Temporary accommodation",
      "SIM card setup",
      "Essential shopping tour",
      "Orientation session",
      "Follow-up support for 7 days",
    ],
  },
  16: {
    title: "Digital ID & Apps Setup",
    category: "Digital Transition",
    description: "Complete digital transition with ID applications and essential apps",
    aboutService: "Navigate Canada's digital landscape with expert assistance in obtaining your provincial ID, driver's license, and setting up essential apps. We guide you through the online ID application process, provide driver's license guidance, help you set up essential Canadian apps, deliver cyber-safety training, and teach you how to navigate online services. This service ensures you're digitally connected and secure in your new country.",
    price: "$99",
    duration: "2 sessions",
    rating: 4.7,
    reviews: 189,
    consultant: "EXPERT 16",
    consultantTitle: "Digital Onboarding Specialist",
    features: [
      "Provincial ID application",
      "Driver's license guidance",
      "Essential apps setup",
      "Cyber-safety training",
      "Online services navigation",
      "Follow-up support for 14 days",
    ],
  },
};

const reviewsData = [
  {
    name: "Sarah Thompson",
    rating: 5,
    date: "2 weeks ago",
    comment: "Exceptional service! The consultant was incredibly knowledgeable and patient. They helped me understand all my options and made the process so much easier.",
  },
  {
    name: "Michael Rodriguez",
    rating: 5,
    date: "3 weeks ago",
    comment: "Highly recommend! Professional, thorough, and very helpful. Got exactly what I needed and the follow-up support was excellent.",
  },
  {
    name: "Priya Patel",
    rating: 4,
    date: "1 month ago",
    comment: "Great experience overall. The consultant was well-informed and provided valuable insights. Would definitely use again.",
  },
  {
    name: "James Chen",
    rating: 5,
    date: "1 month ago",
    comment: "Outstanding! They went above and beyond to ensure everything was perfect. Very pleased with the service.",
  },
];
*/

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

        // Fetch all reviews (since we don't have serviceId in reviews yet)
        const reviewsUrl = `${API_BASE_URL}/services/all/reviews`;
        console.log(`📡 Requesting: ${reviewsUrl}`);
        
        const reviewsResponse = await fetch(reviewsUrl);
        console.log(`📥 Reviews Response Status: ${reviewsResponse.status} ${reviewsResponse.statusText}`);
        
        if (reviewsResponse.ok) {
          const reviewsData = await reviewsResponse.json();
          console.log(`✅ Reviews fetched successfully from backend! Total: ${reviewsData.length}`);
          console.log('💬 Reviews Data:', reviewsData.map(r => ({ name: r.name, rating: r.rating })));
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
