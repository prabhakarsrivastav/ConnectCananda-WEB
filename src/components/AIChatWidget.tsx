import { useState } from "react";
import { MessageCircle } from "lucide-react";
import { AIChat } from "@/components/AIChat";

export function AIChatWidget() {
  const [showChat, setShowChat] = useState(false);

  const handleClick = () => {
    setShowChat(true);
  };

  return (
    <>
      <button
        onClick={handleClick}
        className="fixed bottom-24 right-6 z-50 group"
        aria-label="Open AI Chat"
      >
        <div className="relative">
          {/* Glow effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-amber-500 to-orange-500 blur-xl rounded-full group-hover:blur-2xl transition-all duration-300 animate-pulse opacity-50"></div>
          
          {/* Button */}
          <div className="relative flex items-center justify-center w-14 h-14 bg-gradient-to-br from-amber-500 to-orange-500 rounded-full shadow-[0_8px_32px_rgba(251,146,60,0.4)] hover:shadow-[0_12px_40px_rgba(251,146,60,0.6)] transition-all duration-300 group-hover:scale-110">
            <MessageCircle className="h-7 w-7 text-white" strokeWidth={2} />
          </div>
          
          {/* Tooltip */}
          <div className="absolute right-full mr-3 top-1/2 -translate-y-1/2 px-4 py-2 bg-background/95 backdrop-blur-xl border border-white/10 rounded-xl shadow-[0_4px_16px_rgba(0,0,0,0.12)] opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap pointer-events-none">
            <span className="text-sm font-medium">Chat with AI</span>
          </div>
        </div>
      </button>

      <AIChat
        open={showChat}
        onOpenChange={setShowChat}
        agentName="AI Assistant"
        agentType="immigration"
        agentIcon="🤖"
        agentColor="from-amber-500 to-orange-500"
      />
    </>
  );
}
