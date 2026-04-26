import { TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it } from '@jest/globals';

import { DEFAULT_FILTER_VALUES } from '@core/models/project.model';
import { FilterStateService } from './filter-state.service';

describe('FilterStateService', () => {
  let service: FilterStateService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FilterStateService);
  });

  it('stores and returns filter values', () => {
    service.setFilterValues({ department: 'DIC', businessLine: 'XP', type: 'SSP' });

    expect(service.getFilterValues()).toEqual({
      department: 'DIC',
      businessLine: 'XP',
      type: 'SSP'
    });
  });

  it('stores selected project id', () => {
    service.setSelectedProjectId(10);

    expect(service.getSelectedProjectId()).toBe(10);
  });

  it('resets values', () => {
    service.setFilterValues({ department: 'DIC', businessLine: 'XP', type: 'SSP' });
    service.setSelectedProjectId(12);

    service.reset();

    expect(service.getFilterValues()).toEqual(DEFAULT_FILTER_VALUES);
    expect(service.getSelectedProjectId()).toBeNull();
  });
});
