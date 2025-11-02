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
  icon: Icon, // ✅ fix: use Icon (same name you'll use below)
}) => {
  return (
    <div className="mb-4">
      {/* ✅ fix: label spelling */}
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>

      <div className="relative">
        {Icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Icon className="h-5 w-5 text-gray-400" />
          </div>
        )}

        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={`w-full ${
            Icon ? "pl-10" : "pl-3"
          } pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            error ? "border-red-500" : "border-gray-300"
          }`}
        />
      </div>

      {error && (
        <p className="mt-1 text-sm text-red-600 flex items-center">
          <AlertCircle className="h-4 w-4 mr-1" />
          {error}
        </p>
      )}
    </div>
  );
};

export default Input;
