import { ComponentFixture, TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it, jest } from '@jest/globals';

import { FilterPanelComponent } from './filter-panel.component';

describe('FilterPanelComponent', () => {
  let component: FilterPanelComponent;
  let fixture: ComponentFixture<FilterPanelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FilterPanelComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(FilterPanelComponent);
    component = fixture.componentInstance;
    component.options = {
      departments: ['DIC'],
      businessLines: ['XP'],
      types: ['SSP']
    };
    fixture.detectChanges();
  });

  it('emits changed values when department changes', () => {
    const emitSpy = jest.spyOn(component.valuesChange, 'emit');

    component.onDepartmentChange('DIC');

    expect(emitSpy).toHaveBeenCalledWith({
      ...component.values,
      department: 'DIC'
    });
  });

  it('emits search and reset actions', () => {
    const searchSpy = jest.spyOn(component.search, 'emit');
    const resetSpy = jest.spyOn(component.reset, 'emit');

    component.onSearch();
    component.onReset();

    expect(searchSpy).toHaveBeenCalled();
    expect(resetSpy).toHaveBeenCalled();
  });
});
