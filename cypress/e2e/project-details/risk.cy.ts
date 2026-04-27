import { buildCostBreakdowns, buildStatusTrends, paginated, setupSilentAuth } from '../helpers/v1';

describe('Project Details Risk Tab (Phase 8)', () => {
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
    { id: 1001, fiscal_year: 'FY25', psp_element: 'PSP-1', project_title: 'Imaging Platform Modernization', stand_reporting_period: '2025-01' }
  ];

  const costBreakdowns = buildCostBreakdowns(1001, 100);

  const apiRisks = [
    {
      id: 11,
      project: 1,
      title: 'Resource bottleneck',
      type: 'Ressources',
      loss_valuation: '120000',
      due_date: '2025-06-01',
      probability: 'high',
      severity: 'critical',
      state: 'open',
      description: 'Staffing constraints may delay delivery.',
      action: 'Backfill contract roles.',
      action_state: 'in-progress',
      loss_after_action: '80000',
      probability_after_action: 'medium',
      severity_after_action: 'high'
    },
    {
      id: 12,
      project: 1,
      title: 'Vendor delay',
      type: 'SCM',
      loss_valuation: '90000',
      due_date: '2025-07-15',
      probability: 'medium',
      severity: 'high',
      state: 'open',
      description: 'Supplier delivery may slip.',
      action: 'Confirm alternate vendors.',
      action_state: 'mitigated',
      loss_after_action: '60000',
      probability_after_action: 'low',
      severity_after_action: 'medium'
    }
  ];

  const bootRiskTab = (riskAlias = '@getRisks') => {
    cy.visit('/project/1');
    cy.wait('@getProjects');
    cy.wait('@getPspMappings');
    cy.wait('@getProjectOne');
    cy.wait('@getProjectOnePsp');
    cy.wait('@getStateOne');
    cy.get('[data-cy="tab-nav-risk"]').click();
    cy.wait(riskAlias);
    cy.get('[data-cy="risk-tab"]').should('be.visible');
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
    cy.intercept('GET', '**/api/v1/products/?project=1&page_size=500*', paginated([])).as('getProductsOne');
    cy.intercept('GET', '**/api/v1/product-costs/?product__project=1&page_size=500*', paginated([])).as('getProductCostsOne');

    cy.intercept('GET', '**/api/v1/risks/?project=1&page_size=300*', paginated(apiRisks)).as('getRisks');
  });

  it('E2E-063 Risk tab loads with heatmap and risk cards', () => {
    bootRiskTab();
    cy.get('[data-cy="risk-heatmap"]').should('be.visible');
    cy.get('[data-cy="risk-card-11"]').should('be.visible');
  });

  it('E2E-064 Risk Type dropdown filters card list', () => {
    cy.intercept('GET', '**/api/v1/risks/?project=1&page_size=300&type=SCM*', paginated([apiRisks[1]])).as(
      'getScmRisks'
    );

    bootRiskTab();
    cy.get('[data-cy="risk-filter-type"]').select('SCM');
    cy.wait('@getScmRisks');
    cy.get('[data-cy="risk-card-12"]').should('be.visible');
  });

  it('E2E-065 Add button posts new risk and refetches list', () => {
    cy.intercept('POST', '**/api/v1/risks/', { id: 99 }).as('addRisk');
    cy.intercept('GET', '**/api/v1/risks/?project=1&page_size=300*', paginated([
      ...apiRisks,
      { ...apiRisks[0], id: 99, title: 'New Risk' }
    ])).as('refetchRisks');

    bootRiskTab('@refetchRisks');
    cy.get('[data-cy="risk-add-button"]').click();

    cy.wait('@addRisk');
    cy.wait('@refetchRisks');
  });

  it('E2E-066 Editing PFL triggers PUT and refetch', () => {
    cy.intercept('PATCH', '**/api/v1/risks/11/', { id: 11 }).as('putRiskPfl');
    cy.intercept('GET', '**/api/v1/risks/?project=1&page_size=300*', paginated([
      { ...apiRisks[0], loss_valuation: '130000' },
      apiRisks[1]
    ])).as('refetchRiskPfl');

    bootRiskTab('@refetchRiskPfl');
    cy.get('[data-cy="risk-pfl-edit-11"]').click();
    cy.get('[data-cy="risk-pfl-input-11"]').clear().type('130000');
    cy.get('[data-cy="risk-pfl-save-11"]').click();

    cy.wait('@putRiskPfl');
    cy.wait('@refetchRiskPfl');
  });

  it('E2E-067 Editing risk description triggers PUT and refetch', () => {
    cy.intercept('PATCH', '**/api/v1/risks/11/', { id: 11 }).as('putRiskDescription');
    cy.intercept('GET', '**/api/v1/risks/?project=1&page_size=300*', paginated([
      { ...apiRisks[0], description: 'Updated description.' },
      apiRisks[1]
    ])).as('refetchRiskDescription');

    bootRiskTab('@refetchRiskDescription');
    cy.get('[data-cy="risk-description-edit-11"]').click();
    cy.get('[data-cy="risk-description-input-11"]').clear().type('Updated description.');
    cy.get('[data-cy="risk-description-save-11"]').click();

    cy.wait('@putRiskDescription');
    cy.wait('@refetchRiskDescription');
  });

  it('E2E-068 Editing Action Due Date triggers PUT and refetch', () => {
    cy.intercept('PATCH', '**/api/v1/risks/11/', { id: 11 }).as('putRiskDueDate');
    cy.intercept('GET', '**/api/v1/risks/?project=1&page_size=300*', paginated([
      { ...apiRisks[0], due_date: '2025-06-15' },
      apiRisks[1]
    ])).as('refetchRiskDueDate');

    bootRiskTab('@refetchRiskDueDate');
    cy.get('[data-cy="risk-action-due-edit-11"]').click();
    cy.get('[data-cy="risk-action-due-11"] input')
      .invoke('val', '2025-06-15')
      .trigger('change');
    cy.get('[data-cy="risk-action-due-save-11"]').click();

    cy.wait('@putRiskDueDate');
    cy.wait('@refetchRiskDueDate');
  });

  it('E2E-069 Editing Probability After Action triggers PUT and refetch', () => {
    cy.intercept('PATCH', '**/api/v1/risks/11/', { id: 11 }).as('putRiskProbabilityAfter');
    cy.intercept('GET', '**/api/v1/risks/?project=1&page_size=300*', paginated([
      { ...apiRisks[0], probability_after_action: 'low' },
      apiRisks[1]
    ])).as('refetchRiskProbabilityAfter');

    bootRiskTab('@refetchRiskProbabilityAfter');
    cy.get('[data-cy="risk-probability-after-edit-11"]').click();
    cy.get('[data-cy="risk-probability-after-select-11"]').select('Low');
    cy.get('[data-cy="risk-probability-after-save-11"]').click();

    cy.wait('@putRiskProbabilityAfter');
    cy.wait('@refetchRiskProbabilityAfter');
  });

  it('E2E-070 shows skeleton while risks load', () => {
    cy.intercept('GET', '**/api/v1/risks/?project=1&page_size=300*', {
      delay: 2000,
      body: paginated(apiRisks)
    }).as('slowRisks');

    cy.visit('/project/1');
    cy.wait('@getProjects');
    cy.wait('@getPspMappings');
    cy.wait('@getProjectOne');
    cy.wait('@getProjectOnePsp');
    cy.wait('@getStateOne');
    cy.get('[data-cy="tab-nav-risk"]').click();

    cy.get('[data-cy="skeleton-risk"]', { timeout: 2000 }).should('be.visible');
    cy.wait('@slowRisks');
  });

  it('E2E-071 risk fetch failure shows level-1 error modal', () => {
    cy.intercept('GET', '**/api/v1/risks/?project=1&page_size=300*', {
      statusCode: 500,
      body: { error: 'risk failed' }
    }).as('riskError');

    cy.visit('/project/1');
    cy.wait('@getProjects');
    cy.wait('@getPspMappings');
    cy.wait('@getProjectOne');
    cy.wait('@getProjectOnePsp');
    cy.wait('@getStateOne');
    cy.get('[data-cy="tab-nav-risk"]').click();
    cy.wait('@riskError');

    cy.get('[data-cy="error-modal-overlay"]').should('be.visible');
  });

  it('E2E-072 shows empty state when no risks', () => {
    cy.intercept('GET', '**/api/v1/risks/?project=1&page_size=300*', paginated([])).as('riskEmpty');

    bootRiskTab('@riskEmpty');
    cy.get('[data-cy="risk-empty-state"]').should('contain.text', 'No risks found');
  });

  it('E2E-073 risk tab route remains on project details with risk active', () => {
    bootRiskTab();
    cy.url().should('include', '/project/1');
    cy.get('[data-cy="tab-nav-risk"]').closest('.tab-row').should('have.class', 'active');
  });
});
