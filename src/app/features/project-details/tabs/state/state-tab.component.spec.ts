import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { beforeEach, describe, expect, it, jest } from '@jest/globals';

import { AuthService } from '@core/services/auth.service';
import { ProjectService } from '@core/services/project.service';
import { StateTabComponent } from './state-tab.component';

describe('StateTabComponent', () => {
  let component: StateTabComponent;
  let fixture: ComponentFixture<StateTabComponent>;

  const cards = [
    {
      id: 'quality',
      key: 'quality',
      label: 'Quality',
      value: 84,
      previousValue: 80,
      narrative: 'Stable quality trend.'
    }
  ];

  const projectService = {
    getStateCards: jest.fn(() => of(cards)),
    saveState: jest.fn(() => of(cards))
  };

  const authService = {
    getUser: jest.fn(() => of({ id: '1', name: 'Manager', role: 'manager' }))
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StateTabComponent],
      providers: [
        { provide: ProjectService, useValue: projectService },
        { provide: AuthService, useValue: authService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(StateTabComponent);
    component = fixture.componentInstance;
    component.projectId = 1;

    component.ngOnInit();
    component.ngOnChanges({
      projectId: {
        previousValue: null,
        currentValue: 1,
        firstChange: true,
        isFirstChange: () => true
      }
    });
    fixture.detectChanges();
  });

  it('loads state cards when project id changes', () => {
    expect(projectService.getStateCards).toHaveBeenCalledWith(1);
    expect(component.cards).toHaveLength(1);
  });

  it('resolves canEdit from user role', () => {
    expect(component.canEdit).toBe(true);
  });

  it('saves state and refetches state cards through service', () => {
    component.onSaveState();
    expect(projectService.saveState).toHaveBeenCalledWith(1, cards);
  });
});
