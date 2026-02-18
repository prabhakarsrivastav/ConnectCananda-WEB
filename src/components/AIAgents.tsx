import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Bot, Zap, Clock, MessageCircle, Sparkles } from "lucide-react";
import { AIChat } from "@/components/AIChat";

const aiAgents = [
  /*
  {
    id: "immigration",
    name: "Arrival Pro AI",
    specialty: "Express Entry & PR Applications",
    description: "Expert guidance on permit applications, PR pathways, and arrival documentation",
    interactions: "12.5K",
    availability: "24/7",
    color: "from-blue-500 to-cyan-500",
    icon: "🛂",
  },
  */
  {
    id: "career",
    name: "Career Navigator AI",
    specialty: "Job Search & Resume Building",
    description: "AI-powered resume optimization, job matching, and interview preparation",
    interactions: "9.8K",
    availability: "24/7",
    color: "from-purple-500 to-pink-500",
    icon: "💼",
  },
  {
    id: "business",
    name: "Business Startup AI",
    specialty: "Business Registration & Planning",
    description: "Comprehensive startup guidance, business plans, and regulatory compliance",
    interactions: "15.2K",
    availability: "24/7",
    color: "from-green-500 to-emerald-500",
    icon: "🚀",
  },
  {
    id: "settlement",
    name: "Settlement Assistant AI",
    specialty: "Housing, Healthcare & Banking",
    description: "Complete settlement support for housing, healthcare, banking, and daily essentials",
    interactions: "11.3K",
    availability: "24/7",
    color: "from-orange-500 to-red-500",
    icon: "🏡",
  },
  /*
  {
    id: "legal",
    name: "Legal Advisor AI",
    specialty: "Canadian Law & Rights",
    description: "Legal guidance on tenant rights, employment law, and consumer protection",
    interactions: "8.7K",
    availability: "24/7",
    color: "from-indigo-500 to-blue-500",
    icon: "⚖️",
  },
  */
  {
    id: "finance",
    name: "Financial Planner AI",
    specialty: "Banking & Credit Building",
    description: "Financial advice on banking, credit, taxes, and investment planning",
    interactions: "10.2K",
    availability: "24/7",
    color: "from-emerald-500 to-teal-500",
    icon: "💰",
  },
  {
    id: "education",
    name: "Education Counselor AI",
    specialty: "Schools & Universities",
    description: "Guidance on school applications, credential assessment, and student permits",
    interactions: "7.9K",
    availability: "24/7",
    color: "from-amber-500 to-yellow-500",
    icon: "🎓",
  },
  {
    id: "health",
    name: "Healthcare Navigator AI",
    specialty: "OHIP & Medical Services",
    description: "Healthcare system guidance, finding doctors, and mental health support",
    interactions: "9.4K",
    availability: "24/7",
    color: "from-rose-500 to-pink-500",
    icon: "🏥",
  },
  {
    id: "employment-career",
    name: "Employment/Career Navigator AI",
    specialty: "Job Search & Career Development",
    description: "Comprehensive career guidance, and professional development",
    interactions: "8.5K",
    availability: "24/7",
    color: "from-violet-500 to-purple-500",
    icon: "💼",
  },
  {
    id: "settlement-integration",
    name: "Settlement & Integration Assistant AI",
    specialty: "Arrival & Settlement Support",
    description: "Complete support for newcomers including housing, healthcare, banking, and cultural integration",
    interactions: "10.1K",
    availability: "24/7",
    color: "from-cyan-500 to-blue-500",
    icon: "🏠",
  },
];

