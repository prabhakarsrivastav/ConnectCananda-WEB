import { toast as sonnerToast } from "sonner";
import { CheckCircle, XCircle, AlertCircle, Info } from "lucide-react";

// Enhanced toast with icons for color-independent accessibility
export const toast = {
  success: (message: string, description?: string) => {
    return sonnerToast.success(message, {
      description,
      icon: <CheckCircle className="h-5 w-5" />,
      className: "state-success",
      duration: 4000,
    });
  },

  error: (message: string, description?: string) => {
    return sonnerToast.error(message, {
      description,
      icon: <XCircle className="h-5 w-5" />,
      className: "state-error",
      duration: 5000,
    });
  },

  warning: (message: string, description?: string) => {
    return sonnerToast.warning(message, {
      description,
      icon: <AlertCircle className="h-5 w-5" />,
      className: "state-warning",
      duration: 4000,
    });
  },

  info: (message: string, description?: string) => {
    return sonnerToast.info(message, {
      description,
      icon: <Info className="h-5 w-5" />,
      className: "state-info",
      duration: 4000,
    });
  },

  // Loading state
  loading: (message: string) => {
    return sonnerToast.loading(message, {
      duration: Infinity,
    });
  },

  // Promise-based toast for async operations
  promise: <T,>(
    promise: Promise<T>,
    {
      loading,
      success,
      error,
    }: {
      loading: string;
      success: string | ((data: T) => string);
      error: string | ((error: any) => string);
    }
  ) => {
    return sonnerToast.promise(promise, {
      loading,
      success: typeof success === "function" ? success : () => success,
      error: typeof error === "function" ? error : () => error,
    });
  },

  // Dismiss a toast
  dismiss: (id?: string | number) => {
    return sonnerToast.dismiss(id);
  },
};
