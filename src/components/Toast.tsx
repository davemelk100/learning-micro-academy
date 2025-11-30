import React, { useEffect } from "react";
import { CheckCircle, X } from "lucide-react";

interface ToastProps {
  isVisible: boolean;
  onClose: () => void;
  title: string;
  message: string;
  duration?: number;
  type?: "success" | "error" | "info";
  onShare?: () => void;
  showShareButton?: boolean;
}

export const Toast: React.FC<ToastProps> = ({
  isVisible,
  onClose,
  title,
  message,
  duration = 5000,
  type = "success",
  onShare,
  showShareButton = false,
}) => {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [isVisible, duration, onClose]);

  if (!isVisible) return null;

  const getTypeStyles = () => {
    switch (type) {
      case "success":
        return "bg-green-50 border-green-200 text-green-800";
      case "error":
        return "bg-red-50 border-red-200 text-red-800";
      case "info":
        return "bg-blue-50 border-blue-200 text-blue-800";
      default:
        return "bg-green-50 border-green-200 text-green-800";
    }
  };

  const getIconColor = () => {
    switch (type) {
      case "success":
        return "text-green-600";
      case "error":
        return "text-red-600";
      case "info":
        return "text-blue-600";
      default:
        return "text-green-600";
    }
  };

  return (
    <div className="fixed top-4 right-4 z-50 max-w-sm w-full">
      <div
        className={`${getTypeStyles()} border rounded-lg shadow-lg p-4 flex items-start space-x-3`}
      >
        <CheckCircle
          className={`h-5 w-5 ${getIconColor()} flex-shrink-0 mt-0.5`}
        />
        <div className="flex-1 min-w-0">
          <h4 className="text-sm font-semibold">{title}</h4>
          <p className="text-sm mt-1">{message}</p>
          {showShareButton && onShare && (
            <button
              onClick={onShare}
              className="mt-2 text-xs font-medium text-blue-600 hover:text-blue-700 underline"
            >
              Share your success →
            </button>
          )}
        </div>
        <button
          onClick={onClose}
          className="flex-shrink-0 text-slate-400 hover:text-slate-600 transition-colors"
        >
          <X className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
};
