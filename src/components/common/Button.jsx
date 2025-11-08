import React from "react";

const Button = ({
  children,
  onClick,
  type = "button",
  variant = "maroon",
  size = "full", // Added size prop
  disabled = false,
  loading = false,
  className = "",
}) => {
  // Removed width and padding from baseClasses
  const baseClasses =
    "rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2";

  // Maps size prop to Tailwind classes for width and padding
  const sizes = {
    full: "w-full py-2 px-4",
    half: "w-1/2 py-2 px-4",
    small: "w-fit py-1 px-3", // "very small" maps to small
  };

  const variants = {
    primary:
      "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500 disabled:bg-blue-400",
    secondary:
      "bg-gray-200 text-gray-700 hover:bg-gray-300 focus:ring-gray-500",
    maroon:
      "bg-[#800000] text-white hover:bg-[#990000] focus:ring-[#800000] disabled:bg-[#b36666]",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      // Added sizes[size] to the className string
      className={`${baseClasses} ${sizes[size]} ${variants[variant]} ${className}`}
    >
      {loading ? "Loading..." : children}
    </button>
  );
};

export default Button;