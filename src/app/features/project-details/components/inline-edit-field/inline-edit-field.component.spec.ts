import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Subject, throwError } from 'rxjs';
import { beforeEach, describe, expect, it, jest } from '@jest/globals';

import { InlineEditFieldComponent } from './inline-edit-field.component';

describe('InlineEditFieldComponent', () => {
  let component: InlineEditFieldComponent;
  let fixture: ComponentFixture<InlineEditFieldComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InlineEditFieldComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(InlineEditFieldComponent);
    component = fixture.componentInstance;
    component.fieldKey = 'department';
    component.label = 'Department';
    component.value = 'DIC';
    fixture.detectChanges();
  });

  it('moves from display to editing', () => {
    component.onEditStart();

    expect(component.state).toBe('editing');
    expect(component.draftValue).toBe('DIC');
  });

  it('enters saving state until save resolves', () => {
    const saveSubject = new Subject<void>();
    component.saveFn = () => saveSubject.asObservable();

    component.onEditStart();
    component.onDraftChange('DAS');
    component.onConfirm();

    expect(component.state).toBe('saving');

    saveSubject.next();
    saveSubject.complete();

    expect(component.state).toBe('display');
    expect(component.value).toBe('DAS');
  });

  it('returns to display when cancelled', () => {
    component.onEditStart();
    component.onDraftChange('LMS');

    component.onCancel();

    expect(component.state).toBe('display');
    expect(component.draftValue).toBe('DIC');
  });

  it('transitions to error and emits saveFailed on save error', () => {
    const failedSpy = jest.spyOn(component.saveFailed, 'emit');
    component.saveFn = () => throwError(() => new Error('save failed'));

    component.onEditStart();
    component.onDraftChange('DAS');
    component.onConfirm();

    expect(component.state).toBe('error');
    expect(failedSpy).toHaveBeenCalledWith('department');
  });
});
