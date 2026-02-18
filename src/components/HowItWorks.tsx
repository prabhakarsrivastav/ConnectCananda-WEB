import { Card } from "@/components/ui/card";
import { Search, Calendar, Users } from "lucide-react";

const steps = [
  {
    icon: Search,
    number: "01",
    title: "Browse Services",
    description: "Explore our marketplace of verified consultants and services tailored for newcomers",
  },
  {
    icon: Calendar,
    number: "02",
    title: "Book Consultation",
    description: "Schedule a session with experts at your convenience through our integrated calendar",
  },
  {
    icon: Users,
    number: "03",
    title: "Get Ongoing Support",
    description: "Access continuous guidance, track your progress, and achieve your Canadian dreams",
  },
];

export const HowItWorks = () => {
  return (
    <section className="container px-4 py-20 bg-[#0B0E11]">
      <div className="text-center mb-16">
        <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">
          How It Works
        </h2>
        <p className="text-lg text-white/60 max-w-2xl mx-auto">
          Get started in three simple steps
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {steps.map((step, index) => {
          const Icon = step.icon;
          return (
            <Card
              key={step.number}
              className="relative p-8 bg-gradient-to-br from-[#181A20] to-[#0B0E11] border-[#F0B90B]/10 overflow-hidden group hover:border-[#F0B90B]/30 hover:shadow-[0_0_30px_rgba(240,185,11,0.1)] transition-all duration-300"
            >
              {/* Background Number */}
              <div className="absolute top-4 right-4 text-8xl font-bold text-[#F0B90B]/5 group-hover:text-[#F0B90B]/10 transition-colors">
                {step.number}
              </div>

              <div className="relative space-y-4">
                <div className="p-4 rounded-xl bg-[#F0B90B]/10 w-fit">
                  <Icon className="h-8 w-8 text-[#F0B90B]" />
                </div>
                
                <h3 className="text-2xl font-bold text-white">{step.title}</h3>
                <p className="text-white/60">{step.description}</p>

                {/* Connector Line for desktop */}
                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute top-12 -right-4 w-8 h-0.5 bg-gradient-to-r from-[#F0B90B] to-transparent"></div>
                )}
              </div>
            </Card>
          );
        })}
      </div>
    </section>
  );
};
