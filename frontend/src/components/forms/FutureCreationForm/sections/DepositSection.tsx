import React from 'react';
import { FutureFormData } from '../schemas/futureFormSchema';
import { FormField } from '../common/FormField';

interface DepositSectionProps {
  form: FutureFormData;
  errors: Record<string, string>;
  stringInputs: {
    percentageMargin: string;
    initialMarginAmount: string;
  };
  api: {
    depositTypes: string[];
    underlyingTypes: string[];
    underlyingAssets: Array<{ id: number; identifier: string }>;
  };
  onDepositTypeChange: (value: string) => void;
  onLotSizeChange: (value: number) => void;
  onPercentageMarginChange: (value: string) => void;
  onInitialMarginAmountChange: (value: string) => void;
  onUnderlyingTypeChange: (value: string) => void;
  onUnderlyingIdChange: (value: number) => void;
}

export const DepositSection: React.FC<DepositSectionProps> = ({
  form,
  errors,
  stringInputs,
  api,
  onDepositTypeChange,
  onLotSizeChange,
  onPercentageMarginChange,
  onInitialMarginAmountChange,
  onUnderlyingTypeChange,
  onUnderlyingIdChange,
}) => {
  return (
    <div className="space-y-3">
      {/* Deposit Type Selection */}
      <div className="flex justify-center space-x-2 my-2">
        <button
          type="button"
          onClick={() => onDepositTypeChange('AMOUNT')}
          className={`px-3 py-2 rounded-lg font-medium transition-all duration-300 transform
            ${form.depositType === 'AMOUNT' 
              ? 'bg-teal-600 text-white scale-105 shadow-lg' 
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
        >
          Montant fixe
        </button>
        <button
          type="button"
          onClick={() => onDepositTypeChange('RATE')}
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
        <FormField
          label="Taille de lot"
          name="lotSize"
          required
          error={errors.lotSize}
          tooltip="Nombre d'unités par contrat"
        >
          <input
            type="number"
            value={form.lotSize}
            onChange={(e) => onLotSizeChange(parseFloat(e.target.value) || 0)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition duration-200"
            required
          />
        </FormField>

        {/* Deposit Type */}
        <FormField
          label="Type de dépôt"
          name="depositType"
          required
          error={errors.depositType}
          tooltip="Type de dépôt requis pour le trading"
        >
          <select
            value={form.depositType}
            onChange={(e) => onDepositTypeChange(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition duration-200"
            required
          >
            <option value="">Sélectionnez le type de dépôt</option>
            {api.depositTypes.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </FormField>

        {/* Initial Margin Amount */}
        <FormField
          label="Montant de la marge initiale"
          name="initialMarginAmount"
          tooltip="Montant de marge requis pour ouvrir une position"
        >
          <div className="space-y-2">
            {form.depositType && form.depositType !== 'AMOUNT' && (
              <span className="text-xs bg-gray-100 text-gray-500 px-2 py-1 rounded">
                Calculé automatiquement
              </span>
            )}
            <input
              type="text"
              value={stringInputs.initialMarginAmount}
              onChange={(e) => onInitialMarginAmountChange(e.target.value)}
              readOnly={Boolean(form.depositType && form.depositType !== 'AMOUNT')}
              className={`w-full px-4 py-2 border rounded-lg transition-all duration-200 ${
                form.depositType && form.depositType !== 'AMOUNT'
                  ? 'bg-gray-100 text-gray-500 cursor-not-allowed' 
                  : 'border-gray-300 focus:ring-2 focus:ring-teal-500 focus:border-transparent hover:border-gray-400'
              }`}
            />
          </div>
        </FormField>

        {/* Percentage Margin */}
        <FormField
          label="Pourcentage de marge"
          name="percentageMargin"
          tooltip="Pourcentage de marge par rapport à la valeur du contrat"
        >
          <div className="space-y-2">
            {form.depositType && form.depositType !== 'RATE' && (
              <span className="text-xs bg-gray-100 text-gray-500 px-2 py-1 rounded">
                Calculé automatiquement
              </span>
            )}
            <input
              type="text"
              value={stringInputs.percentageMargin}
              onChange={(e) => onPercentageMarginChange(e.target.value)}
              readOnly={Boolean(form.depositType && form.depositType !== 'RATE')}
              className={`w-full px-4 py-2 border rounded-lg transition duration-200 ${
                form.depositType && form.depositType !== 'RATE'
                  ? 'bg-gray-100 text-gray-500 cursor-not-allowed' 
                  : 'border-gray-300 focus:ring-2 focus:ring-teal-500 focus:border-transparent'
              }`}
            />
          </div>
        </FormField>
      </div>

      {/* Underlying Assets */}
      <div className="bg-white rounded-lg shadow p-3 border border-gray-100 hover:shadow-lg transition-all duration-200">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <FormField
            label="Type du sous-jacent"
            name="underlyingType"
            required
            error={errors.underlyingType}
            tooltip="Type d'actif sous-jacent au contrat"
          >
            <select
              value={form.underlyingType}
              onChange={(e) => onUnderlyingTypeChange(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition duration-200"
              required
            >
              <option value="">Sélectionnez le type du sous-jacent</option>
              {api.underlyingTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </FormField>
          
          <FormField
            label="Sous-jacent"
            name="underlyingId"
            required
            error={errors.underlyingId}
            tooltip="Actif spécifique sous-jacent au contrat"
          >
            <select
              value={form.underlyingId}
              onChange={(e) => onUnderlyingIdChange(parseInt(e.target.value) || 0)}
              disabled={!form.underlyingType}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition duration-200"
              required
            >
              <option value={0}>Sélectionnez le sous-jacent</option>
              {api.underlyingAssets.map(asset => (
                <option key={asset.id} value={asset.id}>{asset.identifier}</option>
              ))}
            </select>
          </FormField>
        </div>
      </div>
    </div>
  );
};
