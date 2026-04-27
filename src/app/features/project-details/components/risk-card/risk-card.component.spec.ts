import { ComponentFixture, TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it, jest } from '@jest/globals';

import * as riskConfigs from '@core/risk-field-configs';
import { RiskCardComponent } from './risk-card.component';

describe('RiskCardComponent', () => {
  let component: RiskCardComponent;
  let fixture: ComponentFixture<RiskCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RiskCardComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(RiskCardComponent);
    component = fixture.componentInstance;
    component.risk = {
      id: 1,
      title: 'Resource bottleneck',
      riskType: 'Ressources',
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
    };

    fixture.detectChanges();
  });

  it('loads risk field config options on init', () => {
    expect(component.riskTypeOptions).toEqual(riskConfigs.getRiskTypeOptions());
    expect(component.probabilityOptions).toEqual(riskConfigs.getProbabilityOptions());
    expect(component.severityOptions).toEqual(riskConfigs.getSeverityOptions());
    expect(component.statusOptions).toEqual(riskConfigs.getStatusOptions());
  });

  it('renders correct control types per field', () => {
    const element = fixture.nativeElement as HTMLElement;

    expect(element.querySelector('[data-cy="risk-pfl-input-1"]')?.tagName).toBe('INPUT');
    expect(element.querySelector('[data-cy="risk-type-select-1"]')?.tagName).toBe('SELECT');
    expect(element.querySelector('[data-cy="risk-action-due-1"] input')).toBeTruthy();
    expect(element.querySelector('[data-cy="risk-description-input-1"]')?.tagName).toBe('TEXTAREA');
  });

  it('emits fieldSaved on confirm', () => {
    const spy = jest.spyOn(component.fieldSaved, 'emit');

    component.onValueChange('potentialFinancialLoss', '140000');
    component.onSave('potentialFinancialLoss');

    expect(spy).toHaveBeenCalledWith({
      riskId: 1,
      field: 'potentialFinancialLoss',
      value: '140000'
    });
  });

  it('emits fieldSaved for PFL after action', () => {
    const spy = jest.spyOn(component.fieldSaved, 'emit');

    component.onValueChange('potentialFinancialLossAfter', '90000');
    component.onSave('potentialFinancialLossAfter');

    expect(spy).toHaveBeenCalledWith({
      riskId: 1,
      field: 'potentialFinancialLossAfter',
      value: '90000'
    });
  });

  it('shows edit button first and save button only in risk description edit mode', () => {
    let element = fixture.nativeElement as HTMLElement;
    expect(element.querySelector('[data-cy="risk-description-edit-1"]')).toBeTruthy();
    expect(element.querySelector('[data-cy="risk-description-save-1"]')).toBeNull();

    component.onStartEdit('riskDescription');
    fixture.detectChanges();

    element = fixture.nativeElement as HTMLElement;
    expect(element.querySelector('[data-cy="risk-description-edit-1"]')).toBeNull();
    expect(element.querySelector('[data-cy="risk-description-save-1"]')).toBeTruthy();
  });

  it('exits risk description edit mode after save', () => {
    component.onStartEdit('riskDescription');
    component.onSave('riskDescription');

    expect(component.editingField).toBeNull();
  });

  it('shows save only for the actively edited field', () => {
    component.onStartEdit('status');
    fixture.detectChanges();

    const element = fixture.nativeElement as HTMLElement;
    expect(element.querySelector('[data-cy="risk-status-save-1"]')).toBeTruthy();
    expect(element.querySelector('[data-cy="risk-pfl-save-1"]')).toBeNull();
    expect(element.querySelector('[data-cy="risk-pfl-edit-1"]')).toBeTruthy();
  });
});
