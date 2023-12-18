import { Component, OnInit } from '@angular/core';
import {Chart, ChartType} from 'chart.js/auto';
import { FormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Subscription, distinctUntilChanged } from 'rxjs';
import { Report, BrandList, Breadcrumb, ResponseApi} from 'src/app/core/models';
import { ApiErrorFormattingService, ReportService, FormService, SweetAlertService } from 'src/app/core/services';


@Component({
  selector: 'app-by-commercial',
  templateUrl: './by-commercial.component.html',
  styleUrls: ['./by-commercial.component.scss']
})
export class ByCommercialComponent implements OnInit{
  public chart: Chart;
  public chartBySeller: Chart;
  public chartByCoordinator: Chart;


  modalRef?: BsModalRef;

  dataModal = {
    title: 'Crear marcas',
  }

  // bread crumb items
  titleBreadCrumb: string = 'marcas';
  breadCrumbItems: Array<{}>;

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
    this.breadCrumbItems = Breadcrumb.casts([{ label: 'Mantenimiento' }, { label: 'marcas', active: true }]);

    this.initForm();

    this.listData()


  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  /**
   * ****************************************************************
   * OPERACIONES CON LA API
   * ****************************************************************
   */
  // public listDataApi(forceRefresh: boolean = false) {
  //   this._sweetAlertService.loadingUp('Obteniendo datos')
  //   this._brandService.getAll(forceRefresh).subscribe((response: ResponseApi) => {
  //     this._sweetAlertService.stop();
  //     if (response.code == 200) {
  //       this.lists = response.data;
  //     }

  //     if (response.code == 500) {
  //       if (response.errors) {
  //         this._sweetAlertService.showTopEnd({ type: 'error', title: response.errors?.message, message: response.errors?.error });
  //       }
  //     }
  //   }, (error: any) => {
  //     this._sweetAlertService.stop();
  //     console.log(error);
  //   });
  // }

  private listDataApi(data: Report) {
    this._sweetAlertService.loadingUp()
    this.subscription.add(
      this._reportService.salesBySeller(data).subscribe((response: ResponseApi) => {
        this._sweetAlertService.stop();
        if (response.code == 200) {
          if (response.data[0]) {
            // const data: BrandList = BrandList.cast(response.data[0]);
            // this._brandService.addObjectObserver(data);
            if (this.chartBySeller) {
              this.chartBySeller.destroy();
            }

            let labels = response.data[0].map((l: any) => l.nombre)
            let count = response.data[0].map((l: any) => l.total_ventas)

            let data = {
              labels: labels,
              datasets: [{
                label: 'Lista de ventas por Ventas',
                data: count,
                backgroundColor: [ 'rgba(255,99,132, 0.2', 'rgba(255,159,64, 0.2', 'rgba(255,205,86, 0.2', 'rgba(75,192,192, 0.2','rgba(54,162,235, 0.2'],
                borderColor: ['rgba(255, 99, 132)', 'rgba(255, 159, 64)', 'rgba(255, 205, 86)', 'rgba(75, 192, 192)', 'rgba(54, 162, 235)' ],
                borderWidth: 1
              }]
            };
            this.chartBySeller = new Chart("chartBySeller", { type: 'bar' as ChartType, data })

            this.listsBySeller = response.data[0]

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
   * Open modal
   * @param content modal content
   */
  openModal(content: any) {
    this.initForm();
    this.isNewData = true;
    this.dataModal.title = 'Crear marca';
    this.submitted = false;
    this.modalRef = this.modalService.show(content, { class: 'modal-md' });
    this.modalRef.onHide.subscribe(() => { });
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
