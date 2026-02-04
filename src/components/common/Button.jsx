import React from "react";
import { Loader2 } from "lucide-react";

/**
 * Premium Button Component
 * Supports multiple variants, sizes, and loading states.
 */
const Button = ({
  children,
  onClick,
  type = "button",
  variant = "primary", // Default bumped to 'primary' which maps to maroon
  size = "neutral", // Changed 'full' -> 'neutral' as default, but keeping API flexible
  className = "",
  disabled = false,
  loading = false,
  icon: Icon, // Optional icon
  ...props
}) => {
  const baseClasses =
    "relative inline-flex items-center justify-center font-medium transition-all duration-300 " +
    "focus:outline-none focus:ring-2 focus:ring-offset-1 disabled:opacity-60 disabled:cursor-not-allowed disabled:active:scale-100 " +
    "active:scale-[0.98] rounded-xl tracking-wide";

  const sizes = {
    small: "px-3 py-1.5 text-xs",
    neutral: "px-5 py-2.5 text-sm",
    large: "px-6 py-3 text-base",
    full: "w-full py-3 px-4 text-sm", // Backwards compatibility
  };

  const variants = {
    // Primary (Maroon) - The main call to action
    primary:
      "bg-gradient-to-br from-primary-700 to-primary-800 text-white " +
      "shadow-lg shadow-primary-900/20 hover:shadow-primary-900/30 " +
      "hover:to-primary-700 hover:from-primary-600 border border-transparent " +
      "focus:ring-primary-500",

    // Secondary (Gray/White) - For cancellations or secondary actions
    secondary:
      "bg-white text-secondary-700 border border-gray-200 " +
      "hover:bg-gray-50 hover:text-secondary-900 hover:border-gray-300 " +
      "shadow-sm focus:ring-secondary-200",

    // Outline (Maroon Border)
    outline:
      "bg-transparent border-2 border-primary-700 text-primary-700 " +
      "hover:bg-primary-50 focus:ring-primary-200",

    // Ghost (Text Only)
    ghost:
      "bg-transparent text-primary-700 hover:bg-primary-50 hover:text-primary-800 shadow-none",

    // Danger
    danger:
      "bg-red-600 text-white hover:bg-red-700 shadow-md shadow-red-500/20 focus:ring-red-500",

    // Legacy support alias
    maroon:
      "bg-gradient-to-br from-primary-700 to-primary-800 text-white shadow-lg shadow-primary-900/20 hover:to-primary-700 hover:from-primary-600 border border-transparent focus:ring-primary-500",
  };

  // Resolve size if 'full' was passed but we want to map it to styling
  const sizeClass = sizes[size] || sizes.neutral;
  const variantClass = variants[variant] || variants.primary;

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`${baseClasses} ${sizeClass} ${variantClass} ${className}`}
      {...props}
    >
      {loading && <Loader2 className="animate-spin -ml-1 mr-2 h-4 w-4" />}
      {!loading && Icon && <Icon className="mr-2 h-4 w-4" />}
      {children}
    </button>
  );
};

export default Button;
