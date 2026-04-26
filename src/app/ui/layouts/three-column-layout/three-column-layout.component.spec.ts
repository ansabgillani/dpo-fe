import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ThreeColumnLayoutComponent } from './three-column-layout.component';

describe('ThreeColumnLayoutComponent', () => {
  let component: ThreeColumnLayoutComponent;
  let fixture: ComponentFixture<ThreeColumnLayoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ThreeColumnLayoutComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(ThreeColumnLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('creates component', () => {
    expect(component).toBeTruthy();
  });
});
