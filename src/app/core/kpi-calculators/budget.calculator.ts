import { KpiTrendResult } from './kpi-calculator.types';
import { toTrendResult } from './kpi-calculator.utils';

function toConsumptionPercent(actual: number, planned: number): number {
  if (planned === 0) {
    return 0;
  }

  return Number(((actual / planned) * 100).toFixed(2));
}

export function calculateBudgetTrend(
  actualCost: number,
  plannedCost: number,
  previousActualCost: number,
  previousPlannedCost: number
): KpiTrendResult {
  const currentRatio = toConsumptionPercent(actualCost, plannedCost);
  const previousRatio = toConsumptionPercent(previousActualCost, previousPlannedCost);

  if (currentRatio <= 100) {
    return toTrendResult('green', currentRatio, previousRatio);
  }

  if (currentRatio <= 110) {
    return toTrendResult('yellow', currentRatio, previousRatio);
  }

  return toTrendResult('red', currentRatio, previousRatio);
}
