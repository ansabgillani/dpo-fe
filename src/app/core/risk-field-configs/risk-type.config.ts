import { SelectOption } from './risk-field-configs.types';

const RISK_TYPE_OPTIONS: SelectOption[] = [
  { label: 'Technical Risk', value: 'Technical Risk' },
  { label: 'Budget', value: 'Budget' },
  { label: 'Product Cost', value: 'Product Cost' },
  { label: 'Ressources', value: 'Ressources' },
  { label: 'SCM', value: 'SCM' }
];

export function getRiskTypeOptions(): SelectOption[] {
  return RISK_TYPE_OPTIONS.map((option) => ({ ...option }));
}
