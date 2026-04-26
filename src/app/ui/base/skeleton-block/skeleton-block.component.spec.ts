import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SkeletonBlockComponent } from './skeleton-block.component';

describe('SkeletonBlockComponent', () => {
  let component: SkeletonBlockComponent;
  let fixture: ComponentFixture<SkeletonBlockComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [SkeletonBlockComponent] }).compileComponents();
    fixture = TestBed.createComponent(SkeletonBlockComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('creates', () => {
    expect(component).toBeTruthy();
  });
});
