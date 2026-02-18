import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { BookOpen, GraduationCap, Download, PlayCircle, FileText } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import axios from "axios";

interface Ebook {
  id: string;
  title: string;
  description: string;
  cover_image: string | null;
  pdf_url: string;
  status?: string;
  isCancelled?: boolean;
}

interface Course {
  id: string;
  title: string;
  description: string;
  thumbnail: string | null;
  status?: string;
  isCancelled?: boolean;
}

export default function MyLearning() {
  const navigate = useNavigate();
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const [loading, setLoading] = useState(true);
  const [myEbooks, setMyEbooks] = useState<Ebook[]>([]);
  const [myCourses, setMyCourses] = useState<Course[]>([]);

  useEffect(() => {
    if (!authLoading) {
      if (!isAuthenticated) {
        navigate("/auth");
        return;
      }
      fetchUserPurchases();
    }
  }, [authLoading, isAuthenticated, navigate]);

  const fetchUserPurchases = async () => {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        setLoading(false);
        return;
      }

      // Get purchased products from backend (already filtered for non-cancelled)
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/user/my-products`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const purchases = response.data.data || [];

      // Separate ebooks and courses from the backend response
      const ebooks: Ebook[] = [];
      const courses: Course[] = [];

      purchases.forEach((product: any) => {
        if (product.type === 'ebook') {
          ebooks.push({
            id: product._id,
            title: product.title,
            description: product.description,
            cover_image: product.coverImage,
            pdf_url: product.pdfUrl || '',
            status: product.status,
            isCancelled: product.isCancelled
          });
        } else if (product.type === 'course') {
          courses.push({
            id: product._id,
            title: product.title,
            description: product.description,
            thumbnail: product.thumbnail || product.coverImage,
            status: product.status,
            isCancelled: product.isCancelled
          });
        }
      });

      setMyEbooks(ebooks);
      setMyCourses(courses);
    } catch (error) {
      console.error("Error fetching purchases:", error);
      toast({
        title: "Error",
        description: "Failed to load your learning materials",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadEbook = (ebook: Ebook) => {
    if (ebook.isCancelled) {
      toast({
        title: "Access Denied",
        description: "Your order has been cancelled and this content is no longer available.",
        variant: "destructive",
      });
      return;
    }

    if (ebook.pdf_url) {
      // Create a temporary link to download the PDF
      const link = document.createElement('a');
      link.href = ebook.pdf_url;
      link.download = `${ebook.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast({
        title: "Download Started",
        description: "Your e-book download has started.",
      });
    } else {
      toast({
        title: "Download Unavailable",
        description: "This e-book is not available for download at the moment.",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <p className="text-muted-foreground">Loading...</p>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 bg-background">
        <div className="container px-4 py-12">
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-2">My Learning</h1>
            <p className="text-muted-foreground">
              Access all your e-books and courses in one place
            </p>
          </div>

          <Tabs defaultValue="ebooks" className="space-y-8">
            <TabsList className="grid w-full max-w-md grid-cols-2">
              <TabsTrigger value="ebooks" className="flex items-center gap-2">
                <BookOpen className="h-4 w-4" />
                My E-Books
              </TabsTrigger>
              <TabsTrigger value="courses" className="flex items-center gap-2">
                <GraduationCap className="h-4 w-4" />
                My Courses
              </TabsTrigger>
            </TabsList>

            <TabsContent value="ebooks" className="space-y-6">
              {myEbooks.length === 0 ? (
                <Card className="p-12 text-center">
                  <BookOpen className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-lg font-semibold mb-2">No E-Books Yet</h3>
                  <p className="text-muted-foreground mb-4">
                    Start building your library with our expert guides
                  </p>
                  <Button onClick={() => navigate("/ebooks")}>
                    Browse E-Books
                  </Button>
                </Card>
              ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {myEbooks.map((ebook) => (
                    <Card key={ebook.id} className={`overflow-hidden hover:shadow-lg transition-shadow ${ebook.isCancelled ? 'opacity-75' : ''}`}>
                      <div className="aspect-[4/5] overflow-hidden bg-muted">
                        {ebook.cover_image ? (
                          <img
                            src={ebook.cover_image}
                            alt={ebook.title}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <BookOpen className="h-16 w-16 text-muted-foreground" />
                          </div>
                        )}
                      </div>
                      <div className="p-6 space-y-4">
                        <div>
                          <h3 className="font-bold text-lg mb-2 line-clamp-2">
                            {ebook.title}
                          </h3>
                          <p className="text-sm text-muted-foreground line-clamp-2">
                            {ebook.description}
                          </p>
                          {ebook.isCancelled && (
                            <div className="mt-2 px-2 py-1 bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400 text-xs rounded">
                              Order Cancelled
                            </div>
                          )}
                        </div>
                        <Button
                          onClick={() => handleDownloadEbook(ebook)}
                          className="w-full"
                          variant={ebook.isCancelled ? "secondary" : "outline"}
                          disabled={ebook.isCancelled}
                        >
                          <Download className="h-4 w-4 mr-2" />
                          {ebook.isCancelled ? "Access Denied" : "Download PDF"}
                        </Button>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="courses" className="space-y-6">
              {myCourses.length === 0 ? (
                <Card className="p-12 text-center">
                  <GraduationCap className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-lg font-semibold mb-2">No Courses Yet</h3>
                  <p className="text-muted-foreground mb-4">
                    Start learning with our expert-led video courses
                  </p>
                  <Button onClick={() => navigate("/courses")}>
                    Browse Courses
                  </Button>
                </Card>
              ) : (
                <div className="space-y-6">
                  {myCourses.map((course) => (
                    <Card key={course.id} className={`overflow-hidden hover:shadow-lg transition-shadow ${course.isCancelled ? 'opacity-75' : ''}`}>
                      <div className="flex flex-col md:flex-row gap-6 p-6">
                        <div className="md:w-64 aspect-video overflow-hidden rounded-lg bg-muted flex-shrink-0">
                          {course.thumbnail ? (
                            <img
                              src={course.thumbnail}
                              alt={course.title}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <GraduationCap className="h-12 w-12 text-muted-foreground" />
                            </div>
                          )}
                        </div>
                        <div className="flex-1 space-y-4">
                          <div>
                            <h3 className="font-bold text-xl mb-2">{course.title}</h3>
                            <p className="text-muted-foreground">{course.description}</p>
                            {course.isCancelled && (
                              <div className="mt-2 px-2 py-1 bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400 text-xs rounded">
                                Order Cancelled
                              </div>
                            )}
                          </div>
                          <div className="space-y-2">
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-muted-foreground">Progress</span>
                              <span className="font-semibold">0%</span>
                            </div>
                            <Progress value={0} />
                          </div>
                          <div className="flex gap-3">
                            {course.isCancelled ? (
                              <div className="text-red-600 dark:text-red-400 font-medium">
                                Your order has been cancelled
                              </div>
                            ) : (
                              <>
                                <Button onClick={() => navigate(`/courses/${course.id}`)}>
                                  <PlayCircle className="h-4 w-4 mr-2" />
                                  Continue Learning
                                </Button>
                                <Button variant="outline">
                                  <FileText className="h-4 w-4 mr-2" />
                                  Resources
                                </Button>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <Footer />
    </div>
  );
}
