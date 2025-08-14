import React from 'react';
import { AlertCircle, CheckCircle, Info } from 'lucide-react';

export interface ValidationMessageProps {
  type: 'error' | 'warning' | 'info' | 'success';
  title: string;
  messages: string[];
  showIcon?: boolean;
  className?: string;
}

export const ValidationMessage: React.FC<ValidationMessageProps> = ({
  type,
  title,
  messages,
  showIcon = true,
  className = ''
}) => {
  if (messages.length === 0) return null;

  const getIcon = () => {
    switch (type) {
      case 'error':
        return <AlertCircle className="w-5 h-5 text-red-500" />;
      case 'warning':
        return <AlertCircle className="w-5 h-5 text-yellow-500" />;
      case 'info':
        return <Info className="w-5 h-5 text-blue-500" />;
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      default:
        return null;
    }
  };

  const getContainerClasses = () => {
    const baseClasses = 'p-4 rounded-lg border-l-4';
    
    switch (type) {
      case 'error':
        return `${baseClasses} bg-red-50 border-red-400 text-red-700`;
      case 'warning':
        return `${baseClasses} bg-yellow-50 border-yellow-400 text-yellow-700`;
      case 'info':
        return `${baseClasses} bg-blue-50 border-blue-400 text-blue-700`;
      case 'success':
        return `${baseClasses} bg-green-50 border-green-400 text-green-700`;
      default:
        return `${baseClasses} bg-gray-50 border-gray-400 text-gray-700`;
    }
  };

  return (
    <div className={`${getContainerClasses()} ${className}`}>
      <div className="flex items-start space-x-3">
        {showIcon && getIcon()}
        <div className="flex-1">
          <h4 className="font-semibold mb-2">{title}</h4>
          <ul className="space-y-1">
            {messages.map((message, index) => (
              <li key={index} className="text-sm flex items-start space-x-2">
                <span className="text-red-500 mt-1">•</span>
                <span>{message}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ValidationMessage;
