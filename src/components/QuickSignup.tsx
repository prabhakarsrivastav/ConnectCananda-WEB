import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Loader2, Mail, Phone, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";

export const QuickSignup = () => {
  const [step, setStep] = useState<'contact' | 'otp'>('contact');
  const [contact, setContact] = useState('');
  const [otp, setOtp] = useState('');
  const [contactType, setContactType] = useState<'email' | 'phone'>('email');
  const [isLoading, setIsLoading] = useState(false);
  const [consent, setConsent] = useState(false);
  const { loginWithToken } = useAuth();
  const navigate = useNavigate();

  const [isExistingUser, setIsExistingUser] = useState(false);

  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!consent) {
      toast.error("Please agree to the terms and conditions to continue");
      return;
    }

    setIsLoading(true);

    try {
      // Remove mailto: prefix if present
      const cleanContact = contact.replace('mailto:', '');

      const url = `${import.meta.env.VITE_API_URL}/auth/send-otp`;
      console.log('📤 Sending OTP to:', url);
      console.log('📧 Contact:', cleanContact);

      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contact: cleanContact }),
      });

      console.log('📥 Response status:', response.status);
      const data = await response.json();
      console.log('📦 Response data:', data);

      if (response.ok) {
        setIsExistingUser(data.isExistingUser || false);
        toast.success(data.isExistingUser ? 'OTP sent! Login to continue' : 'OTP sent! Create your account');
        console.log('🔑 OTP (dev):', data.otp);
        setStep('otp');
      } else {
        console.error('❌ Error:', data.error);
        toast.error(data.error || 'Failed to send OTP');
      }
    } catch (error) {
      console.error('❌ Network error:', error);
      toast.error('Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const cleanContact = contact.replace('mailto:', '');

      const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/verify-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contact: cleanContact, otp }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success(isExistingUser ? 'Welcome back! 🎉' : 'Account created successfully! 🎉');
        loginWithToken(data.token, data.user);
        navigate(isExistingUser ? '/services' : '/profile/edit');
      } else {
        toast.error(data.error || 'Invalid OTP');
      }
    } catch (error) {
      toast.error('Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="card-padding-lg bg-gradient-to-br from-[#181A20] to-[#0B0E11] border-[#F0B90B]/10 shadow-[0_0_30px_rgba(240,185,11,0.1)] hover:border-[#F0B90B]/20 hover:shadow-[0_0_40px_rgba(240,185,11,0.15)] transition-all duration-500">
      <div className="space-y-6">
        <div>
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-white text-base md:text-lg font-semibold leading-tight uppercase pr-4">
              SUBSCRIBE TO OUR FREE EBOOKS,NEWSLETTER AND INFORMATION RESOURCES
            </h3>
            <div className="text-xs font-medium text-[#F0B90B] bg-[#F0B90B]/10 px-2 py-1 rounded-full border border-[#F0B90B]/20 shrink-0">
              Step {step === 'contact' ? '1' : '2'}/2
            </div>
          </div>
          <p className="text-xs text-white/70">
            {step === 'contact'
              ? 'Enter your email or phone number to subscribe'
              : 'Enter the OTP sent to your contact'
            }
          </p>
        </div>

        {/* Progress Bar */}
        <div className="flex gap-2">
          <div className="h-1 flex-1 rounded bg-[#F0B90B]" />
          <div className={`h-1 flex-1 rounded ${step === 'otp' ? 'bg-[#F0B90B]' : 'bg-[#F0B90B]/20'}`} />
        </div>

        {step === 'contact' ? (
          <form onSubmit={handleSendOTP} className="space-y-4">
            {/* Contact Type Toggle */}
            <div className="flex gap-2 p-1 bg-[#1a1d23] rounded-lg">
              <button
                type="button"
                onClick={() => setContactType('email')}
                className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded text-sm transition-all ${contactType === 'email'
                    ? 'bg-[#F0B90B] text-[#0B0E11] font-medium'
                    : 'text-white/60 hover:text-white/80'
                  }`}
              >
                <Mail className="h-4 w-4" />
                Email
              </button>
              <button
                type="button"
                onClick={() => setContactType('phone')}
                className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded text-sm transition-all ${contactType === 'phone'
                    ? 'bg-[#F0B90B] text-[#0B0E11] font-medium'
                    : 'text-white/60 hover:text-white/80'
                  }`}
              >
                <Phone className="h-4 w-4" />
                Phone
              </button>
            </div>

            <div>
              <Input
                type={contactType === 'email' ? 'email' : 'tel'}
                placeholder={contactType === 'email' ? 'your.email@example.com' : '+1 (555) 123-4567'}
                value={contact}
                onChange={(e) => setContact(e.target.value)}
                required
                className="bg-[#1a1d23] border-[#F0B90B]/20 text-white placeholder:text-white/50 focus:border-[#F0B90B]/40 focus:ring-1 focus:ring-[#F0B90B]/20"
              />
            </div>

            <div className="flex items-start space-x-2 pt-2">
              <Checkbox
                id="terms"
                checked={consent}
                onCheckedChange={(checked) => setConsent(checked as boolean)}
                className="mt-0.5 border-white/40 data-[state=checked]:bg-[#F0B90B] data-[state=checked]:text-[#0B0E11] data-[state=checked]:border-[#F0B90B]"
              />
              <label
                htmlFor="terms"
                className="text-[10px] text-white/60 leading-tight cursor-pointer font-light"
              >
                I agree to the Terms and Conditions. I understand that free newsletters and ebooks will be delivered every quarter, and I consent to receiving informational, marketing, and promotional calls and emails.
              </label>
            </div>

            <Button
              type="submit"
              className="w-full bg-[#F0B90B] hover:bg-[#F3BA2F] text-[#0B0E11] font-semibold hover:scale-105 hover:shadow-[0_0_25px_rgba(240,185,11,0.4)] transition-all duration-300"
              size="lg"
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Processing...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  Subscribe Now
                  <ArrowRight className="h-4 w-4" />
                </span>
              )}
            </Button>
          </form>
        ) : (
          <form onSubmit={handleVerifyOTP} className="space-y-4">
            <div>
              <p className="text-xs text-white/60 mb-2">
                OTP sent to: <span className="text-[#F0B90B]">{contact}</span>
              </p>
              <Input
                type="text"
                placeholder="Enter 6-digit OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                required
                maxLength={6}
                className="bg-[#1a1d23] border-[#F0B90B]/20 text-white placeholder:text-white/50 focus:border-[#F0B90B]/40 focus:ring-1 focus:ring-[#F0B90B]/20 text-center text-lg tracking-widest"
              />
            </div>

            <div className="flex gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setStep('contact');
                  setOtp('');
                }}
                className="border-[#F0B90B]/30 text-[#F0B90B] hover:bg-[#F0B90B]/10"
                disabled={isLoading}
              >
                Back
              </Button>
              <Button
                type="submit"
                className="flex-1 bg-[#F0B90B] hover:bg-[#F3BA2F] text-[#0B0E11] font-semibold hover:scale-105 hover:shadow-[0_0_25px_rgba(240,185,11,0.4)] transition-all duration-300"
                size="lg"
                disabled={isLoading || otp.length !== 6}
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Verifying...
                  </span>
                ) : (
                  isExistingUser ? 'Login' : 'Create Account'
                )}
              </Button>
            </div>
          </form>
        )}

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-[#F0B90B]/10" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-[#181A20] px-2 text-white/60">
              Or continue with
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Button
            type="button"
            variant="outline"
            className="w-full border-[#F0B90B]/30 text-[#F0B90B] hover:bg-[#F0B90B]/10 hover:text-[#F3BA2F] hover:border-[#F0B90B]/50 hover:scale-105 hover:shadow-[0_0_15px_rgba(240,185,11,0.2)] transition-all duration-300"
          >
            Google
          </Button>
          <Button
            type="button"
            variant="outline"
            className="w-full border-[#F0B90B]/30 text-[#F0B90B] hover:bg-[#F0B90B]/10 hover:text-[#F3BA2F] hover:border-[#F0B90B]/50 hover:scale-105 hover:shadow-[0_0_15px_rgba(240,185,11,0.2)] transition-all duration-300"
          >
            Facebook
          </Button>
        </div>

        <p className="text-xs text-center text-white/40">
          By signing up, you agree to our{" "}
          <a href="#" className="text-[#F0B90B] hover:text-[#F3BA2F] hover:underline transition-colors duration-300">
            Terms
          </a>{" "}
          and{" "}
          <a href="#" className="text-[#F0B90B] hover:text-[#F3BA2F] hover:underline transition-colors duration-300">
            Privacy Policy
          </a>
        </p>
      </div>
    </Card>
  );
};