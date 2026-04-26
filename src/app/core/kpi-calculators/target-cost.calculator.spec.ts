import { calculateTargetCostTrend } from './target-cost.calculator';

describe('calculateTargetCostTrend', () => {
  it('returns green when ratio <= 100%', () => {
    expect(calculateTargetCostTrend(95, 100, 90, 100).tier).toBe('green');
  });

  it('returns yellow when ratio is 101-110%', () => {
    expect(calculateTargetCostTrend(108, 100, 95, 100).tier).toBe('yellow');
  });

  it('returns red when ratio > 110%', () => {
    expect(calculateTargetCostTrend(130, 100, 100, 100).tier).toBe('red');
  });

  it('calculates percent delta using ratio', () => {
    expect(calculateTargetCostTrend(105, 100, 100, 100).deltaPercent).toBe(5);
  });
});
