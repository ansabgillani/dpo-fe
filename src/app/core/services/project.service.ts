import { HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, forkJoin, of, throwError } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';

import { UI_CONFIG } from '../../ui-config';
import {
  ApiCostBreakdown,
  ApiCostProject,
  ApiFileEntry,
  ApiMilestone,
  ApiProduct,
  ApiProductCost,
  ApiProject,
  ApiPspMapping,
  ApiRisk,
  ApiStatus,
  PaginatedResponse
} from '../../data/api.models';
import { ProjectApiService } from '../../data/project-api.service';
import { CostData, CostFilters } from '@core/models/cost.model';
import { FileEntry } from '@core/models/file.model';
import {
  CreateProjectPayload,
  FilterOptions,
  FilterValues,
  ProjectSummary,
  PspProject
} from '@core/models/project.model';
import { MilestoneItem } from '@core/models/milestone.model';
import { RiskData, RiskEntry } from '@core/models/risk.model';
import { StateCard } from '@core/models/state-card.model';
import { ErrorLoggerService } from './error-logger.service';

export interface OverviewChartData {
  datasets: Array<{
    label: string;
    color: string;
    data: number[];
  }>;
}

const STATE_CARD_DEFINITIONS: Array<{ key: StateCard['key']; id: string; label: string; statusName: string }> = [
  { key: 'quality', id: 'quality', label: 'Quality', statusName: 'Quality' },
  { key: 'budget', id: 'budget', label: 'Budget', statusName: 'Budget' },
  { key: 'target-cost', id: 'targetCost', label: 'Target Cost', statusName: 'Target Costs' },
  { key: 'resources', id: 'resources', label: 'Resources', statusName: 'Ressources' },
  { key: 'timeline', id: 'timeline', label: 'Timeline', statusName: 'Timeline' },
  {
    key: 'customer-satisfaction',
    id: 'customerSatisfaction',
    label: 'Customer Satisfaction',
    statusName: 'Customer perception'
  }
];

@Injectable({
  providedIn: 'root'
})
export class ProjectService {
  private readonly activeTabIndexSubject = new BehaviorSubject<number>(0);
  private readonly activeCostSubViewIndexSubject = new BehaviorSubject<number>(0);
  private readonly projectOverrides = new Map<number, Partial<ProjectSummary>>();

  readonly activeTabIndex$ = this.activeTabIndexSubject.asObservable();
  readonly activeCostSubViewIndex$ = this.activeCostSubViewIndexSubject.asObservable();

  constructor(
    private readonly projectApi: ProjectApiService,
    private readonly errorLogger: ErrorLoggerService
  ) {}

  getActiveTabIndex(): number {
    return this.activeTabIndexSubject.value;
  }

  setActiveTabIndex(index: number): void {
    this.activeTabIndexSubject.next(index);
  }

  getActiveCostSubViewIndex(): number {
    return this.activeCostSubViewIndexSubject.value;
  }

  setActiveCostSubViewIndex(index: number): void {
    this.activeCostSubViewIndexSubject.next(index);
  }

  getFilters(): Observable<FilterOptions> {
    return this.projectApi
      .getProjectFilters()
      .pipe(
        map((response) => ({
          departments: this.unique(response.department || []),
          businessLines: this.unique(response.business_line || []),
          types: this.unique(response.type || [])
        })),
        catchError((error: unknown) => {
          this.errorLogger.log('error', 'ERR_FETCH_FILTERS', 'Failed to fetch filter options', undefined, error);
          return throwError(() => error);
        })
      );
  }

  getProjects(filters?: FilterValues): Observable<ProjectSummary[]> {
    let params = new HttpParams().set('page_size', '250');

    if (filters?.department) {
      params = params.set('department', filters.department);
    }

    if (filters?.businessLine) {
      params = params.set('business_line', filters.businessLine);
    }

    if (filters?.type) {
      params = params.set('type', filters.type);
    }

    return forkJoin({
      projects: this.projectApi.listProjects(params),
      pspMappings: this.projectApi.listPspMappings(new HttpParams().set('page_size', '500'))
    }).pipe(
      map(({ projects, pspMappings }) => {
        const mappingByProject = this.groupMappingsByProject(this.unwrapResults(pspMappings));
        return this.unwrapResults(projects).map((project) =>
          this.applyProjectOverrides(this.mapProject(project, mappingByProject.get(project.id) || []))
        );
      }),
      catchError((error: unknown) => {
        this.errorLogger.log('error', 'ERR_FETCH_PROJECTS', 'Failed to fetch projects list', { filters }, error);
        return throwError(() => error);
      })
    );
  }

