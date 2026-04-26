import { SelectOption } from './risk-field-configs.types';

const STATUS_OPTIONS: SelectOption[] = [
  { label: 'Open', value: 'open' },
  { label: 'In Progress', value: 'in-progress' },
  { label: 'Mitigated', value: 'mitigated' },
  { label: 'Closed', value: 'closed' }
];

export function getStatusOptions(): SelectOption[] {
  return STATUS_OPTIONS.map((option) => ({ ...option }));
}
