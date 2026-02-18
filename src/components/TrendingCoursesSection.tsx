import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TrendingUp, Target, ExternalLink, Sparkles, GraduationCap, Zap } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import canadaCoursesHero from "@/assets/canada-courses-hero.jpg";
interface Course {
  title: string;
  provider: string;
  description: string;
  link: string;
  tags: string[];
}
export default function TrendingCoursesSection() {
  const {
    toast
  } = useToast();
  const [profession, setProfession] = useState("");
  const [province, setProvince] = useState("");
  const [pathway, setPathway] = useState("");
  const [courses, setCourses] = useState<Course[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState("all");
  const handleGenerateCourses = async () => {
    if (!profession || !province || !pathway) {
      toast({
        title: "Missing Information",
        description: "Please fill in all fields to get personalized recommendations.",
        variant: "destructive"
      });
      return;
    }
    setIsGenerating(true);
    try {
      const {
        data,
        error
      } = await supabase.functions.invoke('fetch-coursera-courses', {
        body: {
          profession,
          province,
          pathway
        }
      });
      if (error) throw error;
      setCourses(data.courses || []);
      if (data.courses && data.courses.length > 0) {
        toast({
          title: "Courses Found!",
          description: `We found ${data.courses.length} courses tailored for you.`
        });
      }
    } catch (error) {
      console.error('Error fetching courses:', error);
      toast({
        title: "Error",
        description: "Failed to fetch courses. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };
  const filteredCourses = selectedFilter === "all" ? courses : courses.filter(course => course.tags.some(tag => tag.toLowerCase().includes(selectedFilter.toLowerCase())));
  return <div className="w-full bg-background">
    {/* Hero Section */}
    <section className="relative overflow-hidden bg-background py-20 border-b border-border">
      <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent" />
      <div className="container px-4 text-center relative z-10">
        <div className="inline-flex items-center justify-center p-3 bg-primary/10 rounded-2xl mb-6 shadow-[0_0_20px_hsl(var(--primary)/0.3)] animate-pulse">
          <Sparkles className="h-7 w-7 text-primary" />
        </div>
        <h1 className="text-5xl md:text-6xl font-bold mb-4 text-foreground tracking-tight animate-fade-in">
          AI-Powered Trending Courses
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-10 animate-fade-in" style={{ animationDelay: "200ms" }}>
          Find the most valuable courses to complete before arriving in Canada.
        </p>

        {/* Illustration */}
        <div className="max-w-2xl mx-auto mb-10 animate-scale-in" style={{ animationDelay: "400ms" }}>
          <img src={canadaCoursesHero} alt="Online learning courses for Canada preparation" className="w-full h-auto rounded-3xl shadow-[0_0_50px_hsl(var(--primary)/0.3)] border border-border hover:scale-110 transition-all duration-700 animate-fade-in" style={{ animationDelay: "500ms" }} />
        </div>

        <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-md px-10 py-6 text-lg font-medium shadow-[0_0_30px_hsl(var(--primary)/0.3)] hover:shadow-[0_0_40px_hsl(var(--primary)/0.5)] transition-all" onClick={() => document.getElementById('course-finder')?.scrollIntoView({
          behavior: 'smooth'
        })}>
          Discover My Courses
        </Button>
      </div>
    </section>

    {/* How We Curate Section */}
    <section className="container px-4 py-16 bg-background">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-foreground mb-3">How We Curate</h2>
        <p className="text-muted-foreground">AI-powered recommendations tailored to your journey</p>
      </div>

      <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
        <Card className="p-8 text-center bg-card border-border hover:border-primary/50 hover:shadow-[0_0_30px_hsl(var(--primary)/0.2)] transition-all duration-300 animate-fade-in hover-scale" style={{ animationDelay: "0ms" }}>
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-2xl mb-4">
            <TrendingUp className="h-8 w-8 text-primary" />
          </div>
          <h3 className="text-xl font-semibold text-foreground mb-3">Trend Analysis</h3>
          <p className="text-muted-foreground text-sm leading-relaxed">
            AI scans Canadian job & arrival trends
          </p>
        </Card>

        <Card className="p-8 text-center bg-card border-border hover:border-primary/50 hover:shadow-[0_0_30px_hsl(var(--primary)/0.2)] transition-all duration-300 animate-fade-in hover-scale" style={{ animationDelay: "150ms" }}>
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-2xl mb-4">
            <Target className="h-8 w-8 text-primary" />
          </div>
          <h3 className="text-xl font-semibold text-foreground mb-3">Personal Match</h3>
          <p className="text-muted-foreground text-sm leading-relaxed">
            Suggests courses that fit your profile
          </p>
        </Card>

        <Card className="p-8 text-center bg-card border-border hover:border-primary/50 hover:shadow-[0_0_30px_hsl(var(--primary)/0.2)] transition-all duration-300 animate-fade-in hover-scale" style={{ animationDelay: "300ms" }}>
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-2xl mb-4">
            <Zap className="h-8 w-8 text-primary" />
          </div>
          <h3 className="text-xl font-semibold text-foreground mb-3">Faster Start</h3>
          <p className="text-muted-foreground text-sm leading-relaxed">
            Arrive prepared and employable
          </p>
        </Card>
      </div>
    </section>

    {/* Interactive Course Finder Section */}


    {/* AI Results Section */}
    {courses.length > 0 && <section className="container px-4 py-16 bg-background">
      <div className="max-w-6xl mx-auto">
        {/* Filters */}
        <div className="flex flex-wrap gap-3 justify-center mb-12">
          {["all", "Language", "IT & Tech", "Business", "Healthcare", "Life Skills"].map(filter => <Button key={filter} variant={selectedFilter === filter ? "default" : "outline"} onClick={() => setSelectedFilter(filter)} className={`px-6 ${selectedFilter === filter ? "bg-primary text-primary-foreground hover:bg-primary/90" : "border-border text-muted-foreground hover:border-primary/50 hover:bg-primary/10"}`}>
            {filter === "all" ? "All" : filter}
          </Button>)}
        </div>

        {/* Course Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map((course, index) => <Card key={index} className="overflow-hidden bg-card border-border hover:border-primary/50 hover:shadow-[0_0_30px_hsl(var(--primary)/0.2)] transition-all duration-300 transform hover:-translate-y-1 animate-fade-in" style={{ animationDelay: `${index * 100}ms` }}>
            <CardContent className="p-6">
              <div className="mb-4">
                <div className="flex items-center gap-2 mb-3 flex-wrap">
                  <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20">
                    {course.provider}
                  </Badge>
                  {course.tags.map((tag, i) => <Badge key={i} variant="outline" className="text-xs border-border">
                    {tag}
                  </Badge>)}
                </div>
                <h3 className="font-bold text-lg text-foreground mb-2 line-clamp-2">
                  {course.title}
                </h3>
                <p className="text-sm text-muted-foreground line-clamp-3">
                  {course.description}
                </p>
              </div>

              <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground shadow-[0_0_20px_hsl(var(--primary)/0.2)] hover:shadow-[0_0_30px_hsl(var(--primary)/0.3)] transition-all" asChild>
                <a href={course.link} target="_blank" rel="noopener noreferrer">
                  Enroll Now
                  <ExternalLink className="h-4 w-4 ml-2" />
                </a>
              </Button>
            </CardContent>
          </Card>)}
        </div>
      </div>
    </section>}

    {/* CTA Footer */}
    <section className="w-full bg-gradient-to-r from-primary/10 via-primary/5 to-primary/10 py-16 border-t border-border">
      <div className="container px-4 text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
          Learn Now. Land Confidently.
        </h2>
        <p className="text-muted-foreground mb-8 text-lg">
          Join thousands of newcomers who arrived in Canada fully prepared
        </p>
        <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground px-10 py-6 text-lg font-medium shadow-[0_0_30px_hsl(var(--primary)/0.3)] hover:shadow-[0_0_40px_hsl(var(--primary)/0.5)] transition-all" onClick={() => document.getElementById('course-finder')?.scrollIntoView({
          behavior: 'smooth'
        })}>
          Start Learning Free
        </Button>
      </div>
    </section>
  </div>;
}