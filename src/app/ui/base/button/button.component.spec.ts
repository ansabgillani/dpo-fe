import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ButtonComponent } from './button.component';

describe('ButtonComponent', () => {
  let component: ButtonComponent;
  let fixture: ComponentFixture<ButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [ButtonComponent] }).compileComponents();
    fixture = TestBed.createComponent(ButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('emits clicked when active', () => {
    const spy = jest.fn();
    component.clicked.subscribe(spy);

    component.onClick();

    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('does not emit when disabled', () => {
    const spy = jest.fn();
    component.disabled = true;
    component.clicked.subscribe(spy);

    component.onClick();

    expect(spy).not.toHaveBeenCalled();
  });
});
