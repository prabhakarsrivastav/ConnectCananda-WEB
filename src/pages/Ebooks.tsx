import { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { BookOpen, Download, DollarSign } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import ebooksHeroImg from "@/assets/ebooks-hero.jpg";

interface Ebook {
  id: string;
  title: string;
  description: string;
  cover_image: string | null;
  price: number;
  is_free: boolean;
  pdf_url: string;
}

export default function Ebooks() {
  const [ebooks, setEbooks] = useState<Ebook[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedEbook, setSelectedEbook] = useState<Ebook | null>(null);
  const [downloadModalOpen, setDownloadModalOpen] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchEbooks();
  }, []);

  const fetchEbooks = async () => {
    try {
      const { data, error } = await supabase
        .from("ebooks")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setEbooks(data || []);
    } catch (error) {
      console.error("Error fetching ebooks:", error);
      toast({
        title: "Error",
        description: "Failed to load e-books",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEbookClick = (ebook: Ebook) => {
    setSelectedEbook(ebook);
    if (ebook.is_free) {
      setDownloadModalOpen(true);
    } else {
      toast({
        title: "Coming Soon",
        description: "Payment integration coming soon!",
      });
    }
  };

  const handleFreeDownload = async () => {
    if (!selectedEbook || !name || !email) {
      toast({
        title: "Required Fields",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    setSubmitting(true);
    try {
      const { error } = await supabase.from("download_requests").insert({
        ebook_id: selectedEbook.id,
        email,
        phone: phone || null,
      });

      if (error) throw error;

      const { data: urlData } = supabase.storage
        .from("ebook-files")
        .getPublicUrl(selectedEbook.pdf_url);

      window.open(urlData.publicUrl, "_blank");

      toast({
        title: "Success!",
        description: "Your download has started. Check your email for the link.",
      });

      setDownloadModalOpen(false);
      setName("");
      setEmail("");
      setPhone("");
      setSelectedEbook(null);
    } catch (error) {
      console.error("Error processing download:", error);
      toast({
        title: "Error",
        description: "Failed to process download request",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 bg-background">
        <section className="relative py-24 md:py-32 bg-gradient-to-br from-[#0B0E11] via-[#181A20] to-[#0B0E11] overflow-hidden border-b border-border">
          <div className="absolute inset-0">
            <img 
              src={ebooksHeroImg} 
              alt="E-Books Library" 
              className="w-full h-full object-cover opacity-15"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0B0E11] via-[#0B0E11]/90 to-transparent" />
          </div>
          <div className="absolute top-20 right-20 w-96 h-96 bg-[#F0B90B]/5 rounded-full blur-3xl animate-pulse" />
          
          <div className="container relative z-10 px-4 text-center">
            <div className="inline-flex items-center justify-center p-3 bg-[#F0B90B]/10 rounded-full mb-6 backdrop-blur-sm border border-[#F0B90B]/20">
              <BookOpen className="h-8 w-8 text-[#F0B90B]" />
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-6 text-white tracking-tight">
              Digital <span className="text-[#F0B90B]">E-Books Library</span>
            </h1>
            <p className="text-lg md:text-xl text-white/70 max-w-2xl mx-auto font-light leading-relaxed">
              Expert guides and resources to help you navigate your Canadian journey
            </p>
          </div>
        </section>

        <section className="container px-4 py-12">
          {loading ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Loading e-books...</p>
            </div>
          ) : ebooks.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No e-books available yet.</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {ebooks.map((ebook) => (
                <Card
                  key={ebook.id}
                  className="group overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer"
                  onClick={() => handleEbookClick(ebook)}
                >
                  <div className="aspect-[4/5] overflow-hidden bg-muted relative">
                    {ebook.cover_image ? (
                      <img
                        src={ebook.cover_image}
                        alt={ebook.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <BookOpen className="h-16 w-16 text-muted-foreground" />
                      </div>
                    )}
                    {ebook.is_free && (
                      <Badge className="absolute top-3 right-3 bg-primary">FREE</Badge>
                    )}
                  </div>

                  <div className="p-6 space-y-4">
                    <div>
                      <h3 className="font-bold text-xl mb-2 line-clamp-2">{ebook.title}</h3>
                      <p className="text-sm text-muted-foreground line-clamp-2">{ebook.description}</p>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-border">
                      {ebook.is_free ? (
                        <span className="text-lg font-bold text-primary">FREE</span>
                      ) : (
                        <span className="text-lg font-bold">${ebook.price}</span>
                      )}
                      <Button size="sm" className="group-hover:shadow-glow">
                        {ebook.is_free ? (
                          <>
                            <Download className="h-4 w-4 mr-2" />
                            Download
                          </>
                        ) : (
                          <>
                            <DollarSign className="h-4 w-4 mr-2" />
                            Buy Now
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </section>
      </main>

      <Footer />

      <Dialog open={downloadModalOpen} onOpenChange={setDownloadModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Download {selectedEbook?.title}</DialogTitle>
            <DialogDescription>
              Please provide your details to get your free e-book
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name *</Label>
              <Input
                id="name"
                placeholder="Your full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone (Optional)</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="+1 (555) 000-0000"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>
          </div>
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={() => setDownloadModalOpen(false)}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button onClick={handleFreeDownload} disabled={submitting} className="flex-1">
              {submitting ? "Processing..." : "Download"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
