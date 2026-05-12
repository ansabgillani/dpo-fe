export interface TokenPair {
  access: string;
  refresh: string;
}

export interface ApiMeUser {
  id: number;
  username: string;
  full_name?: string;
  roles?: string;
}

export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

export interface ApiProject {
  id: number;
  title: string;
  type: string;
  business_line: string;
  department: string;
  market?: string;
  global_project?: boolean;
  start_date: string;
  end_date: string;
  display_image?: string | null;
  is_active?: string;
}

export interface ApiProjectFilterOptions {
  department?: string[];
  business_line?: string[];
  type?: string[];
}

export interface ApiMilestone {
  id: number;
  project: number;
  name: string;
  type?: string;
  description?: string;
  status?: string;
  start_date: string;
  proposed_end_date?: string | null;
  end_date: string;
}

export interface ApiRisk {
  id: number;
  project: number;
  title: string;
  type?: string;
  state?: string;
  probability?: string;
  severity?: string;
  loss_valuation?: string | number | null;
  description?: string;
  riskDescription?: string;
  action?: string;
  action_state?: string;
  due_date?: string | null;
  severity_after_action?: string | null;
  probability_after_action?: string | null;
  loss_after_action?: string | number | null;
}

export interface ApiStatus {
  id: number;
  project: number;
  name: string;
  value: string;
  description: string;
}

export interface ApiOverviewChartSeries {
  reportingMonth: string;
  gross: number;
  net: number;
  manpower: number;
}

export interface ApiOverviewChartResponse {
  series: ApiOverviewChartSeries[];
  totals?: {
    gross?: number;
    net?: number;
    manpower?: number;
  };
}

export interface ApiFileEntry {
  id: number;
  name: string;
  sizeBytes: number;
  contentType: string;
  uploadedAt: string;
  downloadUrl: string;
}

export interface ApiPspMapping {
  id: number;
  project: number;
  psp_element: string;
}

export interface ApiCostProject {
  id: number;
  fiscal_year: string;
  psp_element: string;
  project_title?: string | null;
  stand_reporting_period?: string | null;
  category?: string | null;
  status?: string | null;
  period_index?: number | null;
  created?: string | null;
  breakdown?: ApiCostBreakdown[] | null;
}

export interface ApiCostBreakdown {
  id: number;
  psp_project?: number;
  type?: string | null;
  reporting_month?: string | number | null;
  gross?: string | null;
  charging_to_bl?: string | null;
  net?: string | null;
  charging_internal?: string | null;
  ct_costs?: string | null;
  external_material?: string | null;
  internal_material?: string | null;
}

export interface ApiProduct {
  id: number;
  project: number;
  name: string;
}

export interface ApiProductCost {
  id: number;
  product: number;
  target: string;
  actual: string;
  calculation_date: string;
}
