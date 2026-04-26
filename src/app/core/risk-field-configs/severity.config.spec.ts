import { getSeverityOptions } from './severity.config';

describe('getSeverityOptions', () => {
  it('returns expected option values', () => {
    const values = getSeverityOptions().map((option) => option.value);
    expect(values).toEqual(['low', 'medium', 'high', 'critical']);
  });

  it('returns a new array instance', () => {
    const first = getSeverityOptions();
    const second = getSeverityOptions();
    expect(first).not.toBe(second);
  });
});
