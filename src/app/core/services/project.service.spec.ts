import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { afterEach, beforeEach, describe, expect, it, jest } from '@jest/globals';

import { ErrorLoggerService } from './error-logger.service';
import { ProjectService } from './project.service';

describe('ProjectService', () => {
  let service: ProjectService;
  let httpMock: HttpTestingController;
  let logger: { log: jest.Mock };

  beforeEach(() => {
    logger = { log: jest.fn() };

    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        ProjectService,
        { provide: ErrorLoggerService, useValue: logger }
      ]
    });

    service = TestBed.inject(ProjectService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('fetches filters from canonical projects filters endpoint', () => {
    service.getFilters().subscribe((data) => {
      expect(data.departments).toEqual(['DIC', 'DAS']);
      expect(data.businessLines).toEqual(['XP', 'CT']);
      expect(data.types).toEqual(['SSP', 'Platform']);
    });

    const request = httpMock.expectOne('http://localhost:3001/api/v1/filters/projects');
    expect(request.request.method).toBe('GET');
    request.flush({
      department: ['DIC', 'DAS'],
      business_line: ['XP', 'CT'],
      type: ['SSP', 'Platform']
    });
  });

  it('fetches projects and maps psp mappings', () => {
    service.getProjects({ department: 'DIC', businessLine: 'XP', type: 'SSP' }).subscribe((projects) => {
      expect(projects).toHaveLength(1);
      expect(projects[0].name).toBe('Imaging Platform Modernization');
      expect(projects[0].pspProjects).toEqual([{ id: 101, name: 'PSP-1' }]);
    });

    const projectsReq = httpMock.expectOne(
      (req) =>
        req.url === 'http://localhost:3001/api/v1/projects/' &&
        req.params.get('department') === 'DIC' &&
        req.params.get('business_line') === 'XP' &&
        req.params.get('type') === 'SSP'
    );
    projectsReq.flush({
      count: 1,
      next: null,
      previous: null,
      results: [
        {
          id: 1,
          title: 'Imaging Platform Modernization',
          department: 'DIC',
          business_line: 'XP',
          type: 'SSP',
          start_date: '2025-01-10',
          end_date: '2025-11-30',
          is_active: 'true'
        }
      ]
    });

    const pspReq = httpMock.expectOne('http://localhost:3001/api/v1/psp-mappings/?page_size=500');
    pspReq.flush({ count: 1, next: null, previous: null, results: [{ id: 101, project: 1, psp_element: 'PSP-1' }] });
  });

  it('fetches project detail and maps psp projects', () => {
    service.getProjectDetail(4).subscribe((project) => {
      expect(project.id).toBe(4);
      expect(project.name).toBe('AI Triage Expansion');
      expect(project.pspProjects).toEqual([{ id: 401, name: 'PSP-401' }]);
    });

    const projectReq = httpMock.expectOne('http://localhost:3001/api/v1/projects/4/');
    projectReq.flush({
      id: 4,
      title: 'AI Triage Expansion',
      department: 'LMS',
      business_line: 'XR',
      type: 'Program',
      start_date: '2025-03-05',
      end_date: '2025-11-20',
      is_active: 'true'
    });

    const pspReq = httpMock.expectOne('http://localhost:3001/api/v1/psp-mappings/?project=4&page_size=500');
    pspReq.flush({ count: 1, next: null, previous: null, results: [{ id: 401, project: 4, psp_element: 'PSP-401' }] });
  });

  it('fetches state cards from statuses endpoint', () => {
    service.getStateCards(2).subscribe((cards) => {
      expect(cards).toHaveLength(6);
      expect(cards.find((card) => card.key === 'quality')?.value).toBe(90);
      expect(cards.find((card) => card.key === 'budget')?.narrative).toBe('Spend is within plan.');
      expect(cards.find((card) => card.key === 'target-cost')?.previousValue).toBe(65);
    });

    const request = httpMock.expectOne('http://localhost:3001/api/v1/statuses/?project=2&page_size=200');
    request.flush({
      count: 6,
      next: null,
      previous: null,
      results: [
        { id: 1, project: 2, name: 'Quality', value: 'Green', description: 'Stable quality trend.' },
        { id: 2, project: 2, name: 'Budget', value: 'Yellow', description: 'Spend is within plan.' },
        { id: 3, project: 2, name: 'TargetCost', value: 'Yellow', description: '' },
        { id: 4, project: 2, name: 'Resources', value: 'Green', description: '' },
        { id: 5, project: 2, name: 'Timeline', value: 'Green', description: '' },
        { id: 6, project: 2, name: 'CustomerSatisfaction', value: 'Green', description: '' }
      ]
    });
  });

  it('fetches overview chart data from overview-chart endpoint', () => {
    service.getOverviewChartData(2).subscribe((chartData) => {
      expect(chartData.datasets).toHaveLength(3);
      expect(chartData.datasets[0].label).toBe('Gross');
    });

    httpMock.expectOne('http://localhost:3001/api/v1/projects/2/overview-chart').flush({
      series: [
        { reportingMonth: '2025-01', gross: 100, net: 90, manpower: 12 },
        { reportingMonth: '2025-02', gross: 110, net: 95, manpower: 11 }
      ],
      totals: { gross: 210, net: 185, manpower: 23 }
    });
  });

  it('saves state via statuses update and refetches', () => {
    service
      .saveState(1, [
        {
          id: 'quality',
          key: 'quality',
          label: 'Quality',
          value: 85,
          previousValue: 82,
          narrative: 'Updated narrative.'
        }
      ])
      .subscribe((cards) => {
        expect(cards.find((card) => card.key === 'quality')?.narrative).toBe('Updated narrative.');
      });

    const initialReq = httpMock.expectOne('http://localhost:3001/api/v1/statuses/?project=1&page_size=200');
    initialReq.flush({
      count: 1,
      next: null,
      previous: null,
      results: [{ id: 1, project: 1, name: 'Quality', value: 'Green', description: 'Old narrative' }]
    });

    const patchReq = httpMock.expectOne('http://localhost:3001/api/v1/statuses/1/');
    expect(patchReq.request.method).toBe('PATCH');
    expect(patchReq.request.body).toEqual({ name: 'Quality', value: 'Green', description: 'Updated narrative.' });
    patchReq.flush({});

    // saveState refetches via getStateCards which calls GET /statuses/?project=:id&page_size=200
    const refetchReq = httpMock.expectOne('http://localhost:3001/api/v1/statuses/?project=1&page_size=200');
    refetchReq.flush({
      count: 1,
      next: null,
      previous: null,
      results: [{ id: 1, project: 1, name: 'Quality', value: 'Green', description: 'Updated narrative.' }]
    });
  });

  it('updates metadata via project patch and refetches details', () => {
    service.updateMetadata(1, 'department', 'DAS').subscribe((project) => {
      expect(project.department).toBe('DAS');
    });

    const patchReq = httpMock.expectOne('http://localhost:3001/api/v1/projects/1/');
    expect(patchReq.request.method).toBe('PATCH');
    expect(patchReq.request.body).toEqual({ department: 'DAS' });
    patchReq.flush({});

    httpMock.expectOne('http://localhost:3001/api/v1/projects/1/').flush({
      id: 1,
      title: 'Imaging Platform Modernization',
      department: 'DAS',
      business_line: 'XP',
      type: 'SSP',
      start_date: '2025-01-10',
      end_date: '2025-11-30',
      is_active: 'true'
    });
    httpMock.expectOne('http://localhost:3001/api/v1/psp-mappings/?project=1&page_size=500').flush({ count: 0, next: null, previous: null, results: [] });
  });

  it('adds psp project and refetches details', () => {
    service.addPspProject(1, 'PSP-9').subscribe((project) => {
      expect(project.pspProjects).toEqual([{ id: 999, name: 'PSP-9' }]);
    });

    const postReq = httpMock.expectOne('http://localhost:3001/api/v1/psp-mappings/');
    expect(postReq.request.method).toBe('POST');
    expect(postReq.request.body).toEqual({ project: 1, psp_element: 'PSP-9' });
    postReq.flush({});

    httpMock.expectOne('http://localhost:3001/api/v1/projects/1/').flush({
      id: 1,
      title: 'Imaging Platform Modernization',
      department: 'DIC',
      business_line: 'XP',
      type: 'SSP',
      start_date: '2025-01-10',
      end_date: '2025-11-30',
      is_active: 'true'
    });
    httpMock.expectOne('http://localhost:3001/api/v1/psp-mappings/?project=1&page_size=500').flush({
      count: 1,
      next: null,
      previous: null,
      results: [{ id: 999, project: 1, psp_element: 'PSP-9' }]
    });
  });

  it('deletes psp project and refetches details', () => {
    service.deletePspProject(1, 999).subscribe((project) => {
      expect(project.pspProjects).toEqual([]);
    });

    const deleteReq = httpMock.expectOne('http://localhost:3001/api/v1/psp-mappings/999/');
    expect(deleteReq.request.method).toBe('DELETE');
    deleteReq.flush({});

    httpMock.expectOne('http://localhost:3001/api/v1/projects/1/').flush({
      id: 1,
      title: 'Imaging Platform Modernization',
      department: 'DIC',
      business_line: 'XP',
      type: 'SSP',
      start_date: '2025-01-10',
      end_date: '2025-11-30',
      is_active: 'true'
    });
    httpMock.expectOne('http://localhost:3001/api/v1/psp-mappings/?project=1&page_size=500').flush({ count: 0, next: null, previous: null, results: [] });
  });

  it('maps risk loss fields from API to UI model', () => {
    service.getRisks(1).subscribe((data) => {
      expect(data.risks).toHaveLength(1);
      expect(data.risks[0].potentialFinancialLoss).toBe('120000');
      expect(data.risks[0].potentialFinancialLossAfter).toBe('80000');
    });

    const req = httpMock.expectOne('http://localhost:3001/api/v1/risks/?project=1&page_size=300');
    expect(req.request.method).toBe('GET');
    req.flush({
      count: 1,
      next: null,
      previous: null,
      results: [
        {
          id: 11,
          project: 1,
          title: 'Cabling',
          type: 'Technical Risk',
          state: 'Open',
          probability: 'Medium',
          severity: 'Medium',
          loss_valuation: 120000,
          description: 'Cabling quality is insufficient.',
          action: '',
          action_state: 'Open',
          due_date: '2024-12-31',
          probability_after_action: 'Low',
          severity_after_action: 'Low',
          loss_after_action: 80000
        }
      ]
    });
  });

  it('patches potential financial loss to loss_valuation', () => {
    service.updateRisk(1, 11, 'potentialFinancialLoss', '130000').subscribe((data) => {
      expect(data.risks).toHaveLength(1);
    });

    const patchReq = httpMock.expectOne('http://localhost:3001/api/v1/risks/11/');
    expect(patchReq.request.method).toBe('PATCH');
    expect(patchReq.request.body).toEqual({ loss_valuation: '130000' });
    patchReq.flush({});

    const refetchReq = httpMock.expectOne('http://localhost:3001/api/v1/risks/?project=1&page_size=300');
    refetchReq.flush({ count: 1, next: null, previous: null, results: [] });
  });

  it('patches PFL after action to loss_after_action', () => {
    service.updateRisk(1, 11, 'potentialFinancialLossAfter', '90000').subscribe((data) => {
      expect(data.risks).toHaveLength(1);
    });

    const patchReq = httpMock.expectOne('http://localhost:3001/api/v1/risks/11/');
    expect(patchReq.request.method).toBe('PATCH');
    expect(patchReq.request.body).toEqual({ loss_after_action: '90000' });
    patchReq.flush({});

    const refetchReq = httpMock.expectOne('http://localhost:3001/api/v1/risks/?project=1&page_size=300');
    refetchReq.flush({ count: 1, next: null, previous: null, results: [] });
  });

  it('posts add risk payload with loss valuation fields', () => {
    service
      .addRisk(1, {
        title: 'Cabling',
        riskType: 'Technical Risk',
        potentialFinancialLoss: '120000',
        potentialFinancialLossAfter: '80000'
      })
      .subscribe((data) => {
        expect(data.risks).toHaveLength(1);
      });

    const postReq = httpMock.expectOne('http://localhost:3001/api/v1/risks/');
    expect(postReq.request.method).toBe('POST');
    expect(postReq.request.body.loss_valuation).toBe('120000');
    expect(postReq.request.body.loss_after_action).toBe('80000');
    postReq.flush({ id: 999 });

    const refetchReq = httpMock.expectOne('http://localhost:3001/api/v1/risks/?project=1&page_size=300');
    refetchReq.flush({ count: 1, next: null, previous: null, results: [] });
  });

  it('fetches files by project id', () => {
    service.getFiles(1).subscribe((files) => {
      expect(files).toHaveLength(1);
      expect(files[0].name).toBe('Kickoff Deck.pdf');
      expect(files[0].downloadUrl).toContain('/api/v1/projects/1/files/1/download');
    });

    const request = httpMock.expectOne('http://localhost:3001/api/v1/projects/1/files');
    expect(request.request.method).toBe('GET');
    request.flush([
      {
        id: 1,
        name: 'Kickoff Deck.pdf',
        sizeBytes: 1024,
        contentType: 'application/pdf',
        uploadedAt: '2026-04-26T08:00:00Z',
        downloadUrl: '/api/v1/projects/1/files/1/download'
      }
    ]);
  });

  it('uploads a file and refetches files', () => {
    const file = new File(['data'], 'upload.txt', { type: 'text/plain' });

    service.uploadFile(1, file).subscribe((files) => {
      expect(files).toHaveLength(1);
    });

    const postRequest = httpMock.expectOne('http://localhost:3001/api/v1/projects/1/files');
    expect(postRequest.request.method).toBe('POST');
    expect(postRequest.request.body instanceof FormData).toBe(true);
    postRequest.flush({
      id: 10,
      name: 'upload.txt',
      sizeBytes: 4,
      contentType: 'text/plain',
      uploadedAt: '2026-04-26T08:00:00Z',
      downloadUrl: '/api/v1/projects/1/files/10/download'
    });

    const getRequest = httpMock.expectOne('http://localhost:3001/api/v1/projects/1/files');
    expect(getRequest.request.method).toBe('GET');
    getRequest.flush([
      {
        id: 10,
        name: 'upload.txt',
        sizeBytes: 4,
        contentType: 'text/plain',
        uploadedAt: '2026-04-26T08:00:00Z',
        downloadUrl: '/api/v1/projects/1/files/10/download'
      }
    ]);
  });

  it('deletes a file and refetches files', () => {
    service.deleteFile(1, 10).subscribe((files) => {
      expect(files).toHaveLength(0);
    });

    const deleteRequest = httpMock.expectOne('http://localhost:3001/api/v1/projects/1/files/10');
    expect(deleteRequest.request.method).toBe('DELETE');
    deleteRequest.flush({ success: true });

    const getRequest = httpMock.expectOne('http://localhost:3001/api/v1/projects/1/files');
    expect(getRequest.request.method).toBe('GET');
    getRequest.flush([]);
  });

  it('returns hardcoded milestone sets MP and BL', (done) => {
    service.getMilestoneSets().subscribe((sets) => {
      expect(sets).toEqual(['MP', 'BL']);
      done();
    });
  });

  it('uploadFile emits FILE_TOO_LARGE typed error on 400 with FILE_TOO_LARGE code', (done) => {
    const file = new File(['x'], 'big.bin', { type: 'application/octet-stream' });

    service.uploadFile(1, file).subscribe({
      next: () => done(new Error('expected error')),
      error: (err: unknown) => {
        const typed = err as { type?: string };
        expect(typed?.type).toBe('FILE_TOO_LARGE');
        done();
      }
    });

    const postRequest = httpMock.expectOne('http://localhost:3001/api/v1/projects/1/files');
    postRequest.flush(
      { error: 'File exceeds maximum size of 50 MB', code: 'FILE_TOO_LARGE', maxBytes: 52428800 },
      { status: 400, statusText: 'Bad Request' }
    );
  });
});
