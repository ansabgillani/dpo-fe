import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InputComponent } from './input.component';

describe('InputComponent', () => {
  let component: InputComponent;
  let fixture: ComponentFixture<InputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [InputComponent] }).compileComponents();
    fixture = TestBed.createComponent(InputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('emits valueChange on updates', () => {
    const spy = jest.fn();
    component.valueChange.subscribe(spy);

    component.onValueChange('new value');

    expect(spy).toHaveBeenCalledWith('new value');
  });
});
