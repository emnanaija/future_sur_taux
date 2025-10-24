// Types pour les enums du backend
export type SettlementMethod = 'CASH' | 'PHYSICAL';
export type DepositType = 'AMOUNT' | 'RATE';
export type UnderlyingType = 'EQUITIES' | 'BONDS' | 'FUTURES' | 'COMMODITIES' | 'INDEX' | 'RIGHTS' | 'CURRENCY' | 'MP' | 'INTEREST_RATE' | 'ETF' | 'STOCK_NOT';

// Constantes pour les enums (peuvent être mises à jour dynamiquement depuis le backend)
export const SETTLEMENT_METHODS: SettlementMethod[] = ['CASH', 'PHYSICAL'];
export const DEPOSIT_TYPES: DepositType[] = ['AMOUNT', 'RATE'];
export const UNDERLYING_TYPES: UnderlyingType[] = ['EQUITIES', 'BONDS', 'FUTURES', 'COMMODITIES', 'INDEX', 'RIGHTS', 'CURRENCY', 'MP', 'INTEREST_RATE', 'ETF', 'STOCK_NOT'];

// Labels en français pour l'affichage
export const SETTLEMENT_METHOD_LABELS: Record<SettlementMethod, string> = {
  PHYSICAL: 'Physique',
  CASH: 'Comptant'
};

export const DEPOSIT_TYPE_LABELS: Record<DepositType, string> = {
  AMOUNT: 'Montant fixe',
  RATE: 'Taux'
};

export const UNDERLYING_TYPE_LABELS: Record<UnderlyingType, string> = {
  EQUITIES: 'Actions',
  BONDS: 'Obligations',
  FUTURES: 'Futures',
  COMMODITIES: 'Matières premières',
  INDEX: 'Indice',
  RIGHTS: 'Droits',
  CURRENCY: 'Devise',
  MP: 'Marché primaire',
  INTEREST_RATE: 'Taux d\'intérêt',
  ETF: 'ETF',
  STOCK_NOT: 'Actions non cotées'
};

// Interface pour les réponses API des enums
export interface EnumResponse {
  settlementMethods: SettlementMethod[];
  depositTypes: DepositType[];
  underlyingTypes: UnderlyingType[];
}

