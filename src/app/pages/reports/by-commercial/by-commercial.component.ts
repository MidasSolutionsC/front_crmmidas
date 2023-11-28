import { Component, OnInit } from '@angular/core';
import {Chart, ChartType} from 'chart.js/auto';

@Component({
  selector: 'app-by-commercial',
  templateUrl: './by-commercial.component.html',
  styleUrls: ['./by-commercial.component.scss']
})
export class ByCommercialComponent implements OnInit{
  public chart: Chart; 
  ngOnInit(): void {

    const data = {
      labels: [ 'Comercial 1', 'Comercial 2','Comercial 3', 'Comercial 4', 'Comercial 5'],
      datasets: [{
        label: 'Lista de ventas por comercial',
        data: [1,4,3,2,5],
        fill: false,
        borderColor: 'rgb(75, 192,192',
        tension: 0.1
      }]
    };
    this.chart = new Chart("chart", { type:'line'as ChartType, data})
  }
}