  getProjectDetail(id: number): Observable<ProjectSummary> {
    return forkJoin({
      project: this.projectApi.getProject(id),
      pspMappings: this.projectApi.listPspMappings(new HttpParams().set('project', String(id)).set('page_size', '500'))
    }).pipe(
      map(({ project, pspMappings }) =>
        this.applyProjectOverrides(this.mapProject(project, this.unwrapResults(pspMappings)))
      ),
      catchError((error: unknown) => {
        this.errorLogger.log(
          'error',
          'ERR_FETCH_PROJECT_DETAIL',
          'Failed to fetch project details',
          { projectId: id },
          error
        );
        return throwError(() => error);
      })
    );
  }

  createProject(payload: CreateProjectPayload): Observable<ProjectSummary> {
    return this.projectApi
      .createProject({
        title: payload.title,
        type: payload.type,
        business_line: payload.businessLine,
        department: payload.department,
        market: 'Global',
        global_project: false,
        start_date: payload.startDate,
        end_date: payload.endDate,
        display_image: payload.avatarUrl || null
      })
      .pipe(
        switchMap((project) => {
          const pspElements = payload.pspElements || [];
          if (!pspElements.length) {
            return this.getProjectDetail(project.id);
          }

          return forkJoin(
            pspElements.map((name) =>
              this.projectApi.createPspMapping({
                project: project.id,
                psp_element: name
              })
            )
          ).pipe(switchMap(() => this.getProjectDetail(project.id)));
        }),
        catchError((error: unknown) => {
          this.errorLogger.log('error', 'ERR_FETCH_PROJECTS', 'Failed to create project', { payload }, error);
          return throwError(() => error);
        })
      );
  }

  getStateCards(id: number): Observable<StateCard[]> {
    return this.projectApi
      .listStatuses(new HttpParams().set('project', String(id)).set('page_size', '200'))
      .pipe(
        map((response) => this.toStateCardsFromStatuses(this.unwrapResults(response), id)),
        catchError((error: unknown) => {
          this.errorLogger.log('error', 'ERR_FETCH_STATE', 'Failed to fetch state cards', { projectId: id }, error);
          return throwError(() => error);
        })
      );
  }

  getOverviewChartData(id: number): Observable<OverviewChartData> {
    return this.projectApi.getProjectOverviewChart(id).pipe(
      map((costData) => ({
        datasets: [
          {
            label: 'Gross',
            color: 'rgb(0, 160, 175)',
            data: costData.series.map((entry) => this.toNumber(entry.gross))
          },
          {
            label: 'Net',
            color: 'rgb(232, 119, 34)',
            data: costData.series.map((entry) => this.toNumber(entry.net))
          },
          {
            label: 'Manpower',
            color: 'rgb(0, 112, 192)',
            data: costData.series.map((entry) => this.toNumber(entry.manpower))
          }
        ]
      })),
      catchError((error: unknown) => {
        this.errorLogger.log(
          'error',
          'ERR_FETCH_PROJECT_DETAIL',
          'Failed to fetch overview chart data',
          { projectId: id },
          error
        );
        return throwError(() => error);
      })
    );
  }

  getMilestoneSets(): Observable<string[]> {
    return of(['MP', 'BL']);
  }

  getMilestones(id: number, milestoneSet?: string): Observable<MilestoneItem[]> {
    return this.projectApi
      .listMilestones(new HttpParams().set('project', String(id)).set('page_size', '250').set('type', String(milestoneSet)))
      .pipe(
        map((response) => {
          const milestones = this.unwrapResults(response)
            .map((milestone, index) => this.mapMilestone(milestone, index))
            .filter((milestone) => !milestoneSet || milestone.milestoneSet === milestoneSet);
          return milestones;
        }),
        catchError((error: unknown) => {
          this.errorLogger.log(
            'error',
            'ERR_FETCH_MILESTONES',
            'Failed to fetch milestones',
            { projectId: id, milestoneSet },
            error
          );
          return throwError(() => error);
        })
      );
  }

  updateMilestone(
    id: number,
    milestoneId: number,
    dates: { startDate?: string; endDate?: string },
    milestoneSet?: string
  ): Observable<MilestoneItem[]> {
    return this.projectApi.updateMilestone(milestoneId, {
      ...(dates.startDate ? { start_date: dates.startDate } : {}),
      ...(dates.endDate ? { end_date: dates.endDate } : {})
    }).pipe(
      switchMap(() => this.getMilestones(id, milestoneSet)),
      catchError((error: unknown) => {
        this.errorLogger.log(
          'error',
          'ERR_UPDATE_MILESTONE',
          'Failed to update milestone',
          { projectId: id, milestoneId },
          error
        );
        return throwError(() => error);
      })
    );
  }

