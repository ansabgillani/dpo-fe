import { ComponentFixture, TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it } from '@jest/globals';

import { SkeletonFileListComponent } from './skeleton-file-list.component';

describe('SkeletonFileListComponent', () => {
  let fixture: ComponentFixture<SkeletonFileListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SkeletonFileListComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(SkeletonFileListComponent);
    fixture.detectChanges();
  });

  it('renders skeleton container', () => {
    const element = fixture.nativeElement as HTMLElement;
    expect(element.querySelector('[data-cy="skeleton-file-list"]')).toBeTruthy();
  });
});