export const AIAgents = () => {
  const [selectedAgent, setSelectedAgent] = useState<typeof aiAgents[0] | null>(null);

  const handleChatClick = (agent: typeof aiAgents[0]) => {
    console.log("Chat clicked for agent:", agent.name);
    setSelectedAgent(agent);
  };

  return (
    <section className="container px-4 py-20 bg-gradient-to-b from-[#0B0E11] to-[#181A20]">
      <div className="text-center mb-12">
        <div className="flex items-center justify-center gap-2 mb-4">
          <Sparkles className="h-8 w-8 text-[#F0B90B] animate-pulse" />
          <h2 className="text-3xl md:text-4xl font-bold text-white">
            Your Personal AI Agents
          </h2>
        </div>
        <p className="text-lg text-white/60 max-w-2xl mx-auto mb-6">
          24/7 AI-powered assistance for every step of your Canadian journey
        </p>

        <div className="max-w-3xl mx-auto bg-gradient-to-br from-[#1A1D20] via-[#0B0E11] to-[#1A1D20] border-2 border-[#F0B90B]/30 rounded-3xl p-8 shadow-[0_8px_32px_rgba(239,68,68,0.3),0_16px_64px_rgba(220,38,38,0.2),0_0_128px_rgba(185,28,28,0.15)] backdrop-blur-sm relative overflow-hidden transform hover:scale-105 transition-all duration-500 animate-[float_6s_ease-in-out_infinite]">
          <div className="absolute inset-0 bg-gradient-to-br from-red-500/10 via-transparent to-red-600/5 rounded-3xl" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(239,68,68,0.15),transparent_70%)]" />
          <div className="relative z-10">
            <div className="flex items-center justify-center gap-2 mb-4">
              <div className="h-2 w-2 rounded-full bg-[#F0B90B] animate-pulse shadow-[0_0_10px_rgba(239,68,68,0.8)]" />
              <h3 className="text-xl font-semibold text-[#F0B90B] drop-shadow-[0_2px_8px_rgba(240,185,11,0.3)]">
                Our AI is still in Beta & learning right now
              </h3>
              <div className="h-2 w-2 rounded-full bg-[#F0B90B] animate-pulse shadow-[0_0_10px_rgba(240,185,11,0.8)]" />
            </div>
            <p className="text-white/80 mb-3 text-center drop-shadow-lg">
              We're training the next generation of AI agents to understand your workflow better.
            </p>
            <p className="text-white/80 mb-3 text-center drop-shadow-lg">
              For now, we're taking a short pause to make them smarter and more reliable.
            </p>
            <p className="text-white/90 font-medium text-center text-lg drop-shadow-lg">
              👉 We'll be right back — sharper, faster, and ready to serve you.
            </p>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
        {aiAgents.map((agent) => (
          <Card
            key={agent.name}
            className="group relative overflow-hidden p-6 bg-gradient-to-br from-[#181A20] to-[#0B0E11] border-[#F0B90B]/10 hover:border-[#F0B90B]/30 transition-all duration-300 hover:shadow-[0_0_30px_rgba(240,185,11,0.15)] hover:scale-105"
          >
            {/* Gradient overlay */}
            <div className={`absolute inset-0 bg-gradient-to-br ${agent.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />

            <div className="relative space-y-4">
              {/* AI Icon & Status */}
              <div className="flex items-start justify-between">
                <div className="relative">
                  <div className={`h-16 w-16 rounded-2xl bg-gradient-to-br ${agent.color} flex items-center justify-center text-3xl shadow-lg`}>
                    {agent.icon}
                  </div>
                  <div className="absolute -bottom-1 -right-1 h-5 w-5 rounded-full bg-green-500 border-2 border-card flex items-center justify-center animate-pulse">
                    <Zap className="h-3 w-3 text-white" />
                  </div>
                </div>
                <Badge variant="secondary" className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {agent.availability}
                </Badge>
              </div>

              {/* Info */}
              <div>
                <h3 className="font-bold text-lg mb-1 flex items-center gap-2 text-white">
                  {agent.name}
                  <Bot className="h-4 w-4 text-[#F0B90B]" />
                </h3>
                <p className="text-sm font-medium text-[#F0B90B] mb-2">
                  {agent.specialty}
                </p>
                <p className="text-xs text-white/60 leading-relaxed">
                  {agent.description}
                </p>
              </div>

              {/* Stats */}
              <div className="flex items-center gap-3 text-xs text-white/60">
                <div className="flex items-center gap-1">
                  <MessageCircle className="h-3 w-3" />
                  <span>{agent.interactions} chats</span>
                </div>
              </div>

              {/* Actions */}
              {agent.id === "career" || agent.id === "business" || agent.id === "settlement" || agent.id === "education" || agent.id === "employment-career" || agent.id === "settlement-integration" ? (
                <div className="pt-2">
                  <div className="text-center py-2 px-4 bg-[#F0B90B]/10 border border-[#F0B90B]/20 rounded-lg">
                    <span className="text-sm font-medium text-[#F0B90B]">Coming Soon</span>
                  </div>
                </div>
              ) : (
                <div className="flex gap-2 pt-2">
                  <Button
                    size="sm"
                    className="flex-1 bg-[#F0B90B] hover:bg-[#F3BA2F] text-[#0B0E11] group-hover:shadow-lg transition-shadow"
                    onClick={() => handleChatClick(agent)}
                  >
                    <MessageCircle className="h-4 w-4 mr-1" />
                    Chat Now
                  </Button>
                  <Button size="sm" variant="outline" className="border-[#F0B90B]/30 text-[#F0B90B] hover:bg-[#F0B90B]/10">
                    Learn More
                  </Button>
                </div>
              )}
            </div>
          </Card>
        ))}
      </div>

      <div className="text-center mt-12">
        <Button variant="outline" size="lg" className="group border-[#F0B90B]/30 text-[#F0B90B] hover:bg-[#F0B90B]/10">
          <Bot className="h-5 w-5 mr-2 group-hover:animate-bounce" />
          Explore All AI Services
        </Button>
      </div>

      {selectedAgent && (
        <AIChat
          open={!!selectedAgent}
          onOpenChange={(open) => !open && setSelectedAgent(null)}
          agentName={selectedAgent.name}
          agentType={selectedAgent.id}
          agentIcon={selectedAgent.icon}
          agentColor={selectedAgent.color}
        />
      )}
    </section>
  );
};
