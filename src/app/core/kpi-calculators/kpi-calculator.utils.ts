import { KpiTrendResult, TrendTier } from './kpi-calculator.types';

function safePercentDelta(current: number, previous: number): number {
  if (previous === 0) {
    if (current === 0) {
      return 0;
    }

    return current > 0 ? 100 : -100;
  }

  return Number((((current - previous) / Math.abs(previous)) * 100).toFixed(2));
}

function getDirection(current: number, previous: number): 'up' | 'down' | 'flat' {
  if (current > previous) {
    return 'up';
  }

  if (current < previous) {
    return 'down';
  }

  return 'flat';
}

export function toTrendResult(tier: TrendTier, current: number, previous: number): KpiTrendResult {
  return {
    tier,
    deltaPercent: safePercentDelta(current, previous),
    direction: getDirection(current, previous)
  };
}
