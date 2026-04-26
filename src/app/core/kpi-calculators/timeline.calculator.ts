import { KpiTrendResult } from './kpi-calculator.types';
import { toTrendResult } from './kpi-calculator.utils';

export function calculateTimelineTrend(currentDelayDays: number, previousDelayDays: number): KpiTrendResult {
  if (currentDelayDays <= 0) {
    return toTrendResult('green', currentDelayDays, previousDelayDays);
  }

  if (currentDelayDays <= 14) {
    return toTrendResult('yellow', currentDelayDays, previousDelayDays);
  }

  return toTrendResult('red', currentDelayDays, previousDelayDays);
}
