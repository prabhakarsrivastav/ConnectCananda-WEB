import { Loader2 } from "lucide-react";

export const CanadaLoader = () => {
  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <div className="relative">
        {/* Outer spinning ring */}
        <div className="h-16 w-16 rounded-full border-4 border-[#F0B90B]/20 border-t-[#F0B90B] animate-spin"></div>
        
        {/* Canada flag maple leaf in center */}
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-2xl animate-pulse">🍁</span>
        </div>
      </div>
      
      <p className="text-[#F0B90B] font-medium animate-pulse">Loading...</p>
    </div>
  );
};

export const SmallCanadaLoader = () => {
  return (
    <div className="inline-flex items-center gap-2">
      <div className="relative h-6 w-6">
        <div className="h-6 w-6 rounded-full border-2 border-[#F0B90B]/20 border-t-[#F0B90B] animate-spin"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-xs">🍁</span>
        </div>
      </div>
      <span className="text-sm text-[#848e9c]">Loading...</span>
    </div>
  );
};
