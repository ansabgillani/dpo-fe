import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { ChartConfiguration } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';

@Component({
  selector: 'dpo-cost-bar-chart',
  standalone: true,
  imports: [CommonModule, BaseChartDirective],
  templateUrl: './cost-bar-chart.component.html',
  styleUrl: './cost-bar-chart.component.scss'
})
export class CostBarChartComponent {
  @Input() groups: string[] = [];
  @Input() datasets: Array<{ label: string; data: number[]; color: string }> = [];

  readonly options: ChartConfiguration<'bar'>['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'top'
      }
    }
  };

  get data(): ChartConfiguration<'bar'>['data'] {
    return {
      labels: this.groups,
      datasets: this.datasets.map((set) => ({
        label: set.label,
        data: set.data,
        backgroundColor: set.color,
        borderColor: set.color,
        borderWidth: 1
      }))
    };
  }
}