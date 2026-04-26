import { SelectOption } from './risk-field-configs.types';

const PROBABILITY_OPTIONS: SelectOption[] = [
  { label: 'Low', value: 'low' },
  { label: 'Medium', value: 'medium' },
  { label: 'High', value: 'high' }
];

export function getProbabilityOptions(): SelectOption[] {
  return PROBABILITY_OPTIONS.map((option) => ({ ...option }));
}
