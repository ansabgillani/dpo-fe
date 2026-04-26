import { SelectOption } from './risk-field-configs.types';

const SEVERITY_OPTIONS: SelectOption[] = [
  { label: 'Low', value: 'low' },
  { label: 'Medium', value: 'medium' },
  { label: 'High', value: 'high' },
  { label: 'Critical', value: 'critical' }
];

export function getSeverityOptions(): SelectOption[] {
  return SEVERITY_OPTIONS.map((option) => ({ ...option }));
}