  getCostData(id: number, filters?: CostFilters): Observable<CostData> {
    return forkJoin({
      project: this.projectApi.getProject(id),
      pspMappings: this.projectApi.listPspMappings(new HttpParams().set('project', String(id)).set('page_size', '500')),
      costProjects: this.projectApi.listCostProjects(new HttpParams().set('page_size', '500')),
      costBreakdowns: this.projectApi.listCostBreakdowns(new HttpParams().set('page_size', '1000')),
      products: this.projectApi.listProducts(new HttpParams().set('project', String(id)).set('page_size', '500')),
      productCosts: this.projectApi.listProductCosts(new HttpParams().set('product__project', String(id)).set('page_size', '500'))
    }).pipe(
      map(({ project, pspMappings, costProjects, costBreakdowns, products, productCosts }) => {
        const mappingList = this.unwrapResults(pspMappings);
        const pspElements = this.unique(mappingList.map((mapping) => mapping.psp_element));

        let scopedCostProjects = this.unwrapResults(costProjects).filter((costProject) => {
          if (pspElements.length > 0) {
            return pspElements.includes(costProject.psp_element);
          }
          return (costProject.project_title || '').toLowerCase() === (project.title || '').toLowerCase();
        });

        if (filters?.pspProject) {
          scopedCostProjects = scopedCostProjects.filter((entry) => entry.psp_element === filters.pspProject);
        }

        const scopedCostProjectIds = new Set(scopedCostProjects.map((entry) => entry.id));
        const scopedBreakdowns = this.unwrapResults(costBreakdowns).filter((breakdown) =>
          scopedCostProjectIds.has(breakdown.psp_project)
        );

        const monthlyByPeriod = this.groupBreakdownsByPeriod(scopedBreakdowns);
        const budgetSeries = monthlyByPeriod.map((row) => row.budget.gross);
        const actualSeries = monthlyByPeriod.map((row) => row.actuals.gross);
        const chargingSeries = monthlyByPeriod.map((row) => row.actuals.chargingToBL);

        const scopedProducts = this.unwrapResults(products);
        const scopedProductCosts = this.unwrapResults(productCosts);
        const productById = new Map(scopedProducts.map((entry) => [entry.id, entry]));

        const productRows = scopedProductCosts.map((entry) => {
          const productEntry = productById.get(entry.product);
          const target = this.toNumber(entry.target);
          const actual = this.toNumber(entry.actual);
          const variance = actual - target;
          const trendPercent = target === 0 ? 0 : Math.round((Math.abs(variance) / target) * 100);
          return {
            id: String(entry.id),
            name: productEntry?.name || `Product ${entry.product}`,
            target,
            actual,
            calculationDate: entry.calculation_date,
            trendDirection: variance > 0 ? 'up' : variance < 0 ? 'down' : 'neutral',
            trendPercent
          } as CostData['breakdown']['products'][number];
        });

        const actualSummary = this.sumBreakdown(scopedBreakdowns, 'Actuals');
        const budgetSummary = this.sumBreakdown(scopedBreakdowns, 'Budget');
        const forecastSummary = this.sumBreakdown(scopedBreakdowns, 'Forecast');

        const projectCost = scopedBreakdowns.reduce((acc, row) => acc + this.toNumber(row.net || row.gross), 0);
        const reportingPeriod = this.latestReportingPeriod(scopedBreakdowns);

        return {
          projectCost,
          latestReportingPeriod: reportingPeriod,
          project: filters?.project || project.title,
          fy: filters?.fy || scopedCostProjects[0]?.fiscal_year || 'FY25',
          pspProject: filters?.pspProject || scopedCostProjects[0]?.psp_element || pspElements[0] || '',
          breakdownMode: filters?.breakdownMode || 'project',
          overview: {
            actuals: actualSummary,
            budget: budgetSummary,
            forecasts: forecastSummary,
            forecastsPlusActuals: {
              gross: actualSummary.gross + forecastSummary.gross,
              chargingToBL: actualSummary.chargingToBL + forecastSummary.chargingToBL,
              net: actualSummary.net + forecastSummary.net
            },
            barChart: {
              groups: ['Forecast', 'Budget', 'Actuals', 'FC + Actuals'],
              datasets: [
                {
                  label: 'Charging to BL',
                  data: [forecastSummary.chargingToBL, budgetSummary.chargingToBL, actualSummary.chargingToBL, actualSummary.chargingToBL + forecastSummary.chargingToBL],
                  color: 'rgb(0, 176, 80)'
                },
                {
                  label: 'Gross',
                  data: [forecastSummary.gross, budgetSummary.gross, actualSummary.gross, actualSummary.gross + forecastSummary.gross],
                  color: 'rgb(232, 119, 34)'
                },
                {
                  label: 'NET',
                  data: [forecastSummary.net, budgetSummary.net, actualSummary.net, actualSummary.net + forecastSummary.net],
                  color: 'rgb(0, 112, 192)'
                }
              ]
            }
          },
          monthly: {
            actuals: monthlyByPeriod.map((row) => ({
              period: row.period,
              gross: row.actuals.gross,
              chargingToBL: row.actuals.chargingToBL,
              net: row.actuals.net
            })),
            budget: monthlyByPeriod.map((row) => ({
              period: row.period,
              gross: row.budget.gross,
              chargingToBL: row.budget.chargingToBL,
              net: row.budget.net
            })),
            forecastsPlusActuals: monthlyByPeriod.map((row) => ({
              period: row.period,
              gross: row.actuals.gross + row.forecast.gross,
              chargingToBL: row.actuals.chargingToBL + row.forecast.chargingToBL,
              net: row.actuals.net + row.forecast.net
            }))
          },
          breakdown: {
            products: productRows,
            lineChart: {
              budget: budgetSeries,
              actualsAndForecasts: monthlyByPeriod.map((row) => row.actuals.gross + row.forecast.gross),
              chargingActualsAndForecasts: chargingSeries
            },
            periodDetail: monthlyByPeriod.map((row) => ({
              period: row.period,
              gross: row.actuals.gross,
              chargingToInternal: row.actuals.chargingToInternal,
              ctCosts: row.actuals.ctCosts,
              externalMaterial: row.actuals.externalMaterial,
              internalMaterial: row.actuals.internalMaterial,
              chargingToBL: row.actuals.chargingToBL,
              net: row.actuals.net
            }))
          }
        } satisfies CostData;
      }),
      catchError((error: unknown) => {
        this.errorLogger.log('error', 'ERR_FETCH_COST', 'Failed to fetch cost data', { projectId: id, filters }, error);
        return throwError(() => error);
      })
    );
  }

