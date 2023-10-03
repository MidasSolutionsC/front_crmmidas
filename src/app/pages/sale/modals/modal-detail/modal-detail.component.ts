import { ChangeDetectorRef, Component, Input, OnChanges, OnDestroy, OnInit, Renderer2, SimpleChanges, TemplateRef, ViewChild } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Subscription, distinctUntilChanged } from 'rxjs';
import { AddressList, BankAccountList, CompanyList, ContactList, OperatorList, PersonList, ResponseApi, SaleCommentList, SaleDetailList, SaleDocumentList, SaleHistoryList, SaleList, TypeDocumentList } from 'src/app/core/models';
import { ClientList } from 'src/app/core/models/api/client.model';
import { AddressService, ApiErrorFormattingService, BankAccountService, ClientService, ConfigService, ContactService, OperatorService, SaleCommentService, SaleDetailService, SaleDocumentService, SaleHistoryService, SaleService, SharedClientService, SweetAlertService, TypeDocumentService } from 'src/app/core/services';

@Component({
  selector: 'app-modal-detail',
  templateUrl: './modal-detail.component.html',
  styleUrls: ['./modal-detail.component.scss']
})
export class ModalDetailComponent implements OnInit, OnDestroy, OnChanges{

  @ViewChild('content') contentModal: TemplateRef<any>;
  @ViewChild('first') modalForm: any;
  
  // DATOS DE ENTRADAS
  @Input() dataInput: SaleList = null; 

  // MODO DE LA VISTA
  modeView: 'view' | 'edit' = 'view';

  // FORMULARIO A MOSTRAR
  formEditLabel: any;

  // dato compartido a los formularios
  shareDataForm: any = null;
  shareDataTypeService: any = null;

  // REFERENCIA AL MODAL ACTUAL
  modalRefCurrent?: BsModalRef;

  // DATOS DEL MODAL
  dataModal: any = {
    title: 'Detalle de la venta'
  };

  // MODAL DE EDICIÓN DE DATOS
  dataModalEdit: any = {
    title: 'Formulario'
  }
  
  URL_FILES: string = '';


  // DATOS CLIENTE
  dataClient: ClientList;

  // DATOS PERSONA
  dataPerson: PersonList;

  // DATOS EMPRESA
  dataCompany: CompanyList;

  // DATOS DETALLE
  dataSaleDetail: SaleDetailList;
  

  // DATOS TIPO DE DOCUMENTOS
  dataTypeDocument: TypeDocumentList;

  // DATOS DOCUMENTOS
  dataSaleDocument: SaleDocumentList;
  listSaleDocument: SaleDocumentList[] = [];

  // DATOS COMENTARIOS
  dataSaleComment: SaleCommentList;
  listSaleComment: SaleCommentList[] = [];

  // DATOS HISTORIAL
  dataSaleHistory: SaleHistoryList;
  listSaleHistory: SaleHistoryList[] = [];

  // CONTACTOS
  listContact: ContactList[] = [];

  // DIRECCIONES
  listAddress: AddressList[] = [];

  // CUENTAS BANCARIAS
  listBankAccount: BankAccountList[] = [];

  // Lista de ventas detalles
  groupSaleDetail: any;

  // Tipo de documentos
  listTypeDocuments: TypeDocumentList[] = [];

  // Operadores
  listOperators: OperatorList[] = [];

  private subscription: Subscription = new Subscription();
  
  constructor(
    public modalRef: BsModalRef,
    private modalService: BsModalService,
    private cdr: ChangeDetectorRef,
    private _configService: ConfigService,
    private _sharedClientService: SharedClientService,
    private _operatorService: OperatorService,
    private _typeDocumentService: TypeDocumentService,
    private _clientService: ClientService,
    private _contactService: ContactService,
    private _addressService: AddressService,
    private _bankAccountService: BankAccountService,
    private _saleService: SaleService,
    private _saleDetailService: SaleDetailService,
    private _saleDocumentService: SaleDocumentService,
    private _saleCommentService: SaleCommentService,
    private _saleHistoryService: SaleHistoryService,
    private _apiErrorFormattingService: ApiErrorFormattingService,
    private _sweetAlertService: SweetAlertService,
  ){
    this.URL_FILES = this._configService.urlFiles + 'sale/';
  }

