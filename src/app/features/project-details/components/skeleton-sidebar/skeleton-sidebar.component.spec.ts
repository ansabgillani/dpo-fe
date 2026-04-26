import { ComponentFixture, TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it } from '@jest/globals';

import { SkeletonSidebarComponent } from './skeleton-sidebar.component';

describe('SkeletonSidebarComponent', () => {
  let fixture: ComponentFixture<SkeletonSidebarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SkeletonSidebarComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(SkeletonSidebarComponent);
    fixture.detectChanges();
  });

  it('renders skeleton layout', () => {
    const element = fixture.nativeElement as HTMLElement;

    expect(element.querySelector('[data-cy="skeleton-sidebar"]')).toBeTruthy();
  });
});