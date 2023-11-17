import { ChangeDetectorRef, Component, ElementRef, OnDestroy, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { Subscription, distinctUntilChanged, filter } from 'rxjs';
import { AddressList, BankAccountList, CompanyList, ContactList, InstallationList, OperatorList, PersonList, ResponseApi, SaleCommentList, SaleDetailList, SaleDocumentList, SaleHistoryList, SaleList, TypeDocumentList } from 'src/app/core/models';
import { Client, ClientList } from 'src/app/core/models/api/client.model';
import { AddressService, ApiErrorFormattingService, BankAccountService, ClientService, ConfigService, ContactService, OperatorService, SaleCommentService, SaleDetailService, SaleDocumentService, SaleHistoryService, SaleService, SharedClientService, SharedSaleService, SweetAlertService, TempSaleCommentService, TempSaleDetailService, TempSaleDocumentService, TempSaleHistoryService, TempSaleService, TypeDocumentService } from 'src/app/core/services';

import { CurrencyUtil } from 'src/app/core/helpers/currency.util';
import { CalculateUtil } from 'src/app/core/helpers/calculate.util';

@Component({
  selector: 'app-info-general',
  templateUrl: './info-general.component.html',
  styleUrls: ['./info-general.component.scss']
})
export class InfoGeneralComponent implements OnInit, OnDestroy {

  @ViewChild('contentDetail') contentPrint: TemplateRef<HTMLElement>;
  contentPrintHtml: string = '';


  URL_FILES: string = '';

  //IDs
  saleId: number;
  clientId: number;
  personId: number;
  companyId: number;
  legalPerson: boolean = false;

  // VENTA ID
  // saleId: number = null;

  // DATOS CLIENTE
  dataClient: ClientList;

  // DATOS PERSONA
  dataPerson: PersonList;

  // DATOS EMPRESA
  dataCompany: CompanyList;

  // DIRECCIÓN
  dataInstallation: InstallationList;

  dataSale: SaleList;

  // DATOS DETALLE
  dataSaleDetail: SaleDetailList; 
  listSaleDetail: SaleDetailList[] = [];

  iso_code_currency: string = 'EUR';
  subTotal: number = 0;
  descuento: number = 0;
  total: number = 0;

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
    private _saleDetailService: SaleDetailService,
    private _tempSaleService: TempSaleService,
    private _saleService: SaleService,
    private _tempSaleDocumentService: TempSaleDocumentService,
    private _saleDocumentService: SaleDocumentService,
    private _tempSaleCommentService: TempSaleCommentService,
    private _saleCommentService: SaleCommentService,
    private _tempSaleHistoryService: TempSaleHistoryService,
    private _saleHistoryService: SaleHistoryService,
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
    // this.subscription.add(
    //   this._saleService.dataObserver$
    //   .pipe(distinctUntilChanged())
    //   .subscribe((data: SaleList) => {
    //     if(data?.clientes_id){
    //       this.apiClientGetById(data.clientes_id);
    //     }
    //   })
    // )
    
    // CLIENT ID
    this.subscription.add(
      this._sharedClientService.getClientId().pipe(filter((id) => id !== null)).subscribe((value: number) => {
        if(value){
          this.clientId = value;
        }
      })
    );
    
    // PERSONA ID
    this.subscription.add(
      this._sharedClientService.getPersonId().pipe(filter((id) => id !== null)).subscribe((value: number) => {
        if(value){
          this.personId = value;
        }
      })
    );
    
    // EMPRESA ID
    this.subscription.add(
      this._sharedClientService.getCompanyId().pipe(filter((id) => id !== null)).subscribe((value: number) => {
        if(value){
          this.companyId = value;
        }
      })
    );

    // DATOS CLIENTE
    this.subscription.add(
      this._sharedClientService.getDataClient()
        .pipe(filter((data) => data != null))
        .subscribe((data: ClientList) => {
          this.dataClient = data;
        })
    )

    // DATOS PERSONA
    this.subscription.add(
      this._sharedClientService.getDataPerson()
        .pipe(filter((data) => data != null))
        .subscribe((data: PersonList) => {
          this.dataPerson = data;
        })
    )

    // DATOS EMPRESA
    this.subscription.add(
      this._sharedClientService.getDataCompany()
        .pipe(filter((data) => data != null))
        .subscribe((data: CompanyList) => {
          this.dataCompany = data;
        })
    )

    // INSTALACIÓN - VENTA
    this.subscription.add(
      this._sharedSaleService.getDataInstallation()
        .pipe(filter((data) => data != null))
        .subscribe((data: InstallationList) => {
          const direccion_completo = `
            ${data.tipo} 
            ${data.direccion} 
            ${data.numero != '' ? ', ' + data.numero : ''} 
            ${data.escalera != '' ? ', ' + data.escalera : ''} 
            ${data.portal != '' ? ', ' + data.portal : ''} 
            ${data.planta != '' ? ', ' + data.planta : ''} 
            ${data.puerta != '' ? ', ' + data.puerta : ''}
          `;

          // this.dataBasicPreview.fecha = new Date().toLocaleString();
          data.direccion_completo = direccion_completo;
          this.dataInstallation = data;
        })
    );

            
    // CONTACTOS
    this.subscription.add(
      this._contactService.listObserver$
        .subscribe((list: ContactList[]) => {
          this.listContact = list;
        })
    );
            

    // CUENTAS BANCARIAS
    this.subscription.add(
      this._bankAccountService.listObserver$
        .subscribe((list: BankAccountList[]) => {
          this.listBankAccount = list;
        })
    );

        
    // VENTA ID
    this.subscription.add(
      this._sharedSaleService.getSaleId().subscribe((value: number) => {
        if(value){
          this.saleId = value;
          this.apiSaleGetById(value);
          this.apiSaleDetailFilterSale(value);
          this.apiSaleDocumentFilterSale(value);
        }
      })
    );


    // Detalle - observado
    this.subscription.add(
      this._saleDetailService.listObserver$
        .subscribe((list: SaleDetailList[]) => {
          this.listSaleDetail = list;
          this.subTotal = CalculateUtil.calculateTotal(list, (item: SaleDetailList) => (item.product?.latest_price?.precio || 0) * (item?.cantidad || 1));
          this.descuento = CalculateUtil.calculateTotal(list, (item: SaleDetailList) => {
            if(item?.promotion?.tipo_descuento == 'C'){
              return (item?.promotion?.descuento || 0) * (item?.cantidad || 1)
            } else if (item?.promotion?.tipo_descuento == 'P') {
              // Descuento porcentual
              const subtotal = (item.product?.latest_price?.precio || 0) * (item?.cantidad || 1);
              const porcentajeDescuento = (item?.promotion?.descuento || 0);
            
              // Calcula el descuento en base al porcentaje
              const descuento = (porcentajeDescuento / 100) * subtotal;
              return descuento;
            } else {
              return 0; // Manejar otros tipos de descuento o valores no válidos
            }
          });
          
          this.total = this.subTotal - this.descuento;
          if(list.length > 0){
            this.iso_code_currency = list[0].product?.latest_price?.type_currency?.iso_code;
          }


          // this.groupSaleDetail = list.reduce(function (acc, detail) {
          //   try{
          //     const typeDocument = this.listTypeDocuments.find((obj) => obj.id === detail?.datos_json?.tipo_documento_id);
          //     const operator = this.listOperators.find((obj) => obj.id === detail?.datos_json?.operador_donante_id);
              
          //     if (typeDocument !== undefined) {
          //       detail.datos_json.tipo_documento_nombre = typeDocument.nombre;
          //       detail.datos_json.tipo_documento_abreviacion = typeDocument.abreviacion;
          //     }
          //     if (operator !== undefined) {
          //       detail.datos_json.operador_donante_nombre = operator.nombre;
          //     }
          //   }catch(error){

          //   }
            
          //   let typeService = null;

          //   if(detail.tipo_servicios_nombre.toLocaleLowerCase().includes('movil')){
          //     typeService = 'mobile';
          //   }
          //   if(detail.tipo_servicios_nombre.toLocaleLowerCase().includes('fija')){
          //     typeService = 'fixed';
          //   }
          //   if(detail.tipo_servicios_nombre.toLocaleLowerCase().includes('tv')){
          //     typeService = 'tv';
          //   }

          //   detail['visible'] = false;

          //   var key = typeService;
          //   if (!acc[key]) {
          //       acc[key] = [];
          //   }
          //   acc[key].push(detail);
          //   return acc;
          // }, {});

         
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

            
    // LIMAR DATOS VENTAS
    this.subscription.add(
      this._sharedSaleService.getClearData().subscribe((value: boolean) => {
        if(value){
          // RESET DATOS
          this.onResetSale();
        }
      })
    );
    
    // LIMPIAR DATOS CLIENTE
    this.subscription.add(
      this._sharedClientService.getClearData().subscribe((value: boolean) => {
        if(value){
          // RESET DATOS
          this.onResetClient();
        }
      })
    );
    
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }


  // CONVERTIDOR DE MONEDAS
  public convertCurrencyFormat(amount: number, currency: string, format: string = 'en-US') {
    return CurrencyUtil.convertCurrencyFormat(amount, currency, format);
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

  // VENTA TEMPORAL
  public apiSaleGetById(saleId: number){
    this._sweetAlertService.loadingUp('Obteniendo datos')
    this._saleService.getById(saleId).subscribe((response: ResponseApi) => {
      this._sweetAlertService.stop();
      if(response.code == 200){
        this.dataSale = response.data[0];

        // this._sharedSaleService.setDataSale(())
      }

      if(response.code == 500){
        if(response.errors){
          this._sweetAlertService.showTopEnd({type: 'error', title: response.errors?.message, message: response.errors?.error});
        }
      }
    }, (error: any) => {
      this._sweetAlertService.stop();
      if(error.message){
        this._sweetAlertService.showTopEnd({type: 'error', title: 'Error al obtener datos de la venta actual ', message: error.message, timer: 2500});
      }
    });
  }

  // Cargar la VENTA DETALLE
  public apiSaleDetailFilterSale(saleId: number){
    this._sweetAlertService.loadingUp('Obteniendo datos')
    this._saleDetailService.getBySale(saleId).subscribe((response: ResponseApi) => {
      this._sweetAlertService.stop();
      if(response.code == 200){
        // this.tmpListInstallations = response.data;
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

  // Cargar los DOCUMENTOS DE LA VENTA
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

  // cargar los COMENTARIOS DE LA VENTA
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
   * OPERACIONES CON LA API - TEMPORALES
   * ****************************************************************
   */

  // VENTA TEMPORAL
  public apiTempSaleGetById(saleId: number){
    this._sweetAlertService.loadingUp('Obteniendo datos')
    this._tempSaleService.getById(saleId).subscribe((response: ResponseApi) => {
      this._sweetAlertService.stop();
      if(response.code == 200){
        this.dataSale = response.data[0];
        
      }

      if(response.code == 500){
        if(response.errors){
          this._sweetAlertService.showTopEnd({type: 'error', title: response.errors?.message, message: response.errors?.error});
        }
      }
    }, (error: any) => {
      this._sweetAlertService.stop();
      if(error.message){
        this._sweetAlertService.showTopEnd({type: 'error', title: 'Error al obtener datos de la venta actual ', message: error.message, timer: 2500});
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
  public apiTempSaleDocumentFilterSale(saleId: number){
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
  public apiTempSaleCommentFilterSale(saleId: number){
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
  public apiTempSaleHistoryFilterSale(saleId: number){
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


  private onResetClient(){
    this.dataClient = null;
    this.dataCompany = null;
    this.dataPerson = null;
    this.listAddress = [];
    this.listContact = [];
    this.listBankAccount = [];

  }

  private onResetSale(){
    this.dataSale = null;
    this.listSaleDocument = [];
    this.listSaleComment = [];
    this.listSaleDetail = [];
    this.listSaleHistory = [];
    this.dataInstallation = null;
    this.subTotal = 0;
    this.descuento = 0;
    this.total = 0;
  }
}
