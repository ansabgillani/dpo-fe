export type CostSubView = 'overview' | 'monthly' | 'breakdown';
export type BreakdownMode = 'product' | 'project';
export type MonthlyDataType = 'actuals' | 'budget' | 'actuals+fc';

export interface CostSection {
  gross: number;
  chargingToBL: number;
  net: number;
}

export interface CostOverview {
  actuals: CostSection;
  budget: CostSection;
  forecasts: CostSection;
  forecastsPlusActuals: CostSection;
  barChart: {
    groups: string[];
    datasets: Array<{
      label: string;
      data: number[];
      color: string;
    }>;
  };
}

export interface CostPeriodRow {
  period: string;
  gross: number;
  chargingToBL: number;
  net: number;
}

export interface CostBreakdownProduct {
  id: string;
  name: string;
  target: number;
  actual: number;
  calculationDate: string;
  trendDirection: 'up' | 'down' | 'neutral';
  trendPercent: number;
}

export interface CostPeriodDetail {
  period: string;
  gross: number;
  chargingToInternal: number;
  ctCosts: number;
  externalMaterial: number;
  internalMaterial: number;
  chargingToBL: number;
  net: number;
}

export interface CostData {
  projectCost: number;
  latestReportingPeriod: string;
  project: string;
  fy: string;
  pspProject: string;
  breakdownMode: BreakdownMode;
  overview: CostOverview;
  monthly: {
    actuals: CostPeriodRow[];
    budget: CostPeriodRow[];
    forecastsPlusActuals: CostPeriodRow[];
  };
  breakdown: {
    products: CostBreakdownProduct[];
    lineChart: {
      budget: number[];
      actualsAndForecasts: number[];
      chargingActualsAndForecasts: number[];
    };
    periodDetail: CostPeriodDetail[];
  };
}

export interface CostFilters {
  project?: string;
  fy?: string;
  pspProject?: string;
  breakdownMode?: BreakdownMode;
}