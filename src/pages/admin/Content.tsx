import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AIEbookGenerator } from "@/components/admin/AIEbookGenerator";
import { ContentManager } from "@/components/admin/ContentManager";
import { FreeCoursesManager } from "@/components/admin/FreeCoursesManager";
import { Card } from "@/components/ui/card";

export default function AdminContent() {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-semibold text-gray-900">Content Management</h2>
        <p className="text-gray-600 mt-1">
          Manage e-books, courses, and generate new content
        </p>
      </div>

      <Card className="shadow-md border-gray-200 bg-white p-6">
        <Tabs defaultValue="generator" className="space-y-6">
          <TabsList className="bg-gray-100">
            <TabsTrigger value="generator">AI Generator</TabsTrigger>
            <TabsTrigger value="manage">Manage Content</TabsTrigger>
            <TabsTrigger value="free-courses">Free Courses</TabsTrigger>
          </TabsList>

          <TabsContent value="generator" className="space-y-6">
            <AIEbookGenerator />
          </TabsContent>

          <TabsContent value="manage" className="space-y-6">
            <ContentManager />
          </TabsContent>

          <TabsContent value="free-courses" className="space-y-6">
            <FreeCoursesManager />
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  );
}
