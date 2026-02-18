import { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { GraduationCap, Clock, BarChart3 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { Link } from "react-router-dom";
import coursesHeroImg from "@/assets/courses-hero.jpg";

interface Course {
  id: string;
  title: string;
  description: string;
  thumbnail: string | null;
  price: number;
  is_free: boolean;
  sales_count: number;
}

export default function Courses() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const { data, error } = await supabase
        .from("courses")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setCourses(data || []);
    } catch (error) {
      console.error("Error fetching courses:", error);
      toast({
        title: "Error",
        description: "Failed to load courses",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 bg-background">
        <section className="relative py-24 md:py-32 bg-gradient-to-br from-[#0B0E11] via-[#181A20] to-[#0B0E11] overflow-hidden border-b border-border">
          <div className="absolute inset-0">
            <img 
              src={coursesHeroImg} 
              alt="Online Courses" 
              className="w-full h-full object-cover opacity-15"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0B0E11] via-[#0B0E11]/90 to-transparent" />
          </div>
          <div className="absolute bottom-20 left-20 w-80 h-80 bg-[#F0B90B]/5 rounded-full blur-3xl animate-pulse" />
          
          <div className="container relative z-10 px-4 text-center">
            <div className="inline-flex items-center justify-center p-3 bg-[#F0B90B]/10 rounded-full mb-6 backdrop-blur-sm border border-[#F0B90B]/20">
              <GraduationCap className="h-8 w-8 text-[#F0B90B]" />
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-6 text-white tracking-tight">
              Expert-Led <span className="text-[#F0B90B]">E-Courses</span>
            </h1>
            <p className="text-lg md:text-xl text-white/70 max-w-2xl mx-auto font-light leading-relaxed">
              Learn at your own pace with expert-led video courses designed for your Canadian success
            </p>
          </div>
        </section>

        <section className="container px-4 py-12">
          {loading ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Loading courses...</p>
            </div>
          ) : courses.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No courses available yet.</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {courses.map((course) => (
                <Card
                  key={course.id}
                  className="group overflow-hidden hover:shadow-xl transition-all duration-300"
                >
                  <Link to={`/courses/${course.id}`}>
                    <div className="aspect-video overflow-hidden bg-muted relative">
                      {course.thumbnail ? (
                        <img
                          src={course.thumbnail}
                          alt={course.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <GraduationCap className="h-16 w-16 text-muted-foreground" />
                        </div>
                      )}
                      {course.is_free && (
                        <Badge className="absolute top-3 right-3 bg-secondary">FREE</Badge>
                      )}
                    </div>
                  </Link>

                  <div className="p-6 space-y-4">
                    <div>
                      <Link to={`/courses/${course.id}`}>
                        <h3 className="font-bold text-xl mb-2 line-clamp-2 hover:text-primary transition-colors">
                          {course.title}
                        </h3>
                      </Link>
                      <p className="text-sm text-muted-foreground line-clamp-3">{course.description}</p>
                    </div>

                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        <span>Self-paced</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <BarChart3 className="h-4 w-4" />
                        <span>All Levels</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-border">
                      <div>
                        {course.is_free ? (
                          <span className="text-lg font-bold text-secondary">FREE</span>
                        ) : (
                          <span className="text-lg font-bold">${course.price}</span>
                        )}
                        <p className="text-xs text-muted-foreground">{course.sales_count} enrolled</p>
                      </div>
                      <Link to={`/courses/${course.id}`}>
                        <Button size="sm" className="group-hover:shadow-glow">
                          Enroll Now
                        </Button>
                      </Link>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </section>
      </main>

      <Footer />
    </div>
  );
}
