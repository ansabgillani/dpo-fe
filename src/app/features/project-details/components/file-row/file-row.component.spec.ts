import { ComponentFixture, TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it, jest } from '@jest/globals';

import { FileRowComponent } from './file-row.component';

describe('FileRowComponent', () => {
  let component: FileRowComponent;
  let fixture: ComponentFixture<FileRowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FileRowComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(FileRowComponent);
    component = fixture.componentInstance;
    component.file = {
      id: 1,
      name: 'Kickoff Deck.pdf',
      sizeBytes: 1024,
      contentType: 'application/pdf',
      uploadedAt: '2026-04-26T08:00:00Z',
      downloadUrl: 'http://localhost:3001/api/v1/projects/1/files/1/download'
    };
    fixture.detectChanges();
  });

  it('renders file row actions with data-cy', () => {
    const element = fixture.nativeElement as HTMLElement;

    expect(element.querySelector('[data-cy="file-row-download-1"]')).toBeTruthy();
    expect(element.querySelector('[data-cy="file-row-delete-1"]')).toBeTruthy();
  });
});
