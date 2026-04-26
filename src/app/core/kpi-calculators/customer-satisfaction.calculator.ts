import { KpiTrendResult } from './kpi-calculator.types';
import { toTrendResult } from './kpi-calculator.utils';

export function calculateCustomerSatisfactionTrend(currentScore: number, previousScore: number): KpiTrendResult {
  if (currentScore >= 75) {
    return toTrendResult('green', currentScore, previousScore);
  }

  if (currentScore >= 50) {
    return toTrendResult('yellow', currentScore, previousScore);
  }

  return toTrendResult('red', currentScore, previousScore);
}
