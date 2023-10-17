import { ChangeDetectorRef, Component, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription, distinctUntilChanged, filter, take } from 'rxjs';
import { Company, CompanyList, CountryList, Person, PersonList, ResponseApi, SaleList, TypeDocumentList } from 'src/app/core/models';
import { Client } from 'src/app/core/models/api/client.model';
import { UbigeoList } from 'src/app/core/models/api/maintenance/ubigeo.model';
import { ApiErrorFormattingService, ClientService, CompanyService, CountryService, FormService, PersonService, SharedClientService, SweetAlertService, TempSaleService, TypeDocumentService, UbigeoService } from 'src/app/core/services';

@Component({
  selector: 'app-form-client-full',
  templateUrl: './form-client-full.component.html',
  styleUrls: ['./form-client-full.component.scss']
})
export class FormClientFullComponent {
  @ViewChild('países_id', { static: false }) paises_id: ElementRef<HTMLInputElement>;

  // DATOS EMITIR A LOS FORMULARIOS DETALLES
  dataSendDetail: any = null;

  shareDataClient: any = null;
  shareDataPerson: any = null;
  shareDataCompany: any = null;

  // Formulario para buscar cliente
  isClientPerson: boolean = true;
  submittedSearchClient: boolean = false;
  searchClientForm: FormGroup;

  // COLLAPSE SEARCH CLIENTE
  isCollapseFormSearchClient: boolean = false;
  isCollapseClientList: boolean = true;
  isCollapseFormClient: boolean = true;

  // LISTA DE TIPO DE DOCUMENTOS
  listTypeDocuments: TypeDocumentList[] = [];
  listTypeDocumentFilters: TypeDocumentList[] = [];

  // MESSAGE DE ALERTA
  alertMsg = {
    show: false,
    msg: '',
    type: ''
  }

  private subscription: Subscription = new Subscription();

  constructor(
    private cdr: ChangeDetectorRef,
    private _sharedClientService: SharedClientService,
    private _tempSaleService: TempSaleService,
    private _countryService: CountryService,
    private _ubigeoService: UbigeoService,
    private _personService: PersonService,
    private _companyService: CompanyService,
    private _clientService: ClientService,
    private _typeDocumentService: TypeDocumentService,
    private _apiErrorFormattingService: ApiErrorFormattingService,
    private _sweetAlertService: SweetAlertService,
    private _formService: FormService,
    private formBuilder: FormBuilder
  ){}

