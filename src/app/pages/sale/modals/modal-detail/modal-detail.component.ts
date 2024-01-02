import { ChangeDetectorRef, Component, ElementRef, Input, OnChanges, OnDestroy, OnInit, Renderer2, SimpleChanges, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject, Subscription, debounceTime, distinctUntilChanged } from 'rxjs';
import { AddressList, BankAccountList, CompanyList, ContactList, InstallationList, OperatorList, Pagination, PaginationResult, PersonList, ResponseApi, SaleComment, SaleCommentList, SaleDetailList, SaleDocumentList, SaleHistoryList, SaleList, TypeDocumentList } from 'src/app/core/models';
import { ClientList } from 'src/app/core/models/api/client.model';
import { AddressService, ApiErrorFormattingService, BankAccountService, ClientService, ConfigService, ContactService, InstallationService, OperatorService, SaleCommentService, SaleDetailService, SaleDocumentService, SaleHistoryService, SaleService, SharedClientService, SweetAlertService, TypeDocumentService } from 'src/app/core/services';
import { ValidateTextUtil } from 'src/app/core/utils';

@Component({
  selector: 'app-modal-detail',
  templateUrl: './modal-detail.component.html',
  styleUrls: ['./modal-detail.component.scss']
})
export class ModalDetailComponent implements OnInit, OnDestroy, OnChanges {

  @ViewChild('content') contentModal: TemplateRef<any>;
  @ViewChild('first') modalForm: any;
  @ViewChild('commentContainer') commentContainer: ElementRef;


  // DATOS DE ENTRADAS
  @Input() dataSale: SaleList = null;

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
  listDetailSaleComment: SaleCommentList[] = [];

  // DATOS HISTORIAL
  dataSaleHistory: SaleHistoryList;
  listSaleHistory: SaleHistoryList[] = [];

  // CONTACTOS
  listContact: ContactList[] = [];

  // DIRECCIONES
  listAddress: AddressList[] = [];
  listInstallations: InstallationList[] = []

  // CUENTAS BANCARIAS
  listBankAccount: BankAccountList[] = [];

  // Lista de ventas detalles
  groupSaleDetail: any;

  // Tipo de documentos
  listTypeDocuments: TypeDocumentList[] = [];

  // Operadores
  listOperators: OperatorList[] = [];

  // ITEMS OPTIONS
  items: string[];


  // VARIABLES ´PARA REGISTRAR EL COMENTARIO DEL SERVICIO
  dataMsgComment: SaleComment = {
    ventas_id: null,
    ventas_detalles_id: null,
    comentario: ''
  }

  // Un objeto que contendrá formularios reactivos, uno por cada servicio
  comentariosForm: { [key: number]: FormGroup } = {};

  lazyLoadingComment: boolean = false;
  loadLazyTimeout: any;

  // PAGINACIÓN
  countElements: number[] = [2, 5, 10, 25, 50, 100];
  pagination: BehaviorSubject<Pagination> = new BehaviorSubject<Pagination>({
    page: 1,
    perPage: 10,
    search: '',
    column: '',
    order: 'desc',
  });

  paginationResult: PaginationResult = new PaginationResult();

  dataPaginationComments: {pagination: Pagination, ventas_detalles_id: number}[] = [] 

  private subscription: Subscription = new Subscription();

  constructor(
    public modalRef: BsModalRef,
    private fb: FormBuilder,
    private modalService: BsModalService,
    private cdr: ChangeDetectorRef,
    private _configService: ConfigService,
    private _sharedClientService: SharedClientService,
    private _operatorService: OperatorService,
    private _typeDocumentService: TypeDocumentService,
    private _clientService: ClientService,
    private _contactService: ContactService,
    private _addressService: AddressService,
    private _installationService: InstallationService,
    private _bankAccountService: BankAccountService,
    private _saleService: SaleService,
    private _saleDetailService: SaleDetailService,
    private _saleDocumentService: SaleDocumentService,
    private _saleCommentService: SaleCommentService,
    private _saleHistoryService: SaleHistoryService,
    private _apiErrorFormattingService: ApiErrorFormattingService,
    private _sweetAlertService: SweetAlertService,
  ) {
    this.URL_FILES = this._configService.urlFiles + 'sale/';
  }

