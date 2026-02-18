import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star } from "lucide-react";

export function RecommendedServices() {
  const services = [
    {
      title: "Health Insurance Guide",
      price: "$60/hour",
      rating: 4.9,
    },
    {
      title: "Tax Filing Support",
      price: "$85/hour",
      rating: 4.8,
    },
  ];

  return (
    <Card className="p-6 bg-gradient-card border-border/50">
      <h2 className="text-xl font-bold mb-4">Recommended for You</h2>
      <div className="space-y-4">
        {services.map((service, index) => (
          <div
            key={index}
            className="p-4 rounded-lg border border-border hover:border-primary/50 transition-colors cursor-pointer"
          >
            <div className="flex items-start justify-between mb-2">
              <p className="font-semibold text-sm">{service.title}</p>
              <Badge variant="outline" className="text-xs">
                New
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1">
                <Star className="h-3 w-3 fill-secondary text-secondary" />
                <span className="text-xs font-medium">
                  {service.rating}
                </span>
              </div>
              <p className="text-xs font-bold text-primary">
                {service.price}
              </p>
            </div>
          </div>
        ))}
      </div>
      <Button className="w-full mt-4" variant="outline">
        Browse All Services
      </Button>
    </Card>
  );
}
