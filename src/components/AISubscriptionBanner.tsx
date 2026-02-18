import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Crown, Sparkles, MessageCircle, Brain, Zap } from "lucide-react";

interface AISubscriptionBannerProps {
  onSubscribeClick: () => void;
}

export function AISubscriptionBanner({ onSubscribeClick }: AISubscriptionBannerProps) {
  return (
    <section className="container px-4 py-12">
      <Card className="relative overflow-hidden bg-gradient-to-br from-amber-500/10 via-orange-500/10 to-red-500/10 border-amber-500/20">
        {/* Animated background elements */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-10 left-10 w-32 h-32 bg-amber-500/30 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-10 right-10 w-40 h-40 bg-orange-500/30 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        </div>

        <div className="relative p-8 md:p-12">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            {/* Left Content */}
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-amber-500/20 border border-amber-500/30 rounded-full">
                <Crown className="h-4 w-4 text-amber-500" />
                <span className="text-sm font-semibold text-amber-600 dark:text-amber-400">
                  Premium Feature
                </span>
              </div>

              <div>
                <h2 className="text-3xl md:text-4xl font-bold mb-3 flex items-center gap-3">
                  Upgrade to AI Chat
                  <Sparkles className="h-8 w-8 text-amber-500 animate-pulse" />
                </h2>
                <p className="text-lg text-muted-foreground">
                  Get expert-level guidance for your Canadian journey — 24/7 AI-powered assistance
                </p>
              </div>

              {/* Features List */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  { icon: MessageCircle, text: "Unlimited conversations" },
                  { icon: Brain, text: "4 specialized AI agents" },
                  { icon: Zap, text: "Instant responses 24/7" },
                  { icon: Crown, text: "Priority support" },
                ].map((feature, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <feature.icon className="h-4 w-4 text-primary" />
                    </div>
                    <span className="text-sm font-medium">{feature.text}</span>
                  </div>
                ))}
              </div>

              {/* CTA */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <Button
                  onClick={onSubscribeClick}
                  size="lg"
                  className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-semibold h-12 px-8 shadow-lg hover:shadow-xl transition-all"
                >
                  <Crown className="h-5 w-5 mr-2" />
                  Subscribe Now
                </Button>
                <div className="flex flex-col">
                  <span className="text-2xl font-bold text-foreground">$69.99</span>
                  <span className="text-sm text-muted-foreground">/month</span>
                </div>
              </div>
            </div>

            {/* Right Visual */}
            <div className="hidden md:flex items-center justify-center">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-amber-500 to-orange-500 blur-2xl opacity-30 animate-pulse" />
                <div className="relative bg-gradient-to-br from-background to-muted p-8 rounded-3xl border border-border shadow-2xl">
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="h-12 w-12 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-2xl">
                        🛂
                      </div>
                      <div className="h-4 w-32 bg-muted rounded animate-pulse" />
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="h-12 w-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-2xl">
                        💼
                      </div>
                      <div className="h-4 w-28 bg-muted rounded animate-pulse" />
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="h-12 w-12 rounded-full bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center text-2xl">
                        🚀
                      </div>
                      <div className="h-4 w-36 bg-muted rounded animate-pulse" />
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="h-12 w-12 rounded-full bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center text-2xl">
                        🏡
                      </div>
                      <div className="h-4 w-24 bg-muted rounded animate-pulse" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </section>
  );
}
