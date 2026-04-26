import { Component } from '@angular/core';

import { PageHeaderComponent } from '../page-header/page-header.component';

@Component({
  selector: 'dpo-page-shell',
  standalone: true,
  imports: [PageHeaderComponent],
  templateUrl: './page-shell.component.html',
  styleUrl: './page-shell.component.scss'
})
export class PageShellComponent {}
