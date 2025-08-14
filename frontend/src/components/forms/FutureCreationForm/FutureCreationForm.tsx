import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Info, DollarSign, Calendar,ClipboardCheck } from 'lucide-react';

// Hooks
import { useFutureForm } from './hooks/useFutureForm';
import { useFormNavigation } from './hooks/useFormNavigation';
import { useFutureAPI } from './hooks/useFutureAPI';

// Components
import { FormStepper } from './common/FormStepper';
import { 
  IdentificationSection, 
  DepositSection, 
  TradingSection 
} from './sections';
import { ValidationMessage } from './common/ValidationMessage';

// Types
import { FutureFormData } from './schemas/futureFormSchema';

const FutureCreationForm: React.FC = () => {
  // Use our custom hooks
  const {
    form,
    errors,
    isSubmitting,
    editMode,
    stringInputs,
    localInputs,
    updateField,
    changeEditMode,
    handleTickSizeChange,
    handleTickValueChange,
    handleContractMultiplierChange,
    handlePercentageMarginChange,
    handleInitialMarginAmountChange,
    handleLotSizeChange,
    handleDepositTypeChange,
    handleUnderlyingTypeChange,
    setSubmitting,
    validateEntireForm,
  } = useFutureForm();

  const navigation = useFormNavigation(form, errors);
  const api = useFutureAPI();

  // Fetch underlying assets when underlying type changes
  useEffect(() => {
    if (form.underlyingType) {
      api.fetchUnderlyingAssets(form.underlyingType);
    }
  }, [form.underlyingType, api]);

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!navigation.isFormReadyForSubmission()) {
      alert('Veuillez compléter toutes les étapes avant de soumettre');
      return;
    }

    if (!validateEntireForm()) {
      alert('Veuillez corriger les erreurs avant de soumettre le formulaire');
      return;
    }

    setSubmitting(true);
    const result = await api.createFuture(form);
    
    if (result.success) {
      alert('Future créé avec succès');
      // Optionally reset form or redirect
    } else {
      alert(`Erreur: ${result.error}`);
    }
    
    setSubmitting(false);
  };

  // Handle step navigation
  const handleStepClick = (stepIndex: number) => {
    navigation.goToStep(stepIndex);
  };

  // Handle next step with validation
  const handleNextStep = () => {
    const validation = navigation.getCurrentStepValidation();
    if (!validation.canProceed) {
      // Show validation message
      return;
    }
    navigation.nextStep();
  };

  // Render form section based on current step
  const renderCurrentSection = () => {
    const currentSection = navigation.getCurrentSection();
    if (!currentSection) return null;

    const sectionIcon = {
      identification: <Info className="w-5 h-5" />,
      deposit: <ClipboardCheck  className="w-5 h-5" />,
      trading: <Calendar className="w-5 h-5" />,
    }[currentSection.id] || <Info className="w-5 h-5" />;

    // Get current step validation
    const validation = navigation.getCurrentStepValidation();

    return (
      <div className="bg-white rounded-lg shadow p-2 relative overflow-hidden">
        {/* Section header */}
        <div className="flex items-center mb-2">
          <div className="p-1.5 bg-teal-100 rounded mr-2">
            {sectionIcon}
          </div>
          <div>
            <h2 className="text-lg font-bold text-gray-800">
              {currentSection.title}
            </h2>
            <p className="text-xs text-gray-600">
              {currentSection.description}
            </p>
          </div>
        </div>

        {/* Validation Messages */}
        {validation && !validation.isValid && (
          <div className="mb-4">
            <ValidationMessage
              type="error"
              title="Étape incomplète"
              messages={validation.errorMessages}
              className="mb-3"
            />
          </div>
        )}

        {/* Section content */}
        <div className="transition-all duration-300 transform">
          <AnimatePresence mode="wait">
            <motion.div
              key={navigation.currentStep}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
              className="min-h-[400px]"
            >
              {navigation.currentStep === 0 && (
                <IdentificationSection
                  form={form}
                  errors={errors}
                  onChange={updateField}
                />
              )}

              {navigation.currentStep === 1 && (
                <DepositSection
                  form={form}
                  errors={errors}
                  stringInputs={stringInputs}
                  api={{
                    depositTypes: api.depositTypes,
                    underlyingTypes: api.underlyingTypes,
                    underlyingAssets: api.underlyingAssets,
                  }}
                  onDepositTypeChange={handleDepositTypeChange}
                  onLotSizeChange={handleLotSizeChange}
                  onPercentageMarginChange={handlePercentageMarginChange}
                  onInitialMarginAmountChange={handleInitialMarginAmountChange}
                  onUnderlyingTypeChange={handleUnderlyingTypeChange}
                  onUnderlyingIdChange={(value) => updateField('underlyingId', value)}
                />
              )}

              {navigation.currentStep === 2 && (
                <TradingSection
                  form={form}
                  errors={errors}
                  editMode={editMode}
                  stringInputs={stringInputs}
                  localInputs={localInputs}
                  api={{
                    settlementMethods: api.settlementMethods,
                  }}
                  onTickSizeChange={handleTickSizeChange}
                  onTickValueChange={handleTickValueChange}
                  onContractMultiplierChange={handleContractMultiplierChange}
                  onChangeEditMode={changeEditMode}
                  onFieldChange={updateField}
                />
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 to-white py-2">
      <div className="max-w-4xl mx-auto px-2">
        {/* Title */}
        <div className="text-center mb-3">
          <h1 className="text-2xl font-bold text-gray-900">Créer un Future</h1>
          <p className="mt-1 text-xs text-gray-600">
            Remplissez les informations nécessaires pour créer un nouveau Future
          </p>
        </div>

        {/* Stepper */}
        <FormStepper
          sections={navigation.sections}
          currentStep={navigation.currentStep}
          completedSteps={navigation.completedSteps}
          onStepClick={handleStepClick}
          getStepValidation={navigation.getStepValidation}
        />

        {/* Form Content */}
        {renderCurrentSection()}

        {/* Navigation */}
        <div className="flex justify-between mt-6">
          <button
            type="button"
            onClick={() => navigation.prevStep()}
            className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
              navigation.currentStep === 0
                ? 'opacity-50 cursor-not-allowed bg-gray-200'
                : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
            }`}
            disabled={navigation.currentStep === 0}
          >
            ← Précédent
          </button>

          {navigation.currentStep === navigation.totalSteps - 1 ? (
            <button
              type="submit"
              onClick={handleSubmit}
              disabled={isSubmitting || api.isLoading}
              className="px-6 py-3 bg-gradient-to-r from-teal-600 to-teal-700 text-white rounded-lg font-medium
                       hover:from-teal-700 hover:to-teal-800 transition-all duration-200 transform hover:scale-105
                       focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 hover:shadow-lg
                       disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {isSubmitting ? 'Création en cours...' : 'Créer le Future'}
            </button>
          ) : (
            <button
              type="button"
              onClick={handleNextStep}
              disabled={!navigation.getCurrentStepValidation().canProceed}
              className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
                navigation.getCurrentStepValidation().canProceed
                  ? 'bg-teal-600 text-white hover:bg-teal-700'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              Suivant →
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default FutureCreationForm;
