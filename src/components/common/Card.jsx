import React from "react";

const Card = ({
  children,
  className = "",
  title,
  subtitle,
  actions,
  noPadding = false,
  hoverable = false,
}) => {
  return (
    <div
      className={`
        bg-white rounded-2xl border border-gray-100 shadow-sm
        transition-all duration-300
        ${hoverable ? "hover:shadow-md hover:-translate-y-1 cursor-pointer" : ""}
        ${className}
      `}
    >
      {(title || subtitle || actions) && (
        <div
          className={`
          flex items-start justify-between mb-4 
          ${noPadding ? "p-6 pb-0" : ""}
        `}
        >
          <div>
            {title && (
              <h3 className="text-lg font-bold text-gray-900 leading-tight">
                {title}
              </h3>
            )}
            {subtitle && (
              <p className="text-sm text-gray-500 mt-1">{subtitle}</p>
            )}
          </div>
          {actions && <div className="ml-4">{actions}</div>}
        </div>
      )}

      <div className={noPadding ? "" : "p-6 pt-2"}>{children}</div>
    </div>
  );
};

export default Card;
