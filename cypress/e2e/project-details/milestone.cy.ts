import { buildCostBreakdowns, buildStatusTrends, paginated, setupSilentAuth } from '../helpers/v1';

describe('Project Details Milestone Tab (Phase 6)', () => {
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

  const statuses = buildStatusTrends(1);

  const mappings = [{ id: 101, project: 1, psp_element: 'PSP-1' }];

  const milestones = [
    { id: 1, mid: 'M001', project: 1, name: 'Architecture Complete', milestone_set: 'MS-2025-A', start_date: '2025-02-01', end_date: '2025-02-18' },
    { id: 2, mid: 'M002', project: 1, name: 'Pilot Release', milestone_set: 'MS-2025-A', start_date: '2025-04-01', end_date: '2025-04-26' },
    { id: 3, mid: 'M003', project: 1, name: 'Production Rollout', milestone_set: 'MS-2025-B', start_date: '2025-08-15', end_date: '2025-09-20' }
  ];

  const costProjects = [
    { id: 1001, fiscal_year: 'FY25', psp_element: 'PSP-1', project_title: 'Imaging Platform Modernization', stand_reporting_period: '2025-01' }
  ];

  const costBreakdowns = buildCostBreakdowns(1001, 100);

  const bootMilestoneTab = (milestonesAlias = '@getMilestones') => {
    cy.visit('/project/1');
    cy.wait('@getProjects');
    cy.wait('@getPspMappings');
    cy.wait('@getProjectOne');
    cy.wait('@getProjectOnePsp');
    cy.wait('@getStateOne');
    cy.get('[data-cy="tab-nav-milestone"]').click();
    cy.wait('@getMilestoneSets');
    cy.wait(milestonesAlias);
  };

  beforeEach(() => {
    setupSilentAuth();

    cy.intercept('GET', '**/api/v1/projects/?*', paginated([apiProject])).as('getProjects');
    cy.intercept('GET', '**/api/v1/projects/1/', apiProject).as('getProjectOne');

    cy.intercept('GET', '**/api/v1/psp-mappings/?page_size=500*', paginated(mappings)).as('getPspMappings');
    cy.intercept('GET', '**/api/v1/psp-mappings/?project=1&page_size=500*', paginated(mappings)).as('getProjectOnePsp');

    cy.intercept('GET', '**/api/v1/projects/1/status-trends', paginated(statuses)).as('getStateOne');

    cy.intercept('GET', '**/api/v1/cost-projects/?page_size=2000*', paginated(costProjects)).as('getCostProjects');
    cy.intercept('GET', '**/api/v1/cost-breakdowns/?page_size=1000*', paginated(costBreakdowns)).as('getCostBreakdowns');
    cy.intercept('GET', '**/api/v1/products/?project=1&page_size=500*', paginated([])).as('getProductsOne');
    cy.intercept('GET', '**/api/v1/product-costs/?product__project=1&page_size=500*', paginated([])).as('getProductCostsOne');

    cy.intercept('GET', '**/api/v1/milestones/?page_size=250*', paginated(milestones)).as('getMilestoneSets');
    cy.intercept('GET', '**/api/v1/milestones/?project=1&page_size=250*', paginated(milestones)).as('getMilestones');
  });

  it('E2E-043 renders milestone rows with date pickers and trend', () => {
    bootMilestoneTab();
    cy.get('[data-cy="milestone-row-1"]').should('be.visible');
    cy.get('[data-cy="milestone-start-date-1"]').should('be.visible');
    cy.get('[data-cy="milestone-end-date-1"]').should('be.visible');
    cy.get('[data-cy="milestone-trend-1"]').should('be.visible');
  });

  it('E2E-044 MP MS dropdown filters list', () => {
    bootMilestoneTab();
    cy.get('[data-cy="milestone-set-select"]').select('MS-2025-B');
    cy.wait('@getMilestones');
    cy.get('[data-cy="milestone-row-3"]').should('be.visible');
  });

  it('E2E-045 updating start date triggers PUT and refetch', () => {
    bootMilestoneTab();

    cy.intercept('PATCH', '**/api/v1/milestones/1/', {
      ...milestones[0],
      start_date: '2025-02-03'
    }).as('putStartDate');
    cy.intercept('GET', '**/api/v1/milestones/?project=1&page_size=250*', paginated([
      { ...milestones[0], start_date: '2025-02-03' },
      milestones[1],
      milestones[2]
    ])).as('refetchMilestones');

    cy.get('[data-cy="milestone-start-date-1"] input')
      .invoke('val', '2025-02-03')
      .trigger('change');

    cy.wait('@putStartDate');
    cy.wait('@refetchMilestones');
  });

  it('E2E-046 updating end date triggers PUT and refetch', () => {
    bootMilestoneTab();

    cy.intercept('PATCH', '**/api/v1/milestones/1/', {
      ...milestones[0],
      end_date: '2025-02-20'
    }).as('putEndDate');
    cy.intercept('GET', '**/api/v1/milestones/?project=1&page_size=250*', paginated([
      { ...milestones[0], end_date: '2025-02-20' },
      milestones[1],
      milestones[2]
    ])).as('refetchMilestonesEnd');

    cy.get('[data-cy="milestone-end-date-1"] input')
      .invoke('val', '2025-02-20')
      .trigger('change');

    cy.wait('@putEndDate');
    cy.wait('@refetchMilestonesEnd');
  });

  it('E2E-047 shows empty state when no milestones', () => {
    cy.intercept('GET', '**/api/v1/milestones/?project=1&page_size=250*', paginated([])).as('getMilestonesEmpty');

    bootMilestoneTab('@getMilestonesEmpty');
    cy.get('[data-cy="milestone-empty-state"]').should('contain.text', 'No milestones found');
  });

  it('E2E-048 shows skeleton while milestones load', () => {
    cy.intercept('GET', '**/api/v1/milestones/?project=1&page_size=250*', {
      delay: 4000,
      body: paginated(milestones)
    }).as('slowMilestones');

    cy.visit('/project/1');
    cy.wait('@getProjects');
    cy.wait('@getPspMappings');
    cy.wait('@getProjectOne');
    cy.wait('@getProjectOnePsp');
    cy.wait('@getStateOne');
    cy.get('[data-cy="tab-nav-milestone"]').click();
    cy.wait('@getMilestoneSets');
    cy.get('[data-cy="skeleton-milestone-list"]', { timeout: 2000 }).should('be.visible');
    cy.wait('@slowMilestones');
  });

  it('E2E-049 milestone tab route remains on project details with milestone active', () => {
    bootMilestoneTab();
    cy.url().should('include', '/project/1');
    cy.get('[data-cy="tab-nav-milestone"]').closest('.tab-row').should('have.class', 'active');
  });
});
