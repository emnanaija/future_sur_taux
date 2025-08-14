import React from 'react';
import { FormField } from '../common/FormField';
import { FutureFormData } from '../schemas/futureFormSchema';

interface IdentificationSectionProps {
  form: FutureFormData;
  errors: Record<string, string>;
  onChange: (field: keyof FutureFormData, value: any) => void;
}

export const IdentificationSection: React.FC<IdentificationSectionProps> = ({
  form,
  errors,
  onChange
}) => {
  const handleInputChange = (field: keyof FutureFormData) => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    onChange(field, e.target.value);
  };

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <FormField
          label="Code valeur"
          name="symbol"
          required
          error={errors.symbol}
          tooltip="Identifiant unique de l'instrument financier"
        >
          <input
            type="text"
            value={form.symbol}
            onChange={handleInputChange('symbol')}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg transition-all duration-200
                     focus:ring-2 focus:ring-teal-500 focus:border-transparent
                     hover:border-gray-400"
            placeholder="Ex: FUT001"
          />
        </FormField>

        <FormField
          label="Code ISIN"
          name="isin"
          required
          error={errors.isin}
          tooltip="Code ISIN international standard"
        >
          <input
            type="text"
            value={form.isin}
            onChange={handleInputChange('isin')}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition duration-200"
            placeholder="Ex: FR0000000000"
          />
        </FormField>

        <FormField
          label="Code d'expiration"
          name="expirationCode"
          error={errors.expirationCode}
          tooltip="Code spécifique à l'expiration du contrat"
        >
          <input
            type="text"
            value={form.expirationCode}
            onChange={handleInputChange('expirationCode')}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition duration-200"
            placeholder="Ex: DEC24"
          />
        </FormField>

        <FormField
          label="Ticker parent"
          name="parentTicker"
          error={errors.parentTicker}
          tooltip="Ticker de l'instrument parent"
        >
          <input
            type="text"
            value={form.parentTicker}
            onChange={handleInputChange('parentTicker')}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition duration-200"
            placeholder="Ex: PARENT"
          />
        </FormField>

        <FormField
          label="Description"
          name="description"
          error={errors.description}
          tooltip="Description détaillée de l'instrument"
        >
          <input
            type="text"
            value={form.description}
            onChange={handleInputChange('description')}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition duration-200"
            placeholder="Description du future"
          />
        </FormField>

        <FormField
          label="Nom complet"
          name="fullName"
          required
          error={errors.fullName}
          tooltip="Nom complet de l'instrument"
        >
          <input
            type="text"
            value={form.fullName}
            onChange={handleInputChange('fullName')}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition duration-200"
            placeholder="Nom complet du future"
          />
        </FormField>

        <FormField
          label="Structure marché"
          name="segment"
          error={errors.segment}
          tooltip="Segment de marché de l'instrument"
        >
          <input
            type="text"
            value={form.segment}
            onChange={handleInputChange('segment')}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition duration-200"
            placeholder="Ex: MATIF, EUREX"
          />
        </FormField>

        <FormField
          label="Date d'échéance"
          name="maturityDate"
          error={errors.maturityDate}
          tooltip="Date d'échéance du contrat"
        >
          <input
            type="date"
            value={form.maturityDate}
            onChange={handleInputChange('maturityDate')}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition duration-200"
          />
        </FormField>
      </div>
    </div>
  );
};