  ngOnInit(): void {
    this.apiTypeDocumentList();
    this.apiOperatorList();
    this.onChanges();

    this.items = Array.from({ length: 1000 }).map((_, i) => `Item #${i}`);

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
    // this.subscription.add(
    //   this._addressService.listObserver$
    //     .subscribe((list: AddressList[]) => {
    //       this.listAddress = list;
    //     })
    // );

    // INSTALACIONES
    this.subscription.add(
      this._installationService.listObserver$
        .subscribe((list: InstallationList[]) => {
          // this.listInstallations = list;

          this.listInstallations = list?.map((item) => {
            const direccion_completo = `
              ${item.tipo} 
              ${item.direccion} 
              ${item.numero != '' ? ', ' + item.numero : ''} 
              ${item.escalera != '' ? ', ' + item.escalera : ''} 
              ${item.portal != '' ? ', ' + item.portal : ''} 
              ${item.planta != '' ? ', ' + item.planta : ''} 
              ${item.puerta != '' ? ', ' + item.puerta : ''}
            `;

            // this.dataBasicPreview.fecha = new Date().toLocaleString();
            item.direccion_completo = direccion_completo;
            return item
          });
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
          this.groupSaleDetail = list.reduce((acc, detail) => {
            const typeDocument = this.listTypeDocuments.find(obj => obj.id === detail?.datos_json?.tipo_documentos_id);
            const operator = this.listOperators.find((obj: any) => obj.id === detail?.datos_json?.operador_donante_id);

            this.comentariosForm[detail.id] = this.fb.group({
              comentario: ['', [Validators.required]]
            });

            if (typeDocument !== undefined) {
              detail.datos_json.tipo_documento_nombre = typeDocument.nombre;
              detail.datos_json.tipo_documento_abreviacion = typeDocument.abreviacion;
            }
            if (operator !== undefined) {
              detail.datos_json.operador_donante_nombre = operator.nombre;
            }

            let typeService = detail.product?.type_service?.nombre;
            detail['visible'] = false;
            if(!detail.comments){
              detail['comments'] = [];
            }

            this.dataPaginationComments.push({ventas_detalles_id: detail.id, pagination: new Pagination({order: 'asc'})})

            // Busca un elemento en el array con el mismo typeService
            const existingGroup = acc.find(group => group.typeService === typeService);

            if (existingGroup) {
              // Si existe, agrega el detalle al grupo existente
              existingGroup.details.push(detail);
            } else {
              // Si no existe, crea un nuevo grupo
              acc.push({ typeService: typeService, details: [detail] });
            }

            return acc;
          }, []);


          // console.log("DETALLE AGRUPADO:", this.groupSaleDetail)
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
    if (changes.dataSale && !changes.dataSale.firstChange) {
      this.onChanges();
    }
  }


  /***
   * ***************************************************************
   * DETECTAR CAMBIOS EN LA VARIABLE DE ENTRADA
   * ***************************************************************
   */
  onChanges() {
    if (this.dataSale) {
      // console.log("DATOS DE LA VENTA:",this.dataSale);
      // const {id, clientes_id, clientes_persona_juridica} = this.dataSale;

      if (this.dataSale.client) {
        this.dataClient = this.dataSale.client;

        if (this.dataClient?.persona_juridica) {
          this.dataCompany = this.dataClient?.company;
          this.listAddress = this.dataCompany?.addresses?.map((item) => {
            const direccion_completo = `
              ${item.tipo} 
              ${item.direccion} 
              ${item.numero != '' ? ', ' + item.numero : ''} 
              ${item.escalera != '' ? ', ' + item.escalera : ''} 
              ${item.portal != '' ? ', ' + item.portal : ''} 
              ${item.planta != '' ? ', ' + item.planta : ''} 
              ${item.puerta != '' ? ', ' + item.puerta : ''}
            `;

            // this.dataBasicPreview.fecha = new Date().toLocaleString();
            item.direccion_completo = direccion_completo;

            return item
          });

        } else {
          this.dataPerson = this.dataClient?.person;
          this.listAddress = this.dataPerson?.addresses?.map((item) => {
            const direccion_completo = `
              ${item.tipo} 
              ${item.direccion} 
              ${item.numero != '' ? ', ' + item.numero : ''} 
              ${item.escalera != '' ? ', ' + item.escalera : ''} 
              ${item.portal != '' ? ', ' + item.portal : ''} 
              ${item.planta != '' ? ', ' + item.planta : ''} 
              ${item.puerta != '' ? ', ' + item.puerta : ''}
            `;

            // this.dataBasicPreview.fecha = new Date().toLocaleString();
            item.direccion_completo = direccion_completo;

            return item
          });
        }

        // this.listInstallations = this.dataSale?.installations?.map((item) => {
        //   const direccion_completo = `
        //     ${item.tipo} 
        //     ${item.direccion} 
        //     ${item.numero != '' ? ', ' + item.numero : ''} 
        //     ${item.escalera != '' ? ', ' + item.escalera : ''} 
        //     ${item.portal != '' ? ', ' + item.portal : ''} 
        //     ${item.planta != '' ? ', ' + item.planta : ''} 
        //     ${item.puerta != '' ? ', ' + item.puerta : ''}
        //   `;

        //   // this.dataBasicPreview.fecha = new Date().toLocaleString();
        //   item.direccion_completo = direccion_completo;
        //   return item
        // });
      }

      if (this.dataSale.id) {
        this.apiSaleDetailFilterSale(this.dataSale.id);
        this.apiSaleDocumentFilterSale(this.dataSale.id);
        this.apiSaleCommentFilterSale(this.dataSale.id);
        this.apiSaleHistoryFilterSale(this.dataSale.id);
        this.apiInstallationFilterSale(this.dataSale.id);
      }

      // if(clientes_id){
      //   this.apiClientGetById(clientes_id);
      // }
    }
  }


  /**
   * ****************************************************************
   * OPERACIONES CON LA API
   * ****************************************************************
   */
  // Cargar TIPO DE DOCUMENTOS
  public apiTypeDocumentList(forceRefresh: boolean = false) {
    this._sweetAlertService.loadingUp('Obteniendo datos')
    this._typeDocumentService.getAll(forceRefresh).subscribe((response: ResponseApi) => {
      this._sweetAlertService.stop();
      if (response.code == 200) {
        // this._typeDocumentService.addArrayObserver(response.data);
      }

      if (response.code == 500) {
        if (response.errors) {
          this._sweetAlertService.showTopEnd({ type: 'error', title: response.errors?.message, message: response.errors?.error });
        }
      }
    }, (error: any) => {
      this._sweetAlertService.stop();
      if (error.message) {
        this._sweetAlertService.showTopEnd({ type: 'error', title: 'Error al listar los tipos de documentos ', message: error.message, timer: 2500 });
      }
    });
  }

  // Cargar OPERADORES
  public apiOperatorList(forceRefresh: boolean = false) {
    this._sweetAlertService.loadingUp('Obteniendo datos')
    this._operatorService.getAll(forceRefresh).subscribe((response: ResponseApi) => {
      this._sweetAlertService.stop();
      if (response.code == 200) {
        // this._operatorService.addArrayObserver(response.data);
      }

      if (response.code == 500) {
        if (response.errors) {
          this._sweetAlertService.showTopEnd({ type: 'error', title: response.errors?.message, message: response.errors?.error });
        }
      }
    }, (error: any) => {
      this._sweetAlertService.stop();
      if (error.message) {
        this._sweetAlertService.showTopEnd({ type: 'error', title: 'Error al listar los operadores ', message: error.message, timer: 2500 });
      }
    });
  }

  // OPERACIONES CON LA API - OBTENER DATOS DEL CLIENTE
  public apiClientGetById(id: number): Promise<any> {
    this._sweetAlertService.loadingUp('Obteniendo datos')
    return new Promise((resolve, reject) => {
      this._clientService.getById(id).subscribe((response: ResponseApi) => {
        this._sweetAlertService.stop();
        if (response.code == 200) {
          const data = response.data[0];
          if (data) {
            if (data.person !== null) {
              if (data.person.type_document) {
                this.dataTypeDocument = TypeDocumentList.cast(data.person.type_document);
              }
              this.dataPerson = PersonList.cast(data.person);

              this.apiContactFilterByPerson(this.dataPerson.id);
              this.apiAddressFilterByPerson(this.dataPerson.id);
            }

            if (data.company !== null) {
              if (data.company.type_document) {
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

        if (response.code == 500) {
          if (response.errors) {
            this._sweetAlertService.showTopEnd({ type: 'error', title: response.errors?.message, message: response.errors?.error });
          }
          reject(response.errors);
        }
      }, (error: any) => {
        this._sweetAlertService.stop();
        if (error.message) {
          this._sweetAlertService.showTopEnd({ type: 'error', title: 'Error al listar datos del cliente', message: error.message, timer: 2500 });
        }
        reject(error);
      });
    });
  }

  // Cargar los contactos del cliente -  PERSONA
  public apiContactFilterByPerson(personId: number) {
    this._sweetAlertService.loadingUp('Obteniendo datos')
    this._contactService.getFilterPersonId(personId).subscribe((response: ResponseApi) => {
      this._sweetAlertService.stop();
      if (response.code == 200) {
        this._contactService.addArrayObserver(response.data);
      }

      if (response.code == 500) {
        if (response.errors) {
          this._sweetAlertService.showTopEnd({ type: 'error', title: response.errors?.message, message: response.errors?.error });
        }
      }
    }, (error: any) => {
      this._sweetAlertService.stop();
      if (error.message) {
        this._sweetAlertService.showTopEnd({ type: 'error', title: 'Error al listar los contactos ', message: error.message, timer: 2500 });
      }
    });
  }

  // Cargar los contactos del cliente -   EMPRESA
  public apiContactFilterByCompany(companyId: number) {
    this._sweetAlertService.loadingUp('Obteniendo datos')
    this._contactService.getFilterCompanyId(companyId).subscribe((response: ResponseApi) => {
      this._sweetAlertService.stop();
      if (response.code == 200) {
        this._contactService.addArrayObserver(response.data);
      }

      if (response.code == 500) {
        if (response.errors) {
          this._sweetAlertService.showTopEnd({ type: 'error', title: response.errors?.message, message: response.errors?.error });
        }
      }
    }, (error: any) => {
      this._sweetAlertService.stop();
      if (error.message) {
        this._sweetAlertService.showTopEnd({ type: 'error', title: 'Error al listar los contactos ', message: error.message, timer: 2500 });
      }
    });
  }

  // Cargar los direcciones del cliente -   PERSONA
  public apiAddressFilterByPerson(personId: number) {
    this._sweetAlertService.loadingUp('Obteniendo datos')
    this._addressService.getFilterPersonId(personId).subscribe((response: ResponseApi) => {
      this._sweetAlertService.stop();
      if (response.code == 200) {
        this._addressService.addArrayObserver(response.data);
      }

      if (response.code == 500) {
        if (response.errors) {
          this._sweetAlertService.showTopEnd({ type: 'error', title: response.errors?.message, message: response.errors?.error });
        }
      }
    }, (error: any) => {
      this._sweetAlertService.stop();
      if (error.message) {
        this._sweetAlertService.showTopEnd({ type: 'error', title: 'Error al listar las direcciones ', message: error.message, timer: 2500 });
      }
    });
  }

  // Cargar los direcciones del cliente -   EMPRESA
  public apiAddressFilterByCompany(companyId: number) {
    this._sweetAlertService.loadingUp('Obteniendo datos')
    this._addressService.getFilterCompanyId(companyId).subscribe((response: ResponseApi) => {
      this._sweetAlertService.stop();
      if (response.code == 200) {
        this._addressService.addArrayObserver(response.data);
      }

      if (response.code == 500) {
        if (response.errors) {
          this._sweetAlertService.showTopEnd({ type: 'error', title: response.errors?.message, message: response.errors?.error });
        }
      }
    }, (error: any) => {
      this._sweetAlertService.stop();
      if (error.message) {
        this._sweetAlertService.showTopEnd({ type: 'error', title: 'Error al listar las direcciones ', message: error.message, timer: 2500 });
      }
    });
  }

  // Cargar las cuentas bancarias del cliente -  CLIENTE
  public apiBankAccountFilterByClient(clientId: number) {
    this._sweetAlertService.loadingUp('Obteniendo datos')
    this._bankAccountService.getFilterClientId(clientId).subscribe((response: ResponseApi) => {
      this._sweetAlertService.stop();
      if (response.code == 200) {
        this._bankAccountService.addArrayObserver(response.data);
      }

      if (response.code == 500) {
        if (response.errors) {
          this._sweetAlertService.showTopEnd({ type: 'error', title: response.errors?.message, message: response.errors?.error });
        }
      }
    }, (error: any) => {
      this._sweetAlertService.stop();
      if (error.message) {
        this._sweetAlertService.showTopEnd({ type: 'error', title: 'Error al listar las cuentas bancarias ', message: error.message, timer: 2500 });
      }
    });
  }

  // Cargar VENTA DETALLE
  public apiSaleDetailFilterSale(saleId: number) {
    this._sweetAlertService.loadingUp('Obteniendo datos')
    this._saleDetailService.getBySale(saleId).subscribe((response: ResponseApi) => {
      this._sweetAlertService.stop();
      if (response.code == 200) {
        this._saleDetailService.addArrayObserver(response.data);
      }

      if (response.code == 500) {
        if (response.errors) {
          this._sweetAlertService.showTopEnd({ type: 'error', title: response.errors?.message, message: response.errors?.error });
        }
      }
    }, (error: any) => {
      this._sweetAlertService.stop();
      if (error.message) {
        this._sweetAlertService.showTopEnd({ type: 'error', title: 'Error al listar los detalles ', message: error.message, timer: 2500 });
      }
    });
  }

  private apiSaleCommentSave(data: SaleComment) {
    return new Promise((resolve, reject) => {
      this._sweetAlertService.loadingUp('Enviando comentario...')
      this.subscription.add(
        this._saleCommentService.register(data).subscribe((response: ResponseApi) => {
          this._sweetAlertService.stop();
          if (response.code == 201) {
            if (response.data[0]) {
              const data: SaleCommentList = SaleCommentList.cast(response.data[0]);
              resolve(data)
              // this._saleCommentService.addObjectObserver(data);
            }
          }

          if (response.code == 422) {
            if (response.errors) {
              const textErrors = this._apiErrorFormattingService.formatAsHtml(response.errors);
              this._sweetAlertService.showTopEnd({ type: 'error', title: response.message, message: textErrors });
            }
            reject(response.errors)
          }

          if (response.code == 500) {
            if (response.errors) {
              this._sweetAlertService.showTopEnd({ type: 'error', title: response.errors?.message, message: response.errors?.error });
            }
            reject(response.errors)
          }
        }, (error) => {
          this._sweetAlertService.stop();
          if (error.message) {
            this._sweetAlertService.showTopEnd({ type: 'error', title: 'Error al registrar el comentario', message: error.message, timer: 2500 });
          }

          reject(error)
        })
      )
    })
  }

  // Cargar DOCUMENTOS DE LA VENTA
  public apiSaleDocumentFilterSale(saleId: number) {
    this._sweetAlertService.loadingUp('Obteniendo datos')
    this._saleDocumentService.getFilterBySale(saleId).subscribe((response: ResponseApi) => {
      this._sweetAlertService.stop();
      if (response.code == 200) {
        this._saleDocumentService.addArrayObserver(response.data);
      }

      if (response.code == 500) {
        if (response.errors) {
          this._sweetAlertService.showTopEnd({ type: 'error', title: response.errors?.message, message: response.errors?.error });
        }
      }
    }, (error: any) => {
      this._sweetAlertService.stop();
      if (error.message) {
        this._sweetAlertService.showTopEnd({ type: 'error', title: 'Error al listar los documentos ', message: error.message, timer: 2500 });
      }
    });
  }

  // Cargar COMENTARIOS DE LA VENTA
  public apiSaleCommentFilterSale(saleId: number) {
    this._sweetAlertService.loadingUp('Obteniendo datos')
    this._saleCommentService.getFilterBySale(saleId).subscribe((response: ResponseApi) => {
      this._sweetAlertService.stop();
      if (response.code == 200) {
        this._saleCommentService.addArrayObserver(response.data);
      }

      if (response.code == 500) {
        if (response.errors) {
          this._sweetAlertService.showTopEnd({ type: 'error', title: response.errors?.message, message: response.errors?.error });
        }
      }
    }, (error: any) => {
      this._sweetAlertService.stop();
      if (error.message) {
        this._sweetAlertService.showTopEnd({ type: 'error', title: 'Error al listar los comentarios ', message: error.message, timer: 2500 });
      }
    });
  }

  // Cargar COMENTARIOS DE LA VENTA
  public apiSaleHistoryFilterSale(saleId: number) {
    this._sweetAlertService.loadingUp('Obteniendo datos')
    this._saleHistoryService.getFilterBySale(saleId).subscribe((response: ResponseApi) => {
      this._sweetAlertService.stop();
      if (response.code == 200) {
        this._saleHistoryService.addArrayObserver(response.data);
      }

      if (response.code == 500) {
        if (response.errors) {
          this._sweetAlertService.showTopEnd({ type: 'error', title: response.errors?.message, message: response.errors?.error });
        }
      }
    }, (error: any) => {
      this._sweetAlertService.stop();
      if (error.message) {
        this._sweetAlertService.showTopEnd({ type: 'error', title: 'Error al listar el historial ', message: error.message, timer: 2500 });
      }
    });
  }

  // Cargar DIRECCIÓN DE LA INSTALACION
  public apiInstallationFilterSale(saleId: number) {
    this._sweetAlertService.loadingUp('Obteniendo datos')
    this._installationService.getBySale(saleId).subscribe((response: ResponseApi) => {
      this._sweetAlertService.stop();
      if (response.code == 200) {
        this._installationService.addArrayObserver(response.data);
      }

      if (response.code == 500) {
        if (response.errors) {
          this._sweetAlertService.showTopEnd({ type: 'error', title: response.errors?.message, message: response.errors?.error });
        }
      }
    }, (error: any) => {
      this._sweetAlertService.stop();
      if (error.message) {
        this._sweetAlertService.showTopEnd({ type: 'error', title: 'Error al listar las instalaciones de la venta ', message: error.message, timer: 2500 });
      }
    });
  }


  /**
   * ****************************************************************
   * DETALLE VENTA
   * ****************************************************************
   */
  // LISTAR LOS COMENTARIOS ASINCRONICAMENTE
  public apiSaleCommentListPagination(saleDetailId: number): Promise<any> {
    return new Promise((resolve, reject) => {
      this.subscription.add(
        this._saleCommentService.getPagination({...this.pagination.getValue(), ventas_detalles_id: saleDetailId })
        .pipe(debounceTime(250))
        .subscribe((response: ResponseApi) => {
          if(response.code == 200){
            const result = PaginationResult.cast(response.data);
            resolve(result)
          }
          
          if(response.code == 500){
            if(response.errors){
              this._sweetAlertService.showTopEnd({type: 'error', title: response.errors?.message, message: response.errors?.error});
            }
            reject(response.errors)
          }
        }, (error: any) => {
          if(error.message){
            this._sweetAlertService.showTopEnd({type: 'error', title: 'Error al cargar usuarios', message: error.message, timer: 2500});
          }
          reject(error)
        })
      ); 

    })
  }

  // CARGAR COMENTARIOS DEL SERVICIO
  public apiSaleCommentFilterDetailId(saleDetailId: number) {
    return new Promise((resolve, reject) => {
      this._sweetAlertService.loadingUp('Obteniendo datos')
      this._saleCommentService.getFilterBySaleDetail(saleDetailId).subscribe((response: ResponseApi) => {
        this._sweetAlertService.stop();
        if (response.code == 200) {
          resolve(response.data);
        }

        if (response.code == 500) {
          if (response.errors) {
            this._sweetAlertService.showTopEnd({ type: 'error', title: response.errors?.message, message: response.errors?.error });
          }

          reject(response.errors)
        }
      }, (error: any) => {
        this._sweetAlertService.stop();
        if (error.message) {
          this._sweetAlertService.showTopEnd({ type: 'error', title: 'Error al listar los detalles ', message: error.message, timer: 2500 });
        }

        reject(error)
      });
    })
  }


  // EDITAR EL CONTENIDO DEL MENSAJE
  updateComentarioValue(saleDetailId: string, event: any) {
    const keyCode = event.keyCode || event.which;
    if(keyCode !== 13 && keyCode !== 27){
      this.comentariosForm[saleDetailId].get('comentario').setValue(event.target.innerText);
    }
  }


  /**=>  PERMITIR PEGAR SOLO TEXTO PLANO ***/
  public onPasteMessage(event: ClipboardEvent) {
    event.preventDefault();
    const clipboardData = event.clipboardData;
    if (clipboardData) {
      const pastedItems = clipboardData.items;
      const pastedText = clipboardData.getData('text/plain');
      const truncatedContent = pastedText.slice(0, 500);
      document.execCommand("insertHTML", false, truncatedContent); // Insertar texto plano
    }
  }

  // AGREGAR MENSAJE AL ARRAY
  public addCommentInDetail(saleId: number, saleDetailId: number, data: any): any {
    const dataGroup = this.groupSaleDetail.find((obj: any) => {
      const detail = obj.details.find((ob: any) => ob.ventas_id == saleId && ob.id == saleDetailId);
      if (detail) {
        detail.comments.push(data);
        return true; // Termina la búsqueda después de encontrar el elemento
      }
      return false; // Continúa la búsqueda
    });
  
    return dataGroup;
  }

  // Agregar y obtener el objeto actual del contenedor de mensajes
  public addCommentDetail(saleId: number, saleDetailId: number, data: any): any {
    const foundDetail = this.groupSaleDetail.map((obj: any) => {
      const detail = obj.details.find((ob: any) => ob.ventas_id === saleId && ob.id === saleDetailId);
      if (detail) {
        detail.comments.push(data);
      }
      return detail;
    }).find((detail: any) => detail !== undefined);
  
    return foundDetail || null;
  }
  

  // OBTENER MENSAJE AL ARRAY
  public getCommentDetail(saleId: number, saleDetailId: number): any {
    const foundDetail = this.groupSaleDetail
      .map((obj: any) => obj.details.find((ob: any) => ob.ventas_id === saleId && ob.id === saleDetailId))
      .find(detail => detail !== undefined);
  
    return foundDetail || null;
  }
  
  // LIMPIAR CONTENIDO DEL MENSAJE
  public clearCommentCurrent(saleDetailId: number){
    this.comentariosForm[saleDetailId].get('comentario').setValue('');

    const commentElement = document.getElementById('comment' + saleDetailId);
    if (commentElement) {
      commentElement.innerText = '';
    }
  }
    

  // REGISTRAR COMENTARIO EN EL SERVICIO
  public async registerCommentInSaleDetail(saleId: number, saleDetailId: number) {
    this.dataMsgComment.ventas_id = saleId;
    this.dataMsgComment.ventas_detalles_id = saleDetailId;
    const comentario = this.comentariosForm[saleDetailId].get('comentario')?.value;
    this.dataMsgComment.comentario = comentario;
    
    this.comentariosForm[saleDetailId].get('comentario').setValue('');
    
    
    const resComment: SaleComment = await this.apiSaleCommentSave(this.dataMsgComment);
    if (resComment) {
      
      // console.log("RES COMENTARIO:", resComment)
      this.dataMsgComment = new SaleComment();
      this.comentariosForm[saleDetailId].get('comentario').setValue('');
      this.clearCommentCurrent(saleDetailId);

      const objDetail = this.addCommentDetail(saleId, saleDetailId, SaleCommentList.cast(resComment))
      // console.log("OBJETO SERVICIO:", objDetail);
    }
  }

  onLazyLoadComment(event: any) {
    this.lazyLoadingComment = true;
    const { first, last } = event;
    console.log(event)
  }


  onScrollBottom() {
    const container = this.commentContainer.nativeElement;
    container.scrollTop = container.scrollHeight;
  }

  onScrollUpComment(event: any, saleId: number, saleDetailId: number){
    console.log(event)
  }

  async onScrollDownComment(event: any, saleId: number, saleDetailId: number){
    this.pagination.value.page += this.pagination.value.page;
    const commentCurrent = await this.apiSaleCommentListPagination(saleDetailId)
    console.log(event, commentCurrent)
  }

  // Copy Message
  copyMessage(event: any) {
    navigator.clipboard.writeText(event.target.closest('div.conversation-list').querySelector('p').innerHTML);
  }
  
  validateLongitud(mensaje: string, long: any){
    return ValidateTextUtil.validateLongitud(mensaje, long)
  }
  
  truncateMessage(mensaje: string, long: any){
    return ValidateTextUtil.truncateMessage(mensaje, long)
  }


  /**
   * ****************************************************************
   * MOSTRAR DETALLE
   * ****************************************************************
   */
  async toggleVisibility(item: any) {
    item.visible = !item.visible;

    if(item.visible && item?.comments.length == 0){
      const comments = await this.apiSaleCommentFilterDetailId(item.id);
      if (comments) {
        item.comments = comments;
      }
    }
  }

  /**
   * ****************************************************************
   * VALIDAR DATOS JSON
   * ****************************************************************
   */
  getRowDetailIsNullJson(data: any) {
    if (data?.tipo_servicios_nombre?.toLowerCase().includes('tv')) {
      return false;
    }
    return data.datos_json !== null ? false : true

  }

  /**
   * ****************************************************************
   * MOSTRAR COMENTARIO
   * ****************************************************************
   */
  toggleCommentMore(item: any) {
    item.more = !item.more;
  }



  /**
   * ****************************************************************
   * EDITAR EL REGISTRO - ITEM SELECCIONADO
   * ****************************************************************
   */
  onEditItem(process: any, data: any = null) {
    console.log("EDIT:", process, data);

    this.formEditLabel = process;
    this.shareDataForm = data;
    this.changeModalView('edit');


    if (process == 'client' || process == 'contact' || process == 'address') {
      this._sharedClientService.setClientId(this.dataClient.id);
      this._sharedClientService.setClientId(this.dataClient.id);
      this._sharedClientService.setLegalPerson(this.dataClient.persona_juridica);

      if (this.dataClient.persona_juridica) {
        // EMPRESA
        this._sharedClientService.setCompanyId(this.dataCompany.id);
      } else {
        // PERSONA
        this._sharedClientService.setPersonId(this.dataPerson.id);
      }
    }

    switch (process) {
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
  getDataFormContact(event: any) {
    const { updated, data } = event;
    if (updated) {
      this.listContact = this.listContact.map((item) => {
        if (item.id == data.id) {
          return ContactList.cast(data);
        }

        return item;
      })
    }

    this.changeModalView('view');
  }

  // OBTENER LOS DATOS MODIFICADOS DE DIRECCIÓN
  getDataFormAddress(event: any) {
    const { updated, data } = event;
    if (updated) {
      this.listAddress = this.listAddress.map((item) => {
        if (item.id == data.id) {
          return AddressList.cast(data);
        }

        return item;
      })
    }

    this.changeModalView('view');
  }

  // OBTENER LOS DATOS MODIFICADOS DE SERVICIOS
  getDataFormService(event: any) {
    const { updated, data } = event;
    if (updated) {
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
  changeModalView(mode: 'view' | 'edit' = 'view') {
    this.modeView = mode;

    if (mode == 'view') {
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
  openModal() {
    this.modalRefCurrent = this.modalService.show(this.contentModal, {
      class: 'modal-md modal-dialog-centered modal-dialog-scrollable',
    });
    this.modalRefCurrent.onHide.subscribe(() => { });
    // this.modalForm.show();
  }
}
