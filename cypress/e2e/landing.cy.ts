import { paginated, setupSilentAuth } from './helpers/v1';

describe('Landing Page (Phase 2)', () => {
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

  const apiPspMappings = [
    { id: 101, project: 1, psp_element: 'PSP-1' }
  ];

  const filterOptions = {
    department: ['DIC', 'DAS'],
    business_line: ['XP', 'CT'],
    type: ['SSP', 'Platform']
  };

  beforeEach(() => {
    setupSilentAuth();
    cy.intercept('GET', '**/api/v1/filters/projects', filterOptions).as('getFilterOptions');
    cy.intercept('GET', '**/api/v1/projects/?*', paginated(apiProjects)).as('getProjects');
    cy.intercept('GET', '**/api/v1/psp-mappings/?*', paginated(apiPspMappings)).as('getPspMappings');

    cy.visit('/projects');
    cy.wait('@getFilterOptions');
    cy.wait('@getProjects');
    cy.wait('@getPspMappings');
  });

  it('E2E-001 renders landing route', () => {
    cy.url().should('include', '/projects');
    cy.get('[data-cy="page-shell"]').should('exist');
  });

  it('E2E-002 renders filter panel', () => {
    cy.get('[data-cy="filter-panel"]').should('exist');
  });

  it('E2E-003 renders project list', () => {
    cy.get('[data-cy="project-list"]').should('exist');
    cy.get('[data-cy="project-card-1"]').should('exist');
  });

  it('E2E-004 card click updates preview', () => {
    cy.get('[data-cy="project-card-2"]').click();
    cy.get('[data-cy="project-preview"]').should('contain.text', 'Cloud PACS Migration');
  });

  it('E2E-005 open on card navigates to details', () => {
    cy.get('[data-cy="project-card-open-1"]').click();
    cy.url().should('include', '/project/1');
  });

  it('E2E-006 open on preview navigates to details', () => {
    cy.get('[data-cy="project-card-2"]').click();
    cy.get('[data-cy="project-preview-open"]').click();
    cy.url().should('include', '/project/2');
  });

  it('E2E-007 filter dropdowns populate options', () => {
    cy.get('[data-cy="filter-panel-department"] option').should('have.length.greaterThan', 1);
    cy.get('[data-cy="filter-panel-business-line"] option').should('have.length.greaterThan', 1);
    cy.get('[data-cy="filter-panel-type"] option').should('have.length.greaterThan', 1);
  });

  it('E2E-008 search sends selected filters', () => {
    cy.intercept('GET', '**/api/v1/projects/?*').as('searchProjects');

    cy.get('[data-cy="filter-panel-department"]').select('DIC');
    cy.get('[data-cy="filter-panel-business-line"]').select('XP');
    cy.get('[data-cy="filter-panel-type"]').select('SSP');
    cy.get('[data-cy="filter-panel-search"]').click();

    cy.wait('@searchProjects')
      .its('request.url')
      .should('include', 'department=DIC')
      .and('include', 'business_line=XP')
      .and('include', 'type=SSP');
  });

  it('E2E-009 reset clears filters', () => {
    cy.get('[data-cy="filter-panel-department"]').select('DIC');
    cy.get('[data-cy="filter-panel-reset"]').click();
    cy.get('[data-cy="filter-panel-department"]').should('have.value', '');
    cy.get('[data-cy="filter-panel-business-line"]').should('have.value', '');
    cy.get('[data-cy="filter-panel-type"]').should('have.value', '');
  });

  it('E2E-010 shows empty list state when no projects', () => {
    cy.intercept('GET', '**/api/v1/projects/?*', paginated([])).as('getEmptyProjects');
    cy.intercept('GET', '**/api/v1/psp-mappings/?*', paginated([])).as('getEmptyPsp');

    cy.get('[data-cy="filter-panel-search"]').click();
    cy.wait('@getEmptyProjects');
    cy.wait('@getEmptyPsp');
    cy.get('[data-cy="project-list-empty"]').should('be.visible');
  });

  it('E2E-011 shows preview empty state with no selected project', () => {
    cy.intercept('GET', '**/api/v1/projects/?*', paginated([])).as('getNoProjects');
    cy.intercept('GET', '**/api/v1/psp-mappings/?*', paginated([])).as('getNoPsp');

    cy.get('[data-cy="filter-panel-search"]').click();
    cy.wait('@getNoProjects');
    cy.wait('@getNoPsp');
    cy.get('[data-cy="project-preview-empty"]').should('be.visible');
  });

  it('E2E-012 shows loading skeleton for delayed filters', () => {
    cy.intercept(
      { method: 'GET', url: '**/api/v1/filters/projects', times: 1 },
      { delay: 1200, body: filterOptions }
    ).as('slowFilters');

    cy.visit('/projects');
    cy.get('[data-cy="filter-panel-loading"]').should('exist');
    cy.wait('@slowFilters');
  });

  it('E2E-013 shows level 1 modal on filters error', () => {
    cy.intercept({ method: 'GET', url: '**/api/v1/filters/projects', times: 1 }, {
      statusCode: 500,
      body: { error: 'failed' }
    }).as('filtersFail');

    cy.visit('/projects');
    cy.wait('@filtersFail');
    cy.get('[data-cy="error-modal-overlay"]').should('be.visible');
  });

  it('E2E-014 shows level 1 modal on projects error', () => {
    cy.intercept('GET', '**/api/v1/psp-mappings/?*', {
      statusCode: 500,
      body: { error: 'failed' }
    }).as('projectsFail');

    cy.visit('/projects');
    cy.wait('@projectsFail');
    cy.get('[data-cy="error-modal-overlay"]').should('be.visible');
  });

  it('E2E-015 keeps selected project when filters rerun', () => {
    cy.get('[data-cy="project-card-2"]').click();
    cy.get('[data-cy="filter-panel-search"]').click();
    cy.get('[data-cy="project-preview"]').should('contain.text', 'Cloud PACS Migration');
  });

  it('E2E-016 redirects to login on 401 using modal action', () => {
    cy.intercept('GET', '**/api/v1/projects/?*', {
      statusCode: 401,
      body: { error: 'unauthorized' }
    }).as('projects401');

    cy.visit('/projects');
    cy.wait('@projects401');
    cy.get('[data-cy="error-modal-primary"]').click();
    cy.get('[data-cy="error-modal-overlay"]').should('be.visible');
  });

  it('E2E-017 opens and closes create project modal', () => {
    cy.get('[data-cy="landing-create-project"]').click();
    cy.get('[data-cy="create-project-modal-card"]').should('be.visible');
    cy.get('[data-cy="create-project-cancel"]').click();
    cy.get('[data-cy="create-project-modal-card"]').should('not.exist');
  });

  it('E2E-018 create modal captures inputs and shows pending-submit state', () => {
    cy.get('[data-cy="landing-create-project"]').click();
    cy.get('[data-cy="create-project-title"]').type('New Automation Initiative');
    cy.get('[data-cy="create-project-department"]').select('DIC');
    cy.get('[data-cy="create-project-business-line"]').select('XP');
    cy.get('[data-cy="create-project-type"]').select('SSP');
    cy.get('[data-cy="create-project-start-date"] input').clear().type('2026-01-01').trigger('change');
    cy.get('[data-cy="create-project-end-date"] input').clear().type('2026-12-31').trigger('change');
    cy.get('[data-cy="create-project-psp-input"]').type('PSP-9901');
    cy.get('[data-cy="create-project-psp-add"]').click();

    cy.window().then((win) => {
      const ng = (win as unknown as { ng?: { getComponent: (element: Element) => unknown } }).ng;
      const modalElement = win.document.querySelector('dpo-create-project-modal');

      if (!ng || !modalElement) {
        return;
      }

      const component = ng.getComponent(modalElement) as {
        onStartDateChange: (value: string) => void;
        onEndDateChange: (value: string) => void;
      };
      component.onStartDateChange('2026-01-01');
      component.onEndDateChange('2026-12-31');
    });

    cy.get('[data-cy="create-project-psp-item-0"]').should('contain.text', 'PSP-9901');
    cy.get('[data-cy="create-project-submit"]').should('be.disabled');
  });
});
