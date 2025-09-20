// Additional utility components for professional content rendering
import React from 'react';

// Loading spinner component
export const LoadingSpinner = ({ text = "Loading...", size = "default" }) => {
  const sizeClasses = {
    small: "h-4 w-4",
    default: "h-8 w-8",
    large: "h-12 w-12"
  };

  return (
    <div className="flex items-center justify-center py-8">
      <div className={`animate-spin rounded-full border-2 border-gray-300 border-t-primary-600 ${sizeClasses[size]}`}></div>
      {text && <span className="ml-3 text-gray-600">{text}</span>}
    </div>
  );
};

// Professional button component
export const ProfessionalButton = ({ 
  children, 
  variant = "primary", 
  size = "default", 
  className = "", 
  ...props 
}) => {
  const variants = {
    primary: "bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-700 hover:to-primary-600 text-white",
    secondary: "bg-gray-100 hover:bg-gray-200 text-gray-800 border border-gray-300",
    success: "bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 text-white",
    warning: "bg-gradient-to-r from-yellow-600 to-yellow-500 hover:from-yellow-700 hover:to-yellow-600 text-white",
    danger: "bg-gradient-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-600 text-white"
  };

  const sizes = {
    small: "px-3 py-1.5 text-sm",
    default: "px-4 py-2",
    large: "px-6 py-3 text-lg"
  };

  return (
    <button
      className={`
        ${variants[variant]}
        ${sizes[size]}
        font-semibold rounded-lg transition-all duration-300 
        transform hover:scale-105 hover:shadow-lg
        focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500
        ${className}
      `}
      {...props}
    >
      {children}
    </button>
  );
};

// Professional badge component
export const ProfessionalBadge = ({ children, variant = "default", className = "" }) => {
  const variants = {
    default: "bg-gray-100 text-gray-800 border-gray-300",
    primary: "bg-blue-100 text-blue-800 border-blue-300",
    success: "bg-green-100 text-green-800 border-green-300",
    warning: "bg-yellow-100 text-yellow-800 border-yellow-300",
    danger: "bg-red-100 text-red-800 border-red-300",
    purple: "bg-purple-100 text-purple-800 border-purple-300"
  };

  return (
    <span className={`px-3 py-1 rounded-full text-sm font-medium border ${variants[variant]} ${className}`}>
      {children}
    </span>
  );
};

// Professional card component
export const ProfessionalCard = ({ 
  children, 
  className = "", 
  hover = true, 
  shadow = "default" 
}) => {
  const shadows = {
    none: "",
    small: "shadow-sm",
    default: "shadow-lg",
    large: "shadow-xl"
  };

  return (
    <div className={`
      bg-white rounded-xl border border-gray-200 overflow-hidden
      ${shadows[shadow]}
      ${hover ? "card-hover" : ""}
      ${className}
    `}>
      {children}
    </div>
  );
};

const ProfessionalComponents = {
  LoadingSpinner,
  ProfessionalButton,
  ProfessionalBadge,
  ProfessionalCard
};

export default ProfessionalComponents;