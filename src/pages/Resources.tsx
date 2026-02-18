import { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Sparkles, BookOpen, GraduationCap, Send, ArrowRight, ExternalLink, Gift, Linkedin } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { Link } from "react-router-dom";
import resourcesHero from "@/assets/resources-hero.jpg";
import canadaStudy1 from "@/assets/canada-study-1.jpg";
import canadaStudy2 from "@/assets/canada-study-2.jpg";
import canadaStudy3 from "@/assets/canada-study-3.jpg";
import TrendingCoursesSection from "@/components/TrendingCoursesSection";
interface Ebook {
  id: string;
  title: string;
  description: string;
  cover_image: string | null;
  price: number;
  is_free: boolean;
}
interface Course {
  id: string;
  title: string;
  description: string;
  thumbnail: string | null;
  price: number;
  is_free: boolean;
  sales_count: number;
}
interface FreeCourse {
  id: string;
  title: string;
  description: string;
  thumbnail: string | null;
  external_url: string;
  display_order: number;
}
export default function Resources() {
  const [aiQuery, setAiQuery] = useState("");
  const [ebooks, setEbooks] = useState<Ebook[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [freeCourses, setFreeCourses] = useState<FreeCourse[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    fetchResources();
  }, []);
  const fetchResources = async () => {
    try {
      setLoading(true);
      const [ebooksRes, coursesRes, freeCoursesRes] = await Promise.all([supabase.from("ebooks").select("*").order("created_at", {
        ascending: false
      }).limit(6), supabase.from("courses").select("*").order("created_at", {
        ascending: false
      }).limit(3), supabase.from("free_external_courses").select("*").eq("is_active", true).order("display_order", {
        ascending: true
      }).limit(9)]);
      if (ebooksRes.error) {
        console.error("Ebooks fetch error:", ebooksRes.error);
        throw ebooksRes.error;
      }
      if (coursesRes.error) {
        console.error("Courses fetch error:", coursesRes.error);
        throw coursesRes.error;
      }
      if (freeCoursesRes.error) {
        console.error("Free courses fetch error:", freeCoursesRes.error);
        throw freeCoursesRes.error;
      }
      console.log("Fetched ebooks:", ebooksRes.data);
      setEbooks(ebooksRes.data || []);
      setCourses(coursesRes.data || []);
      setFreeCourses(freeCoursesRes.data || []);
    } catch (error) {
      console.error("Error fetching resources:", error);
      toast({
        title: "Error",
        description: "Failed to load resources",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };
  const handleAiQuery = () => {
    if (!aiQuery.trim()) return;
    toast({
      title: "AI Feature Coming Soon",
      description: "Personalized guidance will be available shortly!"
    });
    setAiQuery("");
  };
  return <div className="min-h-screen flex flex-col bg-background">
    <Header />

    <main className="flex-1">
      {/* Hero Section - Band 1 */}
      <section className="relative py-32 md:py-40 bg-gradient-to-br from-[#0B0E11] via-[#181A20] to-[#0B0E11] overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={resourcesHero}
            alt="Learning Resources"
            className="w-full h-full object-cover opacity-20"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0B0E11] via-[#0B0E11]/80 to-transparent" />
        </div>
        <div className="absolute top-20 right-20 w-96 h-96 bg-[#F0B90B]/5 rounded-full blur-3xl animate-pulse" />

        <div className="container relative z-10 px-4 text-center">
          <Badge className="mb-6 bg-[#F0B90B]/10 text-[#F0B90B] border-[#F0B90B]/20 px-4 py-2">
            <Sparkles className="h-4 w-4 mr-2" />
            Free & Premium Resources
          </Badge>
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 tracking-tight">
            Your Learning Hub for <span className="text-[#F0B90B]">Canadian Success</span>
          </h1>
          <p className="text-xl md:text-2xl text-white/70 max-w-3xl mx-auto mb-8 font-light leading-relaxed">
            Explore curated courses, e-books, and AI-powered guidance to accelerate your journey in Canada
          </p>
        </div>
      </section>

      {/* AI-Powered Trending Courses - Band 2 */}
      <section className="py-20 bg-background">
        <TrendingCoursesSection />
      </section>

      {/* Sample Course List - Band 3 */}
      <section className="py-24 md:py-32 bg-card border-y border-border">
        <div className="container max-w-6xl mx-auto px-6 md:px-8">
          {/* Section Header */}
          <div className="text-center mb-16 space-y-4">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-primary/10 mb-2">
              <BookOpen className="h-7 w-7 text-primary" />
            </div>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground">
              Essential Course list
            </h2>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto font-normal leading-relaxed">
              Curated Coursera courses to help you succeed in Canada
            </p>
          </div>

          {/* Course Table */}
          <div className="overflow-x-auto">
            <div className="inline-block min-w-full align-middle">
              <div className="overflow-hidden border border-border rounded-2xl">
                <table className="min-w-full divide-y divide-border">
                  <thead className="bg-muted">
                    <tr>
                      <th scope="col" className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                        Course
                      </th>
                      <th scope="col" className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                        Platform
                      </th>
                      <th scope="col" className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                        Focus
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border bg-card">
                    <tr className="hover:bg-muted/50 transition-colors">
                      <td className="px-6 py-4 text-sm font-medium text-foreground">
                        <a href="https://www.coursera.org/search?query=canada%20arrival" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors inline-flex items-center gap-2">
                          Canada Arrival Essentials
                          <ExternalLink className="h-4 w-4" />
                        </a>
                      </td>
                      <td className="px-6 py-4 text-sm text-muted-foreground">
                        <Badge variant="secondary">Coursera</Badge>
                      </td>
                      <td className="px-6 py-4 text-sm text-muted-foreground">
                        Covers permit types, PR pathways, settlement steps
                      </td>
                    </tr>
                    <tr className="hover:bg-muted/50 transition-colors">
                      <td className="px-6 py-4 text-sm font-medium text-foreground">
                        <a href="https://www.coursera.org/search?query=workplace%20communication%20canada" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors inline-flex items-center gap-2">
                          Workplace Communication in Canada
                          <ExternalLink className="h-4 w-4" />
                        </a>
                      </td>
                      <td className="px-6 py-4 text-sm text-muted-foreground">
                        <Badge variant="secondary">Coursera</Badge>
                      </td>
                      <td className="px-6 py-4 text-sm text-muted-foreground">
                        Canadian workplace etiquette & communication
                      </td>
                    </tr>
                    <tr className="hover:bg-muted/50 transition-colors">
                      <td className="px-6 py-4 text-sm font-medium text-foreground">
                        <a href="https://www.coursera.org/search?query=financial%20planning%20canada" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors inline-flex items-center gap-2">
                          Financial Planning for Newcomers
                          <ExternalLink className="h-4 w-4" />
                        </a>
                      </td>
                      <td className="px-6 py-4 text-sm text-muted-foreground">
                        <Badge variant="secondary">Coursera</Badge>
                      </td>
                      <td className="px-6 py-4 text-sm text-muted-foreground">
                        Managing bank accounts, credit, taxes
                      </td>
                    </tr>
                    <tr className="hover:bg-muted/50 transition-colors">
                      <td className="px-6 py-4 text-sm font-medium text-foreground">
                        <a href="https://www.coursera.org/search?query=healthcare%20system%20canada" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors inline-flex items-center gap-2">
                          Healthcare System in Canada
                          <ExternalLink className="h-4 w-4" />
                        </a>
                      </td>
                      <td className="px-6 py-4 text-sm text-muted-foreground">
                        <Badge variant="secondary">Coursera</Badge>
                      </td>
                      <td className="px-6 py-4 text-sm text-muted-foreground">
                        How to access healthcare and insurance
                      </td>
                    </tr>
                    <tr className="hover:bg-muted/50 transition-colors">
                      <td className="px-6 py-4 text-sm font-medium text-foreground">
                        <a href="https://www.coursera.org/search?query=resume%20job%20search%20canada" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors inline-flex items-center gap-2">
                          Resume & Job Search Skills
                          <ExternalLink className="h-4 w-4" />
                        </a>
                      </td>
                      <td className="px-6 py-4 text-sm text-muted-foreground">
                        <Badge variant="secondary">Coursera</Badge>
                      </td>
                      <td className="px-6 py-4 text-sm text-muted-foreground">
                        Writing Canadian-style resumes, networking
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Free Learning Section - Band 4 */}
      <section className="py-24 md:py-32 bg-card border-y border-border">
        <div className="container max-w-6xl mx-auto px-6 md:px-8">
          {/* Section Header */}
          <div className="text-center mb-20 space-y-4">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-primary/10 mb-2">
              <Gift className="h-7 w-7 text-primary" />
            </div>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground">
              Free Learning for a Smooth Canadian Journey
            </h2>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto font-normal leading-relaxed">
              Explore top free online programs that guide you through arrival, settlement, and integration in Canada
            </p>
          </div>

          {/* Course Cards */}
          {loading ? <div className="text-center py-20">
            <p className="text-muted-foreground text-lg">Loading courses...</p>
          </div> : freeCourses.length === 0 ? <div className="text-center py-20 space-y-4">
            <Gift className="h-16 w-16 mx-auto text-muted-foreground/40" />
            <p className="text-muted-foreground text-lg">No courses available yet.</p>
          </div> : <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {freeCourses.map((freeCourse, index) => {
              const images = [canadaStudy1, canadaStudy2, canadaStudy3];
              const courseImage = images[index % images.length];
              return <div key={freeCourse.id} className="group animate-fade-in" style={{
                animationDelay: `${index * 100}ms`
              }}>
                <div className="h-full flex flex-col bg-card rounded-3xl overflow-hidden border border-border transition-all duration-500 hover:shadow-[0_20px_50px_-15px_hsl(var(--primary)/0.3)] hover:border-primary/50 hover:-translate-y-1">
                  {/* Image */}
                  <div className="relative h-56 overflow-hidden">
                    <img src={courseImage} alt={freeCourse.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                    <div className="absolute inset-0 bg-gradient-to-t from-card/80 to-transparent" />
                  </div>

                  {/* Content */}
                  <div className="flex-1 p-8 space-y-4">
                    <h3 className="text-2xl font-bold text-foreground group-hover:text-primary transition-colors duration-300">
                      {freeCourse.title}
                    </h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {freeCourse.description}
                    </p>
                    <a href={freeCourse.external_url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-primary hover:text-primary/80 font-semibold transition-colors duration-300">
                      <span>Explore Free Course</span>
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  </div>
                </div>
              </div>;
            })}
          </div>}
        </div>
      </section>

      {/* CTA Section - Band 5 */}
      <section className="py-24 bg-background border-t border-border">
        <div className="container max-w-4xl mx-auto px-6 md:px-8 text-center space-y-8">
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground">
            Ready to start your journey?
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Join thousands of newcomers who have successfully settled in Canada with our guidance
          </p>
          <div className="pt-4">
            <Link to="/services">
              <button className="inline-flex items-center gap-2 px-8 py-5 bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl font-semibold text-lg transition-all duration-300 shadow-lg hover:shadow-xl">
                <span>Explore Services</span>
                <ArrowRight className="h-5 w-5" />
              </button>
            </Link>
          </div>
        </div>
      </section>
    </main>

    <Footer />
  </div>;
}