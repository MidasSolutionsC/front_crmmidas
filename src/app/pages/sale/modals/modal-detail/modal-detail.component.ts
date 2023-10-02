import { ChangeDetectorRef, Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { Subscription, distinctUntilChanged } from 'rxjs';
import { CompanyList, OperatorList, PersonList, ResponseApi, SaleCommentList, SaleDetailList, SaleDocumentList, SaleHistoryList, SaleList, TypeDocumentList } from 'src/app/core/models';
import { ClientList } from 'src/app/core/models/api/client.model';
import { ApiErrorFormattingService, ClientService, ConfigService, OperatorService, SaleCommentService, SaleDetailService, SaleDocumentService, SaleHistoryService, SaleService, SweetAlertService, TypeDocumentService } from 'src/app/core/services';

@Component({
  selector: 'app-modal-detail',
  templateUrl: './modal-detail.component.html',
  styleUrls: ['./modal-detail.component.scss']
})
export class ModalDetailComponent implements OnInit, OnDestroy, OnChanges{
  // DATOS DE ENTRADAS
  @Input() dataInput: SaleList = null; 

  // REFERENCIA AL MODAL ACTUAL
  modalRefCurrent?: BsModalRef;

  // DATOS DEL MODAL
  dataModal: any = {
    title: 'Detalle de la venta'
  };
  
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

  // Lista de ventas detalles
  groupSaleDetail: any;

  // Tipo de documentos
  listTypeDocuments: TypeDocumentList[] = [];

  // Operadores
  listOperators: OperatorList[] = [];

  private subscription: Subscription = new Subscription();
  
  constructor(
    public modalRef: BsModalRef,
    private cdr: ChangeDetectorRef,
    private _configService: ConfigService,
    private _operatorService: OperatorService,
    private _typeDocumentService: TypeDocumentService,
    private _clientService: ClientService,
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
      console.log("DATOS DE LA VENTA:",this.dataInput);
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
   * OPERACIONES CON LA API - TIPO DE DOCUMENTOS
   * ****************************************************************
   */
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


  /**
   * ****************************************************************
   * OPERACIONES CON LA API - OPERADORES
   * ****************************************************************
   */
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



  /**
   * ****************************************************************
   * OPERACIONES CON LA API - CLIENT
   * ****************************************************************
   */
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
            } 
            
            if(data.company !== null){
              if(data.company.type_document){
                this.dataTypeDocument = TypeDocumentList.cast(data.company.type_document);
              }
              this.dataCompany = CompanyList.cast(data.company);
            } 
  
            this.dataClient = ClientList.cast(data);
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

  /**
   * ****************************************************************
   * OPERACIONES CON LA API - VENTA DETALLE
   * ****************************************************************
   */
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

  /**
   * ****************************************************************
   * OPERACIONES CON LA API - DOCUMENTOS DE LA VENTA
   * ****************************************************************
   */
  public apiSaleDocumentFilterSale(saleId: number){
    this._sweetAlertService.loadingUp('Obteniendo datos')
    this._saleDocumentService.getBySale(saleId).subscribe((response: ResponseApi) => {
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

  /**
   * ****************************************************************
   * OPERACIONES CON LA API - COMENTARIOS DE LA VENTA
   * ****************************************************************
   */
  public apiSaleCommentFilterSale(saleId: number){
    this._sweetAlertService.loadingUp('Obteniendo datos')
    this._saleCommentService.getBySale(saleId).subscribe((response: ResponseApi) => {
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

  /**
   * ****************************************************************
   * OPERACIONES CON LA API - COMENTARIOS DE LA VENTA
   * ****************************************************************
   */
  public apiSaleHistoryFilterSale(saleId: number){
    this._sweetAlertService.loadingUp('Obteniendo datos')
    this._saleHistoryService.getBySale(saleId).subscribe((response: ResponseApi) => {
      this._sweetAlertService.stop();
      if(response.code == 200){
        console.log("HISTORIAL:", response.data)
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
}
