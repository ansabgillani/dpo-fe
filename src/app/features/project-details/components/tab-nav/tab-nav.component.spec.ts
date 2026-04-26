import { ComponentFixture, TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it, jest } from '@jest/globals';

import { TabNavComponent } from './tab-nav.component';

describe('TabNavComponent', () => {
  let component: TabNavComponent;
  let fixture: ComponentFixture<TabNavComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TabNavComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(TabNavComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('emits selected tab index', () => {
    const spy = jest.spyOn(component.tabSelected, 'emit');

    component.onSelect(4);

    expect(spy).toHaveBeenCalledWith(4);
  });

  it('renders tabs from input', () => {
    component.tabs = ['Overview', 'State', 'Milestone'];
    component.activeTabIndex = 1;

    fixture.detectChanges();

    const element = fixture.nativeElement as HTMLElement;
    expect(element.textContent).toContain('Overview');
    expect(element.textContent).toContain('State');
    expect(element.textContent).toContain('Milestone');
  });
});