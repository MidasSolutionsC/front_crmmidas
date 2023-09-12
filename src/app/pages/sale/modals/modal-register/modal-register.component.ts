import { ChangeDetectorRef, Component } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Subscription, debounceTime } from 'rxjs';
import { Pagination, ResponsePagination, ServiceList } from 'src/app/core/models';
import { ApiErrorFormattingService, FormService, ServiceService, SweetAlertService } from 'src/app/core/services';

@Component({
  selector: 'app-modal-register',
  templateUrl: './modal-register.component.html',
  styleUrls: ['./modal-register.component.scss']
})
export class ModalRegisterComponent {

  // VALORES DE ENTRADA

  // DATOS DEL MODAL
  dataModal: any = {
    title: 'Formulario de venta'
  };

  // TABLE SERVER SIDE - SERVICES
  countElements: number[] = [5, 10, 25, 50, 100];
  servicePage: number = 1;
  servicePerPage: number = 5;
  serviceSearch: string = '';
  serviceColumn: string = 'id';
  serviceOrder: 'asc' | 'desc' = 'desc';
  serviceTotal: number = 0;
  servicePagination: Pagination = new Pagination();

  // Lista de servicios
  listServices: ServiceList[] = [];

  // SELECCIÓN DE SERVICIOS
  selectAllService: boolean = false;
  listServiceSelected: ServiceList[] = [];


  private subscription: Subscription = new Subscription();

  constructor(
    public modalRef: BsModalRef,
    private cdr: ChangeDetectorRef,
    private _modalService: BsModalService,
    private _serviceService: ServiceService,
    private _formService: FormService,
    private _apiErrorFormattingService: ApiErrorFormattingService,
    private _sweetAlertService: SweetAlertService,
  ) { }

  ngOnInit(): void {

    this.apiServiceListPagination();
  }


  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }


  closeModal() {
    this.modalRef.hide();
  }

  /**
   * ****************************************************************
   * OPERACIONES CON LA API
   * ****************************************************************
   */


  
  /**
   * ***************************************************************
   * SERVER SIDE - SERVICIOS
   * ***************************************************************
   */
  apiServiceListPagination(): void {
    this.subscription.add(
      this._serviceService.getPagination({
        page: this.servicePage.toString(),
        perPage: this.servicePerPage.toString(),
        search: this.serviceSearch,
        column: this.serviceColumn,
        order: this.serviceOrder
      })
      .pipe(debounceTime(250))
      .subscribe((response: ResponsePagination) => {
        if(response.code == 200){
          this.servicePagination = Pagination.cast(response.data);
          this.listServices = response.data.data;
          this.servicePage = response.data.current_page;
          this.serviceTotal = response.data.total;
        }
        
        if(response.code == 500){
          if(response.errors){
            this._sweetAlertService.showTopEnd({type: 'error', title: response.errors?.message, message: response.errors?.error});
          }
        }
      }, (error: any) => {
        if(error.message){
          this._sweetAlertService.showTopEnd({type: 'error', title: 'Error al cargar servicios', message: error.message, timer: 2500});
        }
      })
    ); 
  }

  getPageService(event: any){
    const {page, itemsPerPage} = event;
    this.servicePage = page;
    this.servicePerPage = itemsPerPage;
    this.cdr.detectChanges();

    setTimeout(() => {
      this.apiServiceListPagination();
    }, 0);
  }
      

  /**
   * ***************************************************************
   * SELECCIÓN DE SERVICIOS
   * ***************************************************************
   */
  /**
   * Seleccionar o quitar a todos los registros
   */
  toggleAllSelectionService() {
    if (!this.selectAllService) {
      this.listServiceSelected = [];
    } else {
      this.listServiceSelected = this.servicePagination.data.map((obj: any) => obj);
    }
  }

  /**
   * Activar o desactivar selección
   * @param id id del usuario
   */
  toggleSelectionService(data: ServiceList) {
    const index = this.listServiceSelected.findIndex((item) => item.id === data.id);
    if (index === -1) {
      this.listServiceSelected.push(data); // Agregar el ID si no está en la lista
    } else {
      this.listServiceSelected.splice(index, 1); // Quitar el ID si ya está en la lista
    }
  }

  /**
   * Comprobar si el registro esta seleccionado o no
   * @param id
   * @returns true o false
   */
  getCheckedRowService(id: any){
    return this.listServiceSelected.some((item) => item.id === id);
  }

  // getRowServiceIsSelected(id: any){
  //   return this.listServiceSelected.some((item) => item.id === id);
  // }

}
