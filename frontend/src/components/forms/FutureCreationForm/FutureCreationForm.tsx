import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Info, Calendar,ClipboardCheck } from 'lucide-react';
import { toast } from 'react-hot-toast';

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
    handleLotSizeChange,
    setSubmitting,
    validateEntireForm,
  } = useFutureForm();

  const navigation = useFormNavigation(form, errors);
  const api = useFutureAPI();

  // Fetch underlying assets on component mount
  useEffect(() => {
    // Show loading notification
    const loadingToast = toast.loading('Chargement des actifs sous-jacents...', {
      icon: '🔄',
    });
    
    // Fetch all underlying assets (you might want to modify this to fetch by a default type)
    api.fetchUnderlyingAssets('BONDS' as any)
      .then(() => {
        toast.success('Actifs sous-jacents chargés avec succès', {
          icon: '✅',
          duration: 3000,
        });
      })
      .catch((error) => {
        toast.error('Erreur lors du chargement des actifs sous-jacents', {
          icon: '❌',
          duration: 5000,
        });
        console.error('Error fetching underlying assets:', error);
      })
      .finally(() => {
        toast.dismiss(loadingToast);
      });
  }, [api.fetchUnderlyingAssets]); // eslint-disable-line react-hooks/exhaustive-deps

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    console.log('Form submission started');
    console.log('Form data:', form);
    console.log('Navigation ready:', navigation.isFormReadyForSubmission());
    console.log('Form valid:', validateEntireForm());
    
    if (!navigation.isFormReadyForSubmission()) {
      toast.error('Veuillez compléter toutes les étapes avant de soumettre', {
        icon: '⚠️',
        duration: 5000,
      });
      return;
    }

    if (!validateEntireForm()) {
      toast.error('Veuillez corriger les erreurs avant de soumettre le formulaire', {
        icon: '❌',
        duration: 5000,
      });
      return;
    }

    setSubmitting(true);
    
    try {
      console.log('Sending payload:', { ...form, underlyingId: form.underlyingId, depositType: 'RATE' });
      const result = await api.createFuture({ ...form, underlyingId: form.underlyingId, depositType: 'RATE' });
      console.log('API response:', result);
      
      if (result.success) {
        toast.success('Future créé avec succès ! 🎉', {
          icon: '✅',
          duration: 6000,
        });
        // Optionally reset form or redirect
      } else {
        console.error('Backend error details:', result.error);
        toast.error(`Erreur lors de la création: ${result.error}`, {
          icon: '❌',
          duration: 8000,
        });
      }
    } catch (error: any) {
      console.error('Error in form submission:', error);
      console.error('Error details:', error.response?.data);
      console.error('Error status:', error.response?.status);
      toast.error(`Erreur réseau: ${error.response?.data?.message || error.message}`, {
        icon: '❌',
        duration: 8000,
      });
    } finally {
      setSubmitting(false);
    }
  };

  // Handle step navigation
  const handleStepClick = (stepIndex: number) => {
    const currentStep = navigation.currentStep;
    const result = navigation.goToStep(stepIndex);
    
    if (result) {
      if (stepIndex > currentStep) {
        // Moving forward
        toast.success(`Navigation vers l'étape ${stepIndex + 1}`, {
          icon: '➡️',
          duration: 2000,
        });
      } else if (stepIndex < currentStep) {
        // Moving backward
        toast(`Retour à l'étape ${stepIndex + 1}`, {
          icon: '⬅️',
          duration: 2000,
          style: {
            background: '#3B82F6',
            color: '#fff',
          },
        });
      }
    } else {
      // Cannot navigate to this step
      toast.error('Impossible de naviguer vers cette étape', {
        icon: '🚫',
        duration: 3000,
      });
    }
  };

  // Handle next step with validation
  const handleNextStep = () => {
    const validation = navigation.getCurrentStepValidation();
    if (!validation.canProceed) {
      // Show detailed validation message
      if (validation.missingFields.length > 0) {
        toast.error(
          `Étape incomplète : ${validation.missingFields.length} champ(s) requis manquant(s)`, 
          {
            icon: '⚠️',
            duration: 5000,
          }
        );
      } else if (validation.errorMessages.length > 0) {
        toast.error(
          `Erreurs de validation : ${validation.errorMessages[0]}`, 
          {
            icon: '❌',
            duration: 5000,
          }
        );
      } else {
        toast.error('Veuillez compléter cette étape avant de continuer', {
          icon: '⚠️',
          duration: 5000,
        });
      }
      return;
    }
    
    // Success notification when moving to next step
    const nextStepIndex = navigation.currentStep + 1;
    if (nextStepIndex < navigation.totalSteps) {
      toast.success(`Étape ${nextStepIndex + 1} : ${navigation.sections[nextStepIndex].title}`, {
        icon: '✅',
        duration: 3000,
      });
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
                    underlyingAssets: api.underlyingAssets,
                  }}
                  onLotSizeChange={handleLotSizeChange}
                  onPercentageMarginChange={handlePercentageMarginChange}
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
