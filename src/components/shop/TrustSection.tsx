import { Shield, Zap, HeadphonesIcon } from "lucide-react";

export function TrustSection() {
  const features = [
    {
      icon: Shield,
      title: "Secure Payment",
      description: "SSL encrypted transactions",
    },
    {
      icon: Zap,
      title: "Instant Access",
      description: "Immediate download after purchase",
    },
    {
      icon: HeadphonesIcon,
      title: "24/7 Support",
      description: "Round-the-clock customer service",
    },
  ];

  return (
    <div className="py-16 bg-card/50 border-y border-border">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="flex items-start gap-4 p-6 rounded-lg bg-background border border-border hover:border-primary/30 transition-all duration-300 animate-fade-in"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="p-3 rounded-lg bg-primary/10 border border-primary/20">
                <feature.icon className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-1">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
