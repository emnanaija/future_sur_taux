import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Info, DollarSign, Calendar,ClipboardCheck } from 'lucide-react';

// Hooks
import { useFutureForm } from './hooks/useFutureForm';
import { useFormNavigation } from './hooks/useFormNavigation';
import { useFutureAPI } from './hooks/useFutureAPI';

// Components
import { FormStepper } from './common/FormStepper';
import { IdentificationSection } from './sections/IdentificationSection';

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

  // Render form section based on current step
  const renderCurrentSection = () => {
    const currentSection = navigation.getCurrentSection();
    if (!currentSection) return null;

    const sectionIcon = {
      identification: <Info className="w-5 h-5" />,
      deposit: <ClipboardCheck  className="w-5 h-5" />,
      trading: <Calendar className="w-5 h-5" />,
    }[currentSection.id] || <Info className="w-5 h-5" />;

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
                <div className="space-y-3">
                  {/* Deposit Type Selection */}
                  <div className="flex justify-center space-x-2 my-2">
                    <button
                      type="button"
                      onClick={() => handleDepositTypeChange('AMOUNT')}
                      className={`px-3 py-2 rounded-lg font-medium transition-all duration-300 transform
                        ${form.depositType === 'AMOUNT' 
                          ? 'bg-teal-600 text-white scale-105 shadow-lg' 
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                    >
                      Montant fixe
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDepositTypeChange('RATE')}
                      className={`px-3 py-2 rounded-lg font-medium transition-all duration-300 transform
                        ${form.depositType === 'RATE' 
                          ? 'bg-teal-600 text-white scale-105 shadow-lg' 
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                    >
                      Pourcentage
                    </button>
                  </div>

                  {/* Financial Fields */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Lot Size */}
                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-gray-700">
                        Taille de lot <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="number"
                        value={form.lotSize}
                        onChange={(e) => handleLotSizeChange(parseFloat(e.target.value) || 0)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition duration-200"
                        required
                      />
                      {errors.lotSize && (
                        <p className="text-red-500 text-xs mt-1">{errors.lotSize}</p>
                      )}
                    </div>

                    {/* Deposit Type */}
                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-gray-700">
                        Type de dépôt <span className="text-red-500">*</span>
                      </label>
                      <select
                        value={form.depositType}
                        onChange={(e) => handleDepositTypeChange(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition duration-200"
                        required
                      >
                        <option value="">Sélectionnez le type de dépôt</option>
                        {api.depositTypes.map(type => (
                          <option key={type} value={type}>{type}</option>
                        ))}
                      </select>
                      {errors.depositType && (
                        <p className="text-red-500 text-xs mt-1">{errors.depositType}</p>
                      )}
                    </div>

                    {/* Initial Margin Amount */}
                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-gray-700">
                        Montant de la marge initiale
                        {form.depositType && form.depositType !== 'AMOUNT' && (
                          <span className="ml-2 text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                            Calculé automatiquement
                          </span>
                        )}
                      </label>
                      <input
                        type="text"
                        value={stringInputs.initialMarginAmount}
                        onChange={(e) => handleInitialMarginAmountChange(e.target.value)}
                        readOnly={Boolean(form.depositType && form.depositType !== 'AMOUNT')}
                        className={`w-full px-4 py-2 border rounded-lg transition-all duration-200 ${
                          form.depositType && form.depositType !== 'AMOUNT'
                            ? 'bg-gray-100 text-gray-500 cursor-not-allowed' 
                            : 'border-gray-300 focus:ring-2 focus:ring-teal-500 focus:border-transparent hover:border-gray-400'
                        }`}
                      />
                    </div>

                    {/* Percentage Margin */}
                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-gray-700">
                        Pourcentage de marge
                        {form.depositType && form.depositType !== 'RATE' && (
                          <span className="ml-2 text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                            Calculé automatiquement
                          </span>
                        )}
                      </label>
                      <input
                        type="text"
                        value={stringInputs.percentageMargin}
                        onChange={(e) => handlePercentageMarginChange(e.target.value)}
                        readOnly={Boolean(form.depositType && form.depositType !== 'RATE')}
                        className={`w-full px-4 py-2 border rounded-lg transition duration-200 ${
                          form.depositType && form.depositType !== 'RATE'
                            ? 'bg-gray-100 text-gray-500 cursor-not-allowed' 
                            : 'border-gray-300 focus:ring-2 focus:ring-teal-500 focus:border-transparent'
                        }`}
                      />
                    </div>
                  </div>

                  {/* Underlying Assets */}
                  <div className="bg-white rounded-lg shadow p-3 border border-gray-100 hover:shadow-lg transition-all duration-200">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div className="space-y-2">
                        <label className="block text-sm font-semibold text-gray-700">
                          Type du sous-jacent <span className="text-red-500">*</span>
                        </label>
                        <select
                          value={form.underlyingType}
                          onChange={(e) => handleUnderlyingTypeChange(e.target.value)}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition duration-200"
                          required
                        >
                          <option value="">Sélectionnez le type du sous-jacent</option>
                          {api.underlyingTypes.map(type => (
                            <option key={type} value={type}>{type}</option>
                          ))}
                        </select>
                        {errors.underlyingType && (
                          <p className="text-red-500 text-xs mt-1">{errors.underlyingType}</p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <label className="block text-sm font-semibold text-gray-700">
                          Sous-jacent <span className="text-red-500">*</span>
                        </label>
                        <select
                          value={form.underlyingId}
                          onChange={(e) => updateField('underlyingId', parseInt(e.target.value) || 0)}
                          disabled={!form.underlyingType}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition duration-200"
                          required
                        >
                          <option value={0}>Sélectionnez le sous-jacent</option>
                          {api.underlyingAssets.map(asset => (
                            <option key={asset.id} value={asset.id}>{asset.identifier}</option>
                          ))}
                        </select>
                        {errors.underlyingId && (
                          <p className="text-red-500 text-xs mt-1">{errors.underlyingId}</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {navigation.currentStep === 2 && (
                <div className="space-y-3">
                  {/* Tick Configuration */}
                  <div className="bg-gradient-to-r from-teal-50 to-white p-3 rounded-lg space-y-3">
                    <div className="flex items-end space-x-4 mb-2">
                      <div className="flex-0">
                        <label className="block text-sm font-medium text-gray-700">
                          Tick Size
                        </label>
                        <input
                          type="text"
                          value={stringInputs.tickSize}
                          onChange={(e) => handleTickSizeChange(e.target.value)}
                          className="w-32 px-4 py-2 border border-gray-300 rounded-lg transition-all duration-200 focus:ring-2 focus:ring-teal-500 focus:border-transparent hover:border-gray-400"
                          placeholder="Ex: 0.01"
                        />
                        {errors.tickSize && (
                          <p className="text-red-500 text-xs mt-1">{errors.tickSize}</p>
                        )}
                      </div>
                      
                      {/* Edit Mode Buttons */}
                      <div className="flex space-x-2">
                        <button
                          type="button"
                          onClick={() => changeEditMode('tickValue')}
                          className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 transform
                            ${editMode === 'tickValue' 
                              ? 'bg-teal-600 text-white scale-105 shadow-lg' 
                              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                        >
                          Saisir Tick Value
                        </button>
                        <button
                          type="button"
                          onClick={() => changeEditMode('contractMultiplier')}
                          className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 transform
                            ${editMode === 'contractMultiplier' 
                              ? 'bg-teal-600 text-white scale-105 shadow-lg' 
                              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                        >
                          Saisir Multiplicateur
                        </button>
                      </div>
                    </div>

                    {/* Tick Value and Contract Multiplier */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="flex items-center text-sm font-medium text-gray-700">
                          Tick Value
                          {editMode !== 'tickValue' && (
                            <span className="ml-2 text-xs bg-gray-100 text-gray-500 px-2 py-1 rounded">
                              Calculé automatiquement
                            </span>
                          )}
                        </label>
                        <input
                          type="number"
                          value={editMode === 'tickValue' ? localInputs.tickValue : form.tickValue}
                          onChange={(e) => handleTickValueChange(parseFloat(e.target.value) || 0)}
                          readOnly={editMode !== 'tickValue'}
                          className={`w-full px-4 py-2 border rounded-lg transition-all duration-200
                            ${editMode !== 'tickValue'
                              ? 'bg-gray-50 text-gray-500 cursor-not-allowed'
                              : 'border-gray-300 focus:ring-2 focus:ring-teal-500 hover:border-gray-400'
                            }`}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <label className="flex items-center text-sm font-medium text-gray-700">
                          Multiplicateur
                          {editMode !== 'contractMultiplier' && (
                            <span className="ml-2 text-xs bg-gray-100 text-gray-500 px-2 py-1 rounded">
                              Calculé automatiquement
                            </span>
                          )}
                        </label>
                        <input
                          type="number"
                          value={editMode === 'contractMultiplier' ? localInputs.contractMultiplier : form.contractMultiplier}
                          onChange={(e) => handleContractMultiplierChange(parseFloat(e.target.value) || 0)}
                          readOnly={editMode !== 'contractMultiplier'}
                          className={`w-full px-4 py-2 border rounded-lg transition-all duration-200
                            ${editMode !== 'contractMultiplier'
                              ? 'bg-gray-50 text-gray-500 cursor-not-allowed'
                              : 'border-gray-300 focus:ring-2 focus:ring-teal-500 hover:border-gray-400'
                            }`}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Trading Fields */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-gray-700">
                        Date de première négociation <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="date"
                        value={form.firstTradingDate}
                        onChange={(e) => updateField('firstTradingDate', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition duration-200"
                        required
                      />
                      {errors.firstTradingDate && (
                        <p className="text-red-500 text-xs mt-1">{errors.firstTradingDate}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-gray-700">
                        Date de dernière négociation <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="date"
                        value={form.lastTraadingDate}
                        onChange={(e) => updateField('lastTraadingDate', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition duration-200"
                        required
                      />
                      {errors.lastTraadingDate && (
                        <p className="text-red-500 text-xs mt-1">{errors.lastTraadingDate}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-gray-700">
                        Devise de négociation <span className="text-red-500">*</span>
                      </label>
                      <input
                        value={form.tradingCurrency}
                        onChange={(e) => updateField('tradingCurrency', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition duration-200"
                        required
                      />
                      {errors.tradingCurrency && (
                        <p className="text-red-500 text-xs mt-1">{errors.tradingCurrency}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-gray-700">
                        Mode de livraison <span className="text-red-500">*</span>
                      </label>
                      <select
                        value={form.settlementMethod}
                        onChange={(e) => updateField('settlementMethod', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition duration-200"
                        required
                      >
                        <option value="">Sélectionnez la méthode de règlement</option>
                        {api.settlementMethods.map(method => (
                          <option key={method} value={method}>{method}</option>
                        ))}
                      </select>
                      {errors.settlementMethod && (
                        <p className="text-red-500 text-xs mt-1">{errors.settlementMethod}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-gray-700">
                        Cotation <span className="text-red-500">*</span>
                      </label>
                      <div className="flex space-x-2">
                        <button
                          type="button"
                          onClick={() => updateField('instrumentStatus', true)}
                          className={`flex-1 py-3 px-4 rounded-lg font-semibold transition-all duration-200 ${
                            form.instrumentStatus 
                              ? 'bg-green-600 text-white shadow-lg' 
                              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                          }`}
                        >
                          Côté
                        </button>
                        <button
                          type="button"
                          onClick={() => updateField('instrumentStatus', false)}
                          className={`flex-1 py-3 px-4 rounded-lg font-semibold transition-all duration-200 ${
                            !form.instrumentStatus 
                              ? 'bg-red-600 text-white shadow-lg' 
                              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                          }`}
                        >
                          Non côté
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
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
              onClick={() => navigation.nextStep()}
              className="px-6 py-3 bg-teal-600 text-white rounded-lg font-medium
                       hover:bg-teal-700 transition-all duration-200"
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
