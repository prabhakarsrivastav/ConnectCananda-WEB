import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { toast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { Calendar as CalendarIcon, CheckCircle2, Loader2, Phone, Mail, User, MessageSquare, Sparkles } from "lucide-react";
import { format } from "date-fns";

interface ConsultationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const ConsultationDialog = ({ open, onOpenChange }: ConsultationDialogProps) => {
  const { isAuthenticated, user } = useAuth();

  const [step, setStep] = useState<"details" | "success">("details");
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [consultationType, setConsultationType] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  // Pre-fill user data when dialog opens for authenticated users
  useEffect(() => {
    if (open && isAuthenticated && user) {
      setName(`${user.firstName} ${user.lastName}`);
      setEmail(user.email);
      setPhone(user.phone || "");
    }
  }, [open, isAuthenticated, user]);

  // Reset form when dialog closes
  useEffect(() => {
    if (!open) {
      setStep("details");
      setName("");
      setEmail("");
      setPhone("");
      setConsultationType("");
      setMessage("");
      setDate(new Date());
      setLoading(false);
    }
  }, [open]);

  const handleBooking = async () => {
    console.log('🎯 Consultation booking started');

    // Validate required fields
    if (!name || !email || !date || !consultationType) {
      toast({
        title: "Required Fields Missing",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast({
        title: "Invalid Email",
        description: "Please enter a valid email address",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      // Prepare consultation data
      const consultationData = {
        name,
        email,
        phone,
        consultationType,
        preferredDate: date.toISOString(),
        message,
        userId: isAuthenticated ? user?.id : null,
        status: 'pending'
      };

      console.log('📝 Consultation data:', consultationData);

      // Send to backend API
      const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
      const response = await fetch(`${API_BASE_URL}/consultations`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(isAuthenticated && { 'Authorization': `Bearer ${localStorage.getItem('authToken')}` })
        },
        body: JSON.stringify(consultationData)
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to book consultation');
      }

      console.log('✅ Consultation booked successfully:', result);

      toast({
        title: "Consultation Booked Successfully!",
        description: "We'll contact you within 24 hours to confirm your appointment.",
      });

      setStep("success");

    } catch (error: any) {
      console.error("❌ Consultation booking error:", error);

      let errorMessage = "Please try again or contact support.";

      if (error.message?.includes('Authentication')) {
        errorMessage = "Please sign in to book a consultation.";
      } else if (error.message?.includes('already exists')) {
        errorMessage = "You already have a pending consultation. Please wait for our team to contact you.";
      } else if (error.message?.includes('Invalid date')) {
        errorMessage = "Please select a future date for your consultation.";
      }

      toast({
        title: "Booking Failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    onOpenChange(false);
  };

  const consultationTypes = [
    { value: "immigration", label: "Arrival Consultation" },
    { value: "settlement", label: "Settlement Services" },
    { value: "job-search", label: "Job Search Support" },
    { value: "legal", label: "Legal Consultation" },
    { value: "education", label: "Education Planning" },
    { value: "business", label: "Business Setup" },
    { value: "general", label: "General Consultation" }
  ];

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto bg-gradient-to-br from-[#0B0E11] via-[#0f1419] to-[#0B0E11] border-[#F0B90B]/30 shadow-2xl">
        <DialogHeader className="space-y-4 pb-6 border-b border-[#2b3139]">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#F0B90B] to-[#F3BA2F] flex items-center justify-center shadow-lg">
              <Sparkles className="w-7 h-7 text-[#0B0E11]" />
            </div>
            <div>
              <DialogTitle className="text-2xl font-bold text-white">
                {step === "success" ? "Consultation Booked!" : "Book Free Consultation"}
              </DialogTitle>
              <DialogDescription className="text-[#848e9c] text-base mt-1">
                {step === "success"
                  ? "Your consultation has been scheduled successfully"
                  : "Get expert guidance for your Canadian journey"}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        {step === "details" && (
          <div className="space-y-4 py-4">
            <div className="p-5 rounded-xl bg-gradient-to-r from-[#F0B90B]/20 via-[#F0B90B]/10 to-transparent border border-[#F0B90B]/30 shadow-lg">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-[#F0B90B]/30 shadow-md">
                  <MessageSquare className="h-6 w-6 text-[#F0B90B]" />
                </div>
                <div>
                  <h4 className="font-bold text-white text-lg">Free Consultation</h4>
                  <p className="text-sm text-[#F0B90B]/80">30-minute personalized session with experts</p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name" className="text-white flex items-center gap-2 font-semibold mb-2">
                    <User className="h-4 w-4 text-[#F0B90B]" />
                    Full Name {!isAuthenticated && "*"}
                  </Label>
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    disabled={isAuthenticated}
                    className="bg-[#181a20] border-[#2b3139] text-white disabled:opacity-60 disabled:cursor-not-allowed h-11 focus:border-[#F0B90B] focus:ring-[#F0B90B]"
                    placeholder="John Doe"
                  />
                </div>

                <div>
                  <Label htmlFor="email" className="text-white flex items-center gap-2 font-semibold mb-2">
                    <Mail className="h-4 w-4 text-[#F0B90B]" />
                    Email {!isAuthenticated && "*"}
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={isAuthenticated}
                    className="bg-[#181a20] border-[#2b3139] text-white disabled:opacity-60 disabled:cursor-not-allowed h-11 focus:border-[#F0B90B] focus:ring-[#F0B90B]"
                    placeholder="john@example.com"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="phone" className="text-white flex items-center gap-2 font-semibold mb-2">
                    <Phone className="h-4 w-4 text-[#F0B90B]" />
                    Phone Number
                  </Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="bg-[#181a20] border-[#2b3139] text-white h-11 focus:border-[#F0B90B] focus:ring-[#F0B90B]"
                    placeholder="+1 (555) 000-0000"
                  />
                </div>

                <div>
                  <Label htmlFor="consultationType" className="text-white font-semibold mb-2 block">
                    Consultation Type *
                  </Label>
                  <Select value={consultationType} onValueChange={setConsultationType}>
                    <SelectTrigger className="bg-[#181a20] border-[#2b3139] text-white h-11 focus:border-[#F0B90B] focus:ring-[#F0B90B]">
                      <SelectValue placeholder="Select consultation type" />
                    </SelectTrigger>
                    <SelectContent className="bg-[#181a20] border-[#2b3139]">
                      {consultationTypes.map((type) => (
                        <SelectItem key={type.value} value={type.value} className="text-white hover:bg-[#2b3139]">
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label className="text-white mb-3 block font-semibold">
                  <CalendarIcon className="h-4 w-4 inline mr-2 text-[#F0B90B]" />
                  Preferred Date *
                </Label>
                <div className="flex justify-center">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    disabled={(date) => date < new Date()}
                    className="rounded-md border border-[#2b3139] bg-[#181a20] p-3 w-fit"
                  />
                </div>
                {date && (
                  <p className="text-sm text-[#848e9c] text-center mt-2">
                    Selected: {format(date, "EEEE, MMMM d, yyyy")}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="message" className="text-white font-semibold mb-2 block">
                  <MessageSquare className="h-4 w-4 inline mr-2 text-[#F0B90B]" />
                  Message / Specific Questions
                </Label>
                <Textarea
                  id="message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="bg-[#181a20] border-[#2b3139] text-white min-h-[100px] focus:border-[#F0B90B] focus:ring-[#F0B90B] resize-none"
                  placeholder="Tell us about your situation and what you'd like to discuss..."
                />
              </div>
            </div>

            <div className="flex gap-3 pt-6 border-t border-[#2b3139]">
              <Button
                variant="outline"
                onClick={handleClose}
                className="flex-1 border-[#2b3139] text-white hover:bg-[#181a20] h-12"
                disabled={loading}
              >
                Cancel
              </Button>
              <Button
                onClick={handleBooking}
                disabled={loading}
                className="flex-1 bg-gradient-to-r from-[#F0B90B] to-[#F3BA2F] text-black hover:from-[#F3BA2F] hover:to-[#F0B90B] font-bold h-12 shadow-lg"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Booking...
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="mr-2 h-5 w-5" />
                    Book Consultation
                  </>
                )}
              </Button>
            </div>

            <div className="text-sm text-[#848e9c] text-center pt-4 space-y-1 bg-[#181a20]/50 p-4 rounded-lg">
              <p className="flex items-center justify-center gap-2"><CheckCircle2 className="h-4 w-4 text-[#F0B90B]" /> Free 30-minute consultation</p>
              <p className="flex items-center justify-center gap-2"><CheckCircle2 className="h-4 w-4 text-[#F0B90B]" /> Available Monday to Friday, 9 AM - 5 PM EST</p>
              <p className="flex items-center justify-center gap-2"><CheckCircle2 className="h-4 w-4 text-[#F0B90B]" /> We'll confirm within 24 hours</p>
            </div>
          </div>
        )}

        {step === "success" && (
          <div className="py-8 text-center space-y-4">
            <div className="flex justify-center">
              <div className="h-16 w-16 rounded-full bg-[#02c076]/10 flex items-center justify-center">
                <CheckCircle2 className="h-8 w-8 text-[#02c076]" />
              </div>
            </div>

            <div className="space-y-2">
              <p className="text-white text-lg font-semibold">
                Consultation Booked Successfully!
              </p>
              <p className="text-[#F0B90B] font-medium">
                {date && format(date, "EEEE, MMMM d, yyyy")}
              </p>
              <p className="text-sm text-[#848e9c]">
                We'll send a confirmation email to {email}
              </p>
            </div>

            <div className="space-y-2 text-sm text-[#848e9c] bg-[#181a20] p-4 rounded-lg">
              <p className="font-medium text-white">What happens next?</p>
              <p>• Our team will contact you within 24 hours</p>
              <p>• We'll confirm your preferred date and time</p>
              <p>• Consultation can be via phone or video call</p>
              <p>• Free 30-minute personalized session</p>
            </div>

            <Button
              onClick={handleClose}
              className="w-full bg-[#F0B90B] text-black hover:bg-[#F0B90B]/90"
            >
              Done
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
