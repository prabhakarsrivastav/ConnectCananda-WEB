import { Search, FileQuestion, X, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

interface EmptyStateProps {
  type?: "no-results" | "no-data" | "error";
  title?: string;
  description?: string;
  onReset?: () => void;
  resetLabel?: string;
  onRetry?: () => void | Promise<void>;
  retryLabel?: string;
  showRetryButton?: boolean;
}

export const EmptyState = ({
  type = "no-results",
  title,
  description,
  onReset,
  resetLabel = "Clear Filters",
  onRetry,
  retryLabel = "Try Again",
  showRetryButton = true
}: EmptyStateProps) => {
  const [isRetrying, setIsRetrying] = useState(false);

  const handleRetry = async () => {
    if (!onRetry) return;
    
    setIsRetrying(true);
    try {
      await onRetry();
    } finally {
      setIsRetrying(false);
    }
  };
  const getIcon = () => {
    switch (type) {
      case "no-results":
        return <Search className="h-16 w-16 text-[#F0B90B]/50" />;
      case "error":
        return <X className="h-16 w-16 text-red-500/50" />;
      default:
        return <FileQuestion className="h-16 w-16 text-[#F0B90B]/50" />;
    }
  };

  const getDefaultTitle = () => {
    switch (type) {
      case "no-results":
        return "No Services Found";
      case "error":
        return "Something Went Wrong";
      default:
        return "No Data Available";
    }
  };

  const getDefaultDescription = () => {
    switch (type) {
      case "no-results":
        return "Try adjusting your search or filters to find what you're looking for.";
      case "error":
        return "We encountered an error. Please try again later.";
      default:
        return "There's nothing here yet. Check back soon!";
    }
  };

  return (
    <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
      <div className="mb-6 animate-in fade-in duration-500">
        {getIcon()}
      </div>
      
      <h3 className="text-2xl font-bold text-white mb-3 animate-in fade-in slide-in-from-bottom-2 duration-500">
        {title || getDefaultTitle()}
      </h3>
      
      <p className="text-[#848e9c] max-w-md mb-6 animate-in fade-in slide-in-from-bottom-3 duration-500 delay-100">
        {description || getDefaultDescription()}
      </p>

      <div className="flex gap-3 flex-wrap justify-center">
        {/* Retry button for errors */}
        {type === "error" && showRetryButton && onRetry && (
          <Button
            onClick={handleRetry}
            disabled={isRetrying}
            className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold hover:scale-105 transition-all duration-300 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-200 gap-2"
          >
            <RefreshCw className={`h-4 w-4 ${isRetrying ? 'animate-spin' : ''}`} />
            {isRetrying ? 'Retrying...' : retryLabel}
          </Button>
        )}

        {/* Reset/Clear filters button */}
        {onReset && (
          <Button
            onClick={onReset}
            variant="outline"
            className="border-primary/50 text-primary hover:bg-primary/10 font-semibold hover:scale-105 transition-all duration-300 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-200"
          >
            {resetLabel}
          </Button>
        )}
      </div>

      {/* Decorative elements */}
      <div className="mt-8 flex gap-2 opacity-30">
        <div className="h-2 w-2 rounded-full bg-[#F0B90B] animate-pulse"></div>
        <div className="h-2 w-2 rounded-full bg-[#F0B90B] animate-pulse delay-75"></div>
        <div className="h-2 w-2 rounded-full bg-[#F0B90B] animate-pulse delay-150"></div>
      </div>
    </div>
  );
};
