export interface PspProject {
  id: number;
  name: string;
}

export interface ProjectSummary {
  id: number;
  name: string;
  avatarUrl?: string;
  department: string;
  businessLine: string;
  type: string;
  startDate: string;
  endDate: string;
  statusProject: string;
  pspProjects: PspProject[];
}

export interface FilterOptions {
  departments: string[];
  businessLines: string[];
  types: string[];
}

export interface FilterValues {
  department: string;
  businessLine: string;
  type: string;
}

export interface CreateProjectPayload {
  title: string;
  department: string;
  businessLine: string;
  type: string;
  startDate: string;
  endDate: string;
  avatarUrl?: string;
  pspElements?: string[];
}

export const DEFAULT_FILTER_VALUES: FilterValues = {
  department: '',
  businessLine: '',
  type: ''
};
