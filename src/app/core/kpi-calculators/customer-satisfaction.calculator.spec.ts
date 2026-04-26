import { calculateCustomerSatisfactionTrend } from './customer-satisfaction.calculator';

describe('calculateCustomerSatisfactionTrend', () => {
  it('returns green for >= 75', () => {
    expect(calculateCustomerSatisfactionTrend(80, 70).tier).toBe('green');
  });

  it('returns yellow for 50-74', () => {
    expect(calculateCustomerSatisfactionTrend(60, 70).tier).toBe('yellow');
  });

  it('returns red for < 50', () => {
    expect(calculateCustomerSatisfactionTrend(40, 70).tier).toBe('red');
  });

  it('calculates percent delta', () => {
    expect(calculateCustomerSatisfactionTrend(75, 60).deltaPercent).toBe(25);
  });
});
