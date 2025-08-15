// Main component
export { default as FutureCreationForm } from './FutureCreationForm';
export { 
  IdentificationSection, 
  DepositSection, 
  TradingSection 
} from './sections';

// Types and schemas
export type { FutureFormData, PartialFutureFormData } from './schemas/futureFormSchema';
export { futureFormSchema, validateField, validateForm, validateTradingDates } from './schemas/futureFormSchema';

// Hooks
export { useFutureForm } from './hooks/useFutureForm';
export { useFormNavigation, FORM_SECTIONS } from './hooks/useFormNavigation';
export { useFutureAPI } from './hooks/useFutureAPI';

// Services
export { FutureCalculationService } from './services/futureCalculationService';

// Components
export { FormField } from './common/FormField';
export { FormStepper } from './common/FormStepper';
