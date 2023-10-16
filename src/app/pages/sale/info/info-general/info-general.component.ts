import { ChangeDetectorRef, Component, ElementRef, OnDestroy, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { Subscription, distinctUntilChanged } from 'rxjs';
import { AddressList, BankAccountList, CompanyList, ContactList, OperatorList, PersonList, ResponseApi, SaleCommentList, SaleDetailList, SaleDocumentList, SaleHistoryList, SaleList, TypeDocumentList } from 'src/app/core/models';
import { ClientList } from 'src/app/core/models/api/client.model';
import { AddressService, ApiErrorFormattingService, BankAccountService, ClientService, ConfigService, ContactService, OperatorService, SharedClientService, SharedSaleService, SweetAlertService, TempSaleCommentService, TempSaleDetailService, TempSaleDocumentService, TempSaleHistoryService, TempSaleService, TypeDocumentService } from 'src/app/core/services';

@Component({
  selector: 'app-info-general',
  templateUrl: './info-general.component.html',
  styleUrls: ['./info-general.component.scss']
})
export class InfoGeneralComponent implements OnInit, OnDestroy {

  @ViewChild('content') contentPrint: TemplateRef<HTMLElement>;
  contentPrintHtml: string = '';


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

  // Lista de ventas detalles TEMPORALES
  groupSaleDetail: any;

  // Tipo de documentos
  listTypeDocuments: TypeDocumentList[] = [];

  // Operadores
  listOperators: OperatorList[] = [];

  private subscription: Subscription = new Subscription();

  constructor(
    private cdr: ChangeDetectorRef,
    private _configService: ConfigService,
    private _operatorService: OperatorService,
    private _typeDocumentService: TypeDocumentService,
    private _tempSaleDetailService: TempSaleDetailService,
    private _tempSaleService: TempSaleService,
    private _tempSaleDocumentService: TempSaleDocumentService,
    private _tempSaleCommentService: TempSaleCommentService,
    private _tempSaleHistoryService: TempSaleHistoryService,
    private _sharedSaleService: SharedSaleService,
    private _sharedClientService: SharedClientService,
    private _clientService: ClientService,
    private _contactService: ContactService,
    private _addressService: AddressService,
    private _bankAccountService: BankAccountService,
    private _apiErrorFormattingService: ApiErrorFormattingService,
    private _sweetAlertService: SweetAlertService,

  ){
    this.URL_FILES = this._configService.urlFiles + 'sale/';
  }

  ngOnInit(): void {
    this.apiTypeDocumentList();
    this.apiOperatorList();

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
    
    // Ventas OBTENER CLIENTE
    this.subscription.add(
      this._tempSaleService.dataObserver$
      .pipe(distinctUntilChanged())
      .subscribe((data: SaleList) => {
        if(data?.clientes_id){
          this.apiClientGetById(data.clientes_id);
        }
      })
    )
    
    
    // CLIENT ID
    this.subscription.add(
      this._sharedClientService.getClientId().subscribe((value: number) => {
        if(value){
          this.apiClientGetById(value);
        }
      })
    );

            
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


    // Detalle - observado
    this.subscription.add(
      this._tempSaleDetailService.listObserver$
        .subscribe((list: SaleDetailList[]) => {

          this.groupSaleDetail = list.reduce(function (acc, detail) {
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
      this._tempSaleDocumentService.listObserver$
        .subscribe((list: SaleDocumentList[]) => {
          this.listSaleDocument = list;
        })
    );
            
    // Comentarios
    this.subscription.add(
      this._tempSaleCommentService.listObserver$
        .subscribe((list: SaleCommentList[]) => {
          this.listSaleComment = list.map((obj: any) => {
            obj.more = false;
            return obj;
          });
        })
    );
            
    // Historial
    this.subscription.add(
      this._tempSaleHistoryService.listObserver$
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


  /**
   * ****************************************************************
   * OPERACIONES CON LA API
   * ****************************************************************
   */
  // Cargar los TIPO DE DOCUMENTOS
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

  // Cargar los OPERADORES
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

  // Cargar la VENTA DETALLE
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

  // Cargar los DOCUMENTOS DE LA VENTA
  public apiSaleDocumentFilterSale(saleId: number){
    this._sweetAlertService.loadingUp('Obteniendo datos')
    this._tempSaleDocumentService.getFilterBySale(saleId).subscribe((response: ResponseApi) => {
      this._sweetAlertService.stop();
      if(response.code == 200){
        this._tempSaleDocumentService.addArrayObserver(response.data);
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

  // cargar los COMENTARIOS DE LA VENTA
  public apiSaleCommentFilterSale(saleId: number){
    this._sweetAlertService.loadingUp('Obteniendo datos')
    this._tempSaleCommentService.getFilterBySale(saleId).subscribe((response: ResponseApi) => {
      this._sweetAlertService.stop();
      if(response.code == 200){
        this._tempSaleCommentService.addArrayObserver(response.data);
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

  // Cargar los COMENTARIOS DE LA VENTA
  public apiSaleHistoryFilterSale(saleId: number){
    this._sweetAlertService.loadingUp('Obteniendo datos')
    this._tempSaleHistoryService.getFilterBySale(saleId).subscribe((response: ResponseApi) => {
      this._sweetAlertService.stop();
      if(response.code == 200){
        console.log("HISTORIAL:", response.data)
        this._tempSaleHistoryService.addArrayObserver(response.data);
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



  /***
   * *************************************************************
   * IMPRIMIR CONTENIDOS
   * *************************************************************
   */
  printContentInfo(content?: TemplateRef<any>){
    const div = document.createElement('div');
    div.appendChild(content.createEmbeddedView(null).rootNodes[0].cloneNode(true));
    // const content = template.elementRef.nativeElement;
    const windowPrint = window.open(); // '', '', 'width=800'
    windowPrint.document.open();
    windowPrint.document.write(div.innerHTML);
    windowPrint.document.close();
    windowPrint.print();
    windowPrint.close();
  }

}
