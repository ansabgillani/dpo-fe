import { ComponentFixture, TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it, jest } from '@jest/globals';

import { ConfirmDialogService } from '@core/services/confirm-dialog.service';
import { ConfirmDialogComponent } from './confirm-dialog.component';

describe('ConfirmDialogComponent', () => {
  let fixture: ComponentFixture<ConfirmDialogComponent>;
  let component: ConfirmDialogComponent;
  let confirmDialogService: ConfirmDialogService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConfirmDialogComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(ConfirmDialogComponent);
    component = fixture.componentInstance;
    confirmDialogService = TestBed.inject(ConfirmDialogService);
    fixture.detectChanges();
  });

  it('renders when dialog is open', () => {
    confirmDialogService.open({
      title: 'Confirm Delete',
      message: 'Delete this project?'
    });

    fixture.detectChanges();

    const overlay = fixture.nativeElement.querySelector('[data-cy="confirm-dialog-overlay"]');
    expect(overlay).toBeTruthy();
  });

  it('calls confirm on service', () => {
    const spy = jest.spyOn(confirmDialogService, 'confirm');

    component.onConfirm();

    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('calls cancel on service', () => {
    const spy = jest.spyOn(confirmDialogService, 'cancel');

    component.onCancel();

    expect(spy).toHaveBeenCalledTimes(1);
  });
});
