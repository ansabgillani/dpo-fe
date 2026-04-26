import { ComponentFixture, TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { of } from 'rxjs';

import { ProjectService } from '@core/services/project.service';
import { RiskTabComponent } from './risk-tab.component';

describe('RiskTabComponent', () => {
  let component: RiskTabComponent;
  let fixture: ComponentFixture<RiskTabComponent>;

  const riskData = {
    heatmap: {
      before: {
        high: { low: 0, medium: 1, high: 2, block: 0 },
        medium: { low: 1, medium: 2, high: 1, block: 0 },
        low: { low: 2, medium: 1, high: 0, block: 1 }
      },
      after: {
        high: { low: 1, medium: 1, high: 1, block: 0 },
        medium: { low: 2, medium: 1, high: 0, block: 0 },
        low: { low: 3, medium: 1, high: 0, block: 0 }
      }
    },
    risks: [
      {
        id: 11,
        title: 'Resource bottleneck',
        riskType: 'resource',
        potentialFinancialLoss: '120000',
        actionDueDate: '2025-06-01',
        probability: 'high',
        severity: 'critical',
        status: 'open',
        riskDescription: 'Staffing constraints may delay delivery.',
        action: 'Backfill contract roles.',
        potentialFinancialLossAfter: '80000',
        probabilityAfter: 'medium',
        severityAfter: 'high',
        statusAfter: 'in-progress'
      }
    ]
  };

  const projectService = {
    getRisks: jest.fn(() => of(riskData)),
    updateRisk: jest.fn(() => of(riskData)),
    addRisk: jest.fn(() => of(riskData))
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RiskTabComponent],
      providers: [{ provide: ProjectService, useValue: projectService }]
    }).compileComponents();

    fixture = TestBed.createComponent(RiskTabComponent);
    component = fixture.componentInstance;
    component.projectId = 1;
    fixture.detectChanges();
  });

  it('fetches risks when projectId is set', () => {
    expect(projectService.getRisks).toHaveBeenCalledWith(1, undefined);
    expect(component.riskData.risks).toHaveLength(1);
  });

  it('updates risk on field save', () => {
    component.onRiskFieldSaved({ riskId: 11, field: 'status', value: 'closed' });
    expect(projectService.updateRisk).toHaveBeenCalledWith(1, 11, 'status', 'closed', undefined);
  });
});
