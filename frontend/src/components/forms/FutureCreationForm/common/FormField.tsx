import React from 'react';
import { AlertCircle, Info } from 'lucide-react';

interface FormFieldProps {
  label: string;
  name: string;
  error?: string;
  required?: boolean;
  children: React.ReactNode;
  className?: string;
  tooltip?: string;
}

export const FormField: React.FC<FormFieldProps> = ({ 
  label, 
  name, 
  error, 
  required = false, 
  children, 
  className = '',
  tooltip
}) => (
  <div className={`space-y-2 ${className}`}>
    <label 
      htmlFor={name} 
      className="block text-sm font-semibold text-gray-700 flex items-center"
    >
      {label} 
      {required && <span className="text-red-500 ml-1">*</span>}
      {tooltip && (
        <div className="relative ml-2 group">
          <div className="w-4 h-4 text-blue-500 hover:text-blue-600 cursor-help transition-colors duration-200">
            <Info className="w-4 h-4" />
          </div>
          <div className="absolute -top-12 left-0 bg-gray-900 text-white text-xs rounded-lg py-2 px-3 opacity-0 group-hover:opacity-100 transition-all duration-300 whitespace-nowrap z-10 shadow-lg border border-gray-700 max-w-xs">
            {tooltip}
            {/* Flèche du tooltip */}
            <div className="absolute top-full left-3 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
          </div>
        </div>
      )}
    </label>
    {children}
    {error && (
      <p className="text-red-500 text-xs mt-1 flex items-center">
        <AlertCircle className="w-4 h-4 mr-1" />
        {error}
      </p>
    )}
  </div>
);
