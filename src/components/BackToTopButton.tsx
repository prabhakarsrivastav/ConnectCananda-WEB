import { useState, useEffect } from "react";
import { ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";

export const BackToTop = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.pageYOffset > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", toggleVisibility);

    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  };

  return (
    <>
      {isVisible && (
        <Button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 z-50 h-12 w-12 rounded-full bg-[#F0B90B] hover:bg-[#F3BA2F] text-[#0B0E11] shadow-[0_8px_24px_rgba(240,185,11,0.4)] hover:shadow-[0_12px_32px_rgba(240,185,11,0.6)] transition-all duration-300 hover:scale-110 animate-in fade-in slide-in-from-bottom-4"
          size="icon"
          aria-label="Back to top"
        >
          <ChevronUp className="h-6 w-6" />
        </Button>
      )}
    </>
  );
};
