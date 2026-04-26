import { calculateResourcesTrend } from './resources.calculator';

describe('calculateResourcesTrend', () => {
  it('returns green for >= 90%', () => {
    expect(calculateResourcesTrend(92, 88).tier).toBe('green');
  });

  it('returns yellow for 70-89%', () => {
    expect(calculateResourcesTrend(80, 88).tier).toBe('yellow');
  });

  it('returns red for < 70%', () => {
    expect(calculateResourcesTrend(60, 88).tier).toBe('red');
  });

  it('calculates percent delta', () => {
    expect(calculateResourcesTrend(99, 90).deltaPercent).toBe(10);
  });
});
