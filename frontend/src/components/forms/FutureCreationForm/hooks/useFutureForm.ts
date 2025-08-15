import { useState, useEffect, useCallback } from 'react';
import { FutureFormData, PartialFutureFormData, validateField, validateForm, validateTradingDates } from '../schemas/futureFormSchema';
import { FutureCalculationService } from '../services/futureCalculationService';

interface FormState {
  form: FutureFormData;
  errors: Record<string, string>;
  isSubmitting: boolean;
  editMode: 'tickValue' | 'contractMultiplier';
  stringInputs: {
    tickSize: string;
    percentageMargin: string;
    initialMarginAmount: string;
  };
  localInputs: {
    tickValue: number;
    contractMultiplier: number;
  };
}

const initialFormData: FutureFormData = {
  symbol: '',
  description: '',
  isin: '',
  expirationCode: '',
  parentTicker: '',
  fullName: '',
  segment: '',
  maturityDate: '',
  firstTradingDate: '',
  lastTraadingDate: '',
  initialMarginAmount: 0,
  percentageMargin: 0,
  lotSize: 0,
  contractMultiplier: 0,
  tradingCurrency: '',
  underlyingType: '',
  underlyingId: 0,
  settlementMethod: '',
  instrumentStatus: false,
  tickSize: 0,
  tickValue: 0,
  depositType: '',
};

