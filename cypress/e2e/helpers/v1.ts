export const paginated = <T>(results: T[]) => ({
  count: results.length,
  next: null,
  previous: null,
  results
});

export const setupSilentAuth = (role = 'manager') => {
  cy.intercept('POST', '**/api/v1/auth/token/', {
    access: 'mock-access-admin',
    refresh: 'mock-refresh-admin'
  }).as('authToken');

  cy.intercept('GET', '**/api/v1/users/me/', {
    id: 1,
    username: 'admin',
    full_name: 'Mock Admin',
    roles: role
  }).as('authMe');
};

export const buildStatusTrends = (_projectId: number) => [
  {
    name: 'Quality',
    current: { value: 'Green', changed_at: '2026-04-26T08:00:00Z', description: 'Stable quality trend.' },
    previous: { value: 'Yellow', changed_at: '2026-03-26T08:00:00Z' }
  },
  {
    name: 'Budget',
    current: { value: 'Green', changed_at: '2026-04-26T08:00:00Z', description: 'Spend in line.' },
    previous: { value: 'Yellow', changed_at: '2026-03-26T08:00:00Z' }
  },
  {
    name: 'TargetCost',
    current: { value: 'Green', changed_at: '2026-04-26T08:00:00Z', description: 'Slightly above target.' },
    previous: { value: 'Yellow', changed_at: '2026-03-26T08:00:00Z' }
  },
  {
    name: 'Resources',
    current: { value: 'Green', changed_at: '2026-04-26T08:00:00Z', description: 'Healthy staffing.' },
    previous: { value: 'Yellow', changed_at: '2026-03-26T08:00:00Z' }
  },
  {
    name: 'Timeline',
    current: { value: 'Yellow', changed_at: '2026-04-26T08:00:00Z', description: 'Minor delay.' },
    previous: { value: 'Red', changed_at: '2026-03-26T08:00:00Z' }
  },
  {
    name: 'CustomerSatisfaction',
    current: { value: 'Green', changed_at: '2026-04-26T08:00:00Z', description: 'Improving.' },
    previous: { value: 'Yellow', changed_at: '2026-03-26T08:00:00Z' }
  }
];

export const buildCostBreakdowns = (pspProjectId: number, base = 100, year = 2025) =>
  Array.from({ length: 12 }, (_, index) => {
    const month = String(index + 1).padStart(2, '0');
    const reportingMonth = `${year}-${month}`;
    const grossBudget = base + index + 20;
    const grossActuals = base + index;
    const grossForecast = base + index + 10;

    return [
      {
        id: pspProjectId * 1000 + index * 3 + 1,
        psp_project: pspProjectId,
        type: 'Budget',
        reporting_month: reportingMonth,
        gross: `${grossBudget}`,
        charging_to_bl: `${grossBudget - 10}`,
        net: `${grossBudget - 20}`
      },
      {
        id: pspProjectId * 1000 + index * 3 + 2,
        psp_project: pspProjectId,
        type: 'Actuals',
        reporting_month: reportingMonth,
        gross: `${grossActuals}`,
        charging_to_bl: `${grossActuals - 10}`,
        net: `${grossActuals - 20}`,
        charging_internal: '12',
        ct_costs: '7',
        external_material: '15',
        internal_material: '8'
      },
      {
        id: pspProjectId * 1000 + index * 3 + 3,
        psp_project: pspProjectId,
        type: 'Forecast',
        reporting_month: reportingMonth,
        gross: `${grossForecast}`,
        charging_to_bl: `${grossForecast - 10}`,
        net: `${grossForecast - 20}`
      }
    ];
  }).flat();
