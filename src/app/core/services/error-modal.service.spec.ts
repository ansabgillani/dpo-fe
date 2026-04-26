import { TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it } from '@jest/globals';
import { firstValueFrom } from 'rxjs';

import { ErrorModalService } from './error-modal.service';

describe('ErrorModalService', () => {
  let service: ErrorModalService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ErrorModalService);
  });

  it('shows and hides error state', async () => {
    service.showError({ level: 1, title: 'Error', message: 'Failed' });
    const shown = await firstValueFrom(service.error$);
    expect(shown?.title).toBe('Error');

    service.hide();
    const hidden = await firstValueFrom(service.error$);
    expect(hidden).toBeNull();
  });
});
