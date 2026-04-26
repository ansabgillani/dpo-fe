import { getRiskTypeOptions } from './risk-type.config';

describe('getRiskTypeOptions', () => {
  it('returns expected option values', () => {
    const values = getRiskTypeOptions().map((option) => option.value);
    expect(values).toEqual(['scope', 'schedule', 'resource', 'financial', 'compliance']);
  });

  it('returns a new array instance', () => {
    const first = getRiskTypeOptions();
    const second = getRiskTypeOptions();
    expect(first).not.toBe(second);
  });
});