export const useFutureForm = () => {
  const [state, setState] = useState<FormState>({
    form: initialFormData,
    errors: {},
    isSubmitting: false,
    editMode: 'tickValue',
    stringInputs: {
      tickSize: '',
      percentageMargin: '',
      initialMarginAmount: '',
    },
    localInputs: {
      tickValue: 0,
      contractMultiplier: 0,
    },
  });

  // Update form field with real-time validation
  const updateField = useCallback((field: keyof FutureFormData, value: any) => {
    setState(prev => {
      let error = '';
      
      // Validation de base du champ
      const basicError = validateField(field, value);
      if (basicError) {
        error = basicError;
      } else {
        // Validation spéciale pour les dates de trading
        if (field === 'firstTradingDate' && prev.form.lastTraadingDate) {
          const dateError = validateTradingDates(value, prev.form.lastTraadingDate);
          if (dateError) error = dateError;
        }
        
        if (field === 'lastTraadingDate' && prev.form.firstTradingDate) {
          const dateError = validateTradingDates(prev.form.firstTradingDate, value);
          if (dateError) error = dateError;
        }
      }
      
      return {
        ...prev,
        form: { ...prev.form, [field]: value },
        errors: { ...prev.errors, [field]: error }
      };
    });
  }, []);

  // Update multiple fields at once with validation
  const updateFields = useCallback((updates: PartialFutureFormData) => {
    setState(prev => {
      const newForm = { ...prev.form, ...updates };
      const newErrors = { ...prev.errors };
      
      // Clear errors for updated fields
      Object.keys(updates).forEach(key => {
        newErrors[key] = '';
      });
      
      // Special validation for trading dates
      if (updates.firstTradingDate || updates.lastTraadingDate) {
        const firstDate = updates.firstTradingDate || prev.form.firstTradingDate;
        const lastDate = updates.lastTraadingDate || prev.form.lastTraadingDate;
        
        if (firstDate && lastDate) {
          const dateError = validateTradingDates(firstDate, lastDate);
          if (dateError) {
            // Show error on the lastTraadingDate field as per schema
            newErrors.lastTraadingDate = dateError;
          }
        }
      }
      
      return {
        ...prev,
        form: newForm,
        errors: newErrors
      };
    });
  }, []);

  // Update string inputs (for controlled inputs)
  const updateStringInput = useCallback((field: keyof FormState['stringInputs'], value: string) => {
    setState(prev => ({
      ...prev,
      stringInputs: { ...prev.stringInputs, [field]: value }
    }));
  }, []);

  // Update local inputs (for tick calculations)
  const updateLocalInput = useCallback((field: keyof FormState['localInputs'], value: number) => {
    setState(prev => ({
      ...prev,
      localInputs: { ...prev.localInputs, [field]: value }
    }));
  }, []);

  // Change edit mode
  const changeEditMode = useCallback((mode: 'tickValue' | 'contractMultiplier') => {
    setState(prev => ({ ...prev, editMode: mode }));
  }, []);

  // Validate trading dates specifically
  const validateTradingDatesField = useCallback(() => {
    setState(prev => {
      if (prev.form.firstTradingDate && prev.form.lastTraadingDate) {
        const dateError = validateTradingDates(prev.form.firstTradingDate, prev.form.lastTraadingDate);
        return {
          ...prev,
          errors: { 
            ...prev.errors, 
            lastTraadingDate: dateError || '' 
          }
        };
      }
      return prev;
    });
  }, []);

  // Validate single field
  const validateSingleField = useCallback((field: keyof FutureFormData) => {
    const error = validateField(field, state.form[field]);
    setState(prev => ({
      ...prev,
      errors: { ...prev.errors, [field]: error || '' }
    }));
    return !error;
  }, [state.form]);

  // Validate entire form
  const validateEntireForm = useCallback(() => {
    const errors = validateForm(state.form);
    setState(prev => ({ ...prev, errors }));
    return Object.keys(errors).length === 0;
  }, [state.form]);

  // Handle tick size changes
  const handleTickSizeChange = useCallback((value: string) => {
    updateStringInput('tickSize', value);
    const tickSize = FutureCalculationService.parseTickSize(value);
    
    if (tickSize > 0) {
      const calculations = FutureCalculationService.updateTickCalculations(
        tickSize,
        state.editMode,
        state.localInputs.tickValue,
        state.localInputs.contractMultiplier
      );
      
      updateFields({
        tickSize,
        ...calculations
      });
    } else {
      updateFields({ tickSize: 0, tickValue: 0, contractMultiplier: 0 });
    }
  }, [state.editMode, state.localInputs, updateStringInput, updateFields]);

  // Handle tick value changes
  const handleTickValueChange = useCallback((value: number) => {
    updateLocalInput('tickValue', value);
    
    if (state.form.tickSize > 0) {
      const contractMultiplier = FutureCalculationService.calculateContractMultiplier(state.form.tickSize, value);
      updateFields({
        tickValue: value,
        contractMultiplier
      });
    }
  }, [state.form.tickSize, updateLocalInput, updateFields]);

  // Handle contract multiplier changes
  const handleContractMultiplierChange = useCallback((value: number) => {
    updateLocalInput('contractMultiplier', value);
    
    if (state.form.tickSize > 0) {
      const tickValue = FutureCalculationService.calculateTickValue(state.form.tickSize, value);
      updateFields({
        contractMultiplier: value,
        tickValue
      });
    }
  }, [state.form.tickSize, updateLocalInput, updateFields]);

  // Handle percentage margin changes
  const handlePercentageMarginChange = useCallback((value: string) => {
    updateStringInput('percentageMargin', value);
    const percentageMargin = FutureCalculationService.parsePercentageMargin(value);
    
    if (percentageMargin > 0 && state.form.lotSize > 0) {
      const initialMarginAmount = FutureCalculationService.calculateInitialMarginAmount(state.form.lotSize, percentageMargin);
      updateFields({
        percentageMargin,
        initialMarginAmount
      });
    }
  }, [state.form.lotSize, updateStringInput, updateFields]);

  // Handle initial margin amount changes
  const handleInitialMarginAmountChange = useCallback((value: string) => {
    updateStringInput('initialMarginAmount', value);
    const initialMarginAmount = FutureCalculationService.parseInitialMarginAmount(value);
    
    if (initialMarginAmount > 0 && state.form.lotSize > 0) {
      const percentageMargin = FutureCalculationService.calculatePercentageMargin(state.form.lotSize, initialMarginAmount);
      updateFields({
        initialMarginAmount,
        percentageMargin
      });
    }
  }, [state.form.lotSize, updateStringInput, updateFields]);

  // Handle lot size changes
  const handleLotSizeChange = useCallback((value: number) => {
    updateField('lotSize', value);
    
    if (value > 0 && state.form.depositType) {
      const calculations = FutureCalculationService.updateFormCalculations(state.form, state.form.depositType, value);
      updateFields(calculations);
    }
  }, [state.form.depositType, updateField, updateFields]);

  // Handle deposit type changes
  const handleDepositTypeChange = useCallback((value: string) => {
    updateField('depositType', value);
    
    if (value && state.form.lotSize > 0) {
      const calculations = FutureCalculationService.updateFormCalculations(state.form, value, state.form.lotSize);
      updateFields(calculations);
    }
  }, [state.form.lotSize, updateField, updateFields]);

  // Handle underlying type changes
  const handleUnderlyingTypeChange = useCallback((value: string) => {
    updateField('underlyingType', value);
    updateField('underlyingId', 0); // Reset underlying asset when type changes
  }, [updateField]);

  // Set submitting state
  const setSubmitting = useCallback((isSubmitting: boolean) => {
    setState(prev => ({ ...prev, isSubmitting }));
  }, []);

  // Reset form
  const resetForm = useCallback(() => {
    setState({
      form: initialFormData,
      errors: {},
      isSubmitting: false,
      editMode: 'tickValue',
      stringInputs: {
        tickSize: '',
        percentageMargin: '',
        initialMarginAmount: '',
      },
      localInputs: {
        tickValue: 0,
        contractMultiplier: 0,
      },
    });
  }, []);

  // Sync string inputs with form values
  useEffect(() => {
    setState(prev => ({
      ...prev,
      stringInputs: {
        tickSize: prev.form.tickSize > 0 ? prev.form.tickSize.toString() : '',
        percentageMargin: prev.form.percentageMargin > 0 ? prev.form.percentageMargin.toString() : '',
        initialMarginAmount: prev.form.initialMarginAmount > 0 ? prev.form.initialMarginAmount.toString() : '',
      }
    }));
  }, [state.form.tickSize, state.form.percentageMargin, state.form.initialMarginAmount]);

  return {
    // State
    form: state.form,
    errors: state.errors,
    isSubmitting: state.isSubmitting,
    editMode: state.editMode,
    stringInputs: state.stringInputs,
    localInputs: state.localInputs,
    
    // Actions
    updateField,
    updateFields,
    updateStringInput,
    updateLocalInput,
    changeEditMode,
    validateSingleField,
    validateEntireForm,
    validateTradingDatesField, // ✅ Nouvelle fonction de validation des dates
    handleTickSizeChange,
    handleTickValueChange,
    handleContractMultiplierChange,
    handlePercentageMarginChange,
    handleInitialMarginAmountChange,
    handleLotSizeChange,
    handleDepositTypeChange,
    handleUnderlyingTypeChange,
    setSubmitting,
    resetForm,
  };
};
