import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle2, ArrowLeft, Download, Calendar } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { paymentService } from "@/services/paymentService";

export default function PaymentSuccess() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user, isAuthenticated } = useAuth();

  console.log('✅ PaymentSuccess component rendered');
  console.log('- isAuthenticated:', isAuthenticated);
  console.log('- user:', user);
  console.log('- current URL:', window.location.href);

  // Note: Not redirecting on authentication status to ensure payment success page always shows
  // Users can access their bookings after payment without being logged in

  const sessionId = searchParams.get('session_id');

  useEffect(() => {
    const verifyPayment = async () => {
      if (sessionId && isAuthenticated) {
        try {
          console.log('Verifying payment with backend:', sessionId);
          // Call backend to verify payment and ensure purchase record exists
          const response = await paymentService.verifyPayment(sessionId);
          console.log('Payment verification response:', response);
        } catch (error) {
          console.error('Payment verification failed:', error);
          // Don't show error to user, just log it
        }
      }
    };

    verifyPayment();
  }, [sessionId, isAuthenticated]);

  return (
    <div className="min-h-screen flex flex-col bg-[#0B0E11]">
      <Header />

      <main className="flex-1 flex items-center justify-center py-16">
        <Card className="max-w-2xl w-full mx-4 p-8 bg-[#181a20] border-[#2b3139] text-center">
          {/* Success Icon */}
          <div className="flex justify-center mb-6">
            <div className="h-20 w-20 rounded-full bg-[#02c076]/10 flex items-center justify-center">
              <CheckCircle2 className="h-12 w-12 text-[#02c076]" />
            </div>
          </div>

          {/* Success Message */}
          <h1 className="text-3xl font-bold mb-4 text-white">
            Payment Successful!
          </h1>

          <p className="text-lg text-[#848e9c] mb-6">
            Thank you for your purchase. Your booking has been confirmed and you'll receive a confirmation email shortly.
          </p>

          {/* Session ID (if available) */}
          {sessionId && (
            <div className="bg-[#0B0E11] rounded-lg p-4 mb-6 border border-[#2b3139]">
              <p className="text-sm text-[#848e9c] mb-1">Transaction ID</p>
              <p className="text-white font-mono text-sm">{sessionId}</p>
            </div>
          )}

          {/* What happens next */}
          <div className="text-left bg-[#0B0E11] rounded-lg p-6 mb-8 border border-[#2b3139]">
            <h3 className="text-lg font-semibold mb-4 text-white">What's Next?</h3>
            <ul className="space-y-3 text-[#848e9c]">
              <li className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-[#02c076] mt-0.5 flex-shrink-0" />
                <span>Check your email for booking confirmation and details</span>
              </li>
              <li className="flex items-start gap-3">
                <Calendar className="h-5 w-5 text-[#02c076] mt-0.5 flex-shrink-0" />
                <span>Our consultant will contact you within 24 hours to schedule your session</span>
              </li>
              <li className="flex items-start gap-3">
                <Download className="h-5 w-5 text-[#02c076] mt-0.5 flex-shrink-0" />
                <span>Access your booking details in your profile under "Bookings"</span>
              </li>
            </ul>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              onClick={() => {
                if (isAuthenticated) {
                  navigate('/profile/bookings');
                } else {
                  navigate('/auth?redirect=/profile/bookings');
                }
              }}
              className="bg-[#fcd535] text-black hover:bg-[#fcd535]/90"
            >
              View My Bookings
            </Button>
            <Button
              onClick={() => navigate('/services')}
              className="border-[#2b3139] text-white hover:bg-[#181a20]"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Book Another Service
            </Button>
          </div>

          {/* Contact Support */}
          <div className="mt-8 pt-6 border-t border-[#2b3139]">
            <p className="text-sm text-[#848e9c]">
              Need help? Contact our support team at{" "}
              <a href="mailto:support@canadiannexus.com" className="text-[#fcd535] hover:underline">
                support@canadiannexus.com
              </a>
            </p>
          </div>
        </Card>
      </main>

      <Footer />
    </div>
  );
}
