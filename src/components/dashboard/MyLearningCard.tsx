import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookOpen, GraduationCap, ArrowRight } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

interface LearningItem {
  id: string;
  title: string;
  type: string;
}

export function MyLearningCard() {
  const [ebooks, setEbooks] = useState<LearningItem[]>([]);
  const [courses, setCourses] = useState<LearningItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLearningMaterials();
  }, []);

  const fetchLearningMaterials = async () => {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) return;

      // Get purchased products from backend (already filtered for non-cancelled)
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/user/my-products`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const purchases = response.data.data || [];

      // Separate ebooks and courses from the backend response
      const ebookItems: LearningItem[] = [];
      const courseItems: LearningItem[] = [];

      purchases.forEach((product: any) => {
        if (product.type === 'ebook') {
          ebookItems.push({
            id: product._id,
            title: product.title,
            type: 'ebook'
          });
        } else if (product.type === 'course') {
          courseItems.push({
            id: product._id,
            title: product.title,
            type: 'course'
          });
        }
      });

      setEbooks(ebookItems.slice(0, 3)); // Show only first 3
      setCourses(courseItems.slice(0, 3)); // Show only first 3
    } catch (error) {
      console.error("Error fetching learning materials:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            My Learning
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Loading...</p>
        </CardContent>
      </Card>
    );
  }

  const totalItems = ebooks.length + courses.length;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BookOpen className="h-5 w-5" />
          My Learning
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {totalItems === 0 ? (
          <div className="text-center py-6">
            <BookOpen className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
            <p className="text-muted-foreground mb-3">
              No learning materials yet
            </p>
            <Button asChild variant="outline" size="sm">
              <Link to="/shop">
                Browse Courses
              </Link>
            </Button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="flex items-center gap-2">
                <BookOpen className="h-4 w-4 text-blue-500" />
                <span>{ebooks.length} E-book{ebooks.length !== 1 ? 's' : ''}</span>
              </div>
              <div className="flex items-center gap-2">
                <GraduationCap className="h-4 w-4 text-green-500" />
                <span>{courses.length} Course{courses.length !== 1 ? 's' : ''}</span>
              </div>
            </div>

            {(ebooks.length > 0 || courses.length > 0) && (
              <div className="space-y-2">
                <p className="text-sm font-medium">Recent Items:</p>
                <div className="space-y-1">
                  {[...ebooks.slice(0, 2), ...courses.slice(0, 2)].map((item, index) => (
                    <div key={`${item.type}-${item.id}`} className="flex items-center gap-2 text-sm text-muted-foreground">
                      {item.type === 'ebook' ? (
                        <BookOpen className="h-3 w-3 text-blue-500" />
                      ) : (
                        <GraduationCap className="h-3 w-3 text-green-500" />
                      )}
                      <span className="truncate">{item.title}</span>
                    </div>
                  ))}
                  {totalItems > 4 && (
                    <p className="text-xs text-muted-foreground">
                      +{totalItems - 4} more items
                    </p>
                  )}
                </div>
              </div>
            )}

            <Button asChild variant="outline" size="sm" className="w-full">
              <Link to="/profile/learning" className="flex items-center gap-2">
                View All Learning Materials
                <ArrowRight className="h-3 w-3" />
              </Link>
            </Button>
          </>
        )}
      </CardContent>
    </Card>
  );
}