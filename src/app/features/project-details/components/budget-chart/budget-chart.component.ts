import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration } from 'chart.js';

@Component({
  selector: 'dpo-budget-chart',
  standalone: true,
  imports: [CommonModule, BaseChartDirective],
  templateUrl: './budget-chart.component.html',
  styleUrl: './budget-chart.component.scss'
})
export class BudgetChartComponent {
  @Input({ required: true }) datasets: ChartConfiguration<'line'>['data']['datasets'] = [];

  readonly labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  readonly lineChartType = 'line' as const;

  readonly options: ChartConfiguration<'line'>['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'top'
      }
    }
  };

  get data(): ChartConfiguration<'line'>['data'] {
    return {
      labels: this.labels,
      datasets: this.datasets
    };
  }
}