  ngOnInit(): void {

    // Inicializar formularios
    this.initFs(); // SEARCH

    // Listar
    this.apiTypeDocumentList();

    // PERSONA LEGAL
    this.subscription.add(
      this._sharedClientService.getLegalPerson()
      .pipe(
        filter(value => value !== null)
      )
      .subscribe((value: boolean) => {
        this.isClientPerson = !value;
      })
    )

    // ID CLIENTE
    this.subscription.add(
      this._sharedClientService.getClientId().subscribe((value: number) => {
        if(value){
          this.alertMsg.show = false;
        }
      })
    )

    // DATOS PERSONA
    this.subscription.add(
      this._sharedClientService.getDataPerson().pipe(take(1)).subscribe((data: Person) => {
        if(data){
          this.toggleFormClient(false);
        }
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

    // Tipos de documentos
    this.subscription.add(
      this._typeDocumentService.typeDocuments$
      .pipe(distinctUntilChanged())
      .subscribe((list: TypeDocumentList[]) => {
        this.listTypeDocuments = list;
        let selectedTypeDocumentId = null;

        if(list.length > 0){
          if(this.isClientPerson){
            this.listTypeDocumentFilters = this.listTypeDocuments.filter((typeDocument) => typeDocument.abreviacion !== 'RUC');
            selectedTypeDocumentId = this.listTypeDocuments?.find((typeDocument) => typeDocument.abreviacion == 'DNI').id;
          } else {
            this.listTypeDocumentFilters = this.listTypeDocuments.filter((typeDocument) => typeDocument.abreviacion == 'RUC');
            selectedTypeDocumentId = this.listTypeDocuments.find((typeDocument) => typeDocument.abreviacion == 'RUC').id;
          }
  
          if(this.searchClientForm && selectedTypeDocumentId){
            this.searchClientForm.get('tipo_documentos_id').setValue(selectedTypeDocumentId);
          }
        }

      })
    )

  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }


  // ALERT TEXT
  private setAlertMsg(msg: string, type: string, show: boolean = true){
    this.alertMsg = {...this.alertMsg, msg, type, show}
  }


  /**
   * ****************************************************************
   * OPERACIONES CON LA API - CLIENT
   * ****************************************************************
   */
  // OPERACIONES CON LA API - BUSCAR POR PERSONA
  public apiClientFilterByPerson(personId: number): Promise<any>{
    this._sweetAlertService.loadingUp('Obteniendo datos');
    return new Promise((resolve, reject) => {
      this._clientService.getByPersonId(personId).subscribe((response: ResponseApi) => {
        this._sweetAlertService.stop();
        if(response.code == 200){
          resolve(response.data);
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
          this._sweetAlertService.showTopEnd({type: 'error', title: 'Error al listar los clientes', message: error.message, timer: 2500});
        }
        reject(error);
      });
    })
  }

  // OPERACIONES CON LA API - BUSCAR POR EMPRESA
  public apiClientFilterByCompany(companyId: number): Promise<any>{
    this._sweetAlertService.loadingUp('Obteniendo datos')
    return new Promise((resolve, reject) => {
      this._clientService.getByCompanyId(companyId).subscribe((response: ResponseApi) => {
        this._sweetAlertService.stop();
        if(response.code == 200){
          resolve(response.data);
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
          this._sweetAlertService.showTopEnd({type: 'error', title: 'Error al listar los clientes', message: error.message, timer: 2500});
        }
        reject(error);
      });
    });
  }

  // OPERACIONES CON LA API - OBTENER EL CLIENTE BUSCADO
  public apiClientGetById(id: number): Promise<any>{
    this._sweetAlertService.loadingUp('Obteniendo datos')
    return new Promise((resolve, reject) => {
      this._clientService.getById(id).subscribe((response: ResponseApi) => {
        this._sweetAlertService.stop();
        if(response.code == 200){
          const data = response.data[0];
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
   * OPERACIONES CON LA API FORÁNEOS
   * ****************************************************************
   */
  // OPERACIONES CON LA API - TIPO DE DOCUMENTOS
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


  // OPERACIONES CON LA API - BUSCAR PERSONA 
  public apiPersonGetByIdentification(params: any): Promise<any>{
    this._sweetAlertService.loadingUp('Obteniendo datos')
    return new Promise((resolve, reject) => {
      this._personService.getByIdentification(params).subscribe((response: ResponseApi) => {
        this._sweetAlertService.stop();
        if(response.code == 200){
          const result = response.data[0];
          resolve(result);
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
          this._sweetAlertService.showTopEnd({type: 'error', title: 'Error al buscar persona', message: error.message, timer: 2500});
        }
        reject(error);
      });
    })
  }


  // OPERACIONES CON LA API - BUSCAR EMPRESA 
  public apiCompanyGetByIdentification(params: any): Promise<any>{
    this._sweetAlertService.loadingUp('Obteniendo datos')
    return new Promise((resolve, reject) => {
      this._companyService.getByIdentification(params).subscribe((response: ResponseApi) => {
        this._sweetAlertService.stop();
        if(response.code == 200){
          const result = response.data[0];
          resolve(result);
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
          this._sweetAlertService.showTopEnd({type: 'error', title: 'Error al buscar empresa', message: error.message, timer: 2500});
        }
        reject(error);
      });
    });
  }


  /**
   * *****************************************************************
   * FORMULARIO  - SEARCH CLIENTE 
   * *****************************************************************
   */
  get fs() {
    return this.searchClientForm.controls;
  }

  /**
   * INICIAR FORMULARTO CON LAS VALIDACIONES
   * @param model 
   */
  private initFs(){
    const formGroupData = this.getFormGroupDataSearchClient();
    this.searchClientForm = this.formBuilder.group(formGroupData);
  }

  /**
   * CREAR VALIDACIONES DEL FORMGROUP
   * @param model 
   * @returns 
   */
  private getFormGroupDataSearchClient(model?: any): object {
    return {
      tipo_documentos_id: ['', [Validators.required, Validators.min(1)]],
      documento: ['', [Validators.required, Validators.minLength(4)]],
      nombre: ['', [Validators.nullValidator, Validators.maxLength(50)]],
    }
  }


 


  // Cambiar entre PERSONA O EMPRESA
  onSwitchChangeTypeClient(isPerson: any) { 
    let selectedTypeDocumentId = null;
    this._sharedClientService.setLegalPerson(!isPerson);
    
    if(isPerson){
      this.listTypeDocumentFilters = this.listTypeDocuments.filter((typeDocument) => typeDocument.abreviacion !== 'RUC');
      selectedTypeDocumentId = this.listTypeDocuments.find((typeDocument) => typeDocument.abreviacion == 'DNI').id;
    } else {
      this.listTypeDocumentFilters = this.listTypeDocuments.filter((typeDocument) => typeDocument.abreviacion == 'RUC');
      selectedTypeDocumentId = this.listTypeDocuments.find((typeDocument) => typeDocument.abreviacion == 'RUC').id;
    }
    

    this._sharedClientService.setClearData(true);
    this.fs.tipo_documentos_id.setValue(selectedTypeDocumentId);
  }


  /**
   * *******************************************************
   * TOGGLE SEARCH CLIENTE
   * *******************************************************
   */
  // Mostrar/ocultar formulario de registro
  toggleFormClient(collapse: boolean = null){
    this.isCollapseFormClient = collapse || !this.isCollapseFormClient;
    if(!this.isCollapseFormClient){
      this.isCollapseFormSearchClient = true;
      this.alertMsg.show = true;
      // this.isCollapseClientList = true;
    } else {
      this.isCollapseFormSearchClient = false;
      this.alertMsg.show = false;
      // this.isCollapseClientList = false;
    }
  }


  // Buscar cliente
  async searchClient(){
    this.submittedSearchClient = true;
    
    if(this.searchClientForm.valid){
      const values = this.searchClientForm.value;

      const params = {
        tipo_documentos_id: values.tipo_documentos_id,
        documento: values.documento,
        search: values.nombre,
      }
  
      if(this.isClientPerson){
        // PERSONA
        const resPerson = await this.apiPersonGetByIdentification(params);
        if(!resPerson){
          this._sweetAlertService.showTopEnd({type: 'warning', title: 'No encontrado', message: 'La persona buscado no se encontró', timer: 2500});
        } else {
          if(!resPerson?.client){
            this._sweetAlertService.showTopEnd({type: 'warning', title: 'No encontrado', message: 'La persona no se encuentra registrado como cliente', timer: 2500});
            this.setAlertMsg('La persona no se encuentra registrado como cliente!', 'text-danger');
          } else {
            this.shareDataClient = resPerson?.client;    
            this._sharedClientService.setDataClient(Client.cast(resPerson?.client));
            this._sharedClientService.setClientId(resPerson?.client?.id)
          } 
          
          this.toggleFormClient(false);     
          this.shareDataPerson = Person.cast(resPerson);    
          this._sharedClientService.setDataPerson(Person.cast(resPerson));
          this._sharedClientService.setPersonId(resPerson?.id);
          this._sharedClientService.setAddress(resPerson?.addresses);
          // console.log("DIRECCIÓN PERSONA:",resPerson.addresses);
        }
   
      } else {
        // EMPRESA
        const resCompany = await this.apiCompanyGetByIdentification(params);
        if(!resCompany){
          this._sweetAlertService.showTopEnd({type: 'warning', title: 'No encontrado', message: 'La empresa buscado no se encontró', timer: 2500});
        } else {
          if(!resCompany?.client){
            this._sweetAlertService.showTopEnd({type: 'warning', title: 'No encontrado', message: 'La empresa no se encuentra registrado como cliente', timer: 2500});
            this.setAlertMsg('La persona no se encuentra registrado como cliente!', 'text-danger');
          } 

          this.toggleFormClient(false);     
          this.shareDataClient = resCompany?.client;    
          this.shareDataCompany = Company.cast(resCompany); 
          // console.log("DIRECCIÓN EMPRESA:", resCompany.addresses);
        }   
      }
    }
  }

  // RESET FORM  SEARCH CLIENT
  resetFormSearchClient(){
    this.searchClientForm.reset();
    // this.isCollapseFormSearchClient = true;
    this.isCollapseClientList = true;
  }


  /***
   * *****************************************
   * RESPETAR FORMULARIOS
   * *****************************************
   */
  onResetForms(){

  }


  /**
   * ************************************************************
   * DATOS COMPARTIDOS - FORMULARIO CLIENTE
   * ************************************************************
   */
  onCancelClient(event: any){
    if(event){
      // this.toggleFormClient(true);
    }
  }

}
