import React, { useEffect } from "react";
import {
  CheckCircle2,
  AlertCircle,
  X,
  Info,
  AlertTriangle,
} from "lucide-react";

const ToastItem = ({ toast, removeToast }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      removeToast(toast.id);
    }, toast.duration);

    return () => clearTimeout(timer);
  }, [toast, removeToast]);

  const icons = {
    success: <CheckCircle2 className="w-5 h-5 text-green-500" />,
    error: <AlertCircle className="w-5 h-5 text-red-500" />,
    warning: <AlertTriangle className="w-5 h-5 text-yellow-500" />,
    info: <Info className="w-5 h-5 text-blue-500" />,
  };

  const bgColors = {
    success: "bg-white border-green-100",
    error: "bg-white border-red-100",
    warning: "bg-white border-yellow-100",
    info: "bg-white border-blue-100",
  };

  return (
    <div
      className={`
        flex items-center w-full max-w-sm p-4 mb-3 text-gray-700 
        ${bgColors[toast.type] || bgColors.info}
        rounded-xl shadow-lg border animate-slide-up pointer-events-auto
      `}
      role="alert"
    >
      <div className="flex-shrink-0">{icons[toast.type] || icons.info}</div>
      <div className="ml-3 text-sm font-medium">{toast.message}</div>
      <button
        type="button"
        className="ml-auto -mx-1.5 -my-1.5 rounded-lg p-1.5 inline-flex items-center justify-center h-8 w-8 text-gray-400 hover:text-gray-900 hover:bg-gray-100"
        onClick={() => removeToast(toast.id)}
      >
        <span className="sr-only">Close</span>
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};

const ToastContainer = ({ toasts, removeToast }) => {
  return (
    <div className="fixed top-4 right-4 z-[9999] flex flex-col items-end pointer-events-none">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} removeToast={removeToast} />
      ))}
    </div>
  );
};

export default ToastContainer;
