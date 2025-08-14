import React from 'react';
import { FormSection } from '../hooks/useFormNavigation';

interface FormStepperProps {
  sections: FormSection[];
  currentStep: number;
  completedSteps: Set<number>;
  onStepClick?: (stepIndex: number) => void;
}

export const FormStepper: React.FC<FormStepperProps> = ({
  sections,
  currentStep,
  completedSteps,
  onStepClick
}) => {
  const isStepClickable = (stepIndex: number): boolean => {
    // Can click on completed steps or the next available step
    return completedSteps.has(stepIndex) || stepIndex === currentStep;
  };

  const getStepStatus = (stepIndex: number): 'completed' | 'current' | 'upcoming' => {
    if (completedSteps.has(stepIndex)) return 'completed';
    if (stepIndex === currentStep) return 'current';
    return 'upcoming';
  };

  const getStepIcon = (stepIndex: number, status: 'completed' | 'current' | 'upcoming') => {
    if (status === 'completed') {
      return (
        <div className="w-5 h-5 rounded-full bg-teal-600 text-white flex items-center justify-center text-xs">
          ✓
        </div>
      );
    }
    
    if (status === 'current') {
      return (
        <div className="w-5 h-5 rounded-full bg-teal-100 text-teal-600 border border-teal-600 flex items-center justify-center text-xs">
          {stepIndex + 1}
        </div>
      );
    }
    
    return (
      <div className="w-5 h-5 rounded-full bg-gray-100 text-gray-400 flex items-center justify-center text-xs">
        {stepIndex + 1}
      </div>
    );
  };

  const getStepTextColor = (status: 'completed' | 'current' | 'upcoming') => {
    switch (status) {
      case 'completed':
        return 'text-teal-600';
      case 'current':
        return 'text-teal-600';
      case 'upcoming':
        return 'text-gray-400';
    }
  };

  return (
    <div className="mb-3">
      {/* Step indicators */}
      <div className="flex items-center justify-between mb-1">
        {sections.map((section, index) => {
          const status = getStepStatus(index);
          const isClickable = isStepClickable(index);
          
          return (
            <div
              key={section.id}
              className={`flex items-center ${getStepTextColor(status)} ${
                isClickable && onStepClick ? 'cursor-pointer hover:opacity-80' : ''
              }`}
              onClick={() => isClickable && onStepClick?.(index)}
            >
              {getStepIcon(index, status)}
              <span className="hidden sm:block text-xs font-medium ml-1">
                {section.title}
              </span>
              {index < sections.length - 1 && (
                <div className="hidden sm:block w-6 h-0.5 mx-1 bg-gray-200" />
              )}
            </div>
          );
        })}
      </div>
      
      {/* Progress bar */}
      <div className="relative h-1 bg-gray-200 rounded-full overflow-hidden">
        <div
          className="absolute h-full bg-teal-600 transition-all duration-300 ease-out"
          style={{ width: `${((currentStep + 1) / sections.length) * 100}%` }}
        />
      </div>
    </div>
  );
};