  updateCostBreakdown(
    id: number,
    productId: string,
    data: { target?: number; actual?: number; calculationDate?: string },
    filters?: CostFilters
  ): Observable<CostData> {
    const payload: Record<string, unknown> = {};

    if (typeof data.target === 'number') {
      payload['target'] = data.target.toFixed(2);
    }

    if (typeof data.actual === 'number') {
      payload['actual'] = data.actual.toFixed(2);
    }

    if (data.calculationDate) {
      payload['calculation_date'] = data.calculationDate;
    }

    return this.projectApi.updateProductCost(productId, payload).pipe(
      switchMap(() => this.getCostData(id, filters)),
      catchError((error: unknown) => {
        this.errorLogger.log(
          'error',
          'ERR_FETCH_COST',
          'Failed to update cost breakdown',
          { projectId: id, productId, data },
          error
        );
        return throwError(() => error);
      })
    );
  }

  saveState(id: number, cards: StateCard[]): Observable<StateCard[]> {
    return this.projectApi
      .listStatuses(new HttpParams().set('project', String(id)).set('page_size', '200'))
      .pipe(
        switchMap((response) => {
          const existing = this.unwrapResults(response);
          const requests = cards.map((card) => {
            const statusName = this.statusNameForCard(card.key);
            const existingEntry = existing.find((entry) => entry.name === statusName);
            const payload = {
              ...(existingEntry ? { name: existingEntry.name } : { project: id, name: statusName }),
              value: this.statusColorFromCard(card.value),
              description: card.narrative
            };

            if (existingEntry) {
              return this.projectApi.updateStatus(existingEntry.id, payload);
            }

            return this.projectApi.createStatus(payload);
          });

          return requests.length ? forkJoin(requests) : of([]);
        }),
        switchMap(() => this.getStateCards(id)),
        catchError((error: unknown) => {
          this.errorLogger.log('error', 'ERR_SAVE_STATE', 'Failed to save project state', { projectId: id }, error);
          return throwError(() => error);
        })
      );
  }

