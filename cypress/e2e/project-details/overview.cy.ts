import { buildCostBreakdowns, buildStatusTrends, paginated, setupSilentAuth } from '../helpers/v1';

describe('Project Details Overview (Phase 3)', () => {
  const apiProjects = [
    {
      id: 1,
      title: 'Imaging Platform Modernization',
      department: 'DIC',
      business_line: 'XP',
      type: 'SSP',
      start_date: '2025-01-10',
      end_date: '2025-11-30',
      is_active: 'true'
    },
    {
      id: 2,
      title: 'Cloud PACS Migration',
      department: 'DAS',
      business_line: 'CT',
      type: 'Platform',
      start_date: '2025-01-20',
      end_date: '2025-12-15',
      is_active: 'true'
    }
  ];

  const mappings = [
    { id: 101, project: 1, psp_element: 'PSP-1' },
    { id: 201, project: 2, psp_element: 'PSP-11' }
  ];

  const statusesOne = buildStatusTrends(1);
  const statusesTwo = buildStatusTrends(2);

  const costProjects = [
    { id: 1001, fiscal_year: 'FY25', psp_element: 'PSP-1', project_title: 'Imaging Platform Modernization', stand_reporting_period: '2025-01' },
    { id: 2001, fiscal_year: 'FY25', psp_element: 'PSP-11', project_title: 'Cloud PACS Migration', stand_reporting_period: '2025-01' }
  ];

  const costBreakdowns = [...buildCostBreakdowns(1001, 100), ...buildCostBreakdowns(2001, 140)];

  beforeEach(() => {
    setupSilentAuth();

    cy.intercept('GET', '**/api/v1/projects/?*', paginated(apiProjects)).as('getProjects');
    cy.intercept('GET', '**/api/v1/projects/1/', apiProjects[0]).as('getProjectOne');
    cy.intercept('GET', '**/api/v1/projects/2/', apiProjects[1]).as('getProjectTwo');

    cy.intercept('GET', '**/api/v1/psp-mappings/?page_size=500*', paginated(mappings)).as('getPspMappings');
    cy.intercept('GET', '**/api/v1/psp-mappings/?project=1&page_size=500*', paginated([mappings[0]])).as('getProjectOnePsp');
    cy.intercept('GET', '**/api/v1/psp-mappings/?project=2&page_size=500*', paginated([mappings[1]])).as('getProjectTwoPsp');

    cy.intercept('GET', '**/api/v1/projects/1/status-trends', paginated(statusesOne)).as('getStateOne');
    cy.intercept('GET', '**/api/v1/projects/2/status-trends', paginated(statusesTwo)).as('getStateTwo');

    cy.intercept('GET', '**/api/v1/cost-projects/?page_size=500*', paginated(costProjects)).as('getCostProjects');
    cy.intercept('GET', '**/api/v1/cost-breakdowns/?page_size=1000*', paginated(costBreakdowns)).as('getCostBreakdowns');
    cy.intercept('GET', '**/api/v1/products/?project=1&page_size=500*', paginated([])).as('getProductsOne');
    cy.intercept('GET', '**/api/v1/products/?project=2&page_size=500*', paginated([])).as('getProductsTwo');
    cy.intercept('GET', '**/api/v1/product-costs/?product__project=1&page_size=500*', paginated([])).as('getProductCostsOne');
    cy.intercept('GET', '**/api/v1/product-costs/?product__project=2&page_size=500*', paginated([])).as('getProductCostsTwo');

    cy.visit('/project/1');
    cy.wait('@getProjects');
    cy.wait('@getPspMappings');
    cy.wait('@getProjectOne');
    cy.wait('@getProjectOnePsp');
    cy.wait('@getStateOne');
    cy.wait('@getCostBreakdowns');
  });

  it('E2E-029 shows overview tab by default', () => {
    cy.get('[data-cy="overview-tab"]').should('be.visible');
    cy.get('[data-cy="tab-nav-overview"]').closest('.tab-row').should('have.class', 'active');
  });

  it('E2E-030 renders six KPI cards', () => {
    cy.get('[data-cy="overview-kpi-grid"] .kpi-card').should('have.length', 6);
  });

  it('E2E-031 renders project summary and budget chart', () => {
    cy.get('[data-cy="overview-project-summary"]').should('be.visible');
    cy.get('[data-cy="budget-chart"]').should('be.visible');
  });

  it('E2E-032 selector switch keeps overview and updates URL', () => {
    cy.get('[data-cy="project-selector-select"]').select('2');
    cy.wait('@getProjectTwo');
    cy.wait('@getProjectTwoPsp');
    cy.wait('@getStateTwo');
    cy.wait('@getProductsTwo');

    cy.url().should('include', '/project/2');
    cy.get('[data-cy="overview-tab"]').should('be.visible');
  });

  it('E2E-033 shows skeleton while state cards load', () => {
    cy.intercept('GET', '**/api/v1/projects/2/status-trends', {
      delay: 1200,
      body: paginated(statusesTwo)
    }).as('slowStateTwo');

    cy.get('[data-cy="project-selector-select"]').select('2');
    cy.wait('@getProjectTwo');
    cy.get('[data-cy="skeleton-kpi-grid"]').should('be.visible');
    cy.wait('@slowStateTwo');
  });
});
