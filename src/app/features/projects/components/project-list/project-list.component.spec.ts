import { ComponentFixture, TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it, jest } from '@jest/globals';

import { ProjectListComponent } from './project-list.component';

describe('ProjectListComponent', () => {
  let component: ProjectListComponent;
  let fixture: ComponentFixture<ProjectListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProjectListComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(ProjectListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('emits selected project id', () => {
    const spy = jest.spyOn(component.selectProject, 'emit');

    component.onSelectProject(2);

    expect(spy).toHaveBeenCalledWith(2);
  });

  it('emits open project id', () => {
    const spy = jest.spyOn(component.openProject, 'emit');

    component.onOpenProject(3);

    expect(spy).toHaveBeenCalledWith(3);
  });
});