  updateMetadata(id: number, field: string, value: string | unknown[]): Observable<ProjectSummary> {
    if (field === 'pspProjects' && Array.isArray(value)) {
      return this.syncPspMappings(id, value as PspProject[]).pipe(switchMap(() => this.getProjectDetail(id)));
    }

    if (field === 'statusProject') {
      this.setProjectOverride(id, { statusProject: String(value) });
      return this.getProjectDetail(id);
    }

    const fieldMap: Record<string, string> = {
      name: 'title',
      department: 'department',
      businessLine: 'business_line',
      type: 'type',
      startDate: 'start_date',
      endDate: 'end_date',
      avatarUrl: 'display_image'
    };

    const apiField = fieldMap[field];
    if (!apiField) {
      this.setProjectOverride(id, { [field]: value } as Partial<ProjectSummary>);
      return this.getProjectDetail(id);
    }

    return this.projectApi
      .updateProject(id, {
        [apiField]: value
      })
      .pipe(
        switchMap(() => this.getProjectDetail(id)),
        catchError((error: unknown) => {
          this.errorLogger.log(
            'error',
            'ERR_UPDATE_PROJECT_METADATA',
            'Failed to update project metadata',
            { projectId: id, field },
            error
          );
          return throwError(() => error);
        })
      );
  }

  addPspProject(id: number, name: string): Observable<ProjectSummary> {
    return this.projectApi
      .createPspMapping({ project: id, psp_element: name })
      .pipe(
        switchMap(() => this.getProjectDetail(id)),
        catchError((error: unknown) => {
          this.errorLogger.log(
            'error',
            'ERR_ADD_PSP_PROJECT',
            'Failed to add PSP project',
            { projectId: id, pspName: name },
            error
          );
          return throwError(() => error);
        })
      );
  }

  deletePspProject(id: number, pspId: number): Observable<ProjectSummary> {
    return this.projectApi
      .deletePspMapping(pspId)
      .pipe(
        switchMap(() => this.getProjectDetail(id)),
        catchError((error: unknown) => {
          this.errorLogger.log(
            'error',
            'ERR_DELETE_PSP_PROJECT',
            'Failed to delete PSP project',
            { projectId: id, pspId },
            error
          );
          return throwError(() => error);
        })
      );
  }

  getRisks(id: number, riskType?: string): Observable<RiskData> {
    let params = new HttpParams().set('project', String(id)).set('page_size', '300');

    if (riskType) {
      params = params.set('type', riskType);
    }

    return this.projectApi
      .listRisks(params)
      .pipe(
        map((response) => {
          const risks = this.unwrapResults(response).map((entry) => this.mapRiskToUi(entry));
          return {
            heatmap: this.buildRiskHeatmap(risks),
            risks
          };
        }),
        catchError((error: unknown) => {
          this.errorLogger.log('error', 'ERR_FETCH_RISKS', 'Failed to fetch risks', { projectId: id, riskType }, error);
          return throwError(() => error);
        })
      );
  }

  updateRisk(
    id: number,
    riskId: number,
    field: keyof RiskEntry,
    value: string,
    riskType?: string
  ): Observable<RiskData> {
    const payload = this.mapRiskPatchToApi(field, value);

    return this.projectApi.updateRisk(riskId, payload).pipe(
      switchMap(() => this.getRisks(id, riskType)),
      catchError((error: unknown) => {
        this.errorLogger.log(
          'error',
          'ERR_FETCH_RISKS',
          'Failed to update risk',
          { projectId: id, riskId, field },
          error
        );
        return throwError(() => error);
      })
    );
  }

  addRisk(id: number, risk: Partial<RiskEntry> = {}, riskType?: string): Observable<RiskData> {
    const payload = {
      project: id,
      title: risk.title || 'New Risk',
      type: risk.riskType || riskType || '',
      state: risk.status || '',
      probability: risk.probability || '',
      severity: risk.severity || '',
      loss_valuation: risk.potentialFinancialLoss || null,
      description: risk.riskDescription || '',
      riskDescription: risk.riskDescription || '',
      action: risk.action || '',
      action_state: risk.statusAfter || '',
      due_date: risk.actionDueDate || null,
      severity_after_action: risk.severityAfter || null,
      probability_after_action: risk.probabilityAfter || null,
      loss_after_action: risk.potentialFinancialLossAfter || null
    };

    return this.projectApi.createRisk(payload).pipe(
      switchMap(() => this.getRisks(id, riskType)),
      catchError((error: unknown) => {
        this.errorLogger.log('error', 'ERR_FETCH_RISKS', 'Failed to add risk', { projectId: id }, error);
        return throwError(() => error);
      })
    );
  }

  getFiles(id: number): Observable<FileEntry[]> {
    return this.projectApi.listFiles(id).pipe(
      map((files) => files.map((file) => this.mapFileToUi(file, id))),
      catchError((error: unknown) => {
        this.errorLogger.log('error', 'ERR_FETCH_FILES', 'Failed to fetch files', { projectId: id }, error);
        return throwError(() => error);
      })
    );
  }

