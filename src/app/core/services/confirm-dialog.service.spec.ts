import { TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it } from '@jest/globals';

import { ConfirmDialogService } from './confirm-dialog.service';

describe('ConfirmDialogService', () => {
  let service: ConfirmDialogService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ConfirmDialogService);
  });

  it('emits true on confirm', (done) => {
    service.open({ title: 'Confirm', message: 'Proceed?' }).subscribe((result) => {
      expect(result).toBe(true);
      done();
    });

    service.confirm();
  });

  it('emits false on cancel', (done) => {
    service.open({ title: 'Confirm', message: 'Proceed?' }).subscribe((result) => {
      expect(result).toBe(false);
      done();
    });

    service.cancel();
  });
});
