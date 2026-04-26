import { getStatusOptions } from './status.config';

describe('getStatusOptions', () => {
  it('returns expected option values', () => {
    const values = getStatusOptions().map((option) => option.value);
    expect(values).toEqual(['open', 'in-progress', 'mitigated', 'closed']);
  });

  it('returns a new array instance', () => {
    const first = getStatusOptions();
    const second = getStatusOptions();
    expect(first).not.toBe(second);
  });
});
