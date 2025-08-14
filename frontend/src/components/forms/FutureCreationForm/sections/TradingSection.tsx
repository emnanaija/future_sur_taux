import React from 'react';
import { FutureFormData } from '../schemas/futureFormSchema';
import { Info } from 'lucide-react';

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
    settlementMethods: string[];
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
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tick Size <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={stringInputs.tickSize}
              onChange={(e) => onTickSizeChange(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg transition-all duration-200 focus:ring-2 focus:ring-teal-500 focus:border-transparent hover:border-gray-400"
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
          <div className="space-y-2">
            <label className="flex items-center text-sm font-medium text-gray-700">
              Tick Value
              {editMode !== 'tickValue' && (
                <span className="ml-2 text-xs bg-gray-100 text-gray-500 px-2 py-1 rounded">
                  Calculé automatiquement
                </span>
              )}
              <div 
                className="ml-2 text-teal-600 cursor-help"
                title="Tick Value = Tick Size × Contract Multiplier"
              >
                <Info className="w-4 h-4" />
              </div>
            </label>
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
          
          <div className="space-y-2">
            <label className="flex items-center text-sm font-medium text-gray-700">
              Contract Multiplier
              {editMode !== 'contractMultiplier' && (
                <span className="ml-2 text-xs bg-gray-100 text-gray-500 px-2 py-1 rounded">
                  Calculé automatiquement
                </span>
              )}
              <div 
                className="ml-2 text-teal-600 cursor-help"
                title="Contract Multiplier = Tick Value ÷ Tick Size"
              >
                <Info className="w-4 h-4" />
              </div>
            </label>
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
            onChange={(e) => onFieldChange('firstTradingDate', e.target.value)}
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
            onChange={(e) => onFieldChange('lastTraadingDate', e.target.value)}
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
            onChange={(e) => onFieldChange('tradingCurrency', e.target.value)}
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
            onChange={(e) => onFieldChange('settlementMethod', e.target.value)}
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
        </div>
      </div>
    </div>
  );
};
