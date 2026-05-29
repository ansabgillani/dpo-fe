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

export const buildStatuses = (projectId: number) => [
  {
    id: projectId * 100 + 1,
    project: projectId,
    name: 'Quality',
    value: 'Green',
    description: 'Stable quality trend.'
  },
  {
    id: projectId * 100 + 2,
    project: projectId,
    name: 'Budget',
    value: 'Green',
    description: 'Spend in line.'
  },
  {
    id: projectId * 100 + 3,
    project: projectId,
    name: 'Target Costs',
    value: 'Green',
    description: 'Slightly above target.'
  },
  {
    id: projectId * 100 + 4,
    project: projectId,
    name: 'Resources',
    value: 'Green',
    description: 'Healthy staffing.'
  },
  {
    id: projectId * 100 + 5,
    project: projectId,
    name: 'Timeline',
    value: 'Red',
    description: 'Minor delay.'
  },
  {
    id: projectId * 100 + 6,
    project: projectId,
    name: 'Customer perception',
    value: 'Green',
    description: 'Improving.'
  }
];

export const buildCostBreakdowns = (pspProjectId: number, base = 100, year = 2025) =>
  Array.from({ length: 12 }, (_, index) => {
    const month = String(index + 1).padStart(2, '0');
    const reportingMonth = `${year}-${month}`;
    const grossBudget = base + index + 20;
    const grossActuals = base + index;
    const grossForecast = base + index + 10;

    /*return [
      {
        id: pspProjectId * 1000 + index * 3 + 1,
        psp_project: pspProjectId,
        type: `P${month}`,
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
    ];*/
    return Array.from({ length: 12 }, (_, i) => (
      {
                    "type": `P${String(i + 1).padStart(2, '0')}`,
                    "reporting_month": `${String(i + 1).padStart(2, '0')}`,
                    "gross": "11.30",
                    "charging_internal": "0.00",
                    "charging_to_bl": "-10.80",
                    "net": "0.60",
                    "adjust_manpower": "0.00",
                    "ct_costs": "0.00",
                    "external_material": "0.00",
                    "external_services": "0.00",
                    "hc_qt_ehs_costs": "0.00",
                    "internal_material": "0.00",
                    "manpower_old_dcc": "0.00",
                    "me_support": "0.00",
                    "other_support": "0.00",
                    "ps_support": "0.00",
                    "ssme_support": "0.00",
                    "manpower": "11.30"
      }
    ));

  }).flat();
