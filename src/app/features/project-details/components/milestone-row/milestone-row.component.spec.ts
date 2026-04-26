import { ComponentFixture, TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it, jest } from '@jest/globals';

import { MilestoneRowComponent } from './milestone-row.component';

describe('MilestoneRowComponent', () => {
  let component: MilestoneRowComponent;
  let fixture: ComponentFixture<MilestoneRowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MilestoneRowComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(MilestoneRowComponent);
    component = fixture.componentInstance;
    component.milestone = {
      id: 1,
      milestoneSet: 'MS-2025-A',
      name: 'Architecture Complete',
      startDate: '2025-02-01',
      endDate: '2025-02-18'
    };
    fixture.detectChanges();
  });

  it('renders date pickers and trend indicator', () => {
    const element = fixture.nativeElement as HTMLElement;

    expect(element.querySelector('[data-cy="milestone-start-date-1"]')).toBeTruthy();
    expect(element.querySelector('[data-cy="milestone-end-date-1"]')).toBeTruthy();
    expect(element.querySelector('[data-cy="milestone-trend-1"]')).toBeTruthy();
  });

  it('emits start date change', () => {
    const spy = jest.spyOn(component.startDateChange, 'emit');

    component.onStartDateSelected('2025-02-03');

    expect(spy).toHaveBeenCalledWith({ milestoneId: 1, date: '2025-02-03' });
  });

  it('emits end date change', () => {
    const spy = jest.spyOn(component.endDateChange, 'emit');

    component.onEndDateSelected('2025-02-20');

    expect(spy).toHaveBeenCalledWith({ milestoneId: 1, date: '2025-02-20' });
  });
});
