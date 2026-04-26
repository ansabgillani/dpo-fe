import { ComponentFixture, TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it, jest } from '@jest/globals';

import { FileInputComponent } from './file-input.component';

describe('FileInputComponent', () => {
  let component: FileInputComponent;
  let fixture: ComponentFixture<FileInputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FileInputComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(FileInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('emits fileSelected on change', () => {
    const spy = jest.spyOn(component.fileSelected, 'emit');
    const file = new File(['hello'], 'test.txt', { type: 'text/plain' });
    const input = fixture.nativeElement.querySelector('input') as HTMLInputElement;

    Object.defineProperty(input, 'files', { value: [file] });
    input.dispatchEvent(new Event('change'));

    expect(spy).toHaveBeenCalledWith(file);
  });

  it('triggers input click via open', () => {
    const input = fixture.nativeElement.querySelector('input') as HTMLInputElement;
    const clickSpy = jest.spyOn(input, 'click');

    component.open();

    expect(clickSpy).toHaveBeenCalled();
  });
});
