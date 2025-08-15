import { useState, useCallback } from 'react';
import { FutureFormData } from '../schemas/futureFormSchema';

// Define form sections with their required fields and validation rules
export interface FormSection {
  id: string;
  title: string;
  description: string;
  fields: (keyof FutureFormData)[];
  requiredFields: (keyof FutureFormData)[];
  validationMessages: Record<string, string>;
}

export const FORM_SECTIONS: FormSection[] = [
  {
    id: 'identification',
    title: "Identification de l'instrument",
    description: "Informations de base",
    fields: ['symbol', 'description', 'isin', 'expirationCode', 'parentTicker', 'fullName', 'segment', 'maturityDate'],
    requiredFields: ['symbol', 'isin', 'fullName'],
    validationMessages: {
      symbol: 'Le symbole est requis pour identifier l\'instrument',
      isin: 'Le code ISIN est obligatoire',
      fullName: 'Le nom complet de l\'instrument est requis'
    }
  },
  {
    id: 'deposit',
    title: "Dépôt & sous-jacents",
    description: "Configuration des marges",
    fields: ['depositType', 'lotSize', 'initialMarginAmount', 'percentageMargin', 'underlyingType', 'underlyingId'],
    requiredFields: ['depositType', 'lotSize', 'underlyingType', 'underlyingId'],
    validationMessages: {
      depositType: 'Veuillez sélectionner le type de dépôt',
      lotSize: 'La taille de lot doit être supérieure à 0',
      underlyingType: 'Veuillez sélectionner le type de sous-jacent',
      underlyingId: 'Veuillez sélectionner un sous-jacent'
    }
  },
  {
    id: 'trading',
    title: "Négociation",
    description: "Paramètres de trading",
    fields: ['firstTradingDate', 'lastTraadingDate', 'tradingCurrency', 'tickSize', 'settlementMethod', 'instrumentStatus'],
    requiredFields: ['firstTradingDate', 'lastTraadingDate', 'tradingCurrency', 'tickSize', 'settlementMethod'],
    validationMessages: {
      firstTradingDate: 'La date de première négociation est requise',
      lastTraadingDate: 'La date de dernière négociation est requise',
      tradingCurrency: 'La devise de négociation est obligatoire',
      tickSize: 'Le tick size doit être supérieur à 0',
      settlementMethod: 'Veuillez sélectionner la méthode de règlement'
    }
  }
];

export interface StepValidationResult {
  isValid: boolean;
  missingFields: string[];
  errorMessages: string[];
  canProceed: boolean;
}

export const useFormNavigation = (form: FutureFormData, errors: Record<string, string>) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());
  const [justArrivedOnLastStep, setJustArrivedOnLastStep] = useState(false);

  // Check if a step is completed
  const isStepCompleted = useCallback((stepIndex: number): boolean => {
    const section = FORM_SECTIONS[stepIndex];
    if (!section) return false;

    return section.requiredFields.every(field => {
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

  // Validate current step with detailed feedback
  const validateCurrentStep = useCallback((): StepValidationResult => {
    const section = FORM_SECTIONS[currentStep];
    if (!section) {
      return {
        isValid: false,
        missingFields: [],
        errorMessages: ['Section invalide'],
        canProceed: false
      };
    }

    const missingFields: string[] = [];
    const errorMessages: string[] = [];

    // Check required fields
    section.requiredFields.forEach(field => {
      const value = form[field];
      let isValid = true;

      if (typeof value === 'string') {
        isValid = value.trim() !== '';
      } else if (typeof value === 'number') {
        isValid = value > 0;
      } else if (typeof value === 'boolean') {
        isValid = true;
      } else {
        isValid = value !== undefined && value !== null;
      }

      if (!isValid) {
        missingFields.push(field as string);
        errorMessages.push(section.validationMessages[field as string] || `Le champ ${field} est requis`);
      }
    });

    // Check for validation errors
    section.fields.forEach(field => {
      if (errors[field as string]) {
        errorMessages.push(errors[field as string]);
      }
    });

    const isValid = missingFields.length === 0 && errorMessages.length === 0;
    const canProceed = isValid;

    return {
      isValid,
      missingFields,
      errorMessages,
      canProceed
    };
  }, [currentStep, form, errors]);

  // Check if current step has errors
  const hasStepErrors = useCallback((): boolean => {
    const section = FORM_SECTIONS[currentStep];
    if (!section) return false;

    return section.fields.some(field => errors[field as string]);
  }, [currentStep, errors]);

  // Get validation summary for current step
  const getCurrentStepValidation = useCallback((): StepValidationResult => {
    return validateCurrentStep();
  }, [validateCurrentStep]);

  // Get validation summary for specific step
  const getStepValidation = useCallback((stepIndex: number): StepValidationResult => {
    const section = FORM_SECTIONS[stepIndex];
    if (!section) {
      return {
        isValid: false,
        missingFields: [],
        errorMessages: ['Section invalide'],
        canProceed: false
      };
    }

    const missingFields: string[] = [];
    const errorMessages: string[] = [];

    section.requiredFields.forEach(field => {
      const value = form[field];
      let isValid = true;

      if (typeof value === 'string') {
        isValid = value.trim() !== '';
      } else if (typeof value === 'number') {
        isValid = value > 0;
      } else if (typeof value === 'boolean') {
        isValid = true;
      } else {
        isValid = value !== undefined && value !== null;
      }

      if (!isValid) {
        missingFields.push(field as string);
        errorMessages.push(section.validationMessages[field as string] || `Le champ ${field} est requis`);
      }
    });

    const isValid = missingFields.length === 0;
    const canProceed = isValid;

    return {
      isValid,
      missingFields,
      errorMessages,
      canProceed
    };
  }, [form]);

  // Go to next step
  const nextStep = useCallback((): boolean => {
    if (currentStep >= FORM_SECTIONS.length - 1) {
      return false; // Already on last step
    }

    const validation = validateCurrentStep();
    if (!validation.canProceed) {
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
    return validateCurrentStep().canProceed;
  }, [currentStep, completedSteps, validateCurrentStep]);

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
    getCurrentSection,
    getSection,
    getCurrentStepValidation,
    getStepValidation,
    
    // Constants
    totalSteps: FORM_SECTIONS.length,
    sections: FORM_SECTIONS,
  };
};
