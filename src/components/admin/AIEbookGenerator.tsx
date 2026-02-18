import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { BookOpen, Sparkles, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

const SUGGESTED_TOPICS = [
  "Getting Your SIN Number in Canada",
  "Opening Your First Canadian Bank Account",
  "Understanding Canadian Healthcare System",
  "Finding Your First Job in Canada",
  "Renting an Apartment in Canada",
  "Canadian Driver's License Guide",
  "Understanding Canadian Taxes for Newcomers",
  "Building Credit History in Canada",
  "Canadian Education System Overview",
  "Networking in Canadian Professional Culture",
];

export function AIEbookGenerator() {
  const [topic, setTopic] = useState("");
  const [customTopic, setCustomTopic] = useState("");
  const [generating, setGenerating] = useState(false);
  const [generatedContent, setGeneratedContent] = useState<string>("");

  const handleGenerate = async () => {
    const selectedTopic = customTopic || topic;
    
    if (!selectedTopic) {
      toast({
        title: "Topic Required",
        description: "Please select or enter a topic",
        variant: "destructive",
      });
      return;
    }

    setGenerating(true);
    setGeneratedContent("");

    try {
      const { data, error } = await supabase.functions.invoke('generate-ebook', {
        body: { topic: selectedTopic }
      });

      if (error) throw error;

      if (data?.success) {
        toast({
          title: "E-Book Generated!",
          description: `"${data.ebook.title}" has been created successfully`,
        });
        setGeneratedContent(data.ebook.content);
        setTopic("");
        setCustomTopic("");
      }
    } catch (error: any) {
      console.error('Error generating e-book:', error);
      toast({
        title: "Generation Failed",
        description: error.message || "Failed to generate e-book",
        variant: "destructive",
      });
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-primary/10 rounded-lg">
            <Sparkles className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h2 className="text-xl font-bold">AI E-Book Generator</h2>
            <p className="text-sm text-muted-foreground">
              Generate comprehensive e-books on Canadian journey topics
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Select a Suggested Topic</Label>
            <div className="grid gap-2">
              {SUGGESTED_TOPICS.map((suggestedTopic) => (
                <Button
                  key={suggestedTopic}
                  variant={topic === suggestedTopic ? "default" : "outline"}
                  className="justify-start h-auto py-3 px-4"
                  onClick={() => {
                    setTopic(suggestedTopic);
                    setCustomTopic("");
                  }}
                  disabled={generating}
                >
                  <BookOpen className="h-4 w-4 mr-2 flex-shrink-0" />
                  <span className="text-left">{suggestedTopic}</span>
                </Button>
              ))}
            </div>
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">Or</span>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="custom-topic">Custom Topic</Label>
            <Textarea
              id="custom-topic"
              placeholder="Enter your own topic for the e-book..."
              value={customTopic}
              onChange={(e) => {
                setCustomTopic(e.target.value);
                setTopic("");
              }}
              disabled={generating}
              rows={3}
            />
          </div>

          <Button
            onClick={handleGenerate}
            disabled={generating || (!topic && !customTopic)}
            className="w-full"
            size="lg"
          >
            {generating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating E-Book...
              </>
            ) : (
              <>
                <Sparkles className="mr-2 h-4 w-4" />
                Generate E-Book
              </>
            )}
          </Button>
        </div>
      </Card>

      {generatedContent && (
        <Card className="p-6">
          <h3 className="text-lg font-bold mb-4">Generated Content Preview</h3>
          <div className="bg-muted rounded-lg p-4 max-h-96 overflow-y-auto">
            <pre className="whitespace-pre-wrap text-sm">{generatedContent}</pre>
          </div>
        </Card>
      )}
    </div>
  );
}
