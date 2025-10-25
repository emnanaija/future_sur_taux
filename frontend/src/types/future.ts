// Types pour l'affichage des futures
export interface FutureDisplay {
  id: number;
  symbol: string;
  description: string;
  isin: string;
  parentTicker: string;
  fullName: string;
  firstTradingDate: string;
  lastTradingDate: string;
  maturityDate: string;
  tickSize: number;
  tickValue: number;
  tradingCurrency: string;
  lotSize: number;
  contractMultiplier: number;
  percentageMargin: number;
  theoreticalPrice: number;
  contractValue: number;
  initialMarginAmount: number;
  instrumentStatus: boolean;
  depositType: string;
  settlementMethod: string;
  underlyingId: number;
  underlyingIdentifier: string;
  underlyingType: string;
  marketPrice: number | null;
  evaluation: string;
}

// Types pour les enums
export enum DepositType {
  AMOUNT = 'AMOUNT',
  RATE = 'RATE'
}

export enum SettlementMethod {
  CASH = 'CASH',
  PHYSICAL = 'PHYSICAL'
}

export enum UnderlyingType {
  BONDS = 'BONDS',
  STOCKS = 'STOCKS',
  COMMODITIES = 'COMMODITIES'
}

// Labels pour l'affichage
export const DEPOSIT_TYPE_LABELS = {
  [DepositType.AMOUNT]: 'Montant fixe',
  [DepositType.RATE]: 'Pourcentage'
};

export const SETTLEMENT_METHOD_LABELS = {
  [SettlementMethod.CASH]: 'Règlement en espèces',
  [SettlementMethod.PHYSICAL]: 'Livraison physique'
};

export const UNDERLYING_TYPE_LABELS = {
  [UnderlyingType.BONDS]: 'Obligations',
  [UnderlyingType.STOCKS]: 'Actions',
  [UnderlyingType.COMMODITIES]: 'Matières premières'
};

// Labels pour l'évaluation
export const EVALUATION_LABELS = {
  'SUREVALUE': 'Surévalué',
  'SOUS-EVALUEE': 'Sous-évalué',
  'EGAL': 'Égal',
  'INCONNUE': 'Inconnue'
};

export const EVALUATION_COLORS = {
  'SUREVALUE': 'text-red-600 bg-red-100',
  'SOUS-EVALUEE': 'text-green-600 bg-green-100',
  'EGAL': 'text-blue-600 bg-blue-100',
  'INCONNUE': 'text-gray-600 bg-gray-100'
};
