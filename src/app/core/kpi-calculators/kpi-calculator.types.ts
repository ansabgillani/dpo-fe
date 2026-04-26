export type TrendTier = 'green' | 'yellow' | 'red';

export interface KpiTrendResult {
  tier: TrendTier;
  deltaPercent: number;
  direction: 'up' | 'down' | 'flat';
}
