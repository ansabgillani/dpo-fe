import { buildCostBreakdowns, buildStatusTrends, paginated, setupSilentAuth } from '../helpers/v1';

describe('Project Details Files Tab (Phase 9)', () => {
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

  const files = [
    {
      id: 1,
      name: 'Kickoff Deck.pdf',
      sizeBytes: 1024,
      contentType: 'application/pdf',
      uploadedAt: '2026-04-26T08:00:00Z',
      downloadUrl: '/api/v1/projects/1/files/1/download'
    },
    {
      id: 2,
      name: 'Scope Doc.docx',
      sizeBytes: 2048,
      contentType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      uploadedAt: '2026-04-26T08:05:00Z',
      downloadUrl: '/api/v1/projects/1/files/2/download'
    }
  ];

  const bootFilesTab = (filesAlias = '@getFiles') => {
    cy.visit('/project/1');
    cy.wait('@getProjects');
    cy.wait('@getPspMappings');
    cy.wait('@getProjectOne');
    cy.wait('@getProjectOnePsp');
    cy.wait('@getStateOne');
    cy.get('[data-cy="tab-nav-files"]').click({ force: true });
    cy.wait(filesAlias);
    cy.get('[data-cy="files-tab"]').should('be.visible');
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

    cy.intercept('GET', '**/api/v1/projects/1/files', files).as('getFiles');
  });

  it('E2E-074 Files tab loads with file rows', () => {
    bootFilesTab();
    cy.get('[data-cy="files-list"]').should('be.visible');
    cy.get('[data-cy="file-row-1"]').should('be.visible');
  });

  it('E2E-075 shows skeleton while files load', () => {
    cy.intercept('GET', '**/api/v1/projects/1/files', {
      delay: 2000,
      body: files
    }).as('slowFiles');

    cy.visit('/project/1');
    cy.wait('@getProjects');
    cy.wait('@getPspMappings');
    cy.wait('@getProjectOne');
    cy.wait('@getProjectOnePsp');
    cy.wait('@getStateOne');
    cy.get('[data-cy="tab-nav-files"]').click({ force: true });

    cy.get('[data-cy="skeleton-file-list"]', { timeout: 2000 }).should('be.visible');
    cy.wait('@slowFiles');
  });

  it('E2E-076 shows empty state when no files', () => {
    cy.intercept('GET', '**/api/v1/projects/1/files', []).as('emptyFiles');

    bootFilesTab('@emptyFiles');
    cy.get('[data-cy="files-empty-state"]').should('contain.text', 'No files attached');
  });

  it('E2E-077 add button opens upload input', () => {
    bootFilesTab();

    cy.get('[data-cy="files-add-button"]').click();
    cy.get('[data-cy="files-upload-input"]').should('exist');
  });

  it('E2E-078 upload triggers POST and refetch', () => {
    cy.intercept('POST', '**/api/v1/projects/1/files', {
      id: 10,
      name: 'upload.txt',
      sizeBytes: 4,
      contentType: 'text/plain',
      uploadedAt: '2026-04-26T08:10:00Z',
      downloadUrl: '/api/v1/projects/1/files/10/download'
    }).as('uploadFile');
    cy.intercept('GET', '**/api/v1/projects/1/files', [
      ...files,
      {
        id: 10,
        name: 'upload.txt',
        sizeBytes: 4,
        contentType: 'text/plain',
        uploadedAt: '2026-04-26T08:10:00Z',
        downloadUrl: '/api/v1/projects/1/files/10/download'
      }
    ]).as(
      'refetchFiles'
    );

    bootFilesTab('@refetchFiles');

    cy.get('[data-cy="files-upload-input"]').selectFile(
      { contents: Cypress.Buffer.from('data'), fileName: 'upload.txt' },
      { force: true }
    );
    cy.wait('@uploadFile');
    cy.wait('@refetchFiles');
  });

  it('E2E-079 download triggers request to download endpoint', () => {
    bootFilesTab();

    cy.window().then((win) => {
      cy.stub(win, 'open').as('windowOpen');
    });

    cy.get('[data-cy="file-row-download-1"]').click();
    cy.get('@windowOpen').should('have.been.calledOnce');
  });

  it('E2E-080 delete cancel keeps file', () => {
    bootFilesTab();

    cy.get('[data-cy="file-row-delete-1"]').click();
    cy.get('[data-cy="confirm-dialog-overlay"]').should('be.visible');
    cy.get('[data-cy="confirm-dialog-cancel"]').click();
    cy.get('[data-cy="file-row-1"]').should('be.visible');
  });

  it('E2E-081 delete confirm triggers DELETE and refetch', () => {
    cy.intercept('DELETE', '**/api/v1/projects/1/files/1', { success: true }).as('deleteFile');
    cy.intercept('GET', '**/api/v1/projects/1/files', files).as('initialFiles');

    bootFilesTab('@initialFiles');

    cy.intercept('GET', '**/api/v1/projects/1/files', [files[1]]).as('refetchFilesAfterDelete');

    cy.get('[data-cy="file-row-delete-1"]').click();
    cy.get('[data-cy="confirm-dialog-confirm"]').click();

    cy.wait('@deleteFile');
    cy.wait('@refetchFilesAfterDelete');
  });

  it('E2E-082 file fetch failure shows level-1 error modal', () => {
    cy.intercept('GET', '**/api/v1/projects/1/files', { statusCode: 500, body: { error: 'files failed' } }).as('filesError');

    cy.visit('/project/1');
    cy.wait('@getProjects');
    cy.wait('@getPspMappings');
    cy.wait('@getProjectOne');
    cy.wait('@getProjectOnePsp');
    cy.wait('@getStateOne');
    cy.get('[data-cy="tab-nav-files"]').click({ force: true });
    cy.wait('@filesError');

    cy.get('[data-cy="error-modal-overlay"]').should('be.visible');
  });

  it('E2E-083 files tab route remains on project details with files active', () => {
    bootFilesTab();
    cy.url().should('include', '/project/1');
    cy.get('[data-cy="tab-nav-files"]').closest('.tab-row').should('have.class', 'active');
  });
});
