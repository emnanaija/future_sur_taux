import { z } from 'zod';

// Base schema for the future creation form
export const futureFormSchema = z.object({
  // Identification fields
  symbol: z.string().min(1, 'Le symbole est requis'),
  description: z.string().optional(),
  isin: z.string().min(1, 'Le code ISIN est requis'),
  expirationCode: z.string().optional(),
  parentTicker: z.string().optional(),
  fullName: z.string().min(1, 'Le nom complet est requis'),
  segment: z.string().optional(),
  maturityDate: z.string().optional(),
  
  // Trading fields
  firstTradingDate: z.string().min(1, 'La date de première négociation est requise'),
  lastTraadingDate: z.string().min(1, 'La date de dernière négociation est requise'),
  tradingCurrency: z.string().min(1, 'La devise de négociation est requise'),
  settlementMethod: z.string().min(1, 'La méthode de règlement est requise'),
  instrumentStatus: z.boolean(),
  
  // Financial fields
  initialMarginAmount: z.number().min(0, 'Le montant de marge initiale doit être positif'),
  percentageMargin: z.number().min(0, 'Le pourcentage de marge doit être positif'),
  lotSize: z.number().positive('La taille de lot doit être supérieure à 0'),
  contractMultiplier: z.number().min(0, 'Le multiplicateur de contrat doit être positif'),
  tickSize: z.number().positive('Le tick size doit être supérieur à 0'),
  tickValue: z.number().min(0, 'La valeur du tick doit être positive'),
  
  // Underlying fields
  underlyingType: z.string().min(1, 'Le type de sous-jacent est requis'),
  underlyingId: z.number().positive('Le sous-jacent est requis'),
  depositType: z.string().min(1, 'Le type de dépôt est requis'),
}).refine((data) => {
  // Validation personnalisée : date début < date fin
  if (data.firstTradingDate && data.lastTraadingDate) {
    const startDate = new Date(data.firstTradingDate);
    const endDate = new Date(data.lastTraadingDate);
    return startDate < endDate;
  }
  return true; // Si une des dates n'est pas encore saisie, on ne valide pas
}, {
  message: "La date de début de négociation doit être antérieure à la date de fin de négociation",
  path: ["lastTraadingDate"], // L'erreur sera affichée sur le champ date de fin
});

// Type inference from the schema
export type FutureFormData = z.infer<typeof futureFormSchema>;

// Partial type for form updates
export type PartialFutureFormData = Partial<FutureFormData>;

// Validation function for individual fields
export const validateField = (field: keyof FutureFormData, value: any): string | null => {
  try {
    futureFormSchema.pick({ [field]: true }).parse({ [field]: value });
    return null;
  } catch (error: any) {
    return error.errors?.[0]?.message || 'Validation failed';
  }
};

// Validation function for the entire form
export const validateForm = (data: FutureFormData): Record<string, string> => {
  try {
    futureFormSchema.parse(data);
    return {};
  } catch (error: any) {
    const errors: Record<string, string> = {};
    error.errors?.forEach((err: any) => {
      if (err.path?.[0]) {
        errors[err.path[0]] = err.message;
      }
    });
    return errors;
  }
};

// Validation spécifique pour les dates de trading
export const validateTradingDates = (firstDate: string, lastDate: string): string | null => {
  if (!firstDate || !lastDate) {
    return null; // Pas d'erreur si une des dates n'est pas encore saisie
  }
  
  const startDate = new Date(firstDate);
  const endDate = new Date(lastDate);
  
  if (startDate >= endDate) {
    return "La date de début de négociation doit être antérieure à la date de fin de négociation";
  }
  
  return null;
};
