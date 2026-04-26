import { SelectOption } from './risk-field-configs.types';

const RISK_TYPE_OPTIONS: SelectOption[] = [
  { label: 'Scope', value: 'scope' },
  { label: 'Schedule', value: 'schedule' },
  { label: 'Resource', value: 'resource' },
  { label: 'Financial', value: 'financial' },
  { label: 'Compliance', value: 'compliance' }
];

export function getRiskTypeOptions(): SelectOption[] {
  return RISK_TYPE_OPTIONS.map((option) => ({ ...option }));
}
