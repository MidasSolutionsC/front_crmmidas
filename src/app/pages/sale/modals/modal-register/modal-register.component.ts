import { ChangeDetectorRef, Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Subscription, debounceTime } from 'rxjs';
import { Installation, InstallationList, Pagination, ResponseApi, ResponsePagination, SaleDetail, SaleDetailList, ServiceList } from 'src/app/core/models';
import { ApiErrorFormattingService, FormService, ServiceService, SweetAlertService, TempInstallationService, TempSaleDetailService } from 'src/app/core/services';

@Component({
  selector: 'app-modal-register',
  templateUrl: './modal-register.component.html',
  styleUrls: ['./modal-register.component.scss']
})
export class ModalRegisterComponent {

  // VALORES DE ENTRADA
  modalRefCurrent?: BsModalRef;

  // DATOS DEL MODAL
  dataModal: any = {
    title: 'Formulario de venta'
  };


  // MODAL INSTALACIÓN
  dataModalInstallation: any = {
    title: 'Formulario de instalación'
  }

  // Form instalación
  isNewDataInstallation: boolean = true;
  submittedInstallation: boolean = false;
  installationForm: FormGroup;

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

  // Collapsable form instalaciones
  isCollapsedFormInstallation = true;
  isCollapsedInstallation = false;

  // Collapsable table servicios
  isCollapsedService = false;

  // Lista de instalaciones
  listInstallations: InstallationList[] = [];
  tmpListInstallations: InstallationList[] = [];

  // Lista de ventas detalles
  tmpListSaleDetails: SaleDetailList[] = [];

  private subscription: Subscription = new Subscription();

  constructor(
    public modalRef: BsModalRef,
    private cdr: ChangeDetectorRef,
    private modalService: BsModalService,
    private _serviceService: ServiceService,
    private _tempSaleDetailService: TempSaleDetailService,
    private _tempInstallationService: TempInstallationService,
    private _formService: FormService,
    private _apiErrorFormattingService: ApiErrorFormattingService,
    private _sweetAlertService: SweetAlertService,
    private formBuilder: FormBuilder
  ) { }

