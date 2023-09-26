import { ChangeDetectorRef, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable, Subscription, distinctUntilChanged, of } from 'rxjs';
import { Company, CompanyList, CountryList, Person, PersonList, ResponseApi, TypeDocumentList } from 'src/app/core/models';
import { Client } from 'src/app/core/models/api/client.model';
import { UbigeoList } from 'src/app/core/models/api/maintenance/ubigeo.model';
import { ApiErrorFormattingService, ClientService, CompanyService, CountryService, FormService, PersonService, SweetAlertService, TypeDocumentService, UbigeoService } from 'src/app/core/services';

@Component({
  selector: 'app-form-client',
  templateUrl: './form-client.component.html',
  styleUrls: ['./form-client.component.scss']
})
export class FormClientComponent implements OnInit, OnDestroy{

  @ViewChild('paises_id', { static: false }) paises_id: ElementRef<HTMLInputElement>;


  // Formulario para buscar cliente
  isClientPerson: boolean = true;
  submittedSearchClient: boolean = false;
  searchClientForm: FormGroup;

  // COLLAPSE SEARCH CLIENTE
  isCollapseFormSearchClient: boolean = false;
  isCollapseClientList: boolean = true;
  isCollapseFormClient: boolean = true;

  // Formulario persona
  submittedPerson: boolean = false;
  personForm: FormGroup;
  
  // Formulario empresa
  submittedCompany: boolean = false;
  companyForm: FormGroup;

  // Formulario cliente
  submittedClient: boolean = false;
  isNewDataClient: boolean = true;
  clientForm: FormGroup;

  // LISTA DE TIPO DE DOCUMENTOS
  listTypeDocuments: TypeDocumentList[] = [];
  listTypeDocumentFilters: TypeDocumentList[] = [];

  // LISTA DE PERSONAS
  listPersons: PersonList[] = [];

  // LISTA DE PERSONAS
  listCompanies: CompanyList[] = [];

  // PAISES
  listCountries: CountryList[] = [];

  // UBIGEOS
  listUbigeos: UbigeoList[] = [];

  private subscription: Subscription = new Subscription();

