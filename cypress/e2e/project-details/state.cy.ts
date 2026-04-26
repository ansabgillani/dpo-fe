import { buildCostBreakdowns, buildStatusTrends, paginated, setupSilentAuth } from '../helpers/v1';

describe('Project Details State Tab (Phase 5)', () => {
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

  const bootAsRole = (role: 'viewer' | 'manager') => {
    cy.visit('/project/1', {
      onBeforeLoad: (win) => {
        win.localStorage.setItem('dpo-user-role', role);
      }
    });

    cy.wait('@getProjects');
    cy.wait('@getPspMappings');
    cy.wait('@getProjectOne');
    cy.wait('@getProjectOnePsp');
    cy.wait('@getStateOne');
    cy.get('[data-cy="tab-nav-state"]').click();
    cy.get('[data-cy="state-tab"]').should('be.visible');
  };

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
  });

  it('E2E-034 renders exactly six state cards in a 2-column grid', () => {
    bootAsRole('manager');
    cy.get('[data-cy="state-card-quality"]').should('be.visible');
    cy.get('[data-cy="state-card-budget"]').should('be.visible');
    cy.get('[data-cy="state-card-target-cost"]').should('be.visible');
    cy.get('[data-cy="state-card-resources"]').should('be.visible');
    cy.get('[data-cy="state-card-timeline"]').should('be.visible');
    cy.get('[data-cy="state-card-customer-satisfaction"]').should('be.visible');
    cy.get('[data-cy^="state-card-narrative-section-"]').should('have.length', 6);
    cy.get('[data-cy="state-tab-grid"]').should('be.visible');
  });

  it('E2E-035 viewer role has no edit affordance', () => {
    bootAsRole('viewer');
    cy.get('[data-cy^="state-card-edit-"]').should('not.exist');
  });

  it('E2E-036 manager role can open narrative editor', () => {
    bootAsRole('manager');
    cy.get('[data-cy="state-card-edit-quality"]').click();
    cy.get('[data-cy="state-card-input-quality"]').should('be.visible');
  });

  it('E2E-037 narrative cancel reverts to read-only view', () => {
    bootAsRole('manager');
    cy.get('[data-cy="state-card-edit-quality"]').click();
    cy.get('[data-cy="state-card-cancel-quality"]').click();
    cy.get('[data-cy="state-card-input-quality"]').should('not.exist');
    cy.get('[data-cy="state-card-narrative-quality"]').should('be.visible');
  });

  it('E2E-038 save button visible only for manager/admin role', () => {
    bootAsRole('manager');
    cy.get('[data-cy="state-tab-save"]').should('be.visible');

    cy.visit('/project/1', {
      onBeforeLoad: (win) => {
        win.localStorage.setItem('dpo-user-role', 'viewer');
      }
    });
    cy.wait('@getProjects');
    cy.wait('@getPspMappings');
    cy.wait('@getProjectOne');
    cy.wait('@getProjectOnePsp');
    cy.wait('@getStateOne');
    cy.get('[data-cy="tab-nav-state"]').click();
    cy.get('[data-cy="state-tab-save"]').should('not.exist');
  });

  it('E2E-039 save triggers PUT then refetch', () => {
    bootAsRole('manager');

    cy.intercept('PATCH', '**/api/v1/statuses/*', { success: true }).as('saveState');
    cy.intercept('GET', '**/api/v1/projects/1/status-trends', paginated(
      statusesOne.map((card) =>
        card.name === 'Quality'
          ? {
              ...card,
              current: {
                ...card.current,
                description: 'Updated narrative.'
              }
            }
          : card
      )
    )).as('refetchState');

    cy.get('[data-cy="state-card-edit-quality"]').click();
    cy.get('[data-cy="state-card-input-quality"]').clear().type('Updated narrative.');
    cy.get('[data-cy="state-card-confirm-quality"]').click();
    cy.get('[data-cy="state-tab-save"]').click();

    cy.wait('@saveState');
    cy.wait('@refetchState');
    cy.get('[data-cy="state-card-narrative-quality"]').should('contain.text', 'Updated narrative.');
  });

  it('E2E-040 save failure shows level-1 error modal', () => {
    bootAsRole('manager');

    cy.intercept('PATCH', '**/api/v1/statuses/*', { statusCode: 500, body: { error: 'save failed' } }).as('saveStateFail');

    cy.get('[data-cy="state-tab-save"]').click();
    cy.wait('@saveStateFail');
    cy.get('[data-cy="error-modal-overlay"]').should('be.visible');
  });

  it('E2E-041 cards have tier-colored left border class', () => {
    bootAsRole('manager');
    cy.get('[data-cy="state-card-quality"]').should('have.class', 'tier-green');
    cy.get('[data-cy="state-card-timeline"]').should('have.class', 'tier-red');
  });

  it('E2E-042 shows skeleton while state cards are loading', () => {
    cy.intercept('GET', '**/api/v1/projects/2/status-trends', {
      delay: 1200,
      body: paginated(statusesTwo)
    }).as('slowStateTwo');

    bootAsRole('manager');
    cy.get('[data-cy="project-selector-select"]').select('2');
    cy.wait('@getProjectTwo');
    cy.get('[data-cy="skeleton-state-grid"]').should('be.visible');
    cy.wait('@slowStateTwo');
  });
});
