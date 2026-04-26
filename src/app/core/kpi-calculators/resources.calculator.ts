import { KpiTrendResult } from './kpi-calculator.types';
import { toTrendResult } from './kpi-calculator.utils';

export function calculateResourcesTrend(currentUtilization: number, previousUtilization: number): KpiTrendResult {
  if (currentUtilization >= 90) {
    return toTrendResult('green', currentUtilization, previousUtilization);
  }

  if (currentUtilization >= 70) {
    return toTrendResult('yellow', currentUtilization, previousUtilization);
  }

  return toTrendResult('red', currentUtilization, previousUtilization);
}
