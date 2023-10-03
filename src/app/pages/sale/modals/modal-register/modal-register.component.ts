import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Subscription, debounceTime, distinctUntilChanged } from 'rxjs';
import { Installation, InstallationList, OperatorList, Pagination, ResponseApi, ResponsePagination, SaleDetail, SaleDetailList, SaleList, ServiceList, TypeDocumentList, TypeServiceList } from 'src/app/core/models';
import { ApiErrorFormattingService, FormService, OperatorService, ServiceService, SharedClientService, SweetAlertService, TempInstallationService, TempSaleDetailService, TempSaleService, TypeDocumentService, TypeServiceService } from 'src/app/core/services';

@Component({
  selector: 'app-modal-register',
  templateUrl: './modal-register.component.html',
  styleUrls: ['./modal-register.component.scss']
})
export class ModalRegisterComponent implements OnInit, OnDestroy{

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

  // VENTA ID
  saleId: number = null;
  clientId: number;
  personId: number;
  companyId: number;
  legalPerson: boolean = false;

  // Form instalación
  isNewDataInstallation: boolean = true;
  submittedInstallation: boolean = false;
  installationForm: FormGroup;
  optionSearchInstallation: number = null;

  // Form detalle
  isNewDataSaleDetail: boolean = true;
  submittedSaleDetail: boolean = false;
  saleDetailForm: FormGroup;

  // TABLE SERVER SIDE - SERVICES
  countElements: number[] = [5, 10, 25, 50, 100];
  selectTypeService: any = '';
  servicePage: number = 1;
  servicePerPage: number = 5;
  serviceSearch: string = '';
  serviceColumn: string = 'id';
  serviceOrder: 'asc' | 'desc' = 'desc';
  serviceTotal: number = 0;
  servicePagination: Pagination = new Pagination();

  // TABLE SERVER SIDE - DETALLE
  // countElements: number[] = [5, 10, 25, 50, 100];
  saleDetailPage: number = 1;
  saleDetailPerPage: number = 5;
  saleDetailSearch: string = '';
  saleDetailColumn: string = 'id';
  saleDetailOrder: 'asc' | 'desc' = 'desc';
  saleDetailTotal: number = 0;
  saleDetailPagination: Pagination = new Pagination();


  // Lista de tipos de servicios
  listTypeServices: TypeServiceList[] = [];

  // Lista de servicios
  listServices: ServiceList[] = [];


  // SELECCIÓN DE SERVICIOS
  selectAllService: boolean = false;
  listServiceSelected: ServiceList[] = [];

  // Servicios ya añadidos al detalle temporal
  tmpListServiceRegistered: any[] = [];

  // Collapsable form instalaciones
  isCollapsedFormInstallation: boolean = true;
  isCollapsedInstallation: boolean = false;

  // Collapsable table servicios
  isCollapsedFormSearchInstallation: boolean = true;
  isCollapsedService: boolean = false;

  // Collapse table detalle venta
  isCollapseFormSaleDetail: boolean = true;
  isCollapseSaleDetail: boolean = false;

  // Lista de instalaciones
  listInstallations: InstallationList[] = [];
  tmpListInstallations: InstallationList[] = [];
  tmpListInstallationOptions: InstallationList[] = [];
  tmpInstallationSelected?: InstallationList;

  // Lista de ventas detalles TEMPORALES
  tmpListSaleDetails: SaleDetailList[] = [];

  // FORMULARIO DETALLE DE VENTA
  titleFormSaleDetail: string = '';
  typeServiceFormSaleDetail: string = '';

  // Datos del registro seleccionado
  saleDetailActive: SaleDetail = null;

  // Controlar sub tabla del detalle
  subTableDetails: {visible: boolean, typeService?: string,  data?: any}[] = [];

  // Tipo de documentos
  listTypeDocuments: TypeDocumentList[] = [];

  // Operadores
  listOperators: OperatorList[] = [];

  private subscription: Subscription = new Subscription();