  ngOnInit(): void {
    this.apiTypeDocumentList();
    this.apiOperatorList();
    this.onChanges();

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

                
    // CONTACTOS
    this.subscription.add(
      this._contactService.listObserver$
        .subscribe((list: ContactList[]) => {
          this.listContact = list;
        })
    );
            
    // DIRECCIONES
    this.subscription.add(
      this._addressService.listObserver$
        .subscribe((list: AddressList[]) => {
          this.listAddress = list;
        })
    );

    // CUENTAS BANCARIAS
    this.subscription.add(
      this._bankAccountService.listObserver$
        .subscribe((list: BankAccountList[]) => {
          this.listBankAccount = list;
        })
    );

            
    // Detalle de la venta
    this.subscription.add(
      this._saleDetailService.listObserver$
        .subscribe((list: SaleDetailList[]) => {
          this.groupSaleDetail = list.reduce(function (acc, detail) {
            try{
              detail.datos_json = JSON.parse(detail.datos_json);
              const typeDocument = this.listTypeDocuments.find((obj) => obj.id === detail?.datos_json?.tipo_documento_id);
              const operator = this.listOperators.find((obj: any) => obj.id === detail?.datos_json?.operador_donante_id);
              
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

            detail['visible'] = false;

            var key = typeService;
            if (!acc[key]) {
                acc[key] = [];
            }
            acc[key].push(detail);
            return acc;
          }, {});
        })
    );
            
    // Documentos
    this.subscription.add(
      this._saleDocumentService.listObserver$
        .subscribe((list: SaleDocumentList[]) => {
          this.listSaleDocument = list;
        })
    );
            
    // Comentarios
    this.subscription.add(
      this._saleCommentService.listObserver$
        .subscribe((list: SaleCommentList[]) => {
          this.listSaleComment = list.map((obj: any) => {
            obj.more = false;
            return obj;
          });
        })
    );
            
    // Historial
    this.subscription.add(
      this._saleHistoryService.listObserver$
        .subscribe((list: SaleHistoryList[]) => {
          this.listSaleHistory = list.map((obj: any) => {
            obj.more = false;
            return obj;
          });
        })
    );

  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }


  ngOnChanges(changes: SimpleChanges): void {
    if(changes.dataInput && !changes.dataInput.firstChange){
      this.onChanges();
    }
  }


  /***
   * ***************************************************************
   * DETECTAR CAMBIOS EN LA VARIABLE DE ENTRADA
   * ***************************************************************
   */
  onChanges(){
    if(this.dataInput){
      // console.log("DATOS DE LA VENTA:",this.dataInput);
      const {id, clientes_id, clientes_persona_juridica} = this.dataInput;

      if(id){
        this.apiSaleDetailFilterSale(id);
        this.apiSaleDocumentFilterSale(id);
        this.apiSaleCommentFilterSale(id);
        this.apiSaleHistoryFilterSale(id);
      }

      if(clientes_id){
        this.apiClientGetById(clientes_id);
      }
    }
  }


  /**
   * ****************************************************************
   * OPERACIONES CON LA API
   * ****************************************************************
   */
  // Cargar TIPO DE DOCUMENTOS
  public apiTypeDocumentList(forceRefresh: boolean = false){
    this._sweetAlertService.loadingUp('Obteniendo datos')
    this._typeDocumentService.getAll(forceRefresh).subscribe((response: ResponseApi) => {
      this._sweetAlertService.stop();
      if(response.code == 200){
        // this._typeDocumentService.addArrayObserver(response.data);
      }

      if(response.code == 500){
        if(response.errors){
          this._sweetAlertService.showTopEnd({type: 'error', title: response.errors?.message, message: response.errors?.error});
        }
      }
    }, (error: any) => {
      this._sweetAlertService.stop();
      if(error.message){
        this._sweetAlertService.showTopEnd({type: 'error', title: 'Error al listar los tipos de documentos ', message: error.message, timer: 2500});
      }
    });
  }

  // Cargar OPERADORES
  public apiOperatorList(forceRefresh: boolean = false){
    this._sweetAlertService.loadingUp('Obteniendo datos')
    this._operatorService.getAll(forceRefresh).subscribe((response: ResponseApi) => {
      this._sweetAlertService.stop();
      if(response.code == 200){
        // this._operatorService.addArrayObserver(response.data);
      }

      if(response.code == 500){
        if(response.errors){
          this._sweetAlertService.showTopEnd({type: 'error', title: response.errors?.message, message: response.errors?.error});
        }
      }
    }, (error: any) => {
      this._sweetAlertService.stop();
      if(error.message){
        this._sweetAlertService.showTopEnd({type: 'error', title: 'Error al listar los operadores ', message: error.message, timer: 2500});
      }
    });
  }

  // OPERACIONES CON LA API - OBTENER DATOS DEL CLIENTE
  public apiClientGetById(id: number): Promise<any>{
    this._sweetAlertService.loadingUp('Obteniendo datos')
    return new Promise((resolve, reject) => {
      this._clientService.getById(id).subscribe((response: ResponseApi) => {
        this._sweetAlertService.stop();
        if(response.code == 200){
          const data = response.data[0];
          if(data){
            if(data.person !== null){
              if(data.person.type_document){
                this.dataTypeDocument = TypeDocumentList.cast(data.person.type_document);
              }
              this.dataPerson = PersonList.cast(data.person);  
              
              this.apiContactFilterByPerson(this.dataPerson.id);
              this.apiAddressFilterByPerson(this.dataPerson.id);
            } 
            
            if(data.company !== null){
              if(data.company.type_document){
                this.dataTypeDocument = TypeDocumentList.cast(data.company.type_document);
              }
              this.dataCompany = CompanyList.cast(data.company);
              this.apiContactFilterByCompany(this.dataCompany.id);
              this.apiAddressFilterByCompany(this.dataCompany.id);
            } 
  
            this.dataClient = ClientList.cast(data);
            this.apiBankAccountFilterByClient(this.dataClient.id);
          }

          resolve(response.data[0]);
        }
  
        if(response.code == 500){
          if(response.errors){
            this._sweetAlertService.showTopEnd({type: 'error', title: response.errors?.message, message: response.errors?.error});
          }
          reject(response.errors);
        }
      }, (error: any) => {
        this._sweetAlertService.stop();
        if(error.message){
          this._sweetAlertService.showTopEnd({type: 'error', title: 'Error al listar datos del cliente', message: error.message, timer: 2500});
        }
        reject(error);
      });
    });
  }

  // Cargar los contactos del cliente -  PERSONA
  public apiContactFilterByPerson(personId: number){
    this._sweetAlertService.loadingUp('Obteniendo datos')
    this._contactService.getFilterPersonId(personId).subscribe((response: ResponseApi) => {
      this._sweetAlertService.stop();
      if(response.code == 200){
        this._contactService.addArrayObserver(response.data);
      }

      if(response.code == 500){
        if(response.errors){
          this._sweetAlertService.showTopEnd({type: 'error', title: response.errors?.message, message: response.errors?.error});
        }
      }
    }, (error: any) => {
      this._sweetAlertService.stop();
      if(error.message){
        this._sweetAlertService.showTopEnd({type: 'error', title: 'Error al listar los contactos ', message: error.message, timer: 2500});
      }
    });
  }

  // Cargar los contactos del cliente -   EMPRESA
  public apiContactFilterByCompany(companyId: number){
    this._sweetAlertService.loadingUp('Obteniendo datos')
    this._contactService.getFilterCompanyId(companyId).subscribe((response: ResponseApi) => {
      this._sweetAlertService.stop();
      if(response.code == 200){
        this._contactService.addArrayObserver(response.data);
      }

      if(response.code == 500){
        if(response.errors){
          this._sweetAlertService.showTopEnd({type: 'error', title: response.errors?.message, message: response.errors?.error});
        }
      }
    }, (error: any) => {
      this._sweetAlertService.stop();
      if(error.message){
        this._sweetAlertService.showTopEnd({type: 'error', title: 'Error al listar los contactos ', message: error.message, timer: 2500});
      }
    });
  }

  // Cargar los direcciones del cliente -   PERSONA
  public apiAddressFilterByPerson(personId: number){
    this._sweetAlertService.loadingUp('Obteniendo datos')
    this._addressService.getFilterPersonId(personId).subscribe((response: ResponseApi) => {
      this._sweetAlertService.stop();
      if(response.code == 200){
        this._addressService.addArrayObserver(response.data);
      }

      if(response.code == 500){
        if(response.errors){
          this._sweetAlertService.showTopEnd({type: 'error', title: response.errors?.message, message: response.errors?.error});
        }
      }
    }, (error: any) => {
      this._sweetAlertService.stop();
      if(error.message){
        this._sweetAlertService.showTopEnd({type: 'error', title: 'Error al listar las direcciones ', message: error.message, timer: 2500});
      }
    });
  }

  // Cargar los direcciones del cliente -   EMPRESA
  public apiAddressFilterByCompany(companyId: number){
    this._sweetAlertService.loadingUp('Obteniendo datos')
    this._addressService.getFilterCompanyId(companyId).subscribe((response: ResponseApi) => {
      this._sweetAlertService.stop();
      if(response.code == 200){
        this._addressService.addArrayObserver(response.data);
      }

      if(response.code == 500){
        if(response.errors){
          this._sweetAlertService.showTopEnd({type: 'error', title: response.errors?.message, message: response.errors?.error});
        }
      }
    }, (error: any) => {
      this._sweetAlertService.stop();
      if(error.message){
        this._sweetAlertService.showTopEnd({type: 'error', title: 'Error al listar las direcciones ', message: error.message, timer: 2500});
      }
    });
  }

  // Cargar las cuentas bancarias del cliente -  CLIENTE
  public apiBankAccountFilterByClient(clientId: number){
    this._sweetAlertService.loadingUp('Obteniendo datos')
    this._bankAccountService.getFilterClientId(clientId).subscribe((response: ResponseApi) => {
      this._sweetAlertService.stop();
      if(response.code == 200){
        this._bankAccountService.addArrayObserver(response.data);
      }

      if(response.code == 500){
        if(response.errors){
          this._sweetAlertService.showTopEnd({type: 'error', title: response.errors?.message, message: response.errors?.error});
        }
      }
    }, (error: any) => {
      this._sweetAlertService.stop();
      if(error.message){
        this._sweetAlertService.showTopEnd({type: 'error', title: 'Error al listar las cuentas bancarias ', message: error.message, timer: 2500});
      }
    });
  }

  // Cargar VENTA DETALLE
  public apiSaleDetailFilterSale(saleId: number){
    this._sweetAlertService.loadingUp('Obteniendo datos')
    this._saleDetailService.getBySale(saleId).subscribe((response: ResponseApi) => {
      this._sweetAlertService.stop();
      if(response.code == 200){
        this._saleDetailService.addArrayObserver(response.data);
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

  // Cargar DOCUMENTOS DE LA VENTA
  public apiSaleDocumentFilterSale(saleId: number){
    this._sweetAlertService.loadingUp('Obteniendo datos')
    this._saleDocumentService.getFilterBySale(saleId).subscribe((response: ResponseApi) => {
      this._sweetAlertService.stop();
      if(response.code == 200){
        this._saleDocumentService.addArrayObserver(response.data);
      }

      if(response.code == 500){
        if(response.errors){
          this._sweetAlertService.showTopEnd({type: 'error', title: response.errors?.message, message: response.errors?.error});
        }
      }
    }, (error: any) => {
      this._sweetAlertService.stop();
      if(error.message){
        this._sweetAlertService.showTopEnd({type: 'error', title: 'Error al listar los documentos ', message: error.message, timer: 2500});
      }
    });
  }

  // Cargar COMENTARIOS DE LA VENTA
  public apiSaleCommentFilterSale(saleId: number){
    this._sweetAlertService.loadingUp('Obteniendo datos')
    this._saleCommentService.getFilterBySale(saleId).subscribe((response: ResponseApi) => {
      this._sweetAlertService.stop();
      if(response.code == 200){
        this._saleCommentService.addArrayObserver(response.data);
      }

      if(response.code == 500){
        if(response.errors){
          this._sweetAlertService.showTopEnd({type: 'error', title: response.errors?.message, message: response.errors?.error});
        }
      }
    }, (error: any) => {
      this._sweetAlertService.stop();
      if(error.message){
        this._sweetAlertService.showTopEnd({type: 'error', title: 'Error al listar los comentarios ', message: error.message, timer: 2500});
      }
    });
  }

  // Cargar COMENTARIOS DE LA VENTA
  public apiSaleHistoryFilterSale(saleId: number){
    this._sweetAlertService.loadingUp('Obteniendo datos')
    this._saleHistoryService.getFilterBySale(saleId).subscribe((response: ResponseApi) => {
      this._sweetAlertService.stop();
      if(response.code == 200){
        this._saleHistoryService.addArrayObserver(response.data);
      }

      if(response.code == 500){
        if(response.errors){
          this._sweetAlertService.showTopEnd({type: 'error', title: response.errors?.message, message: response.errors?.error});
        }
      }
    }, (error: any) => {
      this._sweetAlertService.stop();
      if(error.message){
        this._sweetAlertService.showTopEnd({type: 'error', title: 'Error al listar el historial ', message: error.message, timer: 2500});
      }
    });
  }



  /**
   * ****************************************************************
   * MOSTRAR DETALLE
   * ****************************************************************
   */
  toggleVisibility(item: any) {
    item.visible = !item.visible;
  }
  
  /**
   * ****************************************************************
   * VALIDAR DATOS JSON
   * ****************************************************************
   */
  getRowDetailIsNullJson(data: any){
    if(data?.tipo_servicios_nombre?.toLowerCase().includes('tv')){
      return false;
    }
    return data.datos_json !== null? false: true

  }

  /**
   * ****************************************************************
   * MOSTRAR COMENTARIO
   * ****************************************************************
   */
  toggleCommentMore(item: any){
    item.more = !item.more;
  }



  /**
   * ****************************************************************
   * EDITAR EL REGISTRO - ITEM SELECCIONADO
   * ****************************************************************
   */
  onEditItem(process: any, data: any = null){
    console.log("EDIT:", process, data);
    
    this.formEditLabel = process;
    this.shareDataForm = data;
    this.changeModalView('edit');


    if(process == 'client' || process == 'contact' || process == 'address'){
      this._sharedClientService.setClientId(this.dataClient.id);
      this._sharedClientService.setClientId(this.dataClient.id);
      this._sharedClientService.setLegalPerson(this.dataClient.persona_juridica);
  
      if(this.dataClient.persona_juridica){
        // EMPRESA
        this._sharedClientService.setCompanyId(this.dataCompany.id);
      } else {
        // PERSONA
        this._sharedClientService.setPersonId(this.dataPerson.id);
      }
    }

    switch(process){
      case 'client':
        this.dataModal.title = 'Edición de cliente';
      break;
      case 'contact':
        this.dataModal.title = 'Edición de contacto';      
      break;
      case 'address':
        this.dataModal.title = 'Edición de dirección';
      break;
      case 'bankAccount':
        this.dataModal.title = 'Edición de cuenta bancaria';
        this._sharedClientService.setClientId(this.dataClient.id);
      break;
      case 'saleDetail':
        this.dataModal.title = 'Edición de servicio';
        // this.shareDataTypeService = 'mobile';
      break;
      default:
        this.dataModal.title = 'Detalle de la venta';
      break;
    }
  }


  // OBTENER LOS DATOS MODIFICADOS DE CONTACTOS
  getDataFormContact(event: any){
    const {updated, data} = event;
    if(updated){
      this.listContact = this.listContact.map((item) => {
        if(item.id == data.id){
          return ContactList.cast(data);
        }

        return item;
      })
    }

    this.changeModalView('view');
  }

  // OBTENER LOS DATOS MODIFICADOS DE DIRECCIÓN
  getDataFormAddress(event: any){
    const {updated, data} = event;
    if(updated){
      this.listAddress = this.listAddress.map((item) => {
        if(item.id == data.id){
          return AddressList.cast(data);
        }

        return item;
      })
    }

    this.changeModalView('view');
  }

  // OBTENER LOS DATOS MODIFICADOS DE SERVICIOS
  getDataFormService(event: any){
    const {updated, data} = event;
    if(updated){
      // this.listAddress = this.listAddress.map((item) => {
      //   if(item.id == data.id){
      //     return AddressList.cast(data);
      //   }

      //   return item;
      // })
    }

    console.log(event);
    this.changeModalView('view');
  }


  /**
   * ****************************************************************
   * CAMBIOS DE MODO VISUAL - (EDIT/VIEW)
   * ****************************************************************
   */
  changeModalView(mode: 'view' | 'edit' = 'view'){
    this.modeView = mode;

    if(mode == 'view'){
      this.dataModal.title = 'Detalle de la venta';
      this.shareDataForm = null;
      // this.modalRef.setClass('modal-sm modal-dialog-centered modal-dialog-scrollable');
    } 
  }


  /**
   * ****************************************************************
   * MOSTRAR MODAL - INTERNO
   * ****************************************************************
   */
  openModal(){
    this.modalRefCurrent = this.modalService.show(this.contentModal, { 
      class: 'modal-md modal-dialog-centered modal-dialog-scrollable',
    });
    this.modalRefCurrent.onHide.subscribe(() => {});
    // this.modalForm.show();
  }
}
