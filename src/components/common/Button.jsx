import React from "react";
import { Loader2 } from "lucide-react";

const Button = ({
  children,
  onClick,
  type = "button",
  variant = "maroon",
  size = "full",
  disabled = false,
  loading = false,
  className = "",
}) => {
  
  const baseClasses = "relative flex items-center justify-center rounded-xl font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 active:scale-[0.98]";

  const sizes = {
    full: "w-full py-3 px-4 text-sm",
    half: "w-1/2 py-2.5 px-4 text-sm",
    small: "w-fit py-2 px-4 text-xs",
  };

  const variants = {
    primary: "bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-600/20 focus:ring-blue-500 disabled:bg-blue-300",
    secondary: "bg-white text-gray-700 border border-gray-200 hover:bg-gray-50 hover:border-gray-300 focus:ring-gray-200",
    maroon: "bg-[#800000] text-white hover:bg-[#660000] shadow-lg shadow-red-900/20 focus:ring-[#800000] disabled:bg-[#800000]/50 disabled:shadow-none",
    ghost: "bg-transparent text-[#800000] hover:bg-red-50 disabled:text-gray-400",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`${baseClasses} ${sizes[size]} ${variants[variant]} ${className} ${disabled ? 'cursor-not-allowed' : 'cursor-pointer'}`}
    >
      {loading ? (
        <>
          <Loader2 className="animate-spin -ml-1 mr-2 h-4 w-4" />
          Processing...
        </>
      ) : (
        children
      )}
    </button>
  );
};

export default Button;