  constructor(
    public modalRef: BsModalRef,
    private cdr: ChangeDetectorRef,
    private modalService: BsModalService,
    private _sharedClientService: SharedClientService,
    private _tempSaleService: TempSaleService,
    private _typeDocumentService: TypeDocumentService,
    private _operatorService: OperatorService,
    private _typeServiceService: TypeServiceService,
    private _serviceService: ServiceService,
    private _tempSaleDetailService: TempSaleDetailService,
    private _tempInstallationService: TempInstallationService,
    private _formService: FormService,
    private _apiErrorFormattingService: ApiErrorFormattingService,
    private _sweetAlertService: SweetAlertService,
    private formBuilder: FormBuilder
  ) { }

  ngOnInit(): void {

    // Instacia de formulario
    this.initFormInstallation();
    this.initFormSaleDetail();

    this.apiServiceListPagination();

    // Instalaciones temporales
    // this.apiTempInstallationList();
    this.apiTypeServiceList();
    this.apiTypeDocumentList();
    this.apiOperatorList();

    // VENTA ID
    this.subscription.add(
      this._sharedClientService.getSaleId().subscribe((value: number) => {
        this.saleId = value;
        if(value){
          this.apiTempInstallationFilterSale(value);
        }
      })
    );

    // Tipos de documentos
    this.subscription.add(
      this._typeDocumentService.typeDocuments$
      .pipe(distinctUntilChanged())
      .subscribe((list: TypeDocumentList[]) => {
        this.listTypeDocuments = list;
      })
    )
    
    // Tipos operadores
    this.subscription.add(
      this._operatorService.listObserver$
      .pipe(distinctUntilChanged())
      .subscribe((list: OperatorList[]) => {
        this.listOperators = list;
      })
    )
    

    // Tipos de servicios
    this.subscription.add(
      this._typeServiceService.listObserver$
      .pipe(distinctUntilChanged())
      .subscribe((list: TypeServiceList[]) => {
        this.listTypeServices = list;
      })
    )


    // Instalaciones - observado
    this.subscription.add(
      this._tempInstallationService.listObserver$
        .pipe(
          distinctUntilChanged((prevList, currentList) =>
            prevList.map(item => item.id).join(',') === currentList.map(item => item.id).join(',')
          )
        )
        .subscribe((list: InstallationList[]) => {
          this.tmpListInstallations = list;
        })
    );

    // Detalle - observado
    this.subscription.add(
      this._tempSaleDetailService.listObserver$
        .subscribe((list: SaleDetailList[]) => {
          this.tmpListSaleDetails = list;

          // Obtener los servicio añadidos
          this.tmpListServiceRegistered = list.map((item) => item.servicios_id);

          // Cargar de datos a la subtabla
          this.subTableDetails = list.map((detail) => {
            try{
              detail.datos_json = JSON.parse(detail.datos_json);
              const typeDocument = this.listTypeDocuments.find((obj) => obj.id === detail?.datos_json?.tipo_documento_id);
              const operator = this.listOperators.find((obj) => obj.id === detail?.datos_json?.operador_donante_id);
              
              if (typeDocument !== undefined) {
                detail.datos_json.tipo_documento_nombre = typeDocument.nombre;
                detail.datos_json.tipo_documento_abreviacion = typeDocument.abreviacion;
              }
              if (operator !== undefined) {
                detail.datos_json.operador_donante_nombre = operator.nombre;
              }
            }catch(error){

            }

            
            let typeService = null;

            if(detail.tipo_servicios_nombre.toLocaleLowerCase().includes('movil')){
              typeService = 'mobile';
            }
            if(detail.tipo_servicios_nombre.toLocaleLowerCase().includes('fija')){
              typeService = 'fixed';
            }
            if(detail.tipo_servicios_nombre.toLocaleLowerCase().includes('tv')){
              typeService = 'tv';
            }

            return {visible: false, typeService, data: detail }
          });
        })
    );


    // Comprobar ventas_id del local storage
    const localVentasId = localStorage.getItem('ventas_id');
    if(localVentasId !== null && localVentasId !== undefined){
      this._sharedClientService.setSaleId(parseInt(localVentasId));
      this.apiTempInstallationFilterSale(parseInt(localVentasId));
      this.apiTempSaleDetailFilterSale(parseInt(localVentasId));
      this.apiTempSaleGetById(parseInt(localVentasId));
    }

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
   * ***************************************************************
   * FORM CONTROLS - DETALLE DE VENTA
   * ***************************************************************
   */
  get fd(){
    return this.saleDetailForm.controls;
  }

  private initFormSaleDetail(){
    const saleDetail = new SaleDetail();
    const formGroupData = this.getFormGroupSaleDetail(saleDetail);
    this.saleDetailForm = this.formBuilder.group(formGroupData);
  }

  private getFormGroupSaleDetail(model: SaleDetail){
    return {
      ...this._formService.modelToFormGroupData(model),
      is_active: [true, [Validators.nullValidator]],
    }
  }




  /**
   * ****************************************************************
   * OPERACIONES CON LA API - INSTALACIONES
   * ****************************************************************
   */
  public apiTempSaleGetById(id: number){
    this._sweetAlertService.loadingUp('Obteniendo datos')
    this._tempSaleService.getById(id).subscribe((response: ResponseApi) => {
      this._sweetAlertService.stop();
      if(response.code == 200){
        const data = SaleList.cast(response.data[0]);
        this._tempSaleService.changeDataObserver(data);
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

  public apiTempSaleFinalProcess(data: any){
    this._sweetAlertService.loadingUp('Obteniendo datos')
    this._tempSaleService.finalProcess(data).subscribe((response: ResponseApi) => {
      this._sweetAlertService.stop();
      if(response.code == 200){
        // const data = SaleList.cast(response.data[0]);
        // this._tempSaleService.changeDataObserver(data);
        localStorage.removeItem('ventas_id');
        console.log(response.data)
      }

      if(response.code == 500){
        if(response.errors){
          this._sweetAlertService.showTopEnd({type: 'error', title: response.errors?.message, message: response.errors?.error});
        }
      }
    }, (error: any) => {
      this._sweetAlertService.stop();
      if(error.message){
        this._sweetAlertService.showTopEnd({type: 'error', title: 'Error al finalizar la venta', message: error.message, timer: 2500});
      }
    });
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

  // Buscar instalaciones
  public apiTempInstallationSearch(search: string) {
    if(!this.saleId){
      return null;
    }
    this._tempInstallationService.getSearch({search, ventas_id: this.saleId}).subscribe((response: ResponseApi) => {
      this._sweetAlertService.stop();
      if(response.code == 200){
        this.tmpListInstallationOptions = response.data;
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

  public apiTempInstallationFilterSale(saleId: number){
    this._sweetAlertService.loadingUp('Obteniendo datos')
    this._tempInstallationService.getBySale(saleId).subscribe((response: ResponseApi) => {
      this._sweetAlertService.stop();
      if(response.code == 200){
        // this.tmpListInstallations = response.data;
        this._tempInstallationService.addArrayObserver(response.data);
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
            const direccion_completo = `
              ${data.tipo} 
              ${data.direccion} 
              ${data.numero != ''? ', '+ data.numero: ''} 
              ${data.escalera != ''? ', '+ data.escalera: ''} 
              ${data.portal != ''? ', '+ data.portal: ''} 
              ${data.planta != ''? ', '+ data.planta: ''} 
              ${data.puerta != ''? ', '+ data.puerta: ''}
            `;
            data.direccion_completo = direccion_completo;
            this._tempInstallationService.addObjectObserver(data);
            
            // GUARDAR EN EL LOCAL STORAGE SOLO SI NO SE ENCUENTRA 
            const localVentasId = localStorage.getItem('ventas_id');
            if(localVentasId == null || localVentasId == undefined){
              if(data.ventas_id){
                this._sharedClientService.setSaleId(data.ventas_id);
                localStorage.setItem('ventas_id', data.ventas_id.toString());
              }
            }
          }

          this.closeFormInstallation();
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
        if(response.code == 200){
          if(response.data[0]){
            const data: InstallationList = InstallationList.cast(response.data[0]);
            const direccion_completo = `
              ${data.tipo} 
              ${data.direccion} 
              ${data.numero != ''? ', '+ data.numero: ''} 
              ${data.escalera != ''? ', '+ data.escalera: ''} 
              ${data.portal != ''? ', '+ data.portal: ''} 
              ${data.planta != ''? ', '+ data.planta: ''} 
              ${data.puerta != ''? ', '+ data.puerta: ''}
            `;
            data.direccion_completo = direccion_completo;
            this._tempInstallationService.updateObjectObserver(data);
            this._sharedClientService.setSaleId(data.ventas_id);
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
        // this.tmpListSaleDetails = response.data;
        this._tempSaleDetailService.addArrayObserver(response.data);
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
  
  public apiTempSaleDetailFilterSale(saleId: number){
    this._sweetAlertService.loadingUp('Obteniendo datos')
    this._tempSaleDetailService.getBySale(saleId).subscribe((response: ResponseApi) => {
      this._sweetAlertService.stop();
      if(response.code == 200){
        // this.tmpListInstallations = response.data;
        this._tempSaleDetailService.addArrayObserver(response.data);
      }

      if(response.code == 500){
        if(response.errors){
          this._sweetAlertService.showTopEnd({type: 'error', title: response.errors?.message, message: response.errors?.error});
        }
      }
    }, (error: any) => {
      this._sweetAlertService.stop();
      if(error.message){
        this._sweetAlertService.showTopEnd({type: 'error', title: 'Error al listar los detalles ', message: error.message, timer: 2500});
      }
    });
  }
  
  private apiTempSaleDetailRegister(data: SaleDetail){
    this._sweetAlertService.loadingUp()
    this.subscription.add(
      this._tempSaleDetailService.register(data).subscribe((response: ResponseApi) => {
        this._sweetAlertService.stop();
        if(response.code == 201){
          // const {ventas_id, instalaciones_id, venta_detalle} = response.data;
          // if(ventas_id){
          //   localStorage.setItem('ventas_id', ventas_id);
          // }

          // this.apiTempSaleDetailFilterSale(ventas_id);
          // this.apiTempInstallationFilterSale(ventas_id);
          // if(response.data[0]){
          //   const data: SaleDetailList = SaleDetailList.cast(response.data[0]);
          //   this._tempSaleDetailService.addObjectObserver(data);
          // }
          this.listServiceSelected = [];
          this.onRemoveOptionInstallation();

          this.apiTempSaleDetailFilterSale(data.ventas_id);
          setTimeout(() => {
            this._sweetAlertService.showTopEnd({type: 'success', title: "Proceso detalle", message: "Registro añadido con éxito", timer: 2500});
          }, 100);
        }

        if(response.code == 422){
          if(response.errors){
            const textErrors = this._apiErrorFormattingService.formatAsHtml(response.errors);
            this._sweetAlertService.showTopEnd({type: 'error', title: response.message, message: textErrors});
            // const {installation_errors, sale_detail_errors, sale_errors} = response.errors;
            // let textErrors = '';

            // if(installation_errors){
            //   textErrors += this._apiErrorFormattingService.formatAsHtml(installation_errors);
            // }

            // if(sale_detail_errors){
            //   textErrors += this._apiErrorFormattingService.formatAsHtml(sale_detail_errors);
            // }

            // if(sale_errors){
            //   textErrors += this._apiErrorFormattingService.formatAsHtml(sale_errors);
            // }

            // if(textErrors != ''){
            //   this._sweetAlertService.showTopEnd({type: 'error', title: response.message, message: textErrors});
            // }
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

  private apiTempSaleDetailUpdate(data: SaleDetail, id: number){
    this._sweetAlertService.loadingUp()
    this.subscription.add(
      this._tempSaleDetailService.update(data, id).subscribe((response: ResponseApi) => {
        this._sweetAlertService.stop();
        if(response.code == 200){
          this.closeFormSaleDetail();

          if(response.data[0]){
            const data: SaleDetailList = SaleDetailList.cast(response.data[0]);
            // const operator = this.listOperators.find((row) => row.id == data.ope)
            const typeDocument = this.listTypeDocuments.find((obj) => obj.id === data?.datos_json?.tipo_documento_id);
            const operator = this.listOperators.find((obj) => obj.id === data?.datos_json?.operador_donante_id);
            
            if (typeDocument !== undefined) {
              data.datos_json.tipo_documento_nombre = typeDocument.nombre;
              data.datos_json.tipo_documento_abreviacion = typeDocument.abreviacion;
            }
            if (operator !== undefined) {
              data.datos_json.operador_donante_nombre = operator.nombre;
            }

  
            this._tempSaleDetailService.updateObjectObserver(data);

            setTimeout(() => {
              this._sweetAlertService.showCenter({type: 'success', title: "Proceso detalle", message: "Registro actualizado con éxito", timer: 2500});
            }, 0);
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

  private apiTempSaleDetailDelete(id: number){
    this._sweetAlertService.loadingUp()
    this._tempSaleDetailService.delete(id).subscribe((response: ResponseApi) => {
      this._sweetAlertService.stop();
      if(response.code == 200){
        const data: SaleDetailList = SaleDetailList.cast(response.data[0]);
        this._tempSaleDetailService.removeObjectObserver(data.id);
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
        this._sweetAlertService.showTopEnd({type: 'error', title: 'Error al eliminar el detalle', message: error.message, timer: 2500});
      }
    });
  }


  /**
   * ****************************************************************
   * OPERACIONES CON LA API - TIPO DE SERVICIOS
   * ****************************************************************
   */
  public apiTypeServiceList(forceRefresh: boolean = false){
    this._sweetAlertService.loadingUp('Obteniendo datos')
    this._typeServiceService.getAll(forceRefresh).subscribe((response: ResponseApi) => {
      this._sweetAlertService.stop();
      if(response.code == 200){
        // this.listTypeServices = response.data; El servicio lo emite al observable
      }

      if(response.code == 500){
        if(response.errors){
          this._sweetAlertService.showTopEnd({type: 'error', title: response.errors?.message, message: response.errors?.error});
        }
      }
    }, (error: any) => {
      this._sweetAlertService.stop();
      if(error.message){
        this._sweetAlertService.showTopEnd({type: 'error', title: 'Error al listar los tipos de servicios', message: error.message, timer: 2500});
      }
    });
  }

  /**
   * ****************************************************************
   * OPERACIONES CON LA API - TIPO DE DOCUMENTOS
   * ****************************************************************
   */
  public apiTypeDocumentList(forceRefresh: boolean = false){
    this._sweetAlertService.loadingUp('Obteniendo datos')
    this._typeDocumentService.getAll(forceRefresh).subscribe((response: ResponseApi) => {
      this._sweetAlertService.stop();
      if(response.code == 200){
        // this.listTypeServices = response.data; El servicio lo emite al observable
      }

      if(response.code == 500){
        if(response.errors){
          this._sweetAlertService.showTopEnd({type: 'error', title: response.errors?.message, message: response.errors?.error});
        }
      }
    }, (error: any) => {
      this._sweetAlertService.stop();
      if(error.message){
        this._sweetAlertService.showTopEnd({type: 'error', title: 'Error al listar los tipos de documentos', message: error.message, timer: 2500});
      }
    });
  }

  /**
   * ****************************************************************
   * OPERACIONES CON LA API - TIPO DE DOCUMENTOS
   * ****************************************************************
   */
  public apiOperatorList(forceRefresh: boolean = false){
    this._sweetAlertService.loadingUp('Obteniendo datos')
    this._operatorService.getAll(forceRefresh).subscribe((response: ResponseApi) => {
      this._sweetAlertService.stop();
      if(response.code == 200){
        // this.listTypeServices = response.data; El servicio lo emite al observable
      }

      if(response.code == 500){
        if(response.errors){
          this._sweetAlertService.showTopEnd({type: 'error', title: response.errors?.message, message: response.errors?.error});
        }
      }
    }, (error: any) => {
      this._sweetAlertService.stop();
      if(error.message){
        this._sweetAlertService.showTopEnd({type: 'error', title: 'Error al listar los operadores', message: error.message, timer: 2500});
      }
    });
  }


  /**
   * ***************************************************************
   * SERVER SIDE - DETALLE DE LA VENTA
   * ***************************************************************
   */
  apiSaleDetailListPagination(): void {
    this.subscription.add(
      this._tempSaleDetailService.getPagination({
        page: this.saleDetailPage.toString(),
        perPage: this.saleDetailPerPage.toString(),
        search: this.saleDetailSearch,
        column: this.saleDetailColumn,
        order: this.saleDetailOrder
      })
      .pipe(debounceTime(250))
      .subscribe((response: ResponsePagination) => {
        if(response.code == 200){
          this.saleDetailPagination = Pagination.cast(response.data);
          this.tmpListSaleDetails = response.data.data;
          this.saleDetailPage = response.data.current_page;
          this.saleDetailTotal = response.data.total;
        }
        
        if(response.code == 500){
          if(response.errors){
            this._sweetAlertService.showTopEnd({type: 'error', title: response.errors?.message, message: response.errors?.error});
          }
        }
      }, (error: any) => {
        if(error.message){
          this._sweetAlertService.showTopEnd({type: 'error', title: 'Error al cargar detalle de venta', message: error.message, timer: 2500});
        }
      })
    ); 
  }

  getPageSaleDetail(event: any){
    const {page, itemsPerPage} = event;
    this.saleDetailPage = page;
    this.saleDetailPerPage = itemsPerPage;
    this.cdr.detectChanges();

    setTimeout(() => {
      this.apiSaleDetailListPagination();
    }, 0);
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
        order: this.serviceOrder,
        tipo_servicios_id: this.selectTypeService
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
      // Solo obtener la selección de los servicios que aun o han sido añadidos al detalle de venta
      this.listServiceSelected = this.servicePagination.data.map((obj: ServiceList) => {
        if (!this.tmpListServiceRegistered.includes(obj.id)) {
          return obj;
        }
        return null; // Retorna null para los elementos que ya existen en tmpListServiceRegistered
      }).filter((obj: ServiceList | null) => obj !== null); // Solo devolver los diferentes de null
      
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
   * VALIDAR SI EL SERVICIO YA ESTA REGISTRADO EN EL DETALLE DE LA VENTA TEMPORAL
   * @param id identificador del servicio
   * @returns 
   */
  getRowServiceIsRegistered(id: number){
    return this.tmpListServiceRegistered.some((serviceId) => serviceId === id);
  }

  /**
   * VALIDAR SI EL SERVICIO AÑADIDO AL DETALLE - LE FALTA DATOS DEL JSON
   * @param data objeto de cada fila
   * @returns 
   */
  getRowDetailIsNullJson(data: SaleDetailList){
    // console.log(data)
    if(data?.tipo_servicios_nombre?.toLowerCase().includes('tv')){
      return false;
    }
    return data.datos_json !== null? false: true

  }


  /**
   * Mostrar alerta de confirmación para poder mostrar el formulario de SELECT instalaciones
   */
  confirmServiceSelected(){
    if(this.listServiceSelected.length == 0){
      this._sweetAlertService.showCenter({title: 'Validación de datos', message: 'Aun no ha seleccionado ningún servicio', type: 'warning', timer: 1500});
    } else{
      this.isCollapsedFormSearchInstallation = false;
      this.isCollapsedService = true;
      this.apiTempInstallationSearch('');
    }

  }



  /**
   * ****************************************************************
   * ABRIR FORMULARIO - INSTALACIÓN
   * ****************************************************************
   */
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

  // Selección de instalación del select
  onSelectOptionInstallation(selectItem: any){
    if(selectItem){
      this.tmpInstallationSelected = selectItem;
    }
  }

  // Eliminar la selección
  onRemoveOptionInstallation(event: any = null){
    this.optionSearchInstallation = null;
    this.tmpInstallationSelected = null;
    this.isCollapsedFormSearchInstallation = true;
    this.isCollapsedService = false;
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
      const localVentasId = localStorage.getItem('ventas_id');
      if(localVentasId !== null && localVentasId !== undefined){
        values.ventas_id = this.saleId;
      }


      if(this.isNewDataInstallation){
        // Crear nuevo registro
        this._sweetAlertService.showConfirmationAlert('¿Estas seguro de registrar la ubicación?').then((confirm) => {
          if(confirm.isConfirmed){
            // this.apiTempSaleDetailRegister(request);
            this.apiTempInstallationRegister(values);
            // this.closeFormInstallation();
          }
        });
      } else {
        // Actualizar datos
        this._sweetAlertService.showConfirmationAlert('¿Estas seguro de modificar la ubicación?').then((confirm) => {
          if(confirm.isConfirmed){
            this.apiTempInstallationUpdate(values, values.id);
            this.closeFormInstallation();
          }
        });
      }
    }

    this.submittedInstallation = true;
  }

  // Cerrar el formulario de la instalación
  closeFormInstallation(){
    this.initFormInstallation();
    this.isNewDataInstallation = true;
    this.isCollapsedFormInstallation = true;
    this.isCollapsedInstallation = false;
  }


  /**
   * SELECCIONAR EL REGISTRO  A MODIFICAR -  INSTALACIÓN
   */
  editDataInstallationGet(id: number){
    var data = this.tmpListInstallations.find((data: { id: any; }) => data.id === id);
    const installation = Installation.cast(data);

    this.installationForm = this.formBuilder.group({
      ...this._formService.modelToFormGroupData(installation), 
      id: [data.id],
      tipo: [data.tipo, [Validators.required, Validators.maxLength(50)]],
      ventas_id: [data.ventas_id, [Validators.nullValidator, Validators.min(1)]],
      direccion: [data.direccion, [Validators.required, Validators.maxLength(150)]],
      localidad: [data.localidad, [Validators.required, Validators.maxLength(70)]],
      provincia: [data.provincia, [Validators.required, Validators.maxLength(70)]],
      codigo_postal: [data.codigo_postal, [Validators.required, Validators.maxLength(20)]],
    });

    // Mostrar formulario y ocultar el listado
    this.isNewDataInstallation = false;
    this.isCollapsedFormInstallation = false;
    this.isCollapsedInstallation = true;
  }

  /**
   * ****************************************************************
   * ELIMINAR UN REGISTRO - INSTALACIÓN
   * ****************************************************************
   * @param id id del registro a eliminar
   */
  deleteRowInstallation(id: any){
    this._sweetAlertService.showConfirmationAlert('¿Estas seguro de eliminar la instalación?').then((confirm) => {
      if(confirm.isConfirmed){
        this.apiTempInstallationDelete(id);
      }
    });
  }



  
  /**
   * ****************************************************************
   * ABRIR FORMULARIO - DETALLE DE VENTA
   * ****************************************************************
   */
  // Toggle formulario de instalaciones
  toggleFormSaleDetail(){
    this.isCollapseFormSaleDetail = !this.isCollapseFormSaleDetail;
    if(!this.isCollapseFormSaleDetail){
      this.isCollapseSaleDetail = true;
    }
  }

  // Toggle formulario de instalaciones
  toggleListSaleDetail(){
    this.isCollapseSaleDetail = !this.isCollapseSaleDetail;
    if(!this.isCollapseSaleDetail){
      this.isCollapseFormSaleDetail = true;
    }
  }

  // Cerrar el formulario de la instalación
  closeFormSaleDetail(){
    // this.initFormSaleDetail();
    this.isNewDataSaleDetail = true;
    this.isCollapseFormSaleDetail = true;
    this.isCollapseSaleDetail = false;
    this.saleDetailActive = null;
    // this.typeServiceFormSaleDetail = null;
  }

  /**
   * ***************************************************************
   * Capturar los valores del formulario -  FORMULARIO EXTERNO (SALE DETAIL)
   * ***************************************************************
   * @param data 
   */
  handleFormSaleDetail(data: any){
    if(data){
      this._sweetAlertService.showConfirmationAlert('¿Estas seguro de modificar el detalle?').then((confirm) => {
        if(confirm.isConfirmed){
          this.apiTempSaleDetailUpdate(data, data.id);
        }
      });
    }
  }


  /**
   * ****************************************************************
   * GUARDAR DATOS (SERVICIOS + INSTALACIONES)- DETALLE VENTA
   * ****************************************************************
   */
  saveDataSaleDetail() {
    if(this.listServiceSelected.length == 0){
      this._sweetAlertService.showTopEnd({title: 'Validación de datos', message: 'No a especificado los servicios para agregar al detalle de la venta', type: 'warning', timer: 1500});
    } else {
      const request = new SaleDetail();
      delete request.datos_json;
      const selectedServiceIds = this.listServiceSelected.map((service) => service.id);
      request['servicios_ids'] = selectedServiceIds;

      if(this.tmpInstallationSelected){
        request.instalaciones_id = this.tmpInstallationSelected.id;
        request.ventas_id = this.tmpInstallationSelected.ventas_id;
      }

      const localVentasId = localStorage.getItem('ventas_id');
      if(localVentasId !== null){
        request.ventas_id = parseInt(localVentasId);
      }


      if(this.isNewDataSaleDetail){
        // Crear nuevo registro
        this._sweetAlertService.showConfirmationAlert('¿Estas seguro de registrar los servicios seleccionado?').then((confirm) => {
          if(confirm.isConfirmed){
            this.apiTempSaleDetailRegister(request);
            // this.listServiceSelected = [];
            // this.onRemoveOptionInstallation();
          }
        });
      } else {
        // Actualizar datos
      }
    }

    this.submittedInstallation = true;
  }

  // Obtener los datos del registro y mostrarlo en el formulario
  editSaleDetailGet(id: any){
    this.isNewDataSaleDetail = false;
    this.isCollapseFormSaleDetail = false;
    this.isCollapseSaleDetail = true;
    var data = this.tmpListSaleDetails.find((data: { id: any; }) => data.id === id);

    try{
      data.datos_json = JSON.parse(data.datos_json);
    } catch(error){
      // No es un JSON
    }

    const saleDetail= SaleDetail.cast(data);
    this.saleDetailActive = saleDetail;

    if(data.tipo_servicios_nombre.toLocaleLowerCase().includes('movil')){
      this.typeServiceFormSaleDetail = 'mobile';
    }
    if(data.tipo_servicios_nombre.toLocaleLowerCase().includes('fija')){
      this.typeServiceFormSaleDetail = 'fixed';
    }
    if(data.tipo_servicios_nombre.toLocaleLowerCase().includes('tv')){
      this.typeServiceFormSaleDetail = 'tv';
    }

    this.titleFormSaleDetail = data.tipo_servicios_nombre;
  }


  /**
   * ELIMINAR UN REGISTRO DEL DETALLE DE VENTA
   * @param id 
   */
  deleteRowSaleDetail(id: any){
    this._sweetAlertService.showConfirmationAlert('¿Estas seguro de eliminar el registro?').then((confirm) => {
      if(confirm.isConfirmed){
        this.apiTempSaleDetailDelete(id);
      }
    });
  }


  /**
   * MOSTRAR DETALLE EN LA SUB TABLA
   */
  changeValueHideSubTable(index: number) {
    this.subTableDetails[index].visible = !this.subTableDetails[index].visible;
  }


  /**
   * *************************************************************
   * TERMINAR VENTA
   * *************************************************************
   */
  saveSaleFinal(){
    this._sweetAlertService.showConfirmationAlert('¿Estas seguro de completar la venta?').then((confirm) => {
      if(confirm.isConfirmed){
        this.apiTempSaleFinalProcess({ventas_id: this.saleId});
      }
    })
  }
}
