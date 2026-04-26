import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SimpleChange } from '@angular/core';
import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { of, throwError } from 'rxjs';

import { ConfirmDialogService } from '@core/services/confirm-dialog.service';
import { ErrorModalService } from '@core/services/error-modal.service';
import { ProjectService } from '@core/services/project.service';
import { FilesTabComponent } from './files-tab.component';

describe('FilesTabComponent', () => {
  let component: FilesTabComponent;
  let fixture: ComponentFixture<FilesTabComponent>;

  const makeFileEntry = (id: number, name: string) => ({
    id,
    name,
    sizeBytes: 1024,
    contentType: 'application/pdf',
    uploadedAt: '2026-04-26T08:00:00Z',
    downloadUrl: `http://localhost:3001/api/v1/projects/1/files/${id}/download`
  });

  const projectService = {
    getFiles: jest.fn(() => of([makeFileEntry(1, 'Kickoff Deck.pdf')])),
    uploadFile: jest.fn(() => of([makeFileEntry(2, 'Upload.txt')])),
    deleteFile: jest.fn(() => of([]))
  };

  const confirmDialog = {
    open: jest.fn(() => of(true))
  };

  const errorModalService = {
    showError: jest.fn()
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FilesTabComponent],
      providers: [
        { provide: ProjectService, useValue: projectService },
        { provide: ConfirmDialogService, useValue: confirmDialog },
        { provide: ErrorModalService, useValue: errorModalService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(FilesTabComponent);
    component = fixture.componentInstance;
    component.projectId = 1;
    component.ngOnChanges({
      projectId: new SimpleChange(null, 1, true)
    });
    fixture.detectChanges();
  });

  it('fetches files when projectId is set', () => {
    expect(projectService.getFiles).toHaveBeenCalledWith(1);
    expect(component.files).toHaveLength(1);
  });

  it('opens file input when add is requested', () => {
    const open = jest.fn();
    (component as unknown as { fileInput: { open: () => void } }).fileInput = { open };

    component.onAddFile();

    expect(open).toHaveBeenCalled();
  });

  it('uploads selected file', () => {
    const file = new File(['data'], 'upload.txt', { type: 'text/plain' });

    component.onUploadSelected(file);

    expect(projectService.uploadFile).toHaveBeenCalledWith(1, file);
  });

  it('confirms and deletes file', () => {
    component.onDeleteRequested(1);

    expect(confirmDialog.open).toHaveBeenCalled();
    expect(projectService.deleteFile).toHaveBeenCalledWith(1, 1);
  });

  it('shows FILE_TOO_LARGE error modal on backend 400 rejection', () => {
    (projectService.uploadFile as jest.Mock).mockReturnValueOnce(
      throwError(() => ({ type: 'FILE_TOO_LARGE', maxBytes: 52428800 }))
    );

    const file = new File(['x'], 'big.bin', { type: 'application/octet-stream' });
    component.onUploadSelected(file);

    expect(errorModalService.showError).toHaveBeenCalledWith(
      expect.objectContaining({ errorCode: 'ERR_FILE_UPLOAD', title: 'File too large' })
    );
  });
});
