import { KpiTrendResult } from './kpi-calculator.types';
import { toTrendResult } from './kpi-calculator.utils';

export function calculateQualityTrend(currentScore: number, previousScore: number): KpiTrendResult {
  if (currentScore >= 80) {
    return toTrendResult('green', currentScore, previousScore);
  }

  if (currentScore >= 60) {
    return toTrendResult('yellow', currentScore, previousScore);
  }

  return toTrendResult('red', currentScore, previousScore);
}
