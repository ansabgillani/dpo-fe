import { ComponentFixture, TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it, jest } from '@jest/globals';

import { StateCardComponent } from './state-card.component';

describe('StateCardComponent', () => {
  let component: StateCardComponent;
  let fixture: ComponentFixture<StateCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StateCardComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(StateCardComponent);
    component = fixture.componentInstance;
    component.card = {
      id: 'quality',
      key: 'quality',
      label: 'Quality',
      value: 84,
      previousValue: 80,
      narrative: 'Stable quality trend.'
    };
    component.trend = { tier: 'green', direction: 'up', deltaPercent: 5 };
    fixture.detectChanges();
  });

  it('renders read-only narrative when canEdit is false', () => {
    component.canEdit = false;
    fixture.detectChanges();

    const element = fixture.nativeElement as HTMLElement;
    expect(element.querySelector('[data-cy="state-card-edit-quality"]')).toBeNull();
    expect(element.querySelector('[data-cy="state-card-narrative-quality"]')?.textContent).toContain('Stable quality trend.');
  });

  it('opens editor and emits save when canEdit is true', () => {
    component.canEdit = true;
    fixture.detectChanges();

    const savedSpy = jest.spyOn(component.narrativeSaved, 'emit');
    component.onStartEdit();
    component.onNarrativeChange('Updated narrative');
    component.onConfirmNarrative();

    expect(savedSpy).toHaveBeenCalledWith({
      cardId: 'quality',
      narrative: 'Updated narrative'
    });
  });

  it('emits cancel when editor is canceled', () => {
    component.canEdit = true;
    fixture.detectChanges();

    const cancelSpy = jest.spyOn(component.narrativeCancelled, 'emit');
    component.onStartEdit();
    component.onCancelNarrative();

    expect(cancelSpy).toHaveBeenCalledWith('quality');
  });
});
