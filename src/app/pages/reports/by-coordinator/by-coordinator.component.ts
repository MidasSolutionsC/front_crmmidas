import { Component, OnInit } from '@angular/core';
import { Chart , ChartType} from 'chart.js/auto';

@Component({
 selector: 'app-by-coordinator',
 templateUrl: './by-coordinator.component.html',
 styleUrls: ['./by-coordinator.component.scss']
})
export class ByCoordinatorComponent implements OnInit{
 public chart: Chart;
 ngOnInit(): void {

  const data = {
    labels: [ 'Coordinador 1', 'Coordinador 2','Coordinador 3', 'Coordinador 4', 'Coordinador 5'],
    datasets: [{
      label: 'Lista de ventas por Coordinador',
      data: [10,40,30,20,45],
      backgroundColor: [ 'rgba(255,99,132, 0.2', 'rgba(255,159,64, 0.2', 'rgba(255,205,86, 0.2', 'rgba(75,192,192, 0.2','rgba(54,162,235, 0.2'],
      borderColor: ['rgba(255, 99, 132)', 'rgba(255, 159, 64)', 'rgba(255, 205, 86)', 'rgba(75, 192, 192)', 'rgba(54, 162, 235)' ],
      borderWidth: 1
    }]
  };
  
  this.chart = new Chart("chart", { type:'bar'as ChartType, data})

}


//  constructor() {
//     this.chart = new Chart('chartID', {
//        type: 'bar' as ChartType,
//        data: {
//          labels: ['Coordinator1', 'Coordinator2', 'Coordinator3'],
//          datasets: [
//            {
//              label: 'Tasks Completed',
//              data: [12, 19, 3],
//              backgroundColor: ['rgba(75, 192, 192, 0.2)'],
//              borderColor: ['rgba(75, 192, 192, 1)'],
//              borderWidth: 1
//            }
//          ]
//        },
//        options: {
//          scales: {
//            y: {
//              beginAtZero: true
//            }
//          }
//        }
//     });
//    }

//  ngOnInit(): void {
//     this.getCoordinatorData();
//  }

//  getCoordinatorData(): void {
//     // Call API or get data from a service
//     // For demonstration, using dummy data
//     const data = {
//       coordinators: ['Coordinator1', 'Coordinator2', 'Coordinator3'],
//       tasksCompleted: [12, 19, 3]
//     };

//     // Update chart data
//     this.chart.data.labels = data.coordinators;
//     this.chart.data.datasets[0].data = data.tasksCompleted;

//     // Update the chart
//     this.chart.update();
//  }
}