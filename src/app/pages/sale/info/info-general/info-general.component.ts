import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription, distinctUntilChanged } from 'rxjs';
import { CompanyList, OperatorList, PersonList, ResponseApi, SaleCommentList, SaleDetailList, SaleDocumentList, SaleHistoryList, SaleList, TypeDocumentList } from 'src/app/core/models';
import { ClientList } from 'src/app/core/models/api/client.model';
import { ApiErrorFormattingService, ClientService, OperatorService, SharedClientService, SharedSaleService, SweetAlertService, TempSaleDetailService, TempSaleService, TypeDocumentService } from 'src/app/core/services';

@Component({
  selector: 'app-info-general',
  templateUrl: './info-general.component.html',
  styleUrls: ['./info-general.component.scss']
})
export class InfoGeneralComponent implements OnInit, OnDestroy {


  // DATOS CLIENTE
  dataClient: ClientList;

  // DATOS PERSONA
  dataPerson: PersonList;

  // DATOS EMPRESA
  dataCompany: CompanyList;

  // DATOS DETALLE
  dataSaleDetail: SaleDetailList;
  
  // DATOS IMITACIONES

  // DATOS TIPO DE DOCUMENTOS
  dataTypeDocument: TypeDocumentList;

  // DATOS DOCUMENTOS
  dataSaleDocument: SaleDocumentList;

  // DATOS COMENTARIOS
  dataSaleComment: SaleCommentList;

  // DATOS HISTORIAL
  dataSaleHistory: SaleHistoryList;

  // Lista de ventas detalles TEMPORALES
  tmpListSaleDetails: SaleDetailList[] = [];
  groupSaleDetail: any;



  // Controlar sub tabla del detalle
  subTableDetails: {visible: boolean, typeService?: string,  data?: any}[] = [];


  // Tipo de documentos
  listTypeDocuments: TypeDocumentList[] = [];

  // Operadores
  listOperators: OperatorList[] = [];

  private subscription: Subscription = new Subscription();

  constructor(
    private cdr: ChangeDetectorRef,
    private _operatorService: OperatorService,
    private _typeDocumentService: TypeDocumentService,
    private _tempSaleDetailService: TempSaleDetailService,
    private _tempSaleService: TempSaleService,
    private _sharedSaleService: SharedSaleService,
    private _sharedClientService: SharedClientService,
    private _clientService: ClientService,
    private _apiErrorFormattingService: ApiErrorFormattingService,
    private _sweetAlertService: SweetAlertService,

  ){}

  ngOnInit(): void {

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


    // Detalle - observado
    this.subscription.add(
      this._tempSaleDetailService.listObserver$
        .subscribe((list: SaleDetailList[]) => {
          this.tmpListSaleDetails = list;

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
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
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
}
