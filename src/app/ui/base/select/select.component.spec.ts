import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectComponent } from './select.component';

describe('SelectComponent', () => {
  let component: SelectComponent;
  let fixture: ComponentFixture<SelectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [SelectComponent] }).compileComponents();
    fixture = TestBed.createComponent(SelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('emits selected value', () => {
    const spy = jest.fn();
    component.valueChange.subscribe(spy);

    const event = { target: { value: 'x' } } as unknown as Event;
    component.onChange(event);

    expect(spy).toHaveBeenCalledWith('x');
  });

  it('uses all option when includeAllOption is enabled and input value is empty', () => {
    component.options = [
      { label: 'DIC', value: 'DIC' },
      { label: 'DAS', value: 'DAS' }
    ];
    component.includeAllOption = true;
    component.value = '';
    fixture.detectChanges();

    expect(component.selectedValue).toBe('');
  });

  it('keeps selected value when it exists in options', () => {
    component.options = [
      { label: 'DIC', value: 'DIC' },
      { label: 'DAS', value: 'DAS' }
    ];
    component.includeAllOption = true;
    component.value = 'DIC';
    fixture.detectChanges();

    expect(component.selectedValue).toBe('DIC');
  });

  it('does not snap back to all after selecting a concrete option', () => {
    component.options = [
      { label: 'DIC', value: 'DIC' },
      { label: 'DAS', value: 'DAS' }
    ];
    component.includeAllOption = true;
    component.value = '';
    fixture.detectChanges();

    const event = { target: { value: 'DAS' } } as unknown as Event;
    component.onChange(event);

    component.options = [
      { label: 'DIC', value: 'DIC' },
      { label: 'DAS', value: 'DAS' }
    ];
    fixture.detectChanges();

    expect(component.selectedValue).toBe('DAS');
  });
});