  uploadFile(id: number, file: File): Observable<FileEntry[]> {
    const data = new FormData();
    data.append('file', file);

    return this.projectApi.uploadFile(id, data).pipe(
      switchMap(() => this.getFiles(id)),
      catchError((error: unknown) => {
        const httpError = error as HttpErrorResponse;
        if (httpError?.status === 400) {
          const body = httpError.error as Record<string, unknown> | null;
          const code = body?.['code'];
          if (code === 'FILE_TOO_LARGE') {
            return throwError(() => ({ type: 'FILE_TOO_LARGE', maxBytes: body?.['maxBytes'] }));
          }
        }
        this.errorLogger.log('error', 'ERR_FILE_UPLOAD', 'Failed to upload file', { projectId: id, fileName: file.name }, error);
        return throwError(() => error);
      })
    );
  }

  deleteFile(id: number, fileId: number): Observable<FileEntry[]> {
    return this.projectApi.deleteFile(id, fileId).pipe(
      switchMap(() => this.getFiles(id)),
      catchError((error: unknown) => {
        this.errorLogger.log('error', 'ERR_FILE_UPLOAD', 'Failed to delete file', { projectId: id, fileId }, error);
        return throwError(() => error);
      })
    );
  }

  private unwrapResults<T>(response: PaginatedResponse<T> | T[]): T[] {
    return Array.isArray(response) ? response : response.results || [];
  }

  private mapProject(project: ApiProject, pspMappings: ApiPspMapping[]): ProjectSummary {
    return {
      id: project.id,
      name: project.title,
      avatarUrl: project.display_image || '',
      department: project.department,
      businessLine: project.business_line,
      type: project.type,
      startDate: project.start_date,
      endDate: project.end_date,
      statusProject: project.is_active === 'true' ? 'Active' : 'Inactive',
      pspProjects: pspMappings.map((mapping) => ({
        id: mapping.id,
        name: mapping.psp_element
      }))
    };
  }

  private groupMappingsByProject(mappings: ApiPspMapping[]): Map<number, ApiPspMapping[]> {
    const grouped = new Map<number, ApiPspMapping[]>();
    for (const mapping of mappings) {
      const current = grouped.get(mapping.project) || [];
      current.push(mapping);
      grouped.set(mapping.project, current);
    }
    return grouped;
  }

  private applyProjectOverrides(project: ProjectSummary): ProjectSummary {
    return {
      ...project,
      ...(this.projectOverrides.get(project.id) || {})
    };
  }

  private setProjectOverride(projectId: number, patch: Partial<ProjectSummary>): void {
    const existing = this.projectOverrides.get(projectId) || {};
    this.projectOverrides.set(projectId, { ...existing, ...patch });
  }

  private toStateCardsFromStatuses(statuses: ApiStatus[], projectId: number): StateCard[] {
    const byName = new Map(statuses.map((status) => [status.name, status]));

    return STATE_CARD_DEFINITIONS.map((definition) => {
      const status = byName.get(definition.statusName);
      const currentColor = status?.value || 'Gray';
      return {
        id: definition.id,
        key: definition.key,
        label: definition.label,
        value: this.stateValueFromColor(currentColor),
        previousValue: this.stateValueFromColor(currentColor),
        narrative: status?.description || ''
      };
    }).map((card) => {
      if (projectId && this.projectOverrides.get(projectId)?.statusProject === 'At Risk' && card.key === 'timeline') {
        return { ...card, value: 45, previousValue: 60 };
      }
      return card;
    });
  }

  private stateValueFromColor(color: string): number {
    switch (color) {
      case 'Green':
        return 90;
      case 'Yellow':
        return 65;
      case 'Red':
        return 35;
      default:
        return 0;
    }
  }

  private statusColorFromCard(value: number): 'Green' | 'Yellow' | 'Red' | 'Gray' {
    if (value >= 80) return 'Green';
    if (value >= 50) return 'Yellow';
    if (value > 0) return 'Red';
    return 'Gray';
  }

  private statusNameForCard(key: StateCard['key']): string {
    const definition = STATE_CARD_DEFINITIONS.find((entry) => entry.key === key);
    return definition?.statusName || 'Quality';
  }

  private mapMilestone(milestone: ApiMilestone, index: number): MilestoneItem {
    const parsedId = Number(milestone.id);
    const id = Number.isFinite(parsedId) && parsedId > 0 ? parsedId : index + 1;

    return {
      id,
      milestoneSet: milestone.type || 'MP',
      name: milestone.name,
      type: milestone.type,
      description: milestone.description || '',
      status: milestone.status || '',
      proposedEndDate: milestone.proposed_end_date || '',
      startDate: milestone.start_date,
      endDate: milestone.end_date
    };
  }

  private groupBreakdownsByPeriod(rows: ApiCostBreakdown[]): Array<{
    period: string;
    actuals: { gross: number; chargingToBL: number; net: number; chargingToInternal: number; ctCosts: number; externalMaterial: number; internalMaterial: number };
    budget: { gross: number; chargingToBL: number; net: number };
    forecast: { gross: number; chargingToBL: number; net: number };
  }> {
    const byPeriod = new Map<string, {
      period: string;
      actuals: { gross: number; chargingToBL: number; net: number; chargingToInternal: number; ctCosts: number; externalMaterial: number; internalMaterial: number };
      budget: { gross: number; chargingToBL: number; net: number };
      forecast: { gross: number; chargingToBL: number; net: number };
    }>();

    for (const row of rows) {
      const period = this.toReportingPeriod(row.reporting_month || '2025-01');
      const current =
        byPeriod.get(period) ||
        {
          period,
          actuals: { gross: 0, chargingToBL: 0, net: 0, chargingToInternal: 0, ctCosts: 0, externalMaterial: 0, internalMaterial: 0 },
          budget: { gross: 0, chargingToBL: 0, net: 0 },
          forecast: { gross: 0, chargingToBL: 0, net: 0 }
        };

      const gross = this.toNumber(row.gross);
      const chargingToBL = this.toNumber(row.charging_to_bl);
      const net = this.toNumber(row.net);

      if (row.type === 'Budget') {
        current.budget.gross += gross;
        current.budget.chargingToBL += chargingToBL;
        current.budget.net += net;
      } else if (row.type === 'Forecast') {
        current.forecast.gross += gross;
        current.forecast.chargingToBL += chargingToBL;
        current.forecast.net += net;
      } else {
        current.actuals.gross += gross;
        current.actuals.chargingToBL += chargingToBL;
        current.actuals.net += net;
        current.actuals.chargingToInternal += this.toNumber(row.charging_internal);
        current.actuals.ctCosts += this.toNumber(row.ct_costs);
        current.actuals.externalMaterial += this.toNumber(row.external_material);
        current.actuals.internalMaterial += this.toNumber(row.internal_material);
      }

      byPeriod.set(period, current);
    }

    return Array.from(byPeriod.values()).sort((a, b) => a.period.localeCompare(b.period));
  }

  private sumBreakdown(rows: ApiCostBreakdown[], type: string): { gross: number; chargingToBL: number; net: number } {
    return rows
      .filter((row) => (type === 'Actuals' ? row.type === 'Actuals' : row.type === type))
      .reduce(
        (acc, row) => {
          acc.gross += this.toNumber(row.gross);
          acc.chargingToBL += this.toNumber(row.charging_to_bl);
          acc.net += this.toNumber(row.net);
          return acc;
        },
        { gross: 0, chargingToBL: 0, net: 0 }
      );
  }

  private latestReportingPeriod(rows: ApiCostBreakdown[]): string {
    const months = rows
      .map((row) => row.reporting_month || '')
      .filter(Boolean)
      .sort();

    if (!months.length) {
      return 'P01';
    }

    return this.toReportingPeriod(months[months.length - 1]);
  }

  private toReportingPeriod(monthValue: string): string {
    const [, month] = monthValue.split('-');
    const numericMonth = Number(month || 1);
    const safeMonth = Number.isFinite(numericMonth) ? Math.max(1, Math.min(12, numericMonth)) : 1;
    return `P${String(safeMonth).padStart(2, '0')}`;
  }

  private syncPspMappings(projectId: number, next: PspProject[]): Observable<unknown> {
    return this.projectApi
      .listPspMappings(new HttpParams().set('project', String(projectId)).set('page_size', '500'))
      .pipe(
        switchMap((response) => {
          const current = this.unwrapResults(response);
          const nextById = new Map(next.map((item) => [item.id, item]));
          const currentById = new Map(current.map((item) => [item.id, item]));

          const toDelete = current.filter((item) => !nextById.has(item.id));
          const toUpdate = next.filter((item) => currentById.has(item.id));
          const toCreate = next.filter((item) => !currentById.has(item.id));

          const requests: Array<Observable<unknown>> = [
            ...toDelete.map((item) => this.projectApi.deletePspMapping(item.id)),
            ...toUpdate.map((item) =>
              this.projectApi.updatePspMapping(item.id, {
                psp_element: item.name
              })
            ),
            ...toCreate.map((item) =>
              this.projectApi.createPspMapping({
                project: projectId,
                psp_element: item.name
              })
            )
          ];

          return requests.length ? forkJoin(requests) : of([]);
        })
      );
  }

