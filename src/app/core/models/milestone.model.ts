export interface MilestoneItem {
  id: number;
  milestoneSet: string;
  name: string;
  type?: string;
  description?: string;
  status?: string;
  proposedEndDate?: string;
  startDate: string;
  endDate: string;
}
