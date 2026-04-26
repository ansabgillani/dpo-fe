import { calculateTimelineTrend } from './timeline.calculator';

describe('calculateTimelineTrend', () => {
  it('returns green for no delay', () => {
    expect(calculateTimelineTrend(0, 3).tier).toBe('green');
  });

  it('returns yellow for 1-14 days delay', () => {
    expect(calculateTimelineTrend(7, 3).tier).toBe('yellow');
  });

  it('returns red for >14 days delay', () => {
    expect(calculateTimelineTrend(20, 3).tier).toBe('red');
  });

  it('calculates percent delta', () => {
    expect(calculateTimelineTrend(12, 10).deltaPercent).toBe(20);
  });
});
