import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText } from "lucide-react";

export function DocumentsCard() {
  return (
    <Card className="p-6 bg-gradient-card border-border/50">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold">Documents</h2>
        <FileText className="h-5 w-5 text-muted-foreground" />
      </div>
      <div className="space-y-3">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">
            Uploaded Files
          </span>
          <span className="font-semibold">4</span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">
            Shared with You
          </span>
          <span className="font-semibold">2</span>
        </div>
      </div>
      <Button className="w-full mt-4" variant="outline" size="sm">
        Manage Documents
      </Button>
    </Card>
  );
}
