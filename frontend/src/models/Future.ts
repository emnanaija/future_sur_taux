import { Asset } from './Asset';
import { CollateralMethod, DepositType, SettlementMethod } from './enums/index'; // selon où tu les as définis
import { Underlying } from './Underlying'; // si tu as une interface Underlying

export interface Future extends Asset {
  instrumentStatus?: boolean;
  loadId?: string;
  fullName?: string;
  tradingParameter?: string;
  lastTraadingDate?: string; // LocalDate => string ISO
  segment?: string;
  calendarId?: string;
  flagForDelete?: boolean;
  md5MulticastChannelId?: string;
  tradingCurrency?: string;
  activeLoadId?: string;
  secMD5MulticastChannelId?: string;
  secondaryLoadId?: string;
  expiryDate?: string;
  internalLoadId?: string;
  marketDataChannelId?: string;
  referencePriceTable?: string;
  referencePrice?: string;
  blueMonth?: boolean;

  settlementMethod?: SettlementMethod;

  firstTradingDate?: string;
  deletionDate?: string;
  parentTicker?: string;
  cfiCode?: string;
  mobType?: string;
  postTradeParameter?: string;
  settlementDate?: string;
  maturityDate?: string;
  issuedQty?: number;
  orderDeletionDate?: string;
  lotSize?: number;
  expirationCode?: string;

  contractMultiplier?: number;
  tickSize?: number;
  tickValue?: number;

  percentageMargin?: number; // BigDecimal → number
  initialMarginAmount?: number;

  depositType?: DepositType;
  collateralMethod?: CollateralMethod;

  underlying?: Underlying;
}
