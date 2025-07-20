import { SettlementMethod, DepositType } from './enums'; // à adapter selon où tu mets les enums

export interface FutureCreationDTO {
  symbol: string;
  description: string;
  isin: string;
  expirationCode: string;
  parentTicker: string;
  fullName: string;
  segment: string;

  maturityDate: string;         // Dates au format ISO string (ex: "2025-07-19")
  firstTradingDate: string;
  lastTraadingDate: string;

  initialMarginAmount: number;  // BigDecimal côté Java -> number en TS
  percentageMargin: number;

  lotSize: number;
  contractMultiplier: number;

  tradingCurrency: string;

  underlyingId: number;

  settlementMethod: SettlementMethod;
  instrumentStatus: boolean;

  tickSize: number;
  tickValue: number;

  depositType: DepositType;
}
