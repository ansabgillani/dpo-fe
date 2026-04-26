import { ComponentFixture, TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it, jest } from '@jest/globals';

import { CreateProjectModalComponent } from './create-project-modal.component';

describe('CreateProjectModalComponent', () => {
  let component: CreateProjectModalComponent;
  let fixture: ComponentFixture<CreateProjectModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateProjectModalComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(CreateProjectModalComponent);
    component = fixture.componentInstance;
    component.open = true;
    component.options = {
      departments: ['DIC'],
      businessLines: ['XP'],
      types: ['SSP']
    };
    fixture.detectChanges();
  });

  it('creates', () => {
    expect(component).toBeTruthy();
  });

  it('emits cancel when cancel is clicked', () => {
    const cancelSpy = jest.spyOn(component.cancel, 'emit');

    component.onCancelClick();

    expect(cancelSpy).toHaveBeenCalled();
  });

  it('does not emit create when required fields are missing', () => {
    const createSpy = jest.spyOn(component.create, 'emit');

    component.onCreateClick();

    expect(createSpy).not.toHaveBeenCalled();
  });

  it('emits create payload when required fields are populated', () => {
    const createSpy = jest.spyOn(component.create, 'emit');

    component.onTitleChange('New Platform Project');
    component.onDepartmentChange('DIC');
    component.onBusinessLineChange('XP');
    component.onTypeChange('SSP');
    component.onStartDateChange('2026-01-01');
    component.onEndDateChange('2026-12-31');
    component.onPspDraftChange('PSP-100');
    component.onAddPspElement();

    component.onCreateClick();

    expect(createSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        title: 'New Platform Project',
        department: 'DIC',
        businessLine: 'XP',
        type: 'SSP',
        startDate: '2026-01-01',
        endDate: '2026-12-31',
        pspElements: ['PSP-100']
      })
    );
  });
});
