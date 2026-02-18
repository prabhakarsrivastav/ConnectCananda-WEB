import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Plus, Edit, Trash2, ExternalLink, GripVertical } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { Switch } from "@/components/ui/switch";

interface FreeCourse {
  id: string;
  title: string;
  description: string;
  thumbnail: string | null;
  external_url: string;
  display_order: number;
  is_active: boolean;
}

export function FreeCoursesManager() {
  const [courses, setCourses] = useState<FreeCourse[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState<FreeCourse | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    thumbnail: "",
    external_url: "",
    is_active: true,
  });

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const { data, error } = await supabase
        .from("free_external_courses")
        .select("*")
        .order("display_order", { ascending: true });

      if (error) throw error;
      setCourses(data || []);
    } catch (error) {
      console.error("Error fetching free courses:", error);
      toast({
        title: "Error",
        description: "Failed to load free courses",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (editingCourse) {
        const { error } = await supabase
          .from("free_external_courses")
          .update({
            ...formData,
            updated_at: new Date().toISOString(),
          })
          .eq("id", editingCourse.id);

        if (error) throw error;

        toast({
          title: "Success",
          description: "Course updated successfully",
        });
      } else {
        const maxOrder = courses.length > 0
          ? Math.max(...courses.map(c => c.display_order))
          : 0;

        const { error } = await supabase
          .from("free_external_courses")
          .insert({
            ...formData,
            display_order: maxOrder + 1,
          });

        if (error) throw error;

        toast({
          title: "Success",
          description: "Course added successfully",
        });
      }

      setIsDialogOpen(false);
      resetForm();
      fetchCourses();
    } catch (error) {
      console.error("Error saving course:", error);
      toast({
        title: "Error",
        description: "Failed to save course",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this course?")) return;

    try {
      const { error } = await supabase
        .from("free_external_courses")
        .delete()
        .eq("id", id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Course deleted successfully",
      });

      fetchCourses();
    } catch (error) {
      console.error("Error deleting course:", error);
      toast({
        title: "Error",
        description: "Failed to delete course",
        variant: "destructive",
      });
    }
  };

  const handleToggleActive = async (id: string, currentState: boolean) => {
    try {
      const { error } = await supabase
        .from("free_external_courses")
        .update({ is_active: !currentState })
        .eq("id", id);

      if (error) throw error;

      toast({
        title: "Success",
        description: `Course ${!currentState ? 'activated' : 'deactivated'} successfully`,
      });

      fetchCourses();
    } catch (error) {
      console.error("Error toggling course:", error);
      toast({
        title: "Error",
        description: "Failed to update course",
        variant: "destructive",
      });
    }
  };

  const handleEdit = (course: FreeCourse) => {
    setEditingCourse(course);
    setFormData({
      title: course.title,
      description: course.description,
      thumbnail: course.thumbnail || "",
      external_url: course.external_url,
      is_active: course.is_active,
    });
    setIsDialogOpen(true);
  };

  const resetForm = () => {
    setEditingCourse(null);
    setFormData({
      title: "",
      description: "",
      thumbnail: "",
      external_url: "",
      is_active: true,
    });
  };

  return (
    <Card className="p-6 shadow-md border-gray-200 bg-white">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-bold text-gray-900">Free External Courses</h3>
          <p className="text-sm text-gray-600">Manage free arrival courses</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={(open) => {
          setIsDialogOpen(open);
          if (!open) resetForm();
        }}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Add Course
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl bg-white">
            <DialogHeader>
              <DialogTitle>
                {editingCourse ? "Edit Course" : "Add New Course"}
              </DialogTitle>
              <DialogDescription>
                Add or edit a free external course for newcomers
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Course Title *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                  placeholder="e.g., Introduction to Arrival & Refugee Law"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  required
                  placeholder="Brief description (1-2 lines)"
                  rows={2}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="thumbnail">Emoji or Icon</Label>
                <Input
                  id="thumbnail"
                  value={formData.thumbnail}
                  onChange={(e) => setFormData({ ...formData, thumbnail: e.target.value })}
                  placeholder="e.g., 📚 or 🧳"
                  maxLength={2}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="external_url">External URL *</Label>
                <Input
                  id="external_url"
                  type="url"
                  value={formData.external_url}
                  onChange={(e) => setFormData({ ...formData, external_url: e.target.value })}
                  required
                  placeholder="https://example.com/course"
                />
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="is_active"
                  checked={formData.is_active}
                  onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
                />
                <Label htmlFor="is_active">Active (visible to users)</Label>
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setIsDialogOpen(false);
                    resetForm();
                  }}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button type="submit" className="flex-1">
                  {editingCourse ? "Update" : "Add"} Course
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {loading ? (
        <p className="text-center py-8 text-gray-600">Loading courses...</p>
      ) : courses.length === 0 ? (
        <p className="text-center py-8 text-gray-600">No courses yet. Add your first one!</p>
      ) : (
        <div className="border rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50">
                <TableHead className="w-12"></TableHead>
                <TableHead className="w-16">Icon</TableHead>
                <TableHead>Title</TableHead>
                <TableHead className="w-20">Status</TableHead>
                <TableHead className="w-32">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {courses.map((course) => (
                <TableRow key={course.id}>
                  <TableCell>
                    <GripVertical className="h-4 w-4 text-gray-400 cursor-move" />
                  </TableCell>
                  <TableCell className="text-2xl">{course.thumbnail || '📚'}</TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium text-gray-900">{course.title}</p>
                      <p className="text-sm text-gray-600 line-clamp-1">{course.description}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Switch
                      checked={course.is_active}
                      onCheckedChange={() => handleToggleActive(course.id, course.is_active)}
                    />
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => window.open(course.external_url, '_blank')}
                      >
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleEdit(course)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleDelete(course.id)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </Card>
  );
}
