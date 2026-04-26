import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';

import { getProbabilityOptions, getRiskTypeOptions, getSeverityOptions, getStatusOptions } from '@core/risk-field-configs';
import { RiskEntry, RiskFieldKey } from '@core/models/risk.model';
import { ButtonComponent } from '../../../../ui/base/button/button.component';
import { DatePickerComponent } from '../../../../ui/base/date-picker/date-picker.component';
import { IconComponent } from '../../../../ui/base/icon/icon.component';
import { InputComponent } from '../../../../ui/base/input/input.component';
import { SelectComponent, SelectOption } from '../../../../ui/base/select/select.component';

@Component({
  selector: 'dpo-risk-card',
  standalone: true,
  imports: [CommonModule, InputComponent, SelectComponent, DatePickerComponent, ButtonComponent, IconComponent],
  templateUrl: './risk-card.component.html',
  styleUrl: './risk-card.component.scss'
})
export class RiskCardComponent implements OnInit, OnChanges {
  @Input({ required: true }) risk!: RiskEntry;
  @Input() disabled = false;

  @Output() fieldSaved = new EventEmitter<{ riskId: number; field: RiskFieldKey; value: string }>();

  riskTypeOptions: SelectOption[] = [];
  probabilityOptions: SelectOption[] = [];
  severityOptions: SelectOption[] = [];
  statusOptions: SelectOption[] = [];
  editingField: RiskFieldKey | null = null;

  draft: Record<RiskFieldKey, string> = this.buildEmptyDraft();

  ngOnInit(): void {
    this.riskTypeOptions = getRiskTypeOptions();
    this.probabilityOptions = getProbabilityOptions();
    this.severityOptions = getSeverityOptions();
    this.statusOptions = getStatusOptions();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (!changes['risk'] || !this.risk) {
      return;
    }

    this.draft = this.buildDraft(this.risk);
    this.editingField = null;
  }

  isEditing(field: RiskFieldKey): boolean {
    return this.editingField === field;
  }

  onStartEdit(field: RiskFieldKey): void {
    if (this.disabled) {
      return;
    }

    if (this.editingField && this.editingField !== field) {
      this.restoreDraftForField(this.editingField);
    }

    this.editingField = field;
  }

  onValueChange(field: RiskFieldKey, value: string): void {
    this.draft[field] = value;
  }

  onSave(field: RiskFieldKey): void {
    this.fieldSaved.emit({
      riskId: this.risk.id,
      field,
      value: this.draft[field]
    });

    if (this.editingField === field) {
      this.editingField = null;
    }
  }

  private restoreDraftForField(field: RiskFieldKey): void {
    this.draft[field] = this.risk?.[field] || '';
  }

  private buildDraft(risk: RiskEntry): Record<RiskFieldKey, string> {
    return {
      title: risk.title || '',
      riskType: risk.riskType || '',
      potentialFinancialLoss: risk.potentialFinancialLoss || '',
      actionDueDate: risk.actionDueDate || '',
      probability: risk.probability || '',
      severity: risk.severity || '',
      status: risk.status || '',
      riskDescription: risk.riskDescription || '',
      action: risk.action || '',
      potentialFinancialLossAfter: risk.potentialFinancialLossAfter || '',
      probabilityAfter: risk.probabilityAfter || '',
      severityAfter: risk.severityAfter || '',
      statusAfter: risk.statusAfter || ''
    };
  }

  private buildEmptyDraft(): Record<RiskFieldKey, string> {
    return {
      title: '',
      riskType: '',
      potentialFinancialLoss: '',
      actionDueDate: '',
      probability: '',
      severity: '',
      status: '',
      riskDescription: '',
      action: '',
      potentialFinancialLossAfter: '',
      probabilityAfter: '',
      severityAfter: '',
      statusAfter: ''
    };
  }
}
