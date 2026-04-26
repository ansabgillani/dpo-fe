import { ComponentFixture, TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it, jest } from '@jest/globals';

import { CostTableComponent } from './cost-table.component';

describe('CostTableComponent', () => {
  let component: CostTableComponent;
  let fixture: ComponentFixture<CostTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CostTableComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(CostTableComponent);
    component = fixture.componentInstance;
    component.rows = [{ period: 'P01', gross: 100, chargingToBL: 80, net: 70 }];
    fixture.detectChanges();
  });

  it('emits dataset toggle selection', () => {
    const spy = jest.spyOn(component.dataTypeChange, 'emit');

    component.onToggle('budget');

    expect(spy).toHaveBeenCalledWith('budget');
  });

  it('renders monthly rows', () => {
    const element = fixture.nativeElement as HTMLElement;
    expect(element.textContent).toContain('P01');
    expect(element.textContent).toContain('100k€');
  });
});