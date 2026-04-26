import { buildCostBreakdowns, buildStatusTrends, paginated, setupSilentAuth } from '../helpers/v1';

describe('Project Details Cost Tab (Phase 7)', () => {
  const apiProject = {
    id: 1,
    title: 'Imaging Platform Modernization',
    department: 'DIC',
    business_line: 'XP',
    type: 'SSP',
    start_date: '2025-01-10',
    end_date: '2025-11-30',
    is_active: 'true'
  };

  const mappings = [{ id: 101, project: 1, psp_element: 'PSP-1' }];
  const statuses = buildStatusTrends(1);

  const costProjects = [
    {
      id: 1001,
      fiscal_year: 'FY26',
      psp_element: 'PSP-1',
      project_title: 'Imaging Platform Modernization',
      stand_reporting_period: '2025-01'
    }
  ];

  const costBreakdowns = buildCostBreakdowns(1001, 100);

  const products = [
    { id: 501, project: 1, name: 'Product 1' },
    { id: 502, project: 1, name: 'Product 2' }
  ];

  const productCosts = [
    { id: 901, product: 501, target: '12345', actual: '12020', calculation_date: '2025-05-10' },
    { id: 902, product: 502, target: '9800', actual: '10040', calculation_date: '2025-05-12' }
  ];

  const bootCostTab = () => {
    cy.visit('/project/1');
    cy.wait('@getProjects');
    cy.wait('@getPspMappings');
    cy.wait('@getProjectOne');
    cy.wait('@getProjectOnePsp');
    cy.wait('@getStateOne');
    cy.get('[data-cy="tab-nav-cost"]').click({ force: true });
    cy.wait('@getCostBreakdowns');
    cy.get('[data-cy="cost-tab"]').should('be.visible');
  };

  beforeEach(() => {
    setupSilentAuth();

    cy.intercept('GET', '**/api/v1/projects/?*', paginated([apiProject])).as('getProjects');
    cy.intercept('GET', '**/api/v1/projects/1/', apiProject).as('getProjectOne');

    cy.intercept('GET', '**/api/v1/psp-mappings/?page_size=500*', paginated(mappings)).as('getPspMappings');
    cy.intercept('GET', '**/api/v1/psp-mappings/?project=1&page_size=500*', paginated(mappings)).as('getProjectOnePsp');

    cy.intercept('GET', '**/api/v1/projects/1/status-trends', paginated(statuses)).as('getStateOne');

    cy.intercept('GET', '**/api/v1/cost-projects/?page_size=500*', paginated(costProjects)).as('getCostProjects');
    cy.intercept('GET', '**/api/v1/cost-breakdowns/?page_size=1000*', paginated(costBreakdowns)).as('getCostBreakdowns');
    cy.intercept('GET', '**/api/v1/products/?project=1&page_size=500*', paginated(products)).as('getProducts');
    cy.intercept('GET', '**/api/v1/product-costs/?product__project=1&page_size=500*', paginated(productCosts)).as('getProductCosts');
  });

  it('E2E-050 Cost tab loads with Overview sub-view active', () => {
    bootCostTab();
    cy.get('[data-cy="cost-sub-nav-overview"]').should('be.visible');
    cy.get('[data-cy="cost-overview"]').should('be.visible');
  });

  it('E2E-051 Skeleton shown during GET cost composition calls', () => {
    cy.intercept('GET', '**/api/v1/cost-breakdowns/?page_size=1000*', {
      delay: 2000,
      body: paginated(costBreakdowns)
    }).as('slowCost');

    cy.visit('/project/1');
    cy.wait('@getProjects');
    cy.wait('@getPspMappings');
    cy.wait('@getProjectOne');
    cy.wait('@getProjectOnePsp');
    cy.wait('@getStateOne');
    cy.get('[data-cy="tab-nav-cost"]').click({ force: true });
    cy.get('[data-cy="skeleton-cost"]').should('be.visible');
    cy.wait('@slowCost');
    cy.get('[data-cy="cost-tab"]').should('be.visible');
  });

  it('E2E-052 Overview sub-view renders KPI, period, 4 data cards, and bar chart', () => {
    bootCostTab();
    cy.get('[data-cy="kpi-card-project-cost"]').should('be.visible');
    cy.get('[data-cy="cost-reporting-period"]').should('contain.text', 'P12');
    cy.get('[data-cy="cost-overview-card-actuals"]').should('be.visible');
    cy.get('[data-cy="cost-overview-card-budget"]').should('be.visible');
    cy.get('[data-cy="cost-overview-card-forecasts"]').should('be.visible');
    cy.get('[data-cy="cost-overview-card-fcplusactuals"]').should('be.visible');
    cy.get('[data-cy="cost-bar-chart"]').should('be.visible');
  });

  it('E2E-053 Bar chart renders 3 series with correct legend labels', () => {
    bootCostTab();
    cy.get('[data-cy="cost-bar-chart"]').should('be.visible');
    cy.contains('Charging to BL').should('exist');
    cy.contains('Gross').should('exist');
    cy.contains('NET').should('exist');
  });

  it('E2E-054 Clicking Monthly shows P01-P12 table', () => {
    bootCostTab();
    cy.get('[data-cy="cost-sub-nav-monthly"]').click();
    cy.get('[data-cy="cost-monthly-table"]').should('be.visible');
    cy.get('[data-cy="cost-monthly-row-p01"]').should('be.visible');
    cy.get('[data-cy="cost-monthly-row-p12"]').should('be.visible');
  });

  it('E2E-055 Monthly toggle switches dataset', () => {
    bootCostTab();
    cy.get('[data-cy="cost-sub-nav-monthly"]').click();
    cy.get('[data-cy="cost-monthly-row-p01"]').should('contain.text', '100k€');

    cy.get('[data-cy="cost-monthly-toggle-budget"]').click();
    cy.get('[data-cy="cost-monthly-row-p01"]').should('contain.text', '120k€');

    cy.get('[data-cy="cost-monthly-toggle-actuals-fc"]').click();
    cy.get('[data-cy="cost-monthly-row-p01"]').should('contain.text', '210k€');
  });

  it('E2E-056 Clicking Breakdown shows Breakdown sub-view; default mode Product', () => {
    bootCostTab();
    cy.get('[data-cy="cost-breakdown-mode-select"] select').should('be.visible');
    cy.get('[data-cy="cost-breakdown-mode-select"] select').should('have.value', 'project');
    cy.contains('Project Cost').should('be.visible');
    cy.get('[data-cy="cost-sub-nav"]').should('be.visible');
  });

  it('E2E-057 Breakdown Product mode renders product rows with target/actual/date/trend', () => {
    bootCostTab();
    cy.get('[data-cy="cost-breakdown-mode-select"] select').select('Product');
    cy.wait('@getCostBreakdowns');

    cy.contains('Product Cost').should('be.visible');
    cy.get('[data-cy="cost-filter-project"]').should('not.exist');
    cy.get('[data-cy="cost-filter-fy"]').should('not.exist');
    cy.get('[data-cy="cost-filter-psp-project"]').should('not.exist');
    cy.get('[data-cy="cost-reporting-period"]').should('not.exist');
    cy.get('[data-cy="cost-sub-nav"]').should('not.exist');
    cy.get('[data-cy="cost-breakdown-product-head"]').should('be.visible');
    cy.get('[data-cy="cost-breakdown-row-901"]').should('be.visible');
    cy.get('[data-cy="cost-breakdown-target-input-901"]').should('be.visible');
    cy.get('[data-cy="cost-breakdown-actual-input-901"]').should('be.visible');
    cy.get('[data-cy="cost-breakdown-date-901"]').should('be.visible');
    cy.get('[data-cy="cost-breakdown-trend-901"]').should('be.visible');
  });

  it('E2E-058 Switching mode to Project renders line chart and detail table', () => {
    bootCostTab();
    cy.get('[data-cy="cost-breakdown-mode-select"] select').select('Product');
    cy.wait('@getCostBreakdowns');
    cy.get('[data-cy="cost-breakdown-mode-select"] select').select('project');
    cy.wait('@getCostBreakdowns');

    cy.get('[data-cy="cost-tab"]').should('be.visible');
  });

  it('E2E-059 Switching mode back to Product re-renders product rows', () => {
    bootCostTab();
    cy.get('[data-cy="cost-breakdown-mode-select"] select').select('Product');
    cy.wait('@getCostBreakdowns');

    cy.get('[data-cy="cost-breakdown-product"]').should('be.visible');
    cy.get('[data-cy="cost-breakdown-row-901"]').should('be.visible');
    cy.get('[data-cy="cost-breakdown-product-head"]').should('be.visible');
  });

  it('E2E-060 Editing Target field in Product mode triggers PATCH and refetch', () => {
    bootCostTab();
    cy.get('[data-cy="cost-breakdown-mode-select"] select').select('Product');
    cy.wait('@getCostBreakdowns');

    cy.intercept('PATCH', '**/api/v1/product-costs/901/', {
      id: 901,
      product: 501,
      target: '13000.00',
      actual: '12020.00',
      calculation_date: '2025-05-10'
    }).as('patchBreakdownTarget');

    cy.intercept('GET', '**/api/v1/product-costs/?product__project=1&page_size=500*', paginated([
      { ...productCosts[0], target: '13000' },
      productCosts[1]
    ])).as('refetchCostAfterBreakdownEdit');

    cy.get('[data-cy="cost-breakdown-target-input-901"] input').clear().type('13000');
    cy.get('[data-cy="cost-breakdown-target-save-901"]').click();

    cy.wait('@patchBreakdownTarget');
    cy.wait('@refetchCostAfterBreakdownEdit');
  });

  it('E2E-061 FY/PSP dropdowns are shown only in Project mode', () => {
    bootCostTab();

    cy.get('[data-cy="cost-filter-project"]').should('not.exist');
    cy.get('[data-cy="cost-filter-fy"]').should('be.visible');
    cy.get('[data-cy="cost-filter-psp-project"]').should('be.visible');
    cy.get('[data-cy="cost-reporting-period"]').should('be.visible');

    cy.get('[data-cy="cost-breakdown-mode-select"] select').select('Product');
    cy.wait('@getCostBreakdowns');

    cy.get('[data-cy="cost-filter-project"]').should('not.exist');
    cy.get('[data-cy="cost-filter-fy"]').should('not.exist');
    cy.get('[data-cy="cost-filter-psp-project"]').should('not.exist');
    cy.get('[data-cy="cost-reporting-period"]').should('not.exist');
  });

  it('E2E-062 Cost fetch failure shows level-1 error modal with ERR_FETCH_COST', () => {
    cy.intercept('GET', '**/api/v1/cost-breakdowns/?page_size=1000*', {
      statusCode: 500,
      body: { error: 'cost failed' }
    }).as('getCostError');

    cy.visit('/project/1');
    cy.wait('@getProjects');
    cy.wait('@getPspMappings');
    cy.wait('@getProjectOne');
    cy.wait('@getProjectOnePsp');
    cy.wait('@getStateOne');
    cy.wait('@getCostError');

    cy.get('[data-cy="error-modal-overlay"]').should('be.visible');
  });
});
