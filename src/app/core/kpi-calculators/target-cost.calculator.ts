import { KpiTrendResult } from './kpi-calculator.types';
import { calculateBudgetTrend } from './budget.calculator';

export function calculateTargetCostTrend(
  actualCost: number,
  targetCost: number,
  previousActualCost: number,
  previousTargetCost: number
): KpiTrendResult {
  return calculateBudgetTrend(actualCost, targetCost, previousActualCost, previousTargetCost);
}