  ngOnInit(): void {

    this.initFormInstallation();
    this.apiServiceListPagination();
  }


  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }


  closeModal() {
    this.modalRef.hide();
  }


  /**
   * ***************************************************************
   * FORM CONTROLS - INSTALACIONES
   * ***************************************************************
   */
  get fi() {
    return this.installationForm.controls;
  }

  /**
   * INICIAR FORMULARTO CON LAS VALIDACIONES
   * @param model 
   */
  private initFormInstallation(){
    const installation = new Installation();
    const formGroupData = this.getFormGroupInstallation(installation);
    this.installationForm = this.formBuilder.group(formGroupData);
  }

  /**
   * CREAR VALIDACIONES DEL FORMGROUP
   * @param model 
   * @returns 
   */
  private getFormGroupInstallation(model: Installation): object {
    return {
      ...this._formService.modelToFormGroupData(model),
      tipo: ['', [Validators.required, Validators.maxLength(50)]],
      ventas_id: ['', [Validators.nullValidator, Validators.min(1)]],
      direccion: ['', [Validators.required, Validators.maxLength(150)]],
      localidad: ['', [Validators.required, Validators.maxLength(70)]],
      provincia: ['', [Validators.required, Validators.maxLength(70)]],
      codigo_postal: ['', [Validators.required, Validators.maxLength(20)]],
      is_active: [true, [Validators.nullValidator]],
    }
  }




  /**
   * ****************************************************************
   * OPERACIONES CON LA API - INSTALACIONES
   * ****************************************************************
   */
  public apiTempInstallationList(forceRefresh: boolean = false){
    this._sweetAlertService.loadingUp('Obteniendo datos')
    this._tempInstallationService.getAll(forceRefresh).subscribe((response: ResponseApi) => {
      this._sweetAlertService.stop();
      if(response.code == 200){
        this.tmpListInstallations = response.data;
      }

      if(response.code == 500){
        if(response.errors){
          this._sweetAlertService.showTopEnd({type: 'error', title: response.errors?.message, message: response.errors?.error});
        }
      }
    }, (error: any) => {
      this._sweetAlertService.stop();
      if(error.message){
        this._sweetAlertService.showTopEnd({type: 'error', title: 'Error al listar las instalación', message: error.message, timer: 2500});
      }
    });
  }

  private apiTempInstallationRegister(data: Installation){
    this._sweetAlertService.loadingUp()
    this.subscription.add(
      this._tempInstallationService.register(data).subscribe((response: ResponseApi) => {
        this._sweetAlertService.stop();
        if(response.code == 201){
          if(response.data[0]){
            const data: InstallationList = InstallationList.cast(response.data[0]);
            this._tempInstallationService.addObjectObserver(data);
          }
        }

        if(response.code == 422){
          if(response.errors){
            const textErrors = this._apiErrorFormattingService.formatAsHtml(response.errors);
            this._sweetAlertService.showTopEnd({type: 'error', title: response.message, message: textErrors});
          }
        }

        if(response.code == 500){
          if(response.errors){
            this._sweetAlertService.showTopEnd({type: 'error', title: response.errors?.message, message: response.errors?.error});
          }
        }
      }, (error) => {
        this._sweetAlertService.stop();
        if(error.message){
          this._sweetAlertService.showTopEnd({type: 'error', title: 'Error al registrar la instalación', message: error.message, timer: 2500});
        }
      })
    )
  }

  private apiTempInstallationUpdate(data: Installation, id: number){
    this._sweetAlertService.loadingUp()
    this.subscription.add(
      this._tempInstallationService.update(data, id).subscribe((response: ResponseApi) => {
        this._sweetAlertService.stop();
        if(response.code == 201){
          if(response.data[0]){
            const data: InstallationList = InstallationList.cast(response.data[0]);
            this._tempInstallationService.updateObjectObserver(data);
          }

          this.modalRef?.hide();
        }

        if(response.code == 422){
          if(response.errors){
            const textErrors = this._apiErrorFormattingService.formatAsHtml(response.errors);
            this._sweetAlertService.showTopEnd({type: 'error', title: response.message, message: textErrors});
          }
        }

        if(response.code == 500){
          if(response.errors){
            this._sweetAlertService.showTopEnd({type: 'error', title: response.errors?.message, message: response.errors?.error});
          }
        }
      }, (error) => {
        this._sweetAlertService.stop();
        if(error.message){
          this._sweetAlertService.showTopEnd({type: 'error', title: 'Error al actualizar la instalación', message: error.message, timer: 2500});
        }
      })
    )
  }

  private apiTempInstallationDelete(id: number){
    this._sweetAlertService.loadingUp()
    this._tempInstallationService.delete(id).subscribe((response: ResponseApi) => {
      this._sweetAlertService.stop();
      if(response.code == 200){
        const data: InstallationList = InstallationList.cast(response.data[0]);
        this._tempInstallationService.removeObjectObserver(data.id);
      }

      if(response.code == 422){
        if(response.errors){
          const textErrors = this._apiErrorFormattingService.formatAsHtml(response.errors);
          this._sweetAlertService.showTopEnd({type: 'error', title: response.message, message: textErrors});
        }
      }

      if(response.code == 500){
        if(response.errors){
          this._sweetAlertService.showTopEnd({type: 'error', title: response.errors?.message, message: response.errors?.error});
        }
      }
    }, (error: ResponseApi) => {
      this._sweetAlertService.stop();
      if(error.message){
        this._sweetAlertService.showTopEnd({type: 'error', title: 'Error al eliminar la instalación', message: error.message, timer: 2500});
      }
    });
  }


  /**
   * ****************************************************************
   * OPERACIONES CON LA API - VENTA DETALLE
   * ****************************************************************
   */
  public apiTempSaleDetailList(forceRefresh: boolean = false){
    this._sweetAlertService.loadingUp('Obteniendo datos')
    this._tempSaleDetailService.getAll(forceRefresh).subscribe((response: ResponseApi) => {
      this._sweetAlertService.stop();
      if(response.code == 200){
        this.tmpListSaleDetails = response.data;
      }

      if(response.code == 500){
        if(response.errors){
          this._sweetAlertService.showTopEnd({type: 'error', title: response.errors?.message, message: response.errors?.error});
        }
      }
    }, (error: any) => {
      this._sweetAlertService.stop();
      if(error.message){
        this._sweetAlertService.showTopEnd({type: 'error', title: 'Error al listar los detalle de la venta', message: error.message, timer: 2500});
      }
    });
  }

  private apiTempSaleDetailRegister(data: SaleDetail | any){
    this._sweetAlertService.loadingUp()
    this.subscription.add(
      this._tempSaleDetailService.register(data).subscribe((response: ResponseApi) => {
        this._sweetAlertService.stop();
        if(response.code == 201){
          console.log(response.data);
          const {ventas_id, instalaciones_id, venta_detalle} = response.data;
          if(ventas_id){
            localStorage.setItem('ventas_id', ventas_id);
          }
          // if(response.data[0]){
          //   const data: SaleDetailList = SaleDetailList.cast(response.data[0]);
          //   this._tempSaleDetailService.addObjectObserver(data);
          // }
        }

        if(response.code == 422){
          if(response.errors){
            console.log(response.errors);
            // const textErrors = this._apiErrorFormattingService.formatAsHtml(response.errors);
            // this._sweetAlertService.showTopEnd({type: 'error', title: response.message, message: textErrors});
            const {installation_errors, sale_detail_errors, sale_errors} = response.errors;
            let textErrors = '';

            if(installation_errors){
              textErrors += this._apiErrorFormattingService.formatAsHtml(installation_errors);
            }

            if(sale_detail_errors){
              textErrors += this._apiErrorFormattingService.formatAsHtml(sale_detail_errors);
            }

            if(sale_errors){
              textErrors += this._apiErrorFormattingService.formatAsHtml(sale_errors);
            }

            if(textErrors != ''){
              this._sweetAlertService.showTopEnd({type: 'error', title: response.message, message: textErrors});
            }
          }
        }

        if(response.code == 500){
          if(response.errors){
            this._sweetAlertService.showTopEnd({type: 'error', title: response.errors?.message, message: response.errors?.error});
          }
        }
      }, (error) => {
        this._sweetAlertService.stop();
        if(error.message){
          this._sweetAlertService.showTopEnd({type: 'error', title: 'Error al registrar el detalle de la venta', message: error.message, timer: 2500});
        }
      })
    )
  }

  private apiTempSaleDetailUpdate(data: Installation, id: number){
    this._sweetAlertService.loadingUp()
    this.subscription.add(
      this._tempSaleDetailService.update(data, id).subscribe((response: ResponseApi) => {
        this._sweetAlertService.stop();
        if(response.code == 201){
          if(response.data[0]){
            const data: SaleDetailList = SaleDetailList.cast(response.data[0]);
            this._tempSaleDetailService.updateObjectObserver(data);
          }
        }

        if(response.code == 422){
          if(response.errors){
            const textErrors = this._apiErrorFormattingService.formatAsHtml(response.errors);
            this._sweetAlertService.showTopEnd({type: 'error', title: response.message, message: textErrors});
          }
        }

        if(response.code == 500){
          if(response.errors){
            this._sweetAlertService.showTopEnd({type: 'error', title: response.errors?.message, message: response.errors?.error});
          }
        }
      }, (error) => {
        this._sweetAlertService.stop();
        if(error.message){
          this._sweetAlertService.showTopEnd({type: 'error', title: 'Error al actualizar el detalle de la venta', message: error.message, timer: 2500});
        }
      })
    )
  }

  
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



  /**
   * ****************************************************************
   * ABRIR MODAL - FORMULARIO INSTALACIÓN
   * ****************************************************************
   */
  openModalInstallation(content: any) {
    this.initFormInstallation();    
    this.modalRefCurrent = this.modalService.show(content, { class: 'modal-md', backdrop: 'static' });
    this.modalRefCurrent.onHide.subscribe(() => {});
  }

  // Toggle formulario de instalaciones
  toggleFormInstallation(){
    this.isCollapsedFormInstallation = !this.isCollapsedFormInstallation;
    if(!this.isCollapsedFormInstallation){
      this.isCollapsedInstallation = true;
    }
  }

  // Toggle formulario de instalaciones
  toggleListInstallation(){
    this.isCollapsedInstallation = !this.isCollapsedInstallation;
    if(!this.isCollapsedInstallation){
      this.isCollapsedFormInstallation = true;
    }
  }


  /**
   * ****************************************************************
   * GUARDAR DATOS INSTALACIONES
   * ****************************************************************
   */
  saveDataInstallation() {
    if(this.installationForm.invalid){
      this._sweetAlertService.showTopEnd({title: 'Validación de datos', message: 'Campos obligatorios vacíos', type: 'warning', timer: 1500});
    } else {
      const values: Installation = this.installationForm.value;
      const selectedServiceId = this.listServiceSelected.map((service) => service.id);
      const request: any = {};
      request['servicios_ids'] = selectedServiceId;
      request['instalacion'] = values;
      request['detalle_venta'] = new SaleDetail();
      const localVentasId = localStorage.getItem('ventas_id');
      if(localVentasId !== null){
        request['ventas_id'] = localVentasId;
      }
      // console.log(request);


      if(this.isNewDataInstallation){
        // Crear nuevo registro
        this._sweetAlertService.showConfirmationAlert('¿Estas seguro de registrar la ubicación?').then((confirm) => {
          if(confirm.isConfirmed){
            this.apiTempSaleDetailRegister(request);
          }
        });
      } else {
        // Actualizar datos
        this._sweetAlertService.showConfirmationAlert('¿Estas seguro de modificar la ubicación?').then((confirm) => {
          if(confirm.isConfirmed){
        
          }
        });
      }
    }

    this.submittedInstallation = true;
  }



}
