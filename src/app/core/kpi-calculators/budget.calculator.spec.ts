import { calculateBudgetTrend } from './budget.calculator';

describe('calculateBudgetTrend', () => {
  it('returns green when ratio <= 100%', () => {
    expect(calculateBudgetTrend(95, 100, 90, 100).tier).toBe('green');
  });

  it('returns yellow when ratio is 101-110%', () => {
    expect(calculateBudgetTrend(105, 100, 90, 100).tier).toBe('yellow');
  });

  it('returns red when ratio > 110%', () => {
    expect(calculateBudgetTrend(120, 100, 90, 100).tier).toBe('red');
  });

  it('calculates percent delta using ratio', () => {
    expect(calculateBudgetTrend(110, 100, 100, 100).deltaPercent).toBe(10);
  });
});
