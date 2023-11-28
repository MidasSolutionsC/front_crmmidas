import { Component } from '@angular/core';
import { Chart , ChartType} from 'chart.js/auto';


@Component({
  selector: 'app-all',
  templateUrl: './all.component.html',
  styleUrls: ['./all.component.scss']
})

export class AllComponent {
  public chart: Chart;

  ngOnInit(): void {
  const data = {
     labels: [ 'Red', 'Blue','Yellow'],
    datasets:[{
     label: 'Mis datos',
           data: [300, 50, 100],
     backgroundColor: ['rgba(255, 99, 132)', 'rgba(54, 162, 235)', 'rgba(54, 205, 86)'],
     hoverOffset:4
    } ]
    };
    this.chart = new Chart("chart", { type:'pie'as ChartType, data})

}
 }