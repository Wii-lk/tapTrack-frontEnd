import React from "react";


const Button = ({
    children,
    onClick,
    type = "button",
    variant = "maroon",
    disabled = false,
    loading = false,
    className = ""
}) => {
    const baseClasses = "w-full py-2 px-4 rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2";
    const variants = {
        primary: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500 disabled:bg-blue-400',
        secondary: 'bg-gray-200 text-gray-700 hover:bg-gray-300 focus:ring-gray-500',
        maroon: 'bg-[#800000] text-white hover:bg-[#990000] focus:ring-[#800000] disabled:bg-[#b36666]',
    };


    return (
        <button
            type={type}
            onClick={onClick}
            disabled={disabled || loading}
            className={`${baseClasses} ${variants[variant]} ${className}`}
        >
            {loading ? 'Loading...' : children}
        </button>
    );
};

export default Button;
