// src/components/ui/button.jsx
import React from 'react';

export const Button = ({ 
  children, 
  variant = "default", 
  className = "", 
  onClick, 
  disabled = false 
}) => {
  const baseStyles = "rounded-md font-medium transition-colors focus:outline-none";
  const variantStyles = {
    default: "bg-blue-600 text-white hover:bg-blue-700 px-4 py-2",
    outline: "border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 px-4 py-2"
  };
  
  return (
    <button
      className={`${baseStyles} ${variantStyles[variant]} ${className} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
};