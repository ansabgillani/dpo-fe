import { ComponentFixture, TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';

import { ErrorModalService } from '@core/services/error-modal.service';
import { ErrorModalComponent } from './error-modal.component';

describe('ErrorModalComponent', () => {
  let fixture: ComponentFixture<ErrorModalComponent>;
  let component: ErrorModalComponent;
  let errorModalService: ErrorModalService;
  let router: jest.Mocked<Router>;

  beforeEach(async () => {
    router = {
      navigateByUrl: jest.fn(async () => true)
    } as unknown as jest.Mocked<Router>;

    await TestBed.configureTestingModule({
      imports: [ErrorModalComponent],
      providers: [{ provide: Router, useValue: router }]
    }).compileComponents();

    fixture = TestBed.createComponent(ErrorModalComponent);
    component = fixture.componentInstance;
    errorModalService = TestBed.inject(ErrorModalService);
    fixture.detectChanges();
  });

  it('renders when an error exists', () => {
    errorModalService.showError({
      level: 1,
      title: 'Error',
      message: 'Something failed'
    });
    fixture.detectChanges();

    const overlay = fixture.nativeElement.querySelector('[data-cy="error-modal-overlay"]');
    expect(overlay).toBeTruthy();
  });

  it('calls retry function when provided', () => {
    const retryFn = jest.fn();

    component.onPrimaryAction(undefined, retryFn);

    expect(retryFn).toHaveBeenCalledTimes(1);
    expect(router.navigateByUrl).not.toHaveBeenCalled();
  });

  it('navigates when redirectUrl is provided', async () => {
    component.onPrimaryAction('/projects');

    await Promise.resolve();
    expect(router.navigateByUrl).toHaveBeenCalledWith('/projects');
  });

  it('hides the modal when no retry or redirect exists', async () => {
    errorModalService.showError({
      level: 1,
      title: 'Error',
      message: 'Something failed'
    });

    component.onPrimaryAction();

    const current = await firstValueFrom(errorModalService.error$);
    expect(current).toBeNull();
  });
});
