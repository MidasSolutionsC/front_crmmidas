import { Component, OnInit } from '@angular/core';
import { Chart , ChartType} from 'chart.js/auto';
import { FormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Subscription, distinctUntilChanged } from 'rxjs';
import { Report, BrandList, Breadcrumb, ResponseApi} from 'src/app/core/models';
import { ApiErrorFormattingService, ReportService, FormService, SweetAlertService } from 'src/app/core/services';

@Component({
 selector: 'app-by-coordinator',
 templateUrl: './by-coordinator.component.html',
 styleUrls: ['./by-coordinator.component.scss']
})
export class ByCoordinatorComponent implements OnInit{

  public chartBySeller: Chart;
  public chartByCoordinator: Chart;
  public chart: Chart;
  public count_user: Number;
  public count_product: Number;
  public count_sale: Number;

  modalRef?: BsModalRef;
 // Form
 isNewData: boolean = true;
 submitted: boolean = false;
 reportForm: UntypedFormGroup;


 // Table data
 // content?: any;
 listsByBrand?: [];
 listsBySeller?: [];
 listsByCoordinator?: [];
 listsSale?:[];



 private subscription: Subscription = new Subscription();

 constructor(
   private modalService: BsModalService,
   private _reportService: ReportService,
   private _formService: FormService,
   private _apiErrorFormattingService: ApiErrorFormattingService,
   private _sweetAlertService: SweetAlertService,
   private formBuilder: FormBuilder) {

 }

 ngOnInit(): void {
   

   this.initForm();

   this.listData()
  
    
 }

 ngOnDestroy(): void {
   this.subscription.unsubscribe();
 }

private listDataApi(data: Report) {
  this._sweetAlertService.loadingUp()
  

 
  this.subscription.add(
    this._reportService.salesByCoordinator(data).subscribe((response: ResponseApi) => {
      this._sweetAlertService.stop();
      if (response.code == 200) {
        if (response.data[0].data) {
          // const data: BrandList = BrandList.cast(response.data[0].data);
          // this._brandService.addObjectObserver(data);
          if (this.chartByCoordinator) {
            this.chartByCoordinator.destroy();
          }

          let labels = response.data[0].data.map((l: any) => l.coordinacion)
          let count = response.data[0].data.map((l: any) => l.vendedores.reduce((total: number, dato: any) => total + dato.total_ventas, 0))
          
          let data = {
            labels: labels,
            datasets: [{
              label: 'Lista de ventas por Comercial',
              data: count,
              backgroundColor: [ 'rgba(255,99,132, 0.2', 'rgba(255,159,64, 0.2', 'rgba(255,205,86, 0.2', 'rgba(75,192,192, 0.2','rgba(54,162,235, 0.2'],
              borderColor: ['rgba(255, 99, 132)', 'rgba(255, 159, 64)', 'rgba(255, 205, 86)', 'rgba(75, 192, 192)', 'rgba(54, 162, 235)' ],
              borderWidth: 1
            }]
          };
          this.chartByCoordinator= new Chart("chartByCoordinator", { type: 'bar' as ChartType, data })

          this.listsByCoordinator = response.data[0].data
          this.count_product = response.data[0].count_product
          this.count_sale = response.data[0].count_sale
          this.count_user = response.data[0].count_user


        }
          
        this.modalRef?.hide();
      }

      if (response.code == 422) {
        if (response.errors) {
          const textErrors = this._apiErrorFormattingService.formatAsHtml(response.errors);
          this._sweetAlertService.showTopEnd({ type: 'error', title: response.message, message: textErrors });
        }
      }

      if (response.code == 500) {
        if (response.errors) {
          this._sweetAlertService.showTopEnd({ type: 'error', title: response.errors?.message, message: response.errors?.error });
        }
      }
    }, (error) => {
      this._sweetAlertService.stop();
      console.log(error);
    })
  )
  }




/**
 * Form data get
 */
get form() {
  return this.reportForm.controls;
}

/**
 * INICIAR FORMULARTO CON LAS VALIDACIONES
 * @param model
 */
private initForm() {

  const report = new Report();
  const formGroupData = this.getFormGroupData(report);
  this.reportForm = this.formBuilder.group(formGroupData);
}

/**
 * CREAR VALIDACIONES DEL FORMGROUP
 * @param model
 * @returns
 */

formatDate(date: Date): string {
  // Convierte la fecha a un formato compatible con el input type="date"
  const year = date.getFullYear();
  const month = ('0' + (date.getMonth() + 1)).slice(-2);
  const day = ('0' + date.getDate()).slice(-2);
  return `${year}-${month}-${day}`;
}

private getFormGroupData(model: Report): object {

  const fechaActual = new Date();
  const fechaFin = this.formatDate(fechaActual);

  const fechaInicio = new Date();
  fechaInicio.setMonth(fechaInicio.getMonth() - 1);
  const fechaInicioFormateada = this.formatDate(fechaInicio);

  return {
    ...this._formService.modelToFormGroupData(model),
    fecha_inicio: [fechaInicioFormateada, [Validators.required]],
    fecha_fin: [fechaFin, [Validators.required]]
  }
}






/**
  * Save
*/
listData() {
  if (!this.reportForm.valid) {
    console.log(this.reportForm)
    this._sweetAlertService.showTopEnd({ title: 'Validación de datos', message: 'Campos obligatorios vacíos', type: 'warning', timer: 1500 });
  } else {
    const values = this.reportForm.value;


    this.listDataApi(values);

  }

  this.submitted = true;
}
  

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
