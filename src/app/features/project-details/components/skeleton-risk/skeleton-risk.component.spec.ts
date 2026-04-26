import { ComponentFixture, TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it } from '@jest/globals';

import { SkeletonRiskComponent } from './skeleton-risk.component';

describe('SkeletonRiskComponent', () => {
  let fixture: ComponentFixture<SkeletonRiskComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SkeletonRiskComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(SkeletonRiskComponent);
    fixture.detectChanges();
  });

  it('renders the skeleton container', () => {
    const element = fixture.nativeElement as HTMLElement;
    expect(element.querySelector('[data-cy="skeleton-risk"]')).toBeTruthy();
  });
});