  private mapRiskToUi(risk: ApiRisk): RiskEntry {
    const description = risk.description || risk.riskDescription || '';

    return {
      id: risk.id,
      title: risk.title || '',
      riskType: risk.type || '',
      potentialFinancialLoss: this.toRiskText(risk.loss_valuation),
      actionDueDate: risk.due_date || '',
      probability: risk.probability || '',
      severity: risk.severity || '',
      status: risk.state || '',
      riskDescription: description,
      action: risk.action || '',
      potentialFinancialLossAfter: this.toRiskText(risk.loss_after_action),
      probabilityAfter: risk.probability_after_action || '',
      severityAfter: risk.severity_after_action || '',
      statusAfter: risk.action_state || ''
    };
  }

  private toRiskText(value: string | number | null | undefined): string {
    if (value === null || value === undefined) {
      return '';
    }

    return String(value);
  }

  private mapRiskPatchToApi(field: keyof RiskEntry, value: string): Record<string, unknown> {
    const mapByField: Partial<Record<keyof RiskEntry, string>> = {
      title: 'title',
      riskType: 'type',
      potentialFinancialLoss: 'loss_valuation',
      actionDueDate: 'due_date',
      probability: 'probability',
      severity: 'severity',
      status: 'state',
      riskDescription: 'description',
      action: 'action',
      potentialFinancialLossAfter: 'loss_after_action',
      probabilityAfter: 'probability_after_action',
      severityAfter: 'severity_after_action',
      statusAfter: 'action_state'
    };

    const apiField = mapByField[field] || 'title';
    return { [apiField]: value };
  }

  private buildRiskHeatmap(entries: RiskEntry[]): RiskData['heatmap'] {
    const blankRow = { low: 0, medium: 0, high: 0, block: 0 };
    const blank = {
      high: { ...blankRow },
      medium: { ...blankRow },
      low: { ...blankRow }
    };

    const before = {
      high: { ...blankRow },
      medium: { ...blankRow },
      low: { ...blankRow }
    };
    const after = {
      high: { ...blankRow },
      medium: { ...blankRow },
      low: { ...blankRow }
    };

    for (const entry of entries) {
      const rowBefore = this.riskLevelToRow(entry.severity);
      const colBefore = this.riskLevelToColumn(entry.probability);
      before[rowBefore][colBefore] += 1;

      const rowAfter = this.riskLevelToRow(entry.severityAfter || entry.severity);
      const colAfter = this.riskLevelToColumn(entry.probabilityAfter || entry.probability);
      after[rowAfter][colAfter] += 1;
    }

    return {
      before: entries.length ? before : blank,
      after: entries.length ? after : blank
    };
  }

  private riskLevelToRow(value: string): 'low' | 'medium' | 'high' {
    const normalized = value.toLowerCase();
    if (normalized.includes('critical') || normalized.includes('high') || normalized === '3') return 'high';
    if (normalized.includes('medium') || normalized === '2') return 'medium';
    return 'low';
  }

  private riskLevelToColumn(value: string): 'low' | 'medium' | 'high' | 'block' {
    const normalized = value.toLowerCase();
    if (normalized.includes('block')) return 'block';
    if (normalized.includes('high') || normalized === '3') return 'high';
    if (normalized.includes('medium') || normalized === '2') return 'medium';
    return 'low';
  }

  private unique(values: string[]): string[] {
    return Array.from(new Set(values.filter((value) => !!value)));
  }

  private mapFileToUi(file: ApiFileEntry, projectId: number): FileEntry {
    const id = Number(file.id);
    const safeId = Number.isFinite(id) ? id : 0;
    const rawDownloadUrl = file.downloadUrl;
    const apiOrigin = new URL(UI_CONFIG.api.baseUrl).origin;

    let resolvedDownloadUrl = rawDownloadUrl;
    if (rawDownloadUrl && !rawDownloadUrl.startsWith('http://') && !rawDownloadUrl.startsWith('https://')) {
      resolvedDownloadUrl = `${apiOrigin}${rawDownloadUrl.startsWith('/') ? rawDownloadUrl : `/${rawDownloadUrl}`}`;
    }

    return {
      id: safeId,
      name: file.name,
      sizeBytes: file.sizeBytes,
      contentType: file.contentType,
      uploadedAt: file.uploadedAt,
      downloadUrl: resolvedDownloadUrl || `${UI_CONFIG.api.baseUrl}/projects/${projectId}/files/${safeId}/download`
    };
  }

  private toNumber(value: unknown): number {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : 0;
  }
}
