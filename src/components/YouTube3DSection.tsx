import { useState } from "react";
import { Play } from "lucide-react";

interface YouTube3DSectionProps {
  videoId?: string;
  title?: string;
  subtitle?: string;
}

export const YouTube3DSection = ({ 
  videoId = "dQw4w9WgXcQ", 
  title = "Watch Our Latest Webinar",
  subtitle = "Learn from expert sessions and workshops"
}: YouTube3DSectionProps) => {
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <section className="py-20 bg-gradient-to-b from-[#0B0E11] via-[#181A20] to-[#0B0E11] overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            {title}
          </h2>
          <p className="text-white/60 text-lg max-w-2xl mx-auto">
            {subtitle}
          </p>
        </div>

        {/* 3D Screen Container */}
        <div className="relative max-w-5xl mx-auto" style={{ perspective: "1500px" }}>
          {/* Glow effects */}
          <div className="absolute -inset-4 bg-gradient-to-r from-[#F0B90B]/20 via-[#F3BA2F]/20 to-[#F0B90B]/20 rounded-3xl blur-3xl animate-pulse" />
          
          {/* 3D Screen */}
          <div 
            className="relative transform transition-all duration-700 hover:scale-[1.02]"
            style={{ 
              transformStyle: "preserve-3d",
              transform: "rotateX(5deg) rotateY(-2deg)"
            }}
          >
            {/* Screen bezel */}
            <div className="relative rounded-2xl overflow-hidden shadow-[0_20px_80px_rgba(240,185,11,0.3)]">
              {/* Inner glow */}
              <div className="absolute inset-0 bg-gradient-to-br from-[#F0B90B]/10 via-transparent to-[#F3BA2F]/10 pointer-events-none z-10" />
              
              {/* Video container */}
              <div className="relative aspect-video bg-[#0B0E11] border-8 border-[#181A20] rounded-xl overflow-hidden">
                {!isPlaying ? (
                  // Thumbnail with play button
                  <div className="relative w-full h-full group cursor-pointer" onClick={() => setIsPlaying(true)}>
                    <img 
                      src={`https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`}
                      alt="Video thumbnail"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        // Fallback to standard quality if maxres doesn't exist
                        e.currentTarget.src = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
                      }}
                    />
                    {/* Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0B0E11]/80 via-[#0B0E11]/30 to-transparent" />
                    
                    {/* Play button */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="relative">
                        {/* Pulsing rings */}
                        <div className="absolute inset-0 rounded-full bg-[#F0B90B]/20 animate-ping" />
                        <div className="absolute inset-0 rounded-full bg-[#F0B90B]/30 animate-pulse" />
                        
                        {/* Play button */}
                        <button 
                          type="button"
                          onClick={() => setIsPlaying(true)}
                          className="relative w-20 h-20 rounded-full bg-[#F0B90B] flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-[0_0_40px_rgba(240,185,11,0.5)]"
                        >
                          <Play className="h-10 w-10 text-[#0B0E11] fill-[#0B0E11] ml-1" />
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  // YouTube iframe
                  <iframe
                    className="w-full h-full"
                    src={`https://www.youtube.com/embed/${videoId}?autoplay=1&mute=0&controls=1&rel=0&modestbranding=1`}
                    title="YouTube video"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                    loading="lazy"
                  />
                )}
              </div>
            </div>

            {/* Screen stand */}
            <div 
              className="mx-auto mt-8 w-32 h-2 bg-gradient-to-r from-transparent via-[#F0B90B]/30 to-transparent rounded-full"
              style={{ transform: "translateZ(-20px)" }}
            />
            <div 
              className="mx-auto w-48 h-3 bg-gradient-to-r from-transparent via-[#181A20] to-transparent rounded-t-xl"
              style={{ transform: "translateZ(-40px)" }}
            />
          </div>

          {/* Floating elements */}
          <div className="absolute top-10 left-10 w-32 h-32 bg-[#F0B90B]/5 rounded-full blur-2xl animate-float" />
          <div className="absolute bottom-10 right-10 w-40 h-40 bg-[#F3BA2F]/5 rounded-full blur-2xl animate-float" style={{ animationDelay: "1s" }} />
        </div>
      </div>
    </section>
  );
};
