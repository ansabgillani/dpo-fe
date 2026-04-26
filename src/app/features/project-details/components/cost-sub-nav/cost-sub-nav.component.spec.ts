import { ComponentFixture, TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it, jest } from '@jest/globals';

import { CostSubNavComponent } from './cost-sub-nav.component';

describe('CostSubNavComponent', () => {
  let component: CostSubNavComponent;
  let fixture: ComponentFixture<CostSubNavComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CostSubNavComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(CostSubNavComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('emits selected sub-view', () => {
    const spy = jest.spyOn(component.viewChange, 'emit');

    component.onSelect('monthly');

    expect(spy).toHaveBeenCalledWith('monthly');
  });
});