import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import immigrationStoryImg from "@/assets/blog-immigration-story.jpg";
import settlementStoryImg from "@/assets/blog-settlement-story.jpg";
import careerStoryImg from "@/assets/blog-career-story.jpg";
import {
  Calendar,
  Clock,
  User,
  ArrowRight,
  Globe,
  Briefcase,
  Home,
  Heart,
  Shield,
  Users,
  TrendingUp,
  CheckCircle,
  Share2,
  Facebook,
  Twitter,
  Linkedin,
  Mail
} from "lucide-react";

export default function Blog() {
  const serviceCategories = [
    {
      icon: Globe,
      title: "Entry Services",
      color: "from-blue-500 to-cyan-500",
      description: "Expert guidance for your permanent residency journey",
      services: [
        "Express Entry Processing",
        "Provincial Nominee Programs",
        "Work Permit Applications",
        "Family Sponsorship",
        "Citizenship Applications"
      ]
    },
    {
      icon: Briefcase,
      title: "Career Development",
      color: "from-purple-500 to-pink-500",
      description: "Launch and accelerate your Canadian career",
      services: [
        "Resume & Cover Letter Optimization",
        "Job Search Strategy",
        "Interview Preparation",
        "LinkedIn Profile Enhancement",
        "Professional Networking"
      ]
    },
    {
      icon: TrendingUp,
      title: "Business Solutions",
      color: "from-green-500 to-emerald-500",
      description: "Start and grow your business in Canada",
      services: [
        "Business Registration",
        "Business Plan Development",
        "Regulatory Compliance",
        "Funding & Investment Guidance",
        "Market Entry Strategy"
      ]
    },
    {
      icon: Home,
      title: "Settlement Support",
      color: "from-orange-500 to-red-500",
      description: "Navigate your new life with confidence",
      services: [
        "Housing Assistance",
        "Healthcare System Navigation",
        "Banking & Finance Setup",
        "Education System Guidance",
        "Cultural Integration Support"
      ]
    }
  ];

  const benefits = [
    {
      icon: Shield,
      title: "Verified Experts",
      description: "All consultants are thoroughly vetted and certified professionals"
    },
    {
      icon: Users,
      title: "Personalized Matching",
      description: "We connect you with specialists who understand your unique needs"
    },
    {
      icon: CheckCircle,
      title: "End-to-End Support",
      description: "Comprehensive assistance from arrival to successful settlement"
    },
    {
      icon: Heart,
      title: "Community Focused",
      description: "Building a supportive network for all newcomers"
    }
  ];

  const relatedArticles = [
    {
      title: "Understanding Canada's Express Entry System",
      category: "Entry",
      date: "Dec 10, 2024",
      readTime: "5 min read",
      image: immigrationStoryImg
    },
    {
      title: "Top 10 Canadian Cities for Newcomers",
      category: "Settlement",
      date: "Dec 8, 2024",
      readTime: "7 min read",
      image: settlementStoryImg
    },
    {
      title: "Building Your Career in Canada: A Complete Guide",
      category: "Career",
      date: "Dec 5, 2024",
      readTime: "6 min read",
      image: careerStoryImg
    }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#0B0E11]">
      <Header />

      <main className="flex-1">
        {/* Hero Section - Apple Style */}
        <article className="relative">
          {/* Hero Section */}
          <div className="relative min-h-[85vh] bg-gradient-to-br from-[#0B0E11] via-[#181A20] to-[#0B0E11] overflow-hidden">
            {/* Animated background elements */}
            <div className="absolute inset-0">
              <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#F0B90B]/5 rounded-full blur-3xl animate-pulse" />
              <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#F0B90B]/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
            </div>

            {/* Hero Content */}
            <div className="relative container px-4 h-full flex items-center">
              <div className="max-w-4xl py-32 md:py-40 animate-fade-in">
                <Badge className="mb-6 bg-[#F0B90B]/10 backdrop-blur-xl hover:bg-[#F0B90B]/20 text-[#F0B90B] border-[#F0B90B]/20 px-4 py-1.5 text-sm font-medium">
                  Featured Story
                </Badge>
                <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-[1.1] tracking-tight">
                  Your Complete Service Ecosystem for Canadian Success
                </h1>
                <p className="text-xl md:text-2xl text-white/80 mb-8 max-w-3xl leading-relaxed font-light">
                  Everything you need to thrive in Canada — from arrival to settlement, career growth to business success
                </p>

                <div className="flex items-center gap-4 text-sm text-white/60">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    <span>December 14, 2024</span>
                  </div>
                  <span>•</span>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    <span>12 min read</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Scroll indicator */}
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
              <div className="w-6 h-10 border-2 border-[#F0B90B]/30 rounded-full flex items-start justify-center p-2">
                <div className="w-1 h-2 bg-[#F0B90B]/70 rounded-full" />
              </div>
            </div>
          </div>

          {/* Article Metadata - Floating Style */}
          <div className="sticky top-20 z-40 bg-[#181A20]/90 backdrop-blur-xl border-b border-[#F0B90B]/10">
            <div className="container px-4 py-4">
              <div className="max-w-6xl mx-auto flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <Avatar className="h-10 w-10 border-2 border-[#F0B90B]/20">
                    <AvatarFallback className="bg-gradient-to-br from-[#F0B90B] to-[#F3BA2F] text-[#0B0E11] font-semibold">
                      CW
                    </AvatarFallback>
                  </Avatar>
                  <div className="hidden sm:block">
                    <div className="font-semibold text-sm text-white">Canada Welcome Team</div>
                    <div className="text-xs text-white/60">Editorial Team</div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="icon" className="h-9 w-9 hover:bg-[#F0B90B]/10 text-[#F0B90B] transition-colors">
                    <Share2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Article Content - Apple Style */}
          <section className="bg-[#0B0E11]">
            <div className="container px-4 py-16 md:py-24">
              <div className="max-w-3xl mx-auto">

                {/* Lead Paragraph - Apple Style */}
                <div className="mb-20 animate-fade-in">
                  <p className="text-2xl md:text-3xl lg:text-4xl leading-relaxed text-white mb-12 font-light tracking-tight">
                    Moving to Canada is more than just getting a permit. It&apos;s about building a new life,
                    establishing a career, creating financial stability, and finding your place in a vibrant community.
                  </p>
                  <p className="text-lg md:text-xl leading-relaxed text-white/60 font-light">
                    That&apos;s why we&apos;ve built a comprehensive ecosystem that supports you at every stage of your journey
                    — from your first permit application to your final citizenship ceremony and beyond.
                  </p>
                </div>

                {/* Section: Why This Matters */}
                <div className="mb-24 animate-fade-in">
                  <h2 className="text-4xl md:text-5xl font-semibold mb-8 tracking-tight text-white">
                    Why a Complete Service Ecosystem Matters
                  </h2>

                  <div className="bg-gradient-to-br from-[#F0B90B]/10 to-[#F0B90B]/5 rounded-3xl p-8 md:p-12 mb-12 border border-[#F0B90B]/20 hover:shadow-[0_0_30px_rgba(240,185,11,0.15)] transition-all duration-500">
                    <h3 className="text-2xl font-semibold mb-4 tracking-tight text-white">Our Holistic Approach</h3>
                    <p className="text-lg leading-relaxed text-white/70 font-light">
                      We connect you with verified experts across arrival, career development, business consulting,
                      and settlement services — ensuring you have the right support at the right time. No more juggling
                      multiple consultants or navigating complex systems alone.
                    </p>
                  </div>

                  <p className="text-xl md:text-2xl leading-relaxed mb-8 font-light text-white">
                    Research shows that newcomers who access comprehensive support services are <strong className="font-semibold text-[#F0B90B]">3x more likely</strong> to
                    achieve their career goals within the first two years of arrival.
                  </p>

                  <p className="text-lg md:text-xl leading-relaxed text-white/60 font-light">
                    Yet many immigrants struggle to find reliable, coordinated assistance across the multiple areas they need help with.
                    Our platform solves this challenge by bringing together the best consultants across multiple domains.
                  </p>
                </div>

                {/* Section: Four Pillars */}
                <div className="mb-24">
                  <h2 className="text-4xl md:text-5xl font-semibold mb-16 tracking-tight text-white">
                    Four Pillars of Your Success
                  </h2>

                  <div className="space-y-8">
                    {serviceCategories.map((category, index) => (
                      <div
                        key={index}
                        className="group rounded-3xl bg-gradient-to-br from-[#181A20] to-[#0B0E11] p-8 md:p-10 transition-all duration-500 hover:shadow-[0_0_30px_rgba(240,185,11,0.1)] hover:scale-[1.02] border border-[#F0B90B]/10 animate-fade-in"
                        style={{ animationDelay: `${index * 100}ms` }}
                      >
                        <div className="flex items-start gap-6 mb-6">
                          <div className="p-4 rounded-2xl bg-gradient-to-br from-[#F0B90B] to-[#F3BA2F] shrink-0 group-hover:scale-110 group-hover:shadow-[0_0_20px_rgba(240,185,11,0.3)] transition-all duration-300">
                            <category.icon className="h-7 w-7 text-[#0B0E11]" />
                          </div>
                          <div>
                            <h3 className="text-2xl md:text-3xl font-semibold mb-3 tracking-tight text-white group-hover:text-[#F0B90B] transition-colors">{category.title}</h3>
                            <p className="text-lg text-white/60 font-light">{category.description}</p>
                          </div>
                        </div>

                        <div className="grid sm:grid-cols-2 gap-4 mt-8">
                          {category.services.map((service, idx) => (
                            <div key={idx} className="flex items-start gap-3 group/item">
                              <CheckCircle className="h-5 w-5 text-[#F0B90B] shrink-0 mt-1 group-hover/item:scale-110 transition-transform" />
                              <span className="text-sm md:text-base font-light text-white/80">{service}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Section: What Makes Us Different */}
                <div className="mb-24">
                  <h2 className="text-4xl md:text-5xl font-semibold mb-8 tracking-tight text-white">
                    What Makes Us Different
                  </h2>

                  <p className="text-xl md:text-2xl leading-relaxed mb-12 font-light text-white">
                    Unlike single-service providers, we offer a complete ecosystem designed specifically
                    for newcomers to Canada.
                  </p>

                  <div className="grid sm:grid-cols-2 gap-6">
                    {benefits.map((benefit, index) => (
                      <div
                        key={index}
                        className="group rounded-2xl bg-gradient-to-br from-[#181A20] to-[#0B0E11] p-8 hover:shadow-[0_0_30px_rgba(240,185,11,0.1)] transition-all duration-300 border border-[#F0B90B]/10 animate-fade-in"
                        style={{ animationDelay: `${index * 100}ms` }}
                      >
                        <benefit.icon className="h-10 w-10 text-[#F0B90B] mb-4 group-hover:scale-110 transition-transform" />
                        <h4 className="font-semibold text-xl mb-3 tracking-tight text-white">{benefit.title}</h4>
                        <p className="text-base text-white/60 leading-relaxed font-light">{benefit.description}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Section: Journey Steps */}
                <div className="mb-16">
                  <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">
                    Your Journey, Simplified
                  </h2>

                  <p className="text-lg leading-relaxed mb-8 text-white/60">
                    Our platform streamlines your Canadian journey into clear, manageable steps. Here&apos;s how we guide you
                    from arrival to successful integration:
                  </p>

                  <div className="space-y-8">
                    <div className="flex gap-4 items-start pb-8 border-b border-[#F0B90B]/10">
                      <div className="flex items-center justify-center w-12 h-12 rounded-full bg-[#F0B90B] text-[#0B0E11] font-bold text-xl shrink-0">
                        1
                      </div>
                      <div>
                        <h4 className="text-xl font-bold mb-2 text-white">Arrival Foundation</h4>
                        <p className="text-white/60 leading-relaxed">
                          Secure your permit and permanent residency with expert arrival consultants
                          who understand the latest regulations and processes.
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-4 items-start pb-8 border-b border-[#F0B90B]/10">
                      <div className="flex items-center justify-center w-12 h-12 rounded-full bg-[#F0B90B] text-[#0B0E11] font-bold text-xl shrink-0">
                        2
                      </div>
                      <div>
                        <h4 className="text-xl font-bold mb-2 text-white">Career Launch</h4>
                        <p className="text-white/60 leading-relaxed">
                          Build your professional presence with resume optimization, job search strategies,
                          and interview coaching from Canadian career experts.
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-4 items-start pb-8 border-b border-[#F0B90B]/10">
                      <div className="flex items-center justify-center w-12 h-12 rounded-full bg-[#F0B90B] text-[#0B0E11] font-bold text-xl shrink-0">
                        3
                      </div>
                      <div>
                        <h4 className="text-xl font-bold mb-2 text-white">Business Growth</h4>
                        <p className="text-white/60 leading-relaxed">
                          Start or expand your business with guidance on registration, compliance,
                          funding, and market entry strategies.
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-4 items-start">
                      <div className="flex items-center justify-center w-12 h-12 rounded-full bg-[#F0B90B] text-[#0B0E11] font-bold text-xl shrink-0">
                        4
                      </div>
                      <div>
                        <h4 className="text-xl font-bold mb-2 text-white">Settlement Success</h4>
                        <p className="text-white/60 leading-relaxed">
                          Navigate housing, healthcare, banking, and education with confidence through
                          our comprehensive settlement support services.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <Separator className="my-12 bg-[#F0B90B]/10" />

                {/* Section: Success Story */}
                <div className="mb-24">
                  <h2 className="text-4xl md:text-5xl font-semibold mb-8 tracking-tight text-white">
                    Real Results for Real People
                  </h2>

                  <p className="text-xl md:text-2xl leading-relaxed mb-12 font-light text-white">
                    Our ecosystem has helped thousands of newcomers successfully transition to Canadian life.
                    From securing permanent residency to landing dream jobs, starting successful businesses,
                    and building thriving communities.
                  </p>

                  <div className="rounded-3xl bg-gradient-to-br from-[#F0B90B] via-[#F3BA2F] to-[#F0B90B] p-10 md:p-12 my-12 shadow-[0_0_50px_rgba(240,185,11,0.3)] hover:scale-[1.02] transition-all duration-500">
                    <p className="text-2xl md:text-3xl italic leading-relaxed mb-8 text-[#0B0E11] font-light">
                      &quot;The complete service approach made all the difference. From getting my PR to
                      finding a job to setting up my business — I had expert support every step of the way.&quot;
                    </p>
                    <div className="flex items-center gap-4">
                      <Avatar className="h-14 w-14 border-2 border-[#0B0E11]/20">
                        <AvatarFallback className="bg-[#0B0E11]/10 text-[#0B0E11] font-semibold text-lg">PS</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-semibold text-[#0B0E11] text-lg">Priya S.</div>
                        <div className="text-[#0B0E11]/80">Successful Entrepreneur, Toronto</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Final CTA */}
                <div className="text-center py-16">
                  <h2 className="text-4xl md:text-5xl font-semibold mb-6 tracking-tight text-white">
                    Ready to Begin Your Journey?
                  </h2>

                  <p className="text-xl md:text-2xl leading-relaxed mb-12 max-w-2xl mx-auto font-light text-white/60">
                    Connect with verified experts, access AI-powered guidance, and join a community of successful newcomers.
                  </p>

                  <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                    <Button size="lg" className="bg-[#F0B90B] hover:bg-[#F3BA2F] text-[#0B0E11] font-semibold px-8 py-6 text-lg rounded-full hover:scale-105 transition-all duration-300 shadow-[0_8px_32px_rgba(240,185,11,0.4)] hover:shadow-[0_12px_40px_rgba(240,185,11,0.6)]">
                      Browse Services
                      <ArrowRight className="h-5 w-5 ml-2" />
                    </Button>
                    <Button size="lg" variant="outline" className="rounded-full px-8 py-6 text-lg font-medium hover:scale-105 transition-all duration-300 border-[#F0B90B]/30 text-[#F0B90B] hover:bg-[#F0B90B]/10">
                      Contact Us
                    </Button>
                  </div>
                </div>

              </div>
            </div>
          </section>

          {/* Related Articles - Apple Style */}
          <section className="bg-gradient-to-b from-[#0B0E11] to-[#181A20] border-t border-[#F0B90B]/10 py-20">
            <div className="container px-4">
              <div className="max-w-6xl mx-auto">
                <h2 className="text-3xl md:text-4xl font-semibold mb-12 tracking-tight text-white">Related Stories</h2>

                <div className="grid md:grid-cols-3 gap-8">
                  {relatedArticles.map((article, index) => (
                    <div
                      key={index}
                      className="group cursor-pointer animate-fade-in"
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      <div className="h-56 bg-gradient-to-br from-[#181A20] to-[#0B0E11] rounded-2xl mb-4 group-hover:scale-105 transition-transform duration-300 overflow-hidden border border-[#F0B90B]/10">
                        <img
                          src={article.image}
                          alt={article.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <Badge variant="outline" className="mb-3 rounded-full px-3 py-1 bg-[#F0B90B]/10 text-[#F0B90B] border-[#F0B90B]/20">{article.category}</Badge>
                      <h3 className="font-semibold text-xl mb-3 line-clamp-2 text-white group-hover:text-[#F0B90B] transition-colors tracking-tight">
                        {article.title}
                      </h3>
                      <div className="flex items-center gap-3 text-sm text-white/40">
                        <span>{article.date}</span>
                        <span>•</span>
                        <span>{article.readTime}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>
        </article>
      </main>

      <Footer />
    </div>
  );
}