  constructor(
    private cdr: ChangeDetectorRef,
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
    this.initFp(); // PERSONA
    this.initFc(); // EMPRESA
    this.initFClient();

    // Listar
    this.apiCountryList();
    this.apiTypeDocumentList();
    this.searchOptionUbigeo('');

    // Tipos de documentos
    this.subscription.add(
      this._typeDocumentService.typeDocuments$
      .pipe(distinctUntilChanged())
      .subscribe((list: TypeDocumentList[]) => {
        this.listTypeDocuments = list;

        if(this.isClientPerson){
          this.listTypeDocumentFilters = this.listTypeDocuments.filter((typeDocument) => typeDocument.abreviacion !== 'RUC');
        } else {
          this.listTypeDocumentFilters = this.listTypeDocuments.filter((typeDocument) => typeDocument.abreviacion == 'RUC');
          // this.listTypeDocumentFilters = this.listTypeDocuments;
        }
      })
    )

    // Países
    this.subscription.add(
      this._countryService.listObserver$
      .pipe(distinctUntilChanged())
      .subscribe((list: CountryList[]) => {
        this.listCountries = list;
      })
    )
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
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

  // Registrar cliente
  private apiClientRegister(data: Client){
    this._sweetAlertService.loadingUp()
    this.subscription.add(
      this._clientService.register(data).subscribe((response: ResponseApi) => {
        this._sweetAlertService.stop();
        if(response.code == 201){
          const {person, company, client} = response.data;

          if(person){
            this.personForm.setValue(Person.cast(person));
          }
          if(company){
            this.companyForm.setValue(Company.cast(company));
          }

          if(client){
            this.clientForm.setValue(Client.cast(client));
            this.isNewDataClient = false;
          }
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
          this._sweetAlertService.showTopEnd({type: 'error', title: 'Error al registrar el cliente', message: error.message, timer: 2500});
        }
      })
    )
  }

  // Registrar cliente
  private apiClientUpdate(data: Client){
    this._sweetAlertService.loadingUp()
    this.subscription.add(
      this._clientService.update(data, data.id).subscribe((response: ResponseApi) => {
        this._sweetAlertService.stop();
        if(response.code == 200){
          const {person, company, client} = response.data;

          if(person){
            this.personForm.setValue(Person.cast(person));
          }
          if(company){
            this.companyForm.setValue(Company.cast(company));
          }

          if(client){
            this.clientForm.setValue(Client.cast(client));
            this.isNewDataClient = false;
          }
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
          this._sweetAlertService.showTopEnd({type: 'error', title: 'Error al actualizar los datos del cliente', message: error.message, timer: 2500});
        }
      })
    )
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
  public apiPersonListSearch(params: any){
    this._sweetAlertService.loadingUp('Obteniendo datos')
    this._personService.getSearch(params).subscribe((response: ResponseApi) => {
      this._sweetAlertService.stop();
      if(response.code == 200){
        this.listPersons = response.data;
      }

      if(response.code == 500){
        if(response.errors){
          this._sweetAlertService.showTopEnd({type: 'error', title: response.errors?.message, message: response.errors?.error});
        }
      }
    }, (error: any) => {
      this._sweetAlertService.stop();
      if(error.message){
        this._sweetAlertService.showTopEnd({type: 'error', title: 'Error al listar las personas', message: error.message, timer: 2500});
      }
    });
  }

  // OPERACIONES CON LA API - BUSCAR EMPRESA
  public apiCompanyListSearch(params: any){
    this._sweetAlertService.loadingUp('Obteniendo datos')
    this._companyService.getSearch(params).subscribe((response: ResponseApi) => {
      this._sweetAlertService.stop();
      if(response.code == 200){
        this.listCompanies = response.data;
      }

      if(response.code == 500){
        if(response.errors){
          this._sweetAlertService.showTopEnd({type: 'error', title: response.errors?.message, message: response.errors?.error});
        }
      }
    }, (error: any) => {
      this._sweetAlertService.stop();
      if(error.message){
        this._sweetAlertService.showTopEnd({type: 'error', title: 'Error al listar las empresas', message: error.message, timer: 2500});
      }
    });
  }


  // OPERACIONES CON LA API - BUSCAR CLIENTE
  public apiCountryList(forceRefresh: boolean = false){
    this._sweetAlertService.loadingUp('Obteniendo datos')
    this._countryService.getAll(forceRefresh).subscribe((response: ResponseApi) => {
      this._sweetAlertService.stop();
      if(response.code == 200){
        // this.listCountries = response.data;
      }

      if(response.code == 500){
        if(response.errors){
          this._sweetAlertService.showTopEnd({type: 'error', title: response.errors?.message, message: response.errors?.error});
        }
      }
    }, (error: any) => {
      this._sweetAlertService.stop();
      if(error.message){
        this._sweetAlertService.showTopEnd({type: 'error', title: 'Error al listar los países', message: error.message, timer: 2500});
      }
    });
  }

  
  // Buscar ubigeos
  public searchOptionUbigeo(search: string) {
    this._ubigeoService.getSearch({search}).subscribe((response: ResponseApi) => {
      this._sweetAlertService.stop();
      if(response.code == 200){
        this.listUbigeos = response.data;
      }

      if(response.code == 500){
        if(response.errors){
          this._sweetAlertService.showTopEnd({type: 'error', title: response.errors?.message, message: response.errors?.error});
        }
      }
    }, (error: any) => {
      this._sweetAlertService.stop();
      console.log(error);
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
      tipo_documentos_id: ['', [Validators.nullValidator, Validators.min(1)]],
      documento: ['', [Validators.nullValidator, Validators.min(1)]],
      nombre: ['', [Validators.nullValidator, Validators.maxLength(50)]],
    }
  }

  /**
   * *****************************************************************
   * FORMULARIO  - FORMULARIO CLIENTE 
   * *****************************************************************
   */
  get fClient() {
    return this.clientForm.controls;
  }

  /**
   * INICIAR FORMULARTO CON LAS VALIDACIONES
   * @param model 
   */
  private initFClient(){
    const model = new Client();
    const formGroupData = this.getFormGroupDataClient(model);
    this.clientForm = this.formBuilder.group(formGroupData);
  }

  /**
   * CREAR VALIDACIONES DEL FORMGROUP
   * @param model 
   * @returns 
   */
  private getFormGroupDataClient(model?: Client): object {
    return {
      ...this._formService.modelToFormGroupData(model),
      tipo_cliente: [model?.tipo_cliente || '', [Validators.required, Validators.maxLength(25)]],
      cif: [model?.cif, [Validators.nullValidator, Validators.minLength(9), Validators.maxLength(9)]],
      codigo_carga: [model?.codigo_carga, [Validators.nullValidator, Validators.maxLength(50)]],
      segmento_vodafond: [model?.segmento_vodafond, [Validators.nullValidator, Validators.maxLength(50)]],
      // cta_bco: [model?.cta_bco, [Validators.nullValidator, Validators.maxLength(50)]],
    }
  }


  /**
   * *****************************************************************
   * FORMULARIO  - REGISTRAR PERSONA 
   * *****************************************************************
   */
  get fp() {
    return this.personForm.controls;
  }

  /**
   * INICIAR FORMULARTO CON LAS VALIDACIONES
   * @param model 
   */
  private initFp(){
    const model = new Person()
    const formGroupData = this.getFormGroupDataPerson(model);
    this.personForm = this.formBuilder.group(formGroupData);
  }

  /**
   * CREAR VALIDACIONES DEL FORMGROUP
   * @param model 
   * @returns 
   */
  private getFormGroupDataPerson(model?: Person): object {
    return {
      ...this._formService.modelToFormGroupData(model),
      paises_id: [model?.paises_id, [Validators.nullValidator, Validators.min(1)]],
      codigo_ubigeo: [model?.codigo_ubigeo, [Validators.nullValidator, Validators.maxLength(50)]],
      nombres: [model?.nombres, [Validators.required, Validators.maxLength(50)]],
      apellido_paterno: [model?.apellido_paterno, [Validators.required, Validators.maxLength(50)]],
      apellido_materno: [model?.apellido_materno, [Validators.required, Validators.maxLength(50)]],
      tipo_documentos_id: [model?.tipo_documentos_id, [Validators.required, Validators.maxLength(50)]],
      documento: [model?.documento, [Validators.nullValidator, Validators.maxLength(11)]],
      reverso_documento: [model?.reverso_documento, [Validators.nullValidator, Validators.maxLength(50)]],
      fecha_nacimiento: [model?.fecha_nacimiento, [Validators.nullValidator, Validators.maxLength(20)]],
      telefono: [model?.telefono, [Validators.nullValidator, Validators.maxLength(11)]],
      correo: [model?.correo, [Validators.nullValidator, Validators.maxLength(150)]],
      direccion: [model?.direccion, [Validators.nullValidator, Validators.maxLength(150)]],
    }
  }


  /**
   * *****************************************************************
   * FORMULARIO  - REGISTRAR EMPRESA 
   * *****************************************************************
   */
  get fc() {
    return this.companyForm.controls;
  }

  /**
   * INICIAR FORMULARTO CON LAS VALIDACIONES
   * @param model 
   */
  private initFc(){
    const model = new Company()
    const formGroupData = this.getFormGroupDataCompany(model);
    this.companyForm = this.formBuilder.group(formGroupData);
  }

  /**
   * CREAR VALIDACIONES DEL FORMGROUP
   * @param model 
   * @returns 
   */
  private getFormGroupDataCompany(model?: Company): object {
    return {
      ...this._formService.modelToFormGroupData(model),
      paises_id: [model?.paises_id, [Validators.nullValidator, Validators.min(1)]],
      codigo_ubigeo: [model?.codigo_ubigeo, [Validators.nullValidator, Validators.maxLength(50)]],
      tipo_empresa: [model?.tipo_empresa, [Validators.required, Validators.maxLength(30)]],
      razon_social: [model?.razon_social, [Validators.required, Validators.maxLength(50)]],
      nombre_comercial: [model?.nombre_comercial, [Validators.required, Validators.maxLength(50)]],
      descripcion: [model?.descripcion, [Validators.nullValidator, Validators.maxLength(50)]],
      tipo_documentos_id: [model?.tipo_documentos_id, [Validators.required, Validators.maxLength(50)]],
      documento: [model?.documento, [Validators.nullValidator, Validators.maxLength(11)]],
      telefono: [model?.telefono, [Validators.nullValidator, Validators.maxLength(11)]],
      correo: [model?.correo, [Validators.nullValidator, Validators.maxLength(150)]],
      direccion: [model?.direccion, [Validators.nullValidator, Validators.maxLength(150)]],
      ciudad: [model?.ciudad, [Validators.nullValidator, Validators.maxLength(150)]],
    }
  }



  // Cambiar entre PERSONA O EMPRESA
  onSwitchChangeTypeClient(isPerson: any) { 
    if(isPerson){
      this.listTypeDocumentFilters = this.listTypeDocuments.filter((typeDocument) => typeDocument.abreviacion !== 'RUC');
      this.fClient.persona_juridica.setValue(0);
    } else {
      this.listTypeDocumentFilters = this.listTypeDocuments.filter((typeDocument) => typeDocument.abreviacion == 'RUC');
      this.fClient.persona_juridica.setValue(1);
      this.fc.is_active.setValue(1);
      // this.listTypeDocumentFilters = this.listTypeDocuments;
    }

    this.fClient.is_active.setValue(1);

  }



  /**
   * *******************************************************
   * TOGGLE SEARCH CLIENTE
   * *******************************************************
   */
  // Toggle formulario de instalaciones
  toggleFormSearchClient(){
    this.isCollapseFormSearchClient = !this.isCollapseFormSearchClient;
    if(this.isCollapseFormSearchClient){
      this.isCollapseClientList = true;
    }
  }

  // Toggle formulario de instalaciones
  toggleListSearchClient(){
    this.isCollapseClientList = !this.isCollapseClientList;
    if(!this.isCollapseClientList){
      this.isCollapseFormSearchClient = true;
    }
  }

  // Mostrar/ocultar formulario de registro
  toggleFormClient(){
    this.isCollapseFormSearchClient = true;
    this.isCollapseClientList = true;
    this.isCollapseFormClient = !this.isCollapseFormClient;
  }


  // Buscar cliente
  searchClient(){
    this.submittedSearchClient = true;
    this.isCollapseClientList = false;

    if(this.searchClientForm.valid){
      const values = this.searchClientForm.value;

      const params = {
        tipo_documentos_id: values.tipo_documentos_id,
        documento: values.documento,
        search: values.nombre,
      }
  
      if(this.isClientPerson){
        this.apiPersonListSearch(params);
      } else {
        this.apiCompanyListSearch(params);
      }
    }
  }

  // RESET FORM  SEARCH CLIENT
  resetFormSearchClient(){
    this.searchClientForm.reset();
    // this.isCollapseFormSearchClient = true;
    this.isCollapseClientList = true;
    this.listPersons = [];
  }

  // RESET FORMS - CLIENT
  resetFormClient(){
    this.clientForm.reset();
    this.personForm.reset();
    this.companyForm.reset();
    this.isNewDataClient = true;
    this.fClient.is_active.setValue(1);


    if(this.isClientPerson){
      this.fClient.persona_juridica.setValue(false);
    } else {
      this.fClient.persona_juridica.setValue(true);
      this.fc.is_active.setValue(1);
    }

    if(this?.paises_id?.nativeElement){
      this.paises_id?.nativeElement.focus();
    }
  }


  /**
   * ************************************************************
   * SELECCIÓN DE CLIENTE - ROW TABLE CLIENTE SEARCHED
   * ************************************************************
   * @param id 
   */
  async selectClientRowTable(id: any){
    this.isNewDataClient = true;

    if(this.isClientPerson){
      const person = this.listPersons.find((per) => per.id === id);
      
      // Buscar cliente por id personal
      const resPerson = await this.apiClientFilterByPerson(person.id);
      if(resPerson.length > 0){
        const client = Client.cast(resPerson[0]);
        this.clientForm.setValue(client);        
        this.isNewDataClient = false;
      } else {
        this.clientForm.reset();
        this.fClient.is_active.setValue(1);
      }

      if(person){
        this.personForm.setValue(Person.cast(person));   
        this.fClient.personas_id.setValue(person.id);  
      }
      
    } else {
      const company = this.listCompanies.find((com) => com.id === id);

      // Buscar cliente por id empresa
      const resCompany = await this.apiClientFilterByCompany(company.id);
      if(resCompany.length > 0){
        const client = Client.cast(resCompany[0]);
        this.clientForm.setValue(client);
        this.isNewDataClient = false;
      } else {
        this.clientForm.reset();
        this.fClient.is_active.setValue(1);
      }

      if(company){
        this.companyForm.setValue(Company.cast(company));      
        this.fClient.empresas_id.setValue(company.id);
      }
    }
    
    // Mostrar formulario
    this.isCollapseFormClient = false;

    // Ocultar lista de clientes buscados
    this.isCollapseClientList = true; 
    this.isCollapseFormSearchClient = true;
  }
  

  /**
   * *******************************************************
   *  PROCEDER A GUARDAR LOS DATOS DEL CLIENTE
   * *******************************************************
   */
  saveClient(){
    this.submittedPerson = true;
    this.submittedCompany = true;
    this.submittedClient = true;

    if(this.isClientPerson){
      if(this.personForm.invalid){
        this._sweetAlertService.showTopEnd({title: 'Validación de datos', message: 'Datos obligatorios incompletos', type: 'warning', timer: 1500});
        return;
      }
    } 

    if(!this.isClientPerson){
      if(this.companyForm.invalid){
        this._sweetAlertService.showTopEnd({title: 'Validación de datos', message: 'Datos obligatorios incompletos', type: 'warning', timer: 1500});
        return;
      }
    } 

    if(this.clientForm.invalid){
      this._sweetAlertService.showTopEnd({title: 'Validación de datos', message: 'Datos obligatorios incompletos', type: 'warning', timer: 1500});
    } else {
      
      const valuesCompany = this.companyForm.value;
      const valuesPerson = this.personForm.value;
      const valuesClient = this.clientForm.value;

      if(this.isClientPerson){
        valuesClient['datos_persona'] = valuesPerson;
      } else{
        valuesClient['datos_empresa'] = valuesCompany;
      }

      if(this.isNewDataClient){
        // Crear nuevo registro
        this._sweetAlertService.showConfirmationAlert('¿Estas seguro de registrar al cliente?').then((confirm) => {
          if(confirm.isConfirmed){
            this.apiClientRegister(valuesClient);
          }
        });
      } else {
        // Modificar
        this._sweetAlertService.showConfirmationAlert('¿Estas seguro de modificar los datos del cliente?').then((confirm) => {
          if(confirm.isConfirmed){
            this.apiClientUpdate(valuesClient);
          }
        });
      }

    }
  }
}
