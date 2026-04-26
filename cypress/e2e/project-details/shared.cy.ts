import { buildCostBreakdowns, buildStatusTrends, paginated, setupSilentAuth } from '../helpers/v1';

describe('Project Details Shared (Phase 3 + Phase 4)', () => {
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

  const allMappings = [
    { id: 101, project: 1, psp_element: 'PSP-1' },
    { id: 201, project: 2, psp_element: 'PSP-11' }
  ];

  const statusesOne = buildStatusTrends(1);
  const statusesTwo = buildStatusTrends(2);

  const costProjects = [
    { id: 1001, fiscal_year: 'FY25', psp_element: 'PSP-1', project_title: 'Imaging Platform Modernization', stand_reporting_period: '2025-01' },
    { id: 2001, fiscal_year: 'FY25', psp_element: 'PSP-11', project_title: 'Cloud PACS Migration', stand_reporting_period: '2025-01' }
  ];

  const costBreakdowns = [...buildCostBreakdowns(1001, 100), ...buildCostBreakdowns(2001, 150)];

  const setupSuccessRoutes = () => {
    setupSilentAuth();

    cy.intercept('GET', '**/api/v1/projects/?*', paginated(apiProjects)).as('getProjects');
    cy.intercept('GET', '**/api/v1/projects/1/', apiProjects[0]).as('getProjectOne');
    cy.intercept('GET', '**/api/v1/projects/2/', apiProjects[1]).as('getProjectTwo');

    cy.intercept('GET', '**/api/v1/psp-mappings/?page_size=500*', paginated(allMappings)).as('getPspMappings');
    cy.intercept('GET', '**/api/v1/psp-mappings/?project=1&page_size=500*', paginated([allMappings[0]])).as('getProjectOnePsp');
    cy.intercept('GET', '**/api/v1/psp-mappings/?project=2&page_size=500*', paginated([allMappings[1]])).as('getProjectTwoPsp');

    cy.intercept('GET', '**/api/v1/projects/1/status-trends', paginated(statusesOne)).as('getStateOne');
    cy.intercept('GET', '**/api/v1/projects/2/status-trends', paginated(statusesTwo)).as('getStateTwo');

    cy.intercept('GET', '**/api/v1/cost-projects/?page_size=500*', paginated(costProjects)).as('getCostProjects');
    cy.intercept('GET', '**/api/v1/cost-breakdowns/?page_size=1000*', paginated(costBreakdowns)).as('getCostBreakdowns');
    cy.intercept('GET', '**/api/v1/products/?project=1&page_size=500*', paginated([])).as('getProductsOne');
    cy.intercept('GET', '**/api/v1/products/?project=2&page_size=500*', paginated([])).as('getProductsTwo');
    cy.intercept('GET', '**/api/v1/product-costs/?product__project=1&page_size=500*', paginated([])).as('getProductCostsOne');
    cy.intercept('GET', '**/api/v1/product-costs/?product__project=2&page_size=500*', paginated([])).as('getProductCostsTwo');
  };

  beforeEach(() => {
    setupSuccessRoutes();
    cy.visit('/project/1');
    cy.wait('@getProjects');
    cy.wait('@getPspMappings');
    cy.wait('@getProjectOne');
    cy.wait('@getProjectOnePsp');
    cy.wait('@getStateOne');
  });

  it('E2E-017 renders project details shell', () => {
    cy.get('[data-cy="project-details-left-panel"]').should('be.visible');
    cy.get('[data-cy="project-details-content-panel"]').should('be.visible');
    cy.get('[data-cy="project-details-right-panel"]').should('be.visible');
  });

  it('E2E-018 keeps selected tab when switching project', () => {
    cy.get('[data-cy="tab-nav-state"]').click();
    cy.get('[data-cy="project-selector-select"]').select('2');
    cy.wait('@getProjectTwo');
    cy.wait('@getProjectTwoPsp');

    cy.get('[data-cy="tab-nav-state"]').closest('.tab-row').should('have.class', 'active');
  });

  it('E2E-019 shows skeleton while details loading', () => {
    cy.intercept('GET', '**/api/v1/projects/2/status-trends', {
      delay: 1000,
      body: paginated(statusesTwo)
    }).as('slowStateTwo');

    cy.get('[data-cy="project-selector-select"]').select('2');
    cy.wait('@getProjectTwo');
    cy.get('[data-cy="skeleton-kpi-grid"]').should('be.visible');
    cy.wait('@slowStateTwo');
  });

  it('E2E-020 shows modal on details failure', () => {
    cy.intercept('GET', '**/api/v1/projects/1/', { statusCode: 500, body: { error: 'failed' } }).as('projectFail');

    cy.visit('/project/1');
    cy.wait('@projectFail');
    cy.get('[data-cy="error-modal-overlay"]').should('be.visible');
  });

  it('E2E-021 project selector updates URL', () => {
    cy.get('[data-cy="project-selector-select"]').select('2');
    cy.url().should('include', '/project/2');
  });

  it('E2E-022 renders sidebar metadata and psp section', () => {
    cy.get('[data-cy="project-sidebar"]').should('contain.text', 'Imaging Platform Modernization');
    cy.get('[data-cy="project-sidebar-psp-list"]').should('exist');
  });

  it('E2E-023 metadata field opens inline editor', () => {
    cy.get('[data-cy="inline-edit-start-department"]').click();
    cy.get('[data-cy="inline-edit-input-department"]').should('be.visible');
  });

  it('E2E-024 metadata save does confirm-then-refetch', () => {
    cy.intercept('PATCH', '**/api/v1/projects/1/', { success: true }).as('updateMetadata');
    cy.intercept('GET', '**/api/v1/projects/1/', {
      ...apiProjects[0],
      department: 'LMS'
    }).as('refetchProject');
    cy.intercept('GET', '**/api/v1/psp-mappings/?project=1&page_size=500*', paginated([allMappings[0]])).as(
      'refetchProjectPsp'
    );

    cy.get('[data-cy="inline-edit-start-department"]').click();
    cy.get('[data-cy="inline-edit-input-department"]').clear().type('LMS');
    cy.get('[data-cy="inline-edit-confirm-department"]').click();

    cy.wait('@updateMetadata');
    cy.wait('@refetchProject');
    cy.wait('@refetchProjectPsp');
    cy.get('[data-cy="inline-edit-value-department"]').should('contain.text', 'LMS');
  });

  it('E2E-025 metadata save failure reverts and shows modal', () => {
    cy.intercept('PATCH', '**/api/v1/projects/1/', { statusCode: 500, body: { error: 'fail' } }).as('updateFail');

    cy.get('[data-cy="inline-edit-start-department"]').click();
    cy.get('[data-cy="inline-edit-input-department"]').clear().type('BAD');
    cy.get('[data-cy="inline-edit-confirm-department"]').click();

    cy.wait('@updateFail');
    cy.get('[data-cy="error-modal-overlay"]').should('be.visible');
    cy.get('[data-cy="inline-edit-error-department"]').should('be.visible');
  });

  it('E2E-026 PSP add row works', () => {
    const newMapping = { id: 777, project: 1, psp_element: 'PSP-777' };

    cy.intercept('POST', '**/api/v1/psp-mappings/', newMapping).as('addPsp');
    cy.intercept('GET', '**/api/v1/projects/1/', apiProjects[0]).as('refetchProject');
    cy.intercept('GET', '**/api/v1/psp-mappings/?project=1&page_size=500*', paginated([allMappings[0], newMapping])).as(
      'refetchWithPsp'
    );

    cy.get('[data-cy="project-sidebar-psp-add"]').click();
    cy.get('[data-cy="project-sidebar-psp-new-input"]').type('PSP-777');
    cy.get('[data-cy="project-sidebar-psp-new-confirm"]').click();

    cy.wait('@addPsp');
    cy.wait('@refetchProject');
    cy.wait('@refetchWithPsp');
    cy.get('[data-cy="project-sidebar-psp-list"]').should('contain.text', 'PSP-777');
  });

  it('E2E-027 PSP delete requires confirmation and supports cancel', () => {
    cy.get('[data-cy="project-sidebar-psp-delete-101"]').click();
    cy.get('[data-cy="confirm-dialog-overlay"]').should('be.visible');
    cy.get('[data-cy="confirm-dialog-cancel"]').click();
    cy.get('[data-cy="confirm-dialog-overlay"]').should('not.exist');
  });

  it('E2E-028 only one field editable at a time', () => {
    cy.get('[data-cy="inline-edit-start-department"]').click();
    cy.get('[data-cy="inline-edit-input-department"]').should('be.visible');

    cy.get('[data-cy="inline-edit-start-status"]').click();
    cy.get('[data-cy="inline-edit-input-status"]').should('be.visible');
    cy.get('[data-cy="inline-edit-input-department"]').should('not.exist');
  });
});
