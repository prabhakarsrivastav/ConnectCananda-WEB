import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ArrowRight, Eye, EyeOff, Loader2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { toast } from "sonner";
import canadianJourneyImg from "@/assets/canadian-journey.jpg";
import { ConsultationDialog } from "@/components/ConsultationDialog";
import { QuickSignup } from "@/components/QuickSignup";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Skeleton Loader Component for form processing
const FormSkeleton = () => (
  <div className="space-y-4 animate-pulse">
    <div className="h-4 bg-[#F0B90B]/20 rounded w-3/4"></div>
    <div className="h-10 bg-[#F0B90B]/20 rounded"></div>
    <div className="h-10 bg-[#F0B90B]/20 rounded w-1/2"></div>
  </div>
);

export const Hero = () => {
  const { user, isAuthenticated, signup } = useAuth();
  const navigate = useNavigate();

  // Form state - Step by step signup
  const [step, setStep] = useState<'email' | 'firstName' | 'lastName' | 'password' | 'confirmPassword'>('email');
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [currentInput, setCurrentInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [showConsultationDialog, setShowConsultationDialog] = useState(false);
  const [signupMode, setSignupMode] = useState<'quick' | 'detailed'>('quick');

  // Helper function to get current step number
  const getStepNumber = () => {
    const steps = ['email', 'firstName', 'lastName', 'password', 'confirmPassword'];
    return steps.indexOf(step) + 1;
  };

  // Helper function to handle step transitions with animation
  const transitionToStep = (newStep: typeof step) => {
    setIsTransitioning(true);
    setTimeout(() => {
      setStep(newStep);
      setIsTransitioning(false);
    }, 150);
  };

  return (
    <section className="container px-4 py-20 md:py-10 bg-[#0B0E11]">
      <div className="grid lg:grid-cols-2 gap-12 items-center">
        {/* Left Content */}
        <div className="space-y-8">
          <div className="inline-block">
            {/*<span className="px-4 py-2 rounded-full bg-[#F0B90B]/10 text-[#F0B90B] text-sm font-medium border border-[#F0B90B]/20">
              Welcome to Canada 🇨🇦
            </span>*/}
          </div>

          <h1 className="text-white text-3xl md:text-4xl lg:text-5xl font-bold leading-tight">
            NAVIGATE YOUR CANADA SUCCESS JOURNEY WITH {" "}
            <span className="text-gold-dark-bg">
              CLARITY, CONFIDENCE AND SPEED.
            </span>
          </h1>

          <p className="text-lead text-white/80">
            We help people who are new to Canada connect with trusted and verified consultants, coaches, businesses, and mentors who have real experience. We also provide useful resources that guide them in finding their first entry-level job, starting a small business, settling in, and becoming part of the community.          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            <Button
              size="lg"
              className="group text-base bg-[#F0B90B] hover:bg-[#F3BA2F] text-[#0B0E11] font-semibold transition-all duration-300 hover:scale-105 hover:shadow-[0_0_30px_rgba(240,185,11,0.5)] hover:-translate-y-0.5"
            >
              Explore Services
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="text-base border-[#F0B90B]/30 text-[#F0B90B] hover:bg-[#F0B90B]/10 hover:text-[#F3BA2F] hover:border-[#F0B90B]/60 transition-all duration-300 hover:scale-105 hover:shadow-[0_0_20px_rgba(240,185,11,0.3)]"
              onClick={() => setShowConsultationDialog(true)}
            >
              Book Free Consultation
            </Button>
          </div>

          {/* Stats - Enhanced with hover effects and better mobile layout */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-8">
            <div className="group cursor-pointer transition-all duration-300 hover:scale-105 p-4 rounded-xl hover:bg-[#F0B90B]/5 border border-transparent hover:border-[#F0B90B]/20">
              <div className="text-3xl md:text-4xl font-bold text-[#F0B90B] group-hover:text-[#F3BA2F] transition-colors">
                12,000+
              </div>
              <div className="text-sm text-white/60 group-hover:text-white/80 transition-colors">
                Newcomers Helped
              </div>
            </div>
            <div className="group cursor-pointer transition-all duration-300 hover:scale-105 p-4 rounded-xl hover:bg-[#F0B90B]/5 border border-transparent hover:border-[#F0B90B]/20">
              <div className="text-3xl md:text-4xl font-bold text-[#F0B90B] group-hover:text-[#F3BA2F] transition-colors">
                120+
              </div>
              <div className="text-sm text-white/60 group-hover:text-white/80 transition-colors">
                Verified Consultants
              </div>
            </div>
            <div className="group cursor-pointer transition-all duration-300 hover:scale-105 p-4 rounded-xl hover:bg-[#F0B90B]/5 border border-transparent hover:border-[#F0B90B]/20">
              <div className="text-3xl md:text-4xl font-bold text-[#F0B90B] group-hover:text-[#F3BA2F] transition-colors">
                $2M+
              </div>
              <div className="text-sm text-white/60 group-hover:text-white/80 transition-colors">
                In Savings
              </div>
            </div>
          </div>
        </div>

        {/* Right Section - Quick Signup or Detailed Signup or Welcome Image */}
        {!isAuthenticated ? (
          <div className="space-y-4">
            <Tabs value={signupMode} onValueChange={(v) => setSignupMode(v as 'quick' | 'detailed')} className="w-full">
              {/* <TabsList className="grid w-full grid-cols-2 bg-[#1a1d23] border border-[#F0B90B]/20">
                <TabsTrigger value="quick" className="data-[state=active]:bg-[#F0B90B] data-[state=active]:text-[#0B0E11] text-white/70">
                  Quick Start
                </TabsTrigger>
                <TabsTrigger value="detailed" className="data-[state=active]:bg-[#F0B90B] data-[state=active]:text-[#0B0E11] text-white/70">
                  Detailed Setup
                </TabsTrigger>
              </TabsList> */}

              <TabsContent value="quick" className="mt-4">
                <QuickSignup />
              </TabsContent>

              <TabsContent value="detailed" className="mt-4">
                <Card className="card-padding-lg bg-gradient-to-br from-[#181A20] to-[#0B0E11] border-[#F0B90B]/10 shadow-[0_0_30px_rgba(240,185,11,0.1)] hover:border-[#F0B90B]/20 hover:shadow-[0_0_40px_rgba(240,185,11,0.15)] transition-all duration-500">
                  <div className="space-y-6">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-white">Get Started Today</h3>
                        <div className="text-sm font-medium text-[#F0B90B] bg-[#F0B90B]/10 px-3 py-1 rounded-full border border-[#F0B90B]/20">
                          Step {getStepNumber()}/5
                        </div>
                      </div>
                      <p className="text-small text-white/70 transition-all duration-300">
                        {step === 'email' && "Enter your email to create an account"}
                        {step === 'firstName' && "What's your first name?"}
                        {step === 'lastName' && "What's your last name?"}
                        {step === 'password' && "Create a secure password"}
                        {step === 'confirmPassword' && "Confirm your password"}
                      </p>
                    </div>

                    {/* Progress Indicator - Enhanced with step numbers */}
                    <div className="flex gap-2">
                      <div className={`h-1 flex-1 rounded transition-colors ${step === 'email' ? 'bg-[#F0B90B]' :
                        ['firstName', 'lastName', 'password', 'confirmPassword'].includes(step) ? 'bg-[#F0B90B]/50' :
                          'bg-[#F0B90B]/20'
                        }`} />
                      <div className={`h-1 flex-1 rounded transition-colors ${step === 'firstName' ? 'bg-[#F0B90B]' :
                        ['lastName', 'password', 'confirmPassword'].includes(step) ? 'bg-[#F0B90B]/50' :
                          'bg-[#F0B90B]/20'
                        }`} />
                      <div className={`h-1 flex-1 rounded transition-colors ${step === 'lastName' ? 'bg-[#F0B90B]' :
                        ['password', 'confirmPassword'].includes(step) ? 'bg-[#F0B90B]/50' :
                          'bg-[#F0B90B]/20'
                        }`} />
                      <div className={`h-1 flex-1 rounded transition-colors ${step === 'password' ? 'bg-[#F0B90B]' :
                        step === 'confirmPassword' ? 'bg-[#F0B90B]/50' :
                          'bg-[#F0B90B]/20'
                        }`} />
                      <div className={`h-1 flex-1 rounded transition-colors ${step === 'confirmPassword' ? 'bg-[#F0B90B]' : 'bg-[#F0B90B]/20'
                        }`} />
                    </div>

                    <form onSubmit={async (e) => {
                      e.preventDefault();
                      setIsLoading(true);

                      try {
                        // Handle each step
                        if (step === 'email') {
                          // Validate email
                          if (!currentInput || !/\S+@\S+\.\S+/.test(currentInput)) {
                            toast.error("Please enter a valid email address");
                            setIsLoading(false);
                            return;
                          }
                          setEmail(currentInput);
                          setCurrentInput("");
                          transitionToStep('firstName');
                        } else if (step === 'firstName') {
                          if (!currentInput || currentInput.trim().length < 2) {
                            toast.error("Please enter your first name");
                            setIsLoading(false);
                            return;
                          }
                          setFirstName(currentInput);
                          setCurrentInput("");
                          transitionToStep('lastName');
                        } else if (step === 'lastName') {
                          if (!currentInput || currentInput.trim().length < 2) {
                            toast.error("Please enter your last name");
                            setIsLoading(false);
                            return;
                          }
                          setLastName(currentInput);
                          setCurrentInput("");
                          transitionToStep('password');
                        } else if (step === 'password') {
                          if (!currentInput || currentInput.length < 6) {
                            toast.error("Password must be at least 6 characters");
                            setIsLoading(false);
                            return;
                          }
                          setPassword(currentInput);
                          setCurrentInput("");
                          transitionToStep('confirmPassword');
                        } else if (step === 'confirmPassword') {
                          if (currentInput !== password) {
                            toast.error("Passwords do not match!");
                            setIsLoading(false);
                            return;
                          }
                          setConfirmPassword(currentInput);

                          // All data collected, now signup
                          await signup({
                            email,
                            password,
                            firstName,
                            lastName
                          });
                          toast.success("Account created successfully! Welcome! 🎉");
                        }
                      } catch (error: any) {
                        toast.error(error.message || "An error occurred");
                      } finally {
                        setIsLoading(false);
                      }
                    }} className="space-y-4">
                      {/* Single Input Field that changes based on step - with fade animation */}
                      <div
                        className={`transition-all duration-300 ${isTransitioning ? 'opacity-0 translate-y-2' : 'opacity-100 translate-y-0'
                          }`}
                        key={step}
                      >
                        <label className="text-sm font-medium mb-2 block text-white">
                          {step === 'email' && "Email Address"}
                          {step === 'firstName' && "First Name"}
                          {step === 'lastName' && "Last Name"}
                          {step === 'password' && "Password"}
                          {step === 'confirmPassword' && "Confirm Password"}
                        </label>
                        <div className="relative">
                          <Input
                            type={
                              step === 'email' ? 'email' :
                                (step === 'password' || step === 'confirmPassword') && !showPassword ? 'password' :
                                  'text'
                            }
                            placeholder={
                              step === 'email' ? "your.email@example.com" :
                                step === 'firstName' ? "John" :
                                  step === 'lastName' ? "Doe" :
                                    step === 'password' ? "Create a strong password" :
                                      "Re-enter your password"
                            }
                            value={currentInput}
                            onChange={(e) => setCurrentInput(e.target.value)}
                            required
                            autoFocus
                            disabled={isTransitioning}
                            className="bg-[#1a1d23] border-[#F0B90B]/20 text-white placeholder:text-white/50 pr-10 focus:border-[#F0B90B]/40 focus:ring-1 focus:ring-[#F0B90B]/20 hover:border-[#F0B90B]/30 hover:bg-[#1a1d23]/80 transition-all duration-300"
                          />
                          {(step === 'password' || step === 'confirmPassword') && (
                            <button
                              type="button"
                              onClick={() => setShowPassword(!showPassword)}
                              className="absolute right-3 top-1/2 -translate-y-1/2 text-white/60 hover:text-[#F0B90B] hover:scale-110 transition-all duration-300"
                              aria-label={showPassword ? "Hide password" : "Show password"}
                              aria-pressed={showPassword}
                            >
                              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                          )}
                        </div>

                        {/* Show what's been entered */}
                        {step !== 'email' && (
                          <div className="mt-3 space-y-1">
                            {email && (
                              <div className="text-xs text-white/40">
                                <span className="text-white/60">Email:</span> {email}
                              </div>
                            )}
                            {firstName && (
                              <div className="text-xs text-white/40">
                                <span className="text-white/60">Name:</span> {firstName} {lastName || '...'}
                              </div>
                            )}
                          </div>
                        )}
                      </div>

                      <div className="flex gap-3">
                        {step !== 'email' && (
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => {
                              // Go back to previous step with transition
                              if (step === 'confirmPassword') {
                                transitionToStep('password');
                                setTimeout(() => setCurrentInput(password), 150);
                              } else if (step === 'password') {
                                transitionToStep('lastName');
                                setTimeout(() => setCurrentInput(lastName), 150);
                              } else if (step === 'lastName') {
                                transitionToStep('firstName');
                                setTimeout(() => setCurrentInput(firstName), 150);
                              } else if (step === 'firstName') {
                                transitionToStep('email');
                                setTimeout(() => setCurrentInput(email), 150);
                              }
                            }}
                            className="border-[#F0B90B]/30 text-[#F0B90B] hover:bg-[#F0B90B]/10 hover:text-[#F3BA2F] hover:border-[#F0B90B]/50 hover:scale-105 transition-all duration-300"
                            disabled={isLoading || isTransitioning}
                          >
                            Back
                          </Button>
                        )}
                        <Button
                          type="submit"
                          className="flex-1 bg-[#F0B90B] hover:bg-[#F3BA2F] text-[#0B0E11] font-semibold hover:scale-105 hover:shadow-[0_0_25px_rgba(240,185,11,0.4)] transition-all duration-300"
                          size="lg"
                          disabled={isLoading || isTransitioning}
                        >
                          {isLoading ? (
                            <span className="flex items-center gap-2">
                              <Loader2 className="h-4 w-4 animate-spin" />
                              Please wait...
                            </span>
                          ) : step === 'confirmPassword' ? "Sign Up" : "Continue"}
                        </Button>
                      </div>
                    </form>

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
              </TabsContent>
            </Tabs>
          </div>
        ) : (
          // Show Welcome Image for logged-in users
          <Card className="overflow-hidden bg-gradient-to-br from-[#181A20] to-[#0B0E11] border-[#F0B90B]/10 shadow-[0_0_30px_rgba(240,185,11,0.1)] hover:border-[#F0B90B]/20 hover:shadow-[0_0_40px_rgba(240,185,11,0.15)] transition-all duration-500">
            <div className="relative h-full min-h-[500px]">
              {/* Welcome Message Overlay */}
              <div className="absolute top-8 left-8 z-10">
                <div className="bg-[#0B0E11]/80 backdrop-blur-sm rounded-lg p-6 border border-[#F0B90B]/20">
                  <h3 className="text-2xl font-bold text-white mb-2">
                    Welcome back, {user?.firstName || 'User'}! 👋
                  </h3>
                  <p className="text-white/70">
                    Ready to continue your Canadian journey?
                  </p>
                </div>
              </div>

              {/* Hero Image */}
              <img
                src={canadianJourneyImg}
                alt="Canadian Journey"
                className="w-full h-full object-cover rounded-lg"
              />

              {/* Gradient Overlay for better text visibility */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#0B0E11] via-transparent to-transparent opacity-60"></div>

              {/* Quick Actions at Bottom */}
              <div className="absolute bottom-8 left-8 right-8 z-10">
                <div className="bg-[#0B0E11]/80 backdrop-blur-sm rounded-lg p-6 border border-[#F0B90B]/20">
                  <p className="text-[#F0B90B] mb-4 text-sm font-medium">Quick Access</p>
                  <div className="flex flex-wrap gap-3">
                    <Button
                      size="sm"
                      className="bg-[#F0B90B] hover:bg-[#F3BA2F] text-[#0B0E11] font-semibold hover:scale-105 hover:shadow-[0_0_20px_rgba(240,185,11,0.4)] transition-all duration-300"
                      onClick={() => navigate('/my-learning')}
                    >
                      My Learning
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-[#F0B90B]/30 text-[#F0B90B] hover:bg-[#F0B90B]/10 hover:text-[#F3BA2F] hover:border-[#F0B90B]/60 hover:scale-105 hover:shadow-[0_0_15px_rgba(240,185,11,0.3)] transition-all duration-300"
                      onClick={() => navigate('/services')}
                    >
                      Browse Services
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        )}

        {/* Consultation Dialog */}
        <ConsultationDialog
          open={showConsultationDialog}
          onOpenChange={setShowConsultationDialog}
        />
      </div>
    </section>
  );
};
