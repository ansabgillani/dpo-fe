import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { UI_CONFIG } from '../ui-config';
import {
  ApiCostProject,
  ApiFileEntry,
  ApiMilestone,
  ApiOverviewChartResponse,
  ApiProduct,
  ApiProductCost,
  ApiProject,
  ApiProjectFilterOptions,
  ApiPspMapping,
  ApiRisk,
  ApiStatus,
  PaginatedResponse
} from './api.models';

@Injectable({ providedIn: 'root' })
export class ProjectApiService {
  constructor(private readonly http: HttpClient) {}

  getProjectFilters(): Observable<ApiProjectFilterOptions> {
    return this.http.get<ApiProjectFilterOptions>(`${UI_CONFIG.api.baseUrl}/filters/projects`);
  }

  listProjects(params: HttpParams): Observable<PaginatedResponse<ApiProject> | ApiProject[]> {
    return this.http.get<PaginatedResponse<ApiProject> | ApiProject[]>(`${UI_CONFIG.api.baseUrl}/projects/`, { params });
  }

  getProject(id: number): Observable<ApiProject> {
    return this.http.get<ApiProject>(`${UI_CONFIG.api.baseUrl}/projects/${id}/`);
  }

  createProject(payload: Record<string, unknown>): Observable<ApiProject> {
    return this.http.post<ApiProject>(`${UI_CONFIG.api.baseUrl}/projects/`, payload);
  }

  updateProject(id: number, payload: Record<string, unknown>): Observable<unknown> {
    return this.http.patch(`${UI_CONFIG.api.baseUrl}/projects/${id}/`, payload);
  }

  getProjectOverviewChart(id: number): Observable<ApiOverviewChartResponse> {
    return this.http.get<ApiOverviewChartResponse>(`${UI_CONFIG.api.baseUrl}/projects/${id}/overview-chart`);
  }

  listPspMappings(params: HttpParams): Observable<PaginatedResponse<ApiPspMapping> | ApiPspMapping[]> {
    return this.http.get<PaginatedResponse<ApiPspMapping> | ApiPspMapping[]>(`${UI_CONFIG.api.baseUrl}/psp-mappings/`, { params });
  }

  createPspMapping(payload: { project: number; psp_element: string }): Observable<unknown> {
    return this.http.post(`${UI_CONFIG.api.baseUrl}/psp-mappings/`, payload);
  }

  updatePspMapping(id: number, payload: { psp_element: string }): Observable<unknown> {
    return this.http.patch(`${UI_CONFIG.api.baseUrl}/psp-mappings/${id}/`, payload);
  }

  deletePspMapping(id: number): Observable<unknown> {
    return this.http.delete(`${UI_CONFIG.api.baseUrl}/psp-mappings/${id}/`);
  }

  listStatuses(params: HttpParams): Observable<PaginatedResponse<ApiStatus> | ApiStatus[]> {
    return this.http.get<PaginatedResponse<ApiStatus> | ApiStatus[]>(`${UI_CONFIG.api.baseUrl}/statuses/`, { params });
  }

  createStatus(payload: Record<string, unknown>): Observable<unknown> {
    return this.http.post(`${UI_CONFIG.api.baseUrl}/statuses/`, payload);
  }

  updateStatus(id: number, payload: Record<string, unknown>): Observable<unknown> {
    return this.http.patch(`${UI_CONFIG.api.baseUrl}/statuses/${id}/`, payload);
  }

  listMilestones(params: HttpParams): Observable<PaginatedResponse<ApiMilestone> | ApiMilestone[]> {
    return this.http.get<PaginatedResponse<ApiMilestone> | ApiMilestone[]>(`${UI_CONFIG.api.baseUrl}/milestones/`, { params });
  }

  updateMilestone(id: number, payload: Record<string, unknown>): Observable<unknown> {
    return this.http.patch(`${UI_CONFIG.api.baseUrl}/milestones/${id}/`, payload);
  }

  listCostProjects(params: HttpParams): Observable<PaginatedResponse<ApiCostProject> | ApiCostProject[]> {
    return this.http.get<PaginatedResponse<ApiCostProject> | ApiCostProject[]>(`${UI_CONFIG.api.baseUrl}/cost-projects/`, { params });
  }

  listProducts(params: HttpParams): Observable<PaginatedResponse<ApiProduct> | ApiProduct[]> {
    return this.http.get<PaginatedResponse<ApiProduct> | ApiProduct[]>(`${UI_CONFIG.api.baseUrl}/products/`, { params });
  }

  listProductCosts(params: HttpParams): Observable<PaginatedResponse<ApiProductCost> | ApiProductCost[]> {
    return this.http.get<PaginatedResponse<ApiProductCost> | ApiProductCost[]>(`${UI_CONFIG.api.baseUrl}/product-costs/`, { params });
  }

  updateProductCost(id: string, payload: Record<string, unknown>): Observable<unknown> {
    return this.http.patch(`${UI_CONFIG.api.baseUrl}/product-costs/${id}/`, payload);
  }

  listRisks(params: HttpParams): Observable<PaginatedResponse<ApiRisk> | ApiRisk[]> {
    return this.http.get<PaginatedResponse<ApiRisk> | ApiRisk[]>(`${UI_CONFIG.api.baseUrl}/risks/`, { params });
  }

  createRisk(payload: Record<string, unknown>): Observable<unknown> {
    return this.http.post(`${UI_CONFIG.api.baseUrl}/risks/`, payload);
  }

  updateRisk(id: number, payload: Record<string, unknown>): Observable<unknown> {
    return this.http.patch(`${UI_CONFIG.api.baseUrl}/risks/${id}/`, payload);
  }

  listFiles(projectId: number): Observable<ApiFileEntry[]> {
    return this.http.get<ApiFileEntry[]>(`${UI_CONFIG.api.baseUrl}/projects/${projectId}/files`);
  }

  uploadFile(projectId: number, data: FormData): Observable<unknown> {
    return this.http.post(`${UI_CONFIG.api.baseUrl}/projects/${projectId}/files`, data);
  }

  deleteFile(projectId: number, fileId: number): Observable<unknown> {
    return this.http.delete(`${UI_CONFIG.api.baseUrl}/projects/${projectId}/files/${fileId}`);
  }
}
