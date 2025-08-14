import React from 'react';
import { AlertCircle } from 'lucide-react';

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
          <div className="w-4 h-4 text-gray-400 cursor-help">ℹ️</div>
          <div className="absolute -top-8 left-0 bg-gray-800 text-white text-xs rounded py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-10">
            {tooltip}
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
