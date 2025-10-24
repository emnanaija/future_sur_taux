import React from 'react';
import { FormSection } from '../hooks/useFormNavigation';
import { StepValidationResult } from '../hooks/useFormNavigation';

interface FormStepperProps {
  sections: FormSection[];
  currentStep: number;
  completedSteps: Set<number>;
  onStepClick?: (stepIndex: number) => void;
  stepValidations?: StepValidationResult[];
  getStepValidation?: (stepIndex: number) => StepValidationResult;
}

export const FormStepper: React.FC<FormStepperProps> = ({
  sections,
  currentStep,
  completedSteps,
  onStepClick,
  stepValidations,
  getStepValidation
}) => {
  const isStepClickable = (stepIndex: number): boolean => {
    // Can click on completed steps or the next available step
    return completedSteps.has(stepIndex) || stepIndex === currentStep;
  };

  const getStepStatus = (stepIndex: number): 'completed' | 'current' | 'upcoming' | 'incomplete' => {
    if (completedSteps.has(stepIndex)) return 'completed';
    if (stepIndex === currentStep) return 'current';
    
    // Check if step is incomplete (has validation errors)
    if (getStepValidation) {
      const validation = getStepValidation(stepIndex);
      if (!validation.canProceed) return 'incomplete';
    }
    
    return 'upcoming';
  };

  const getStepIcon = (stepIndex: number, status: 'completed' | 'current' | 'upcoming' | 'incomplete') => {
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
    
    if (status === 'incomplete') {
      return (
        <div className="w-5 h-5 rounded-full bg-red-100 text-red-600 border border-red-600 flex items-center justify-center text-xs">
          !
        </div>
      );
    }
    
    return (
      <div className="w-5 h-5 rounded-full bg-gray-100 text-gray-400 border border-gray-300 flex items-center justify-center text-xs">
        {stepIndex + 1}
      </div>
    );
  };

  const getStepTextColor = (status: 'completed' | 'current' | 'upcoming' | 'incomplete') => {
    switch (status) {
      case 'completed':
        return 'text-teal-600';
      case 'current':
        return 'text-teal-600';
      case 'incomplete':
        return 'text-red-600';
      case 'upcoming':
        return 'text-gray-400';
    }
  };

  const getStepTooltip = (stepIndex: number, status: 'completed' | 'current' | 'upcoming' | 'incomplete') => {
    if (status === 'incomplete' && getStepValidation) {
      const validation = getStepValidation(stepIndex);
      if (validation.missingFields.length > 0) {
        return `Champs requis manquants: ${validation.missingFields.join(', ')}`;
      }
    }
    
    switch (status) {
      case 'completed':
        return 'Étape terminée';
      case 'current':
        return 'Étape en cours';
      case 'incomplete':
        return 'Étape incomplète - champs requis manquants';
      case 'upcoming':
        return 'Étape à venir';
      default:
        return '';
    }
  };

  return (
    <div className="mb-3">
      {/* Step indicators */}
      <div className="flex items-center justify-between mb-1">
        {sections.map((section, index) => {
          const status = getStepStatus(index);
          const isClickable = isStepClickable(index);
          const tooltip = getStepTooltip(index, status);
          
          return (
            <div
              key={section.id}
              className={`flex items-center ${getStepTextColor(status)} ${
                isClickable && onStepClick ? 'cursor-pointer hover:opacity-80' : 'cursor-not-allowed opacity-60'
              } transition-all duration-200`}
              onClick={() => isClickable && onStepClick?.(index)}
              title={tooltip}
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
      
      {/* Validation status indicator */}
      {getStepValidation && (
        <div className="mt-2 text-xs text-gray-600">
          {(() => {
            const currentValidation = getStepValidation(currentStep);
            if (!currentValidation.canProceed) {
              return (
                <div className="flex items-center space-x-1 text-red-600">
                  <span>⚠️</span>
                  <span>
                    {currentValidation.missingFields.length} champ(s) requis manquant(s) 
                    pour continuer à l'étape suivante
                  </span>
                </div>
              );
            }
            return (
              <div className="flex items-center space-x-1 text-teal-600">
                <span>✓</span>
                <span>Cette étape est complète, vous pouvez continuer</span>
              </div>
            );
          })()}
        </div>
      )}
    </div>
  );
};
