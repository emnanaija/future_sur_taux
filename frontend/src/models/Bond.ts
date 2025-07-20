import { Asset } from './Asset';
import {
  AmortizationType,
  BondNature,
  AdvanceType,
  RateType,
  Guarantee,
  BondClassification,
  PaiementStatusBond,
  Periodicity,
  DayBase,
  BondCategory,
} from './enums/index';

export interface Bond extends Asset {
  indexed?: boolean;
  listed?: boolean;
  reference?: string;
  eligibilityIndicator?: boolean;
  maturityDate?: string;       // LocalDate => string ISO
  datedDate?: string;
  delistingDate?: string;
  convertibilityIndicator?: boolean;
  subordinationIndicator?: boolean;
  amortizationTableManagement?: boolean;
  variableRate?: boolean;
  poolFactor?: number;         // BigDecimal => number
  riskPremium?: number;
  amortizationType?: AmortizationType;
  bondNature?: BondNature;
  advanceType?: AdvanceType;
  rateType?: RateType;
  guarantee?: Guarantee;
  bondClassification?: BondClassification;
  paiementStatus?: PaiementStatusBond;
  periodicity?: Periodicity;
  rate?: number;
  dayBase?: DayBase;
  bondCategory?: BondCategory;
}
