import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { beforeEach, describe, expect, it, jest } from '@jest/globals';

import { ConfirmDialogService } from '@core/services/confirm-dialog.service';
import { ProjectService } from '@core/services/project.service';
import { ProjectSidebarComponent } from './project-sidebar.component';

describe('ProjectSidebarComponent', () => {
  let component: ProjectSidebarComponent;
  let fixture: ComponentFixture<ProjectSidebarComponent>;

  const baseProject = {
    id: 1,
    name: 'Imaging Platform Modernization',
    department: 'DIC',
    businessLine: 'XP',
    type: 'SSP',
    startDate: '2025-01-10',
    endDate: '2025-11-30',
    statusProject: 'Active',
    pspProjects: []
  };

  const projectService = {
    updateMetadata: jest.fn((id: number, field: string, value: unknown) =>
      of({
        ...baseProject,
        ...(field === 'name' ? { name: String(value) } : {}),
        ...(field === 'avatarUrl' ? { avatarUrl: String(value) } : {}),
        ...(field === 'pspProjects' ? { pspProjects: value as [] } : {}),
        ...(field === 'department' ? { department: String(value) } : {}),
        ...(field === 'businessLine' ? { businessLine: String(value) } : {}),
        ...(field === 'type' ? { type: String(value) } : {}),
        ...(field === 'startDate' ? { startDate: String(value) } : {}),
        ...(field === 'endDate' ? { endDate: String(value) } : {}),
        ...(field === 'statusProject' ? { statusProject: String(value) } : {})
      })
    ),
    addPspProject: jest.fn(() => of({ pspProjects: [] })),
    deletePspProject: jest.fn(() =>
      of({
        ...baseProject,
        pspProjects: []
      })
    )
  };

  const confirmDialogService = {
    open: jest.fn(() => of(true))
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProjectSidebarComponent],
      providers: [
        { provide: ProjectService, useValue: projectService },
        { provide: ConfirmDialogService, useValue: confirmDialogService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ProjectSidebarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('returns fallback initials when project is missing', () => {
    component.project = null;

    expect(component.getInitials()).toBe('PR');
  });

  it('builds initials from project name', () => {
    component.project = { ...baseProject };

    expect(component.getInitials()).toBe('IP');
  });

  it('tracks single active edit field', () => {
    component.startEditing('department');
    expect(component.activeEditField).toBe('department');

    component.startEditing('status');
    expect(component.activeEditField).toBe('status');
  });

  it('opens confirm dialog before deleting psp entry', () => {
    component.project = {
      ...baseProject,
      pspProjects: [{ id: 10, name: 'PSP-10' }]
    };

    component.onDeletePspProject(10, 'PSP-10');

    expect(confirmDialogService.open).toHaveBeenCalledTimes(1);
    expect(projectService.deletePspProject).toHaveBeenCalledWith(1, 10);
  });

  it('saves edited title through metadata update', () => {
    component.project = { ...baseProject };

    component.onStartEditTitle();
    component.onTitleDraftChange('Imaging Platform Modernization v2');
    component.onSaveTitle();

    expect(projectService.updateMetadata).toHaveBeenCalledWith(1, 'name', 'Imaging Platform Modernization v2');
    expect(component.project?.name).toBe('Imaging Platform Modernization v2');
    expect(component.isEditingTitle).toBe(false);
  });

  it('updates avatar through metadata update when image is selected', async () => {
    component.project = { ...baseProject };

    jest
      .spyOn(component as never as { readFileAsDataUrl: (file: File) => Promise<string> }, 'readFileAsDataUrl')
      .mockResolvedValue('data:image/png;base64,mock');

    await component.onAvatarFileSelected(new File(['x'], 'avatar.png', { type: 'image/png' }));

    expect(projectService.updateMetadata).toHaveBeenCalledWith(1, 'avatarUrl', 'data:image/png;base64,mock');
  });
});