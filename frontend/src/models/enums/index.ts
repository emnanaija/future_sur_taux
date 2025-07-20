export type AdvanceType = 
  | 'CONVERTIBLE'
  | 'BLOCKED';

export type AmortizationType =
  | 'LINEAIR'
  | 'FIXED_ANNUITY'
  | 'INFINITELY';

export type BondCategory =
  | 'ORDINARY_BOND'
  | 'TCN'
  | 'ADVANCE'
  | 'DAT';

export type BondClassification =
  | 'LISTED_GOVERNMENT_BONDS'
  | 'LISTED_PRIVATE_BONDS'
  | 'UNLISTED_GOVERNMENT_BONDS'
  | 'UNLISTED_PRIVATE_BONDS'
  | 'CDN'
  | 'COLLECTIVE_INVESTMENT_SCHEMES_IN_SECURITIZATION';

export type BondNature =
  | 'CERTIFICATE_OF_DEPOSIT'
  | 'ISSUED_BOND_DEBT'
  | 'DEBT_SECURITIES_ISSUED'
  | 'SUBORDINATED_TERM_SECURITIES'
  | 'SUBORDINATED_FIXED_TERM_SECURITIES_ISSUED_TO_CREDIT_INSTITUTIONS_AND_SIMILAR_ENTITIES'
  | 'PERPERTUAL_SUBORDINATED_SECURITIES'
  | 'PERPERTUAL_SUBORDINATED_SECURITIES_ISSUED_TO_CREDIT_INSTITUTIONS_AND_SIMILAR_ENTITIES'
  | 'CERTIFICATES_OF_DEPOSIT'
  | 'BONS_SOCIETES_FINANCEMENT'
  | 'BILLETS_TRESORERIE'
  | 'FIXED_RATE_TREASURY_BILLS_WITH_PRE_COUNTED_INTEREST'
  | 'FIXED_RATE_ANNUAL_INTEREST_TREASURY_BILLS'
  | 'MEDIUM__AND_LONG_TERM_TREASURY_BONDS_MATURING_IN_2_TO_50_YEARS'
  | 'ASSIMILABLE_TREASURY_BILLS_LESS_THAN_ONE_YEAR';

export type CollateralMethod =
  | 'CASHCOLLATERAL'
  | 'SECCOLLATERAL'
  | 'SECCASHCOLLATERAL';
export type DayBase =
  | 'DAY_BASE_365'
  | 'DAY_BASE_360'
  | 'DAY_BASE_366'
  | 'DAY_BASE_252'
  | 'REAL_BASE';

export type DepositType = 'AMOUNT' | 'RATE';

export type Guarantee =
  | 'STATE_GUARANTEED'
  | 'CO_GUARANTEE'
  | 'SECURED'
  | 'UNSECURED'
  | 'NEGATIVE_PLEDGE'
  | 'SENIOR'
  | 'SUBORDINATED_SENIOR'
  | 'JUNIOR'
  | 'SUBORDINATED_JUNIOR'
  | 'SUPRANATIONAL';

export type PaiementStatusBond =
  | 'FIXED'
  | 'FIXED_WITH_CALL'
  | 'FIXED_WITH_PUT'
  | 'FIXED_WITH_PUTANDCALL'
  | 'AMORTIZING'
  | 'AMORTIZING_WITH_CALL'
  | 'AMORTIZING_WITH_PUT'
  | 'AMORTIZING_WITH_PUTANDCALL'
  | 'PERPETUAL'
  | 'PERPETUAL_WITH_CALL'
  | 'PERPETUAL_WITH_PUT'
  | 'EXTENDABLE';

  export type Periodicity = 
  | 'INFINITY'
  | 'WEEKLY'
  | 'MONTHLY'
  | 'QUARTERLY'
  | 'SEMI_ANNUAL'
  | 'ANNUAL'
  | 'DAILY';

export type RateType = 'VARIABLE_RATE' | 'FIXED_RATE';

export type SettlementMethod = 'CASH' | 'PHYSICAL';

export type UnderlyingType = 
  | 'EQUITIES'
  | 'BONDS'
  | 'FUTURES'
  | 'COMMODITIES'
  | 'INDEX'
  | 'RIGHTS'
  | 'CURRENCY'
  | 'MP'
  | 'INTEREST_RATE'
  | 'ETF'
  | 'STOCK_NOT';


  export const PeriodicityLabels: Record<Periodicity, string> = {
  INFINITY: 'Infini',
  WEEKLY: 'Hebdomadaire',
  MONTHLY: 'Mensuel',
  QUARTERLY: 'Trimestriel',
  SEMI_ANNUAL: 'Semestriel',
  ANNUAL: 'Annuel',
  DAILY: 'Journalier',
};

export const RateTypeLabels: Record<RateType, string> = {
  VARIABLE_RATE: 'Variable',
  FIXED_RATE: 'Taux fixe',
};

export const SettlementMethodLabels: Record<SettlementMethod, string> = {
  CASH: 'Cash',
  PHYSICAL: 'Physique',
};

export const UnderlyingTypeLabels: Record<UnderlyingType, string> = {
  EQUITIES: 'Actions',
  BONDS: 'Obligations',
  FUTURES: 'Futures',
  COMMODITIES: 'Matières premières',
  INDEX: 'Indice',
  RIGHTS: 'Droits',
  CURRENCY: 'Devise',
  MP: 'Marché monétaire',
  INTEREST_RATE: 'Taux d’intérêt',
  ETF: 'ETF',
  STOCK_NOT: 'Stock Noté',
};
