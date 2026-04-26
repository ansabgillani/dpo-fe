export type RiskLevel = 'low' | 'medium' | 'high' | 'block';

export interface RiskHeatmapRow {
  low: number;
  medium: number;
  high: number;
  block: number;
}

export interface RiskHeatmapGrid {
  high: RiskHeatmapRow;
  medium: RiskHeatmapRow;
  low: RiskHeatmapRow;
}

export interface RiskHeatmap {
  before: RiskHeatmapGrid;
  after: RiskHeatmapGrid;
}

export interface RiskEntry {
  id: number;
  title: string;
  riskType: string;
  potentialFinancialLoss: string;
  actionDueDate: string;
  probability: string;
  severity: string;
  status: string;
  riskDescription: string;
  action: string;
  potentialFinancialLossAfter: string;
  probabilityAfter: string;
  severityAfter: string;
  statusAfter: string;
}

export interface RiskData {
  heatmap: RiskHeatmap;
  risks: RiskEntry[];
}

export type RiskFieldKey =
  | 'title'
  | 'riskType'
  | 'potentialFinancialLoss'
  | 'actionDueDate'
  | 'probability'
  | 'severity'
  | 'status'
  | 'riskDescription'
  | 'action'
  | 'potentialFinancialLossAfter'
  | 'probabilityAfter'
  | 'severityAfter'
  | 'statusAfter';
