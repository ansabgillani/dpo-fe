import { calculateQualityTrend } from './quality.calculator';

describe('calculateQualityTrend', () => {
  it('returns green for >= 80', () => {
    expect(calculateQualityTrend(80, 70).tier).toBe('green');
  });

  it('returns yellow for 60-79', () => {
    expect(calculateQualityTrend(70, 70).tier).toBe('yellow');
  });

  it('returns red for < 60', () => {
    expect(calculateQualityTrend(50, 70).tier).toBe('red');
  });

  it('calculates percent delta', () => {
    expect(calculateQualityTrend(90, 75).deltaPercent).toBe(20);
  });
});
