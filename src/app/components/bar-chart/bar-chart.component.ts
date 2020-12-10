import {Component, Input, OnInit} from '@angular/core';
import {ChartDataSets, ChartOptions, ChartType} from 'chart.js';
import {Label} from 'ng2-charts/lib/base-chart.directive';

@Component({
  selector: 'app-bar-chart',
  templateUrl: './bar-chart.component.html',
  styleUrls: ['./bar-chart.component.css']
})
export class BarChartComponent implements OnInit {
  @Input() dataset: ChartDataSets[];
  @Input() labels: Label[];
  @Input() legend: boolean;
  @Input() options: ChartOptions;
  @Input() type: ChartType;


  constructor() { }

  ngOnInit(): void {
  }

}
