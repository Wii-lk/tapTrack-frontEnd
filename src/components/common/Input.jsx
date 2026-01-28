import React from "react";
import { AlertCircle } from "lucide-react";

const Input = ({
  label,
  type = "text",
  name,
  value,
  onChange,
  error,
  placeholder,
  icon: Icon,
}) => {
  return (
    <div className="mb-5 group">
      <label 
        htmlFor={name}
        className="block text-sm font-semibold text-gray-700 mb-1.5 ml-1"
      >
        {label}
      </label>

      <div className="relative">
        {Icon && (
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none transition-colors duration-200 group-focus-within:text-[#800000]">
            <Icon className={`h-5 w-5 ${error ? 'text-red-400' : 'text-gray-400'}`} />
          </div>
        )}

        <input
          id={name}
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={`
            w-full bg-white text-gray-900 placeholder-gray-400
            border rounded-xl py-3
            ${Icon ? "pl-11" : "pl-4"} pr-4
            text-sm transition-all duration-200 ease-in-out
            focus:outline-none focus:ring-4 focus:ring-[#800000]/10
            ${error 
              ? "border-red-300 focus:border-red-500 hover:border-red-400" 
              : "border-gray-200 focus:border-[#800000] hover:border-gray-300"
            }
            shadow-sm
          `}
        />
      </div>

      {error && (
        <div className="mt-1.5 flex items-center text-sm text-red-500 animate-fadeIn ml-1">
          <AlertCircle className="h-4 w-4 mr-1.5" />
          {error}
        </div>
      )}
    </div>
  );
};

export default Input;