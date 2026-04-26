import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

import { DEFAULT_FILTER_VALUES, FilterValues } from '@core/models/project.model';

@Injectable({
  providedIn: 'root'
})
export class FilterStateService {
  private readonly filterValuesSubject = new BehaviorSubject<FilterValues>({
    ...DEFAULT_FILTER_VALUES
  });
  private readonly selectedProjectIdSubject = new BehaviorSubject<number | null>(null);

  readonly filterValues$: Observable<FilterValues> = this.filterValuesSubject.asObservable();
  readonly selectedProjectId$: Observable<number | null> = this.selectedProjectIdSubject.asObservable();

  getFilterValues(): FilterValues {
    return this.filterValuesSubject.value;
  }

  setFilterValues(values: FilterValues): void {
    this.filterValuesSubject.next({ ...values });
  }

  getSelectedProjectId(): number | null {
    return this.selectedProjectIdSubject.value;
  }

  setSelectedProjectId(projectId: number | null): void {
    this.selectedProjectIdSubject.next(projectId);
  }

  reset(): void {
    this.setFilterValues(DEFAULT_FILTER_VALUES);
    this.setSelectedProjectId(null);
  }
}
