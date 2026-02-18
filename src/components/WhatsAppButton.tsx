import { MessageCircle } from "lucide-react";

export const WhatsAppButton = () => {
  const whatsappNumber = "1234567890"; // Replace with actual WhatsApp number
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=Hi, I'd like to learn more about your services`;

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 group"
      aria-label="Chat on WhatsApp"
    >
      <div className="relative">
        {/* Glow effect */}
        <div className="absolute inset-0 bg-green-500/30 blur-xl rounded-full group-hover:bg-green-500/40 transition-all duration-300 animate-pulse"></div>
        
        {/* Button */}
        <div className="relative flex items-center justify-center w-14 h-14 bg-gradient-to-br from-green-500 to-green-600 rounded-full shadow-[0_8px_32px_rgba(34,197,94,0.4)] hover:shadow-[0_12px_40px_rgba(34,197,94,0.6)] transition-all duration-300 group-hover:scale-110">
          <MessageCircle className="h-7 w-7 text-white" strokeWidth={2} />
        </div>
        
        {/* Tooltip */}
        <div className="absolute right-full mr-3 top-1/2 -translate-y-1/2 px-4 py-2 bg-background/95 backdrop-blur-xl border border-white/10 rounded-xl shadow-[0_4px_16px_rgba(0,0,0,0.12)] opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap pointer-events-none">
          <span className="text-sm font-medium">Chat with us on WhatsApp</span>
        </div>
      </div>
    </a>
  );
};
