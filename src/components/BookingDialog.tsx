import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { paymentService } from "@/services/paymentService";
import { Calendar as CalendarIcon, CreditCard, CheckCircle2, Loader2 } from "lucide-react";
import { format } from "date-fns";

interface BookingDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  service: {
    id: string;
    title: string;
    price: string;
    duration: string;
  };
}

export const BookingDialog = ({ open, onOpenChange, service }: BookingDialogProps) => {
  const { isAuthenticated, user, logout: contextLogout } = useAuth();
  const navigate = useNavigate();

  const [step, setStep] = useState<"details" | "payment" | "success">("details");
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);

  // Check authentication and pre-fill user data when dialog opens
  useEffect(() => {
    if (open) {
      if (!isAuthenticated) {
        // Redirect to login if not authenticated
        toast({
          title: "Authentication Required",
          description: "Please sign in to book a service.",
          variant: "destructive",
        });
        onOpenChange(false);
        navigate('/auth');
      } else if (user) {
        // Pre-fill form with user data
        setName(`${user.firstName} ${user.lastName}`);
        setEmail(user.email);
        setPhone(user.phone || "");
      }
    }
  }, [open, isAuthenticated, user, navigate, onOpenChange]);

  const priceNumber = service.price.replace(/[^0-9]/g, '');
  const amount = priceNumber ? parseInt(priceNumber) : 0;

  const handleBooking = async () => {
    console.log('🎯 handleBooking function called!');
    console.log('📝 Form data:', { name, email, phone, date, notes });
    console.log('💳 Service data:', service);

    // Only validate if user is not authenticated (fields are pre-filled for logged-in users)
    if (!isAuthenticated && (!name || !email || !date)) {
      console.log('❌ Form validation failed');
      toast({
        title: "Required Fields",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    if (!date) {
      console.log('❌ Date validation failed');
      toast({
        title: "Required Field",
        description: "Please select a preferred date",
        variant: "destructive",
      });
      return;
    }

    console.log('✅ Form validation passed, proceeding with payment...');

    setLoading(true);

    try {
      console.log('💳 Starting payment session creation...');
      console.log('🔐 Auth check:', { isAuthenticated, hasToken: !!localStorage.getItem('authToken') });

      // Create Stripe checkout session
      const response = await paymentService.createCheckoutSession(service.id);

      console.log('📤 Payment API Response:', response);
      console.log('📤 Response success:', response.success);
      console.log('📤 Response data:', response.data);

      if (response.success && response.data?.url) {
        console.log('✅ Got Stripe URL:', response.data.url);
        // Try using replace instead of href to avoid routing issues
        window.location.replace(response.data.url);
      } else {
        console.log('❌ Payment failed:', response);
        throw new Error(response.message || response.error || 'Failed to create payment session');
      }
    } catch (error) {
      console.error("Payment error:", error);
      console.error("Error details:", {
        message: error.message,
        stack: error.stack,
        status: error.status
      });

      let errorMessage = "Please try again or contact support.";

      // Check if authentication error - clear local state and redirect to auth
      if (error.message?.includes('Invalid or expired token') ||
          error.message?.includes('No token provided') ||
          error.message?.includes('User not found') ||
          error.message?.includes('Unauthorized')) {
        console.log('🔐 Authentication error detected - clearing local auth state and redirecting to login');
        contextLogout(); // Properly logout using context method

        // Show error message and redirect to auth
        toast({
          title: "Authentication Required",
          description: "Your session has expired. Please sign in to continue booking.",
          variant: "destructive",
        });

        // Close the dialog and navigate to auth
        handleClose();
        navigate('/auth');
        return; // Exit early, don't show the error toast again
      }

      // Provide more specific error messages based on error type
      if (error.message?.includes('Service not found')) {
        errorMessage = "The selected service is no longer available. Please select a different service.";
      } else if (error.message?.includes('Invalid service price')) {
        errorMessage = "There was an issue with the service pricing. Please contact support.";
      } else if (error.message?.includes('Failed to create checkout session')) {
        errorMessage = "Unable to process payment. Please check your connection and try again.";
      } else if (error.message?.includes('Authentication')) {
        errorMessage = "Please sign in again to continue with your booking.";
      }

      toast({
        title: "Payment Failed",
        description: errorMessage,
        variant: "destructive",
      });
      setLoading(false);
    }
  };

  const handleClose = () => {
    setStep("details");
    setName("");
    setEmail("");
    setPhone("");
    setNotes("");
    setDate(new Date());
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto bg-[#0B0E11] border-[#2b3139]">
        <DialogHeader>
          <DialogTitle className="text-xl text-white">
            {step === "success" ? "Booking Confirmed!" : "Book Service"}
          </DialogTitle>
          <DialogDescription className="text-[#848e9c]">
            {step === "success" 
              ? "Your booking has been confirmed" 
              : `Complete your booking for ${service.title}`}
          </DialogDescription>
        </DialogHeader>

        {step === "details" && (
          <div className="space-y-4 py-4">
            <div className="p-4 rounded-lg bg-[#181a20] border border-[#2b3139]">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h4 className="font-semibold text-white">{service.title}</h4>
                  <p className="text-sm text-[#848e9c]">{service.duration}</p>
                </div>
                <Badge className="bg-[#fcd535] text-black hover:bg-[#fcd535]/90">
                  {service.price}
                </Badge>
              </div>
            </div>

            <div className="space-y-3">
              {/* <div>
                <Label htmlFor="name" className="text-white">
                  Full Name {!isAuthenticated && "*"}
                </Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  disabled={isAuthenticated}
                  className="bg-[#181a20] border-[#2b3139] text-white disabled:opacity-60 disabled:cursor-not-allowed"
                  placeholder="John Doe"
                />
              </div>

              <div>
                <Label htmlFor="email" className="text-white">
                  Email {!isAuthenticated && "*"}
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isAuthenticated}
                  className="bg-[#181a20] border-[#2b3139] text-white disabled:opacity-60 disabled:cursor-not-allowed"
                  placeholder="john@example.com"
                />
              </div>

              <div>
                <Label htmlFor="phone" className="text-white">Phone Number</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  disabled={isAuthenticated}
                  className="bg-[#181a20] border-[#2b3139] text-white disabled:opacity-60 disabled:cursor-not-allowed"
                  placeholder="+1 (555) 000-0000"
                />
              </div> */}

              <div>
                <Label className="text-white mb-2 block">
                  <CalendarIcon className="h-4 w-4 inline mr-2" />
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
              </div>

              <div>
                <Label htmlFor="notes" className="text-white">Additional Notes</Label>
                <Textarea
                  id="notes"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="bg-[#181a20] border-[#2b3139] text-white min-h-[80px]"
                  placeholder="Any specific requirements or questions..."
                />
              </div>
            </div>

            <Separator className="bg-[#2b3139]" />

            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={handleClose}
                className="flex-1 border-[#2b3139] text-white hover:bg-[#181a20]"
              >
                Cancel
              </Button>
              <Button
                onClick={() => { console.log('🔘 Proceed to Payment button clicked!'); handleBooking(); }}
                disabled={loading}
                className="flex-1 bg-[#fcd535] text-black hover:bg-[#fcd535]/90"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating Payment...
                  </>
                ) : (
                  <>
                    <CreditCard className="mr-2 h-4 w-4" />
                    Proceed to Payment
                  </>
                )}
              </Button>
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
              <p className="text-white">
                Your booking has been confirmed for:
              </p>
              <p className="text-[#fcd535] font-semibold text-lg">
                {date && format(date, "MMMM d, yyyy")}
              </p>
              <p className="text-sm text-[#848e9c]">
                We'll send a confirmation email to {email}
              </p>
            </div>

            <Separator className="bg-[#2b3139]" />

            <div className="space-y-2 text-sm text-[#848e9c]">
              <p>• Check your email for booking details</p>
              <p>• Our team will contact you within 24 hours</p>
              <p>• Free cancellation up to 24h before</p>
            </div>

            <Button
              onClick={handleClose}
              className="w-full bg-[#fcd535] text-black hover:bg-[#fcd535]/90"
            >
              Done
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
