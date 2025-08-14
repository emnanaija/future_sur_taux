import { FutureFormData, PartialFutureFormData } from '../schemas/futureFormSchema';

export class FutureCalculationService {
  /**
   * Calculate tick value based on tick size and contract multiplier
   */
  static calculateTickValue(tickSize: number, contractMultiplier: number): number {
    if (tickSize <= 0 || contractMultiplier <= 0) return 0;
    return tickSize * contractMultiplier;
  }

  /**
   * Calculate contract multiplier based on tick size and tick value
   */
  static calculateContractMultiplier(tickSize: number, tickValue: number): number {
    if (tickSize <= 0) return 0;
    return tickValue / tickSize;
  }

  /**
   * Calculate initial margin amount based on lot size and percentage margin
   */
  static calculateInitialMarginAmount(lotSize: number, percentageMargin: number): number {
    if (lotSize <= 0 || percentageMargin <= 0) return 0;
    return lotSize * percentageMargin;
  }

  /**
   * Calculate percentage margin based on lot size and initial margin amount
   */
  static calculatePercentageMargin(lotSize: number, initialMarginAmount: number): number {
    if (lotSize <= 0) return 0;
    return initialMarginAmount / lotSize;
  }

  /**
   * Parse tick size from string input
   */
  static parseTickSize(str: string): number {
    if (!str) return 0;
    const val = parseFloat(str);
    return isNaN(val) ? 0 : val;
  }

  /**
   * Parse percentage margin from string input
   */
  static parsePercentageMargin(str: string): number {
    if (!str) return 0;
    const val = parseFloat(str);
    return isNaN(val) ? 0 : val;
  }

  /**
   * Parse initial margin amount from string input
   */
  static parseInitialMarginAmount(str: string): number {
    if (!str) return 0;
    const val = parseFloat(str);
    return isNaN(val) ? 0 : val;
  }

  /**
   * Update form with calculated values based on deposit type
   */
  static updateFormCalculations(
    form: FutureFormData,
    depositType: string,
    lotSize: number
  ): PartialFutureFormData {
    if (depositType === 'RATE') {
      // For rate-based deposits, calculate initial margin from percentage
      return {
        initialMarginAmount: this.calculateInitialMarginAmount(lotSize, form.percentageMargin)
      };
    } else if (depositType === 'AMOUNT') {
      // For amount-based deposits, calculate percentage from initial margin
      return {
        percentageMargin: this.calculatePercentageMargin(lotSize, form.initialMarginAmount)
      };
    }
    return {};
  }

  /**
   * Update tick-related calculations based on edit mode
   */
  static updateTickCalculations(
    tickSize: number,
    editMode: 'tickValue' | 'contractMultiplier',
    tickValueInput: number,
    contractMultiplierInput: number
  ): { tickValue: number; contractMultiplier: number } {
    if (editMode === 'tickValue') {
      const contractMultiplier = this.calculateContractMultiplier(tickSize, tickValueInput);
      return {
        tickValue: tickValueInput,
        contractMultiplier
      };
    } else {
      const tickValue = this.calculateTickValue(tickSize, contractMultiplierInput);
      return {
        tickValue,
        contractMultiplier: contractMultiplierInput
      };
    }
  }
}
