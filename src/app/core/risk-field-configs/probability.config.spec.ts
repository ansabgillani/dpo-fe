import { getProbabilityOptions } from './probability.config';

describe('getProbabilityOptions', () => {
  it('returns expected option values', () => {
    const values = getProbabilityOptions().map((option) => option.value);
    expect(values).toEqual(['low', 'medium', 'high']);
  });

  it('returns a new array instance', () => {
    const first = getProbabilityOptions();
    const second = getProbabilityOptions();
    expect(first).not.toBe(second);
  });
});
