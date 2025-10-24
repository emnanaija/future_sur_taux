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
   * Update form with calculated values based on deposit type
   */
  static updateFormCalculations(
    form: FutureFormData,
    depositType: string,
    lotSize: number
  ): PartialFutureFormData {
    // Remove any logic that allows choosing between percentage and amount
    return {
      percentageMargin: this.parsePercentageMargin(form.percentageMargin.toString())
    };
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
