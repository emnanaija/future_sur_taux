import React from 'react';
import { FutureFormData } from '../schemas/futureFormSchema';
import { FormField } from '../common/FormField';
import { DepositType } from '../../../../types/enums';

interface DepositSectionProps {
  form: FutureFormData;
  errors: Record<string, string>;
  stringInputs: {
    percentageMargin: string;
  };
  api: {
    depositTypes: DepositType[];
    underlyingAssets: Array<{ id: number; identifier: string }>;
  };
  onLotSizeChange: (value: number) => void;
  onPercentageMarginChange: (value: string) => void;
  onUnderlyingIdChange: (value: number) => void;
}

export const DepositSection: React.FC<DepositSectionProps> = ({
  form,
  errors,
  stringInputs,
  api,
  onLotSizeChange,
  onPercentageMarginChange,
  onUnderlyingIdChange,
}) => {
  return (
    <div className="space-y-3">
      {/* Deposit Type - Fixed to PERCENTAGE */}
      <div className="bg-white rounded-lg shadow p-3 border border-gray-100 hover:shadow-lg transition-all duration-200">
        <FormField
          label="Type de dépôt"
          name="depositType"
          tooltip="Méthode de calcul de la marge de dépôt (fixé à Pourcentage)"
        >
          <div className="flex items-center space-x-2">
            <input
              type="text"
              value={form.depositType === 'RATE' ? 'Pourcentage' : 'Montant fixe'}
              readOnly
              className="w-full px-4 py-2 bg-gray-100 border border-gray-300 rounded-lg text-gray-600 cursor-not-allowed"
            />
            <span className="text-xs bg-teal-100 text-teal-700 px-2 py-1 rounded">
              Fixé
            </span>
          </div>
        </FormField>
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

        {/* Percentage Margin */}
        <FormField
          label="Pourcentage de marge"
          name="percentageMargin"
          tooltip="Pourcentage de marge par rapport à la valeur du contrat"
        >
          <div className="space-y-2">
            {form.depositType && form.depositType !== 'PERCENTAGE' && (
              <span className="text-xs bg-gray-100 text-gray-500 px-2 py-1 rounded">
                Calculé automatiquement
              </span>
            )}
            <input
              type="text"
              value={stringInputs.percentageMargin}
              onChange={(e) => onPercentageMarginChange(e.target.value)}
              readOnly={Boolean(form.depositType && form.depositType !== 'PERCENTAGE')}
              className={`w-full px-4 py-2 border rounded-lg transition duration-200 ${
                form.depositType && form.depositType !== 'PERCENTAGE'
                  ? 'bg-gray-100 text-gray-500 cursor-not-allowed' 
                  : 'border-gray-300 focus:ring-2 focus:ring-teal-500 focus:border-transparent'
              }`}
            />
          </div>
        </FormField>
      </div>

      {/* Underlying Assets */}
      <div className="bg-white rounded-lg shadow p-3 border border-gray-100 hover:shadow-lg transition-all duration-200">
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
  );
};
