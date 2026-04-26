import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DatePickerComponent } from './date-picker.component';

describe('DatePickerComponent', () => {
  let component: DatePickerComponent;
  let fixture: ComponentFixture<DatePickerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [DatePickerComponent] }).compileComponents();
    fixture = TestBed.createComponent(DatePickerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('emits selected date', () => {
    const spy = jest.fn();
    component.dateSelected.subscribe(spy);

    const event = { target: { value: '2026-03-30' } } as unknown as Event;
    component.onChange(event);

    expect(spy).toHaveBeenCalledWith('2026-03-30');
  });
});
