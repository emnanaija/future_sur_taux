import { useState, useCallback } from 'react';
import { FutureFormData } from '../schemas/futureFormSchema';

// Define form sections with their required fields
export interface FormSection {
  id: string;
  title: string;
  description: string;
  fields: (keyof FutureFormData)[];
}

export const FORM_SECTIONS: FormSection[] = [
  {
    id: 'identification',
    title: "Identification de l'instrument",
    description: "Informations de base",
    fields: ['symbol', 'description', 'isin', 'fullName']
  },
  {
    id: 'deposit',
    title: "Dépôt & sous-jacents",
    description: "Configuration des marges",
    fields: ['depositType', 'lotSize', 'initialMarginAmount', 'percentageMargin', 'underlyingType', 'underlyingId']
  },
  {
    id: 'trading',
    title: "Négociation",
    description: "Paramètres de trading",
    fields: ['firstTradingDate', 'lastTraadingDate', 'tradingCurrency', 'tickSize', 'settlementMethod']
  }
];

export const useFormNavigation = (form: FutureFormData, errors: Record<string, string>) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());
  const [justArrivedOnLastStep, setJustArrivedOnLastStep] = useState(false);

  // Check if a step is completed
  const isStepCompleted = useCallback((stepIndex: number): boolean => {
    const section = FORM_SECTIONS[stepIndex];
    if (!section) return false;

    return section.fields.every(field => {
      const value = form[field];
      if (typeof value === 'string') {
        return value.trim() !== '';
      }
      if (typeof value === 'number') {
        return value > 0;
      }
      if (typeof value === 'boolean') {
        return true; // Boolean fields are always considered valid
      }
      return value !== undefined && value !== null;
    });
  }, [form]);

  // Validate current step
  const validateCurrentStep = useCallback((): boolean => {
    const section = FORM_SECTIONS[currentStep];
    if (!section) return false;

    return section.fields.every(field => {
      const value = form[field];
      if (typeof value === 'string') {
        return value.trim() !== '';
      }
      if (typeof value === 'number') {
        return value > 0;
      }
      if (typeof value === 'boolean') {
        return true;
      }
      return value !== undefined && value !== null;
    });
  }, [currentStep, form]);

  // Check if current step has errors
  const hasStepErrors = useCallback((): boolean => {
    const section = FORM_SECTIONS[currentStep];
    if (!section) return false;

    return section.fields.some(field => errors[field as string]);
  }, [currentStep, errors]);

  // Go to next step
  const nextStep = useCallback((): boolean => {
    if (currentStep >= FORM_SECTIONS.length - 1) {
      return false; // Already on last step
    }

    if (!validateCurrentStep()) {
      return false; // Current step is not valid
    }

    // Mark current step as completed
    setCompletedSteps(prev => new Set(prev).add(currentStep));
    
    // Move to next step
    const nextStepIndex = currentStep + 1;
    setCurrentStep(nextStepIndex);

    // Check if we just arrived on the last step
    if (nextStepIndex === FORM_SECTIONS.length - 1) {
      setJustArrivedOnLastStep(true);
    }

    return true;
  }, [currentStep, validateCurrentStep]);

  // Go to previous step
  const prevStep = useCallback((): boolean => {
    if (currentStep <= 0) {
      return false; // Already on first step
    }

    setCurrentStep(prev => prev - 1);
    setJustArrivedOnLastStep(false);
    return true;
  }, [currentStep]);

  // Go to specific step
  const goToStep = useCallback((stepIndex: number): boolean => {
    if (stepIndex < 0 || stepIndex >= FORM_SECTIONS.length) {
      return false; // Invalid step index
    }

    // Only allow going to completed steps or the next available step
    if (stepIndex > currentStep && !completedSteps.has(stepIndex - 1)) {
      return false; // Cannot skip steps
    }

    setCurrentStep(stepIndex);
    setJustArrivedOnLastStep(stepIndex === FORM_SECTIONS.length - 1);
    return true;
  }, [currentStep, completedSteps]);

  // Check if form is ready for submission
  const isFormReadyForSubmission = useCallback((): boolean => {
    // Must be on last step
    if (currentStep !== FORM_SECTIONS.length - 1) {
      return false;
    }

    // All steps must be completed
    if (completedSteps.size < FORM_SECTIONS.length - 1) {
      return false;
    }

    // Current step must be valid
    return validateCurrentStep();
  }, [currentStep, completedSteps, validateCurrentStep]);

  // Get progress percentage
  const getProgressPercentage = useCallback((): number => {
    return ((currentStep + 1) / FORM_SECTIONS.length) * 100;
  }, [currentStep]);

  // Get current section
  const getCurrentSection = useCallback((): FormSection | undefined => {
    return FORM_SECTIONS[currentStep];
  }, [currentStep]);

  // Get section by index
  const getSection = useCallback((index: number): FormSection | undefined => {
    return FORM_SECTIONS[index];
  }, []);

  return {
    // State
    currentStep,
    completedSteps,
    justArrivedOnLastStep,
    
    // Actions
    nextStep,
    prevStep,
    goToStep,
    
    // Computed values
    isStepCompleted,
    validateCurrentStep,
    hasStepErrors,
    isFormReadyForSubmission,
    getProgressPercentage,
    getCurrentSection,
    getSection,
    
    // Constants
    totalSteps: FORM_SECTIONS.length,
    sections: FORM_SECTIONS,
  };
};
