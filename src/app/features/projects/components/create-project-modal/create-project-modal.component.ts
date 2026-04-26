import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges, ViewChild } from '@angular/core';

import { CreateProjectPayload, FilterOptions } from '@core/models/project.model';
import { ButtonComponent } from '../../../../ui/base/button/button.component';
import { DatePickerComponent } from '../../../../ui/base/date-picker/date-picker.component';
import { FileInputComponent } from '../../../../ui/base/file-input/file-input.component';
import { IconComponent } from '../../../../ui/base/icon/icon.component';
import { InputComponent } from '../../../../ui/base/input/input.component';
import { SelectComponent, SelectOption } from '../../../../ui/base/select/select.component';

interface CreateProjectFormState {
  title: string;
  department: string;
  businessLine: string;
  type: string;
  startDate: string;
  endDate: string;
}

@Component({
  selector: 'dpo-create-project-modal',
  standalone: true,
  imports: [
    CommonModule,
    ButtonComponent,
    InputComponent,
    SelectComponent,
    DatePickerComponent,
    FileInputComponent,
    IconComponent
  ],
  templateUrl: './create-project-modal.component.html',
  styleUrl: './create-project-modal.component.scss'
})
export class CreateProjectModalComponent implements OnChanges {
  @Input() open = false;
  @Input() saving = false;
  @Input() options: FilterOptions = {
    departments: [],
    businessLines: [],
    types: []
  };

  @Output() cancel = new EventEmitter<void>();
  @Output() create = new EventEmitter<CreateProjectPayload>();

  @ViewChild(FileInputComponent) private fileInput?: FileInputComponent;

  form: CreateProjectFormState = this.createInitialFormState();
  pspDraft = '';
  pspElements: string[] = [];

  imageName = '';
  private imageDataUrl = '';

  showValidation = false;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['open']?.currentValue) {
      this.resetForm();
    }
  }

  get departmentOptions(): SelectOption[] {
    return this.options.departments.map((value) => ({ label: value, value }));
  }

  get businessLineOptions(): SelectOption[] {
    return this.options.businessLines.map((value) => ({ label: value, value }));
  }

  get typeOptions(): SelectOption[] {
    return this.options.types.map((value) => ({ label: value, value }));
  }

  get isCreateDisabled(): boolean {
    return this.saving || !this.isValid;
  }

  onTitleChange(value: string): void {
    this.form = { ...this.form, title: value };
  }

  onDepartmentChange(value: string): void {
    this.form = { ...this.form, department: value };
  }

  onBusinessLineChange(value: string): void {
    this.form = { ...this.form, businessLine: value };
  }

  onTypeChange(value: string): void {
    this.form = { ...this.form, type: value };
  }

  onStartDateChange(value: string): void {
    this.form = { ...this.form, startDate: value };
  }

  onEndDateChange(value: string): void {
    this.form = { ...this.form, endDate: value };
  }

  onPspDraftChange(value: string): void {
    this.pspDraft = value;
  }

  onAddPspElement(): void {
    const value = this.pspDraft.trim();

    if (!value) {
      return;
    }

    this.pspElements = [...this.pspElements, value];
    this.pspDraft = '';
  }

  onRemovePspElement(index: number): void {
    this.pspElements = this.pspElements.filter((_, pspIndex) => pspIndex !== index);
  }

  onPickImageClick(): void {
    this.fileInput?.open();
  }

  onImageSelected(file: File): void {
    this.imageName = file.name;

    const reader = new FileReader();
    reader.onload = () => {
      this.imageDataUrl = typeof reader.result === 'string' ? reader.result : '';
    };
    reader.readAsDataURL(file);
  }

  onCancelClick(): void {
    if (this.saving) {
      return;
    }

    this.cancel.emit();
  }

  onCreateClick(): void {
    this.showValidation = true;

    if (!this.isValid) {
      return;
    }

    this.create.emit({
      title: this.form.title.trim(),
      department: this.form.department,
      businessLine: this.form.businessLine,
      type: this.form.type,
      startDate: this.form.startDate,
      endDate: this.form.endDate,
      avatarUrl: this.imageDataUrl || undefined,
      pspElements: [...this.pspElements]
    });
  }

  shouldShowError(value: string): boolean {
    return this.showValidation && !value.trim();
  }

  private get isValid(): boolean {
    return !!(
      this.form.title.trim() &&
      this.form.department &&
      this.form.businessLine &&
      this.form.type &&
      this.form.startDate &&
      this.form.endDate
    );
  }

  private resetForm(): void {
    this.form = this.createInitialFormState();
    this.pspDraft = '';
    this.pspElements = [];
    this.imageName = '';
    this.imageDataUrl = '';
    this.showValidation = false;
  }

  private createInitialFormState(): CreateProjectFormState {
    return {
      title: '',
      department: '',
      businessLine: '',
      type: '',
      startDate: '',
      endDate: ''
    };
  }
}
