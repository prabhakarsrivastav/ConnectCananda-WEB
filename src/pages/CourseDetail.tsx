import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { GraduationCap, Clock, BarChart3, PlayCircle, FileText, CheckCircle2, Lock, AlertTriangle } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/hooks/use-toast";
import axios from "axios";

interface Course {
  _id: string;
  title: string;
  description: string;
  coverImage: string | null;
  thumbnail: string | null;
  price: number;
  type: string;
  salesCount: number;
}

export default function CourseDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [course, setCourse] = useState<Course | null>(null);
  const [hasAccess, setHasAccess] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetchCourseDetails();
    }
  }, [id, isAuthenticated]);

  useEffect(() => {
    // If user is authenticated and we have checked access, redirect if no access
    if (isAuthenticated && course && !hasAccess && !loading) {
      navigate("/my-learning");
    }
  }, [hasAccess, course, loading, isAuthenticated, navigate]);

  const fetchCourseDetails = async () => {
    if (!id) return;

    try {
      setLoading(true);

      // First, check if user has access to this course
      if (isAuthenticated && user) {
        try {
          const accessResponse = await axios.get(
            `${import.meta.env.VITE_API_URL}/user/access/product/${id}`,
            {
              headers: {
                'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
              },
            }
          );
          setHasAccess(accessResponse.data.data.hasAccess);
        } catch (accessError) {
          console.log('Access check failed:', accessError);
          setHasAccess(false);
        }
      }

      // Fetch course details from products API
      const courseResponse = await axios.get(`${import.meta.env.VITE_API_URL}/products`);
      const products = courseResponse.data.data || [];
      const courseData = products.find((p: any) => p._id === id);

      if (courseData) {
        setCourse({
          _id: courseData._id,
          title: courseData.title,
          description: courseData.description,
          coverImage: courseData.coverImage,
          thumbnail: courseData.thumbnail || courseData.coverImage,
          price: courseData.price,
          type: courseData.type,
          salesCount: courseData.salesCount || 0,
        });
      } else {
        toast({
          title: "Course Not Found",
          description: "The requested course could not be found.",
          variant: "destructive",
        });
        navigate("/ebooks");
      }
    } catch (error) {
      console.error("Error fetching course details:", error);
      toast({
        title: "Error",
        description: "Failed to load course details",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEnroll = async () => {
    if (!isAuthenticated) {
      toast({
        title: "Authentication Required",
        description: "Please log in to enroll in this course",
      });
      navigate("/auth");
      return;
    }

    if (course && course.price === 0) {
      // Free course - create purchase record
      try {
        const response = await axios.post(
          `${import.meta.env.VITE_API_URL}/payments/create-purchase`,
          {
            itemId: course._id,
            itemType: 'product',
            amount: 0,
          },
          {
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
            },
          }
        );

        toast({
          title: "Success!",
          description: "You've been enrolled in the course",
        });

        // Refresh access and redirect
        await fetchCourseDetails();
        navigate("/my-learning");
      } catch (error) {
        console.error("Error enrolling:", error);
        toast({
          title: "Error",
          description: "Failed to enroll in course",
          variant: "destructive",
        });
      }
    } else {
      toast({
        title: "Coming Soon",
        description: "Payment integration coming soon!",
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <p className="text-muted-foreground">Loading course...</p>
        </main>
        <Footer />
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <p className="text-muted-foreground">Course not found</p>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 bg-background">
        <section className="bg-gradient-card border-b border-border">
          <div className="container px-4 py-12">
            <div className="grid lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-6">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">Course</Badge>
                    {course.price === 0 && <Badge className="bg-secondary">FREE</Badge>}
                    {hasAccess && <Badge className="bg-green-500">ENROLLED</Badge>}
                  </div>
                  <h1 className="text-4xl md:text-5xl font-bold">{course.title}</h1>
                  <p className="text-lg text-muted-foreground">{course.description}</p>
                </div>

                <div className="flex flex-wrap items-center gap-6 text-sm">
                  <div className="flex items-center gap-2">
                    <GraduationCap className="h-5 w-5 text-primary" />
                    <span>{course.salesCount} students</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-5 w-5 text-primary" />
                    <span>Self-paced learning</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5 text-primary" />
                    <span>All levels</span>
                  </div>
                </div>
              </div>

              <Card className="p-6 h-fit sticky top-24">
                {course.thumbnail && (
                  <div className="aspect-video overflow-hidden rounded-lg mb-4">
                    <img
                      src={course.thumbnail}
                      alt={course.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <div className="space-y-4">
                  <div>
                    {course.price === 0 ? (
                      <p className="text-3xl font-bold text-secondary">FREE</p>
                    ) : (
                      <p className="text-3xl font-bold">${course.price}</p>
                    )}
                  </div>

                  {hasAccess ? (
                    <div className="space-y-4">
                      <div className="flex items-center gap-2 text-green-600">
                        <CheckCircle2 className="h-5 w-5" />
                        <span className="font-semibold">You have access to this course</span>
                      </div>
                      <Button
                        onClick={() => navigate("/my-learning")}
                        className="w-full"
                        size="lg"
                      >
                        Go to My Learning
                      </Button>
                    </div>
                  ) : (
                    <Button onClick={handleEnroll} className="w-full" size="lg">
                      {course.price === 0 ? "Enroll Free" : "Purchase Course"}
                    </Button>
                  )}

                  <Separator />
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-primary" />
                      <span>Lifetime access</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-primary" />
                      <span>Video lessons</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-primary" />
                      <span>Downloadable resources</span>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </section>

        <section className="container px-4 py-12">
          {hasAccess ? (
            <Card className="p-6">
              <h2 className="text-2xl font-bold mb-6">Course Content</h2>
              <div className="space-y-4">
                <div className="text-center py-8">
                  <PlayCircle className="h-16 w-16 mx-auto text-primary mb-4" />
                  <h3 className="text-xl font-semibold mb-2">Course Content Coming Soon</h3>
                  <p className="text-muted-foreground">
                    Video lessons and resources will be available here once the course content is uploaded.
                  </p>
                </div>
              </div>
            </Card>
          ) : (
            <Card className="p-6 border-2 border-dashed border-muted-foreground/25">
              <div className="text-center py-8">
                <Lock className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-xl font-semibold mb-2">Course Content Locked</h3>
                <p className="text-muted-foreground mb-4">
                  Enroll in this course to access the video lessons and resources.
                </p>
                <Button onClick={handleEnroll}>
                  {course.price === 0 ? "Enroll Free" : "Purchase Course"}
                </Button>
              </div>
            </Card>
          )}
        </section>
      </main>

      <Footer />
    </div>
  );
}
