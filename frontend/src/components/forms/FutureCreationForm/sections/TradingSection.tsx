import React from 'react';

import { FutureFormData } from '../schemas/futureFormSchema';
import { FormField } from '../common/FormField';
import { SettlementMethod } from '../../../../types/enums';

interface TradingSectionProps {
  form: FutureFormData;
  errors: Record<string, string>;
  editMode: 'tickValue' | 'contractMultiplier';
  stringInputs: {
    tickSize: string;
  };
  localInputs: {
    tickValue: number;
    contractMultiplier: number;
  };
  api: {
    settlementMethods: SettlementMethod[];
  };
  onTickSizeChange: (value: string) => void;
  onTickValueChange: (value: number) => void;
  onContractMultiplierChange: (value: number) => void;
  onChangeEditMode: (mode: 'tickValue' | 'contractMultiplier') => void;
  onFieldChange: (field: keyof FutureFormData, value: any) => void;
}

export const TradingSection: React.FC<TradingSectionProps> = ({
  form,
  errors,
  editMode,
  stringInputs,
  localInputs,
  api,
  onTickSizeChange,
  onTickValueChange,
  onContractMultiplierChange,
  onChangeEditMode,
  onFieldChange,
}) => {
  return (
    <div className="space-y-3">
      {/* Tick Configuration */}
      <div className="bg-gradient-to-r from-teal-50 to-white p-3 rounded-lg space-y-3">
        <div className="flex items-end space-x-4 mb-2">
          <div className="flex-1">
            <FormField
              label="Tick Size"
              name="tickSize"
              required
              error={errors.tickSize}
              tooltip="Taille minimale de variation du prix"
            >
              <input
                type="text"
                value={stringInputs.tickSize}
                onChange={(e) => onTickSizeChange(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg transition-all duration-200 focus:ring-2 focus:ring-teal-500 focus:border-transparent hover:border-gray-400"
                placeholder="Ex: 0.01"
              />
            </FormField>
          </div>
          
          {/* Edit Mode Buttons */}
          <div className="flex space-x-2">
            <button
              type="button"
              onClick={() => onChangeEditMode('tickValue')}
              className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 transform
                ${editMode === 'tickValue' 
                  ? 'bg-teal-600 text-white scale-105 shadow-lg' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
            >
              Saisir Tick Value
            </button>
            <button
              type="button"
              onClick={() => onChangeEditMode('contractMultiplier')}
              className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 transform
                ${editMode === 'tickValue' 
                  ? 'bg-gray-100 text-gray-600 hover:bg-gray-200' 
                  : 'bg-teal-600 text-white scale-105 shadow-lg'}`}
            >
              Saisir Multiplicateur
            </button>
          </div>
        </div>

        {/* Tick Value and Contract Multiplier */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            label="Tick Value"
            name="tickValue"
            tooltip="Tick Value = Tick Size × Contract Multiplier"
          >
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                {editMode !== 'tickValue' && (
                  <span className="text-xs bg-gray-100 text-gray-500 px-2 py-1 rounded">
                    Calculé automatiquement
                  </span>
                )}
              </div>
              <input
                type="number"
                value={editMode === 'tickValue' ? localInputs.tickValue : form.tickValue}
                onChange={(e) => onTickValueChange(parseFloat(e.target.value) || 0)}
                readOnly={editMode !== 'tickValue'}
                className={`w-full px-4 py-2 border rounded-lg transition-all duration-200
                  ${editMode !== 'tickValue'
                    ? 'bg-gray-50 text-gray-500 cursor-not-allowed'
                    : 'border-gray-300 focus:ring-2 focus:ring-teal-500 hover:border-gray-400'
                  }`}
              />
            </div>
          </FormField>
          
          <FormField
            label="Contract Multiplier"
            name="contractMultiplier"
            tooltip="Contract Multiplier = Tick Value ÷ Tick Size"
          >
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                {editMode !== 'contractMultiplier' && (
                  <span className="text-xs bg-gray-100 text-gray-500 px-2 py-1 rounded">
                    Calculé automatiquement
                  </span>
                )}
              </div>
              <input
                type="number"
                value={editMode === 'contractMultiplier' ? localInputs.contractMultiplier : form.contractMultiplier}
                onChange={(e) => onContractMultiplierChange(parseFloat(e.target.value) || 0)}
                readOnly={editMode !== 'contractMultiplier'}
                className={`w-full px-4 py-2 border rounded-lg transition-all duration-200
                  ${editMode !== 'contractMultiplier'
                    ? 'bg-gray-50 text-gray-500 cursor-not-allowed'
                    : 'border-gray-300 focus:ring-2 focus:ring-teal-500 hover:border-gray-400'
                  }`}
              />
            </div>
          </FormField>
        </div>
      </div>

      {/* Trading Fields */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <FormField
          label="Date de première négociation"
          name="firstTradingDate"
          required
          error={errors.firstTradingDate}
        >
          <input
            type="date"
            value={form.firstTradingDate}
            onChange={(e) => onFieldChange('firstTradingDate', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition duration-200"
            required
          />
        </FormField>

        <FormField
          label="Date de dernière négociation"
          name="lastTradingDate"
          required
          error={errors.lastTradingDate}
        >
          <input
            type="date"
            value={form.lastTradingDate}
            onChange={(e) => onFieldChange('lastTradingDate', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition duration-200"
            required
          />
        </FormField>

        <FormField
          label="Devise de négociation"
          name="tradingCurrency"
          required
          error={errors.tradingCurrency}
        >
          <input
            value={form.tradingCurrency}
            onChange={(e) => onFieldChange('tradingCurrency', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition duration-200"
            required
          />
        </FormField>

        <FormField
          label="Mode de livraison"
          name="settlementMethod"
          required
          error={errors.settlementMethod}
        >
          <select
            value={form.settlementMethod}
            onChange={(e) => onFieldChange('settlementMethod', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition duration-200"
            required
          >
            <option value="">Sélectionnez la méthode de règlement</option>
            {api.settlementMethods.map(method => (
              <option key={method} value={method}>
                {method}
              </option>
            ))}
          </select>
        </FormField>

        <FormField
          label="Cotation"
          name="instrumentStatus"
          required
        >
          <div className="flex space-x-2">
            <button
              type="button"
              onClick={() => onFieldChange('instrumentStatus', true)}
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
              onClick={() => onFieldChange('instrumentStatus', false)}
              className={`flex-1 py-3 px-4 rounded-lg font-semibold transition-all duration-200 ${
                !form.instrumentStatus 
                  ? 'bg-red-600 text-white shadow-lg' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Non côté
            </button>
          </div>
        </FormField>
      </div>
    </div>
  );
};
