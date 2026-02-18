import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileText, Image, BookOpen, Plus, ShoppingBag } from "lucide-react";
import { ProductManager } from "./ProductManager";

export function ContentManager() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Content Manager
          </div>
          <Button size="sm">
            <Plus className="h-4 w-4 mr-2" />
            New Content
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="products" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="products">Products</TabsTrigger>
            <TabsTrigger value="services">Services</TabsTrigger>
            <TabsTrigger value="banners">Banners</TabsTrigger>
            <TabsTrigger value="blog">Blog Posts</TabsTrigger>
          </TabsList>

          <TabsContent value="products" className="space-y-4">
            <ProductManager />
          </TabsContent>

          <TabsContent value="services" className="space-y-4">
            <div className="grid gap-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center">
                      <FileText className="h-6 w-6" />
                    </div>
                    <div>
                      <div className="font-medium">Service {i}</div>
                      <div className="text-sm text-muted-foreground">
                        Last updated: {new Date().toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline">Edit</Button>
                    <Button size="sm" variant="outline">Preview</Button>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="banners" className="space-y-4">
            <div className="grid gap-3">
              {[1, 2].map((i) => (
                <div key={i} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-20 h-12 bg-muted rounded-lg flex items-center justify-center">
                      <Image className="h-6 w-6" />
                    </div>
                    <div>
                      <div className="font-medium">Banner {i}</div>
                      <div className="text-sm text-muted-foreground">1920x400px</div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline">Edit</Button>
                    <Button size="sm" variant="outline">Upload</Button>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="blog" className="space-y-4">
            <div className="grid gap-3">
              {[1, 2].map((i) => (
                <div key={i} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center">
                      <BookOpen className="h-6 w-6" />
                    </div>
                    <div>
                      <div className="font-medium">Blog Post {i}</div>
                      <div className="text-sm text-muted-foreground">Draft</div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline">Edit</Button>
                    <Button size="sm">Publish</Button>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
