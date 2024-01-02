import { ChangeDetectorRef, Component, ElementRef, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BehaviorSubject, Observable, Subscription, debounceTime, distinctUntilChanged, filter, of, pipe, take } from 'rxjs';
import { BankAccount, Company, CompanyList, Contact, CountryList, IdentificationDocument, InstallationList, Person, PersonList, ResponseApi, SaleList, TypeDocumentList } from 'src/app/core/models';
import { Client, ClientList } from 'src/app/core/models/api/client.model';
import { UbigeoList } from 'src/app/core/models/api/maintenance/ubigeo.model';
import { ApiErrorFormattingService, ClientService, CompanyService, CountryService, FormService, PersonService, SharedClientService, SharedSaleService, SweetAlertService, TempSaleService, TypeDocumentService, UbigeoService } from 'src/app/core/services';

import { FormCompanyComponent } from './form-company/form-company.component';
import { FormPersonComponent } from './form-person/form-person.component';
import { FormArrayBankAccountComponent } from './form-client-bank-account/form-array-bank-account/form-array-bank-account.component';

@Component({
  selector: 'app-form-client',
  templateUrl: './form-client.component.html',
  styleUrls: ['./form-client.component.scss']
})
export class FormClientComponent implements OnInit, OnDestroy, OnChanges{
  
  @ViewChild('focusTipoCliente') focusTipoCliente: ElementRef<HTMLInputElement>;
  @ViewChild('formCompany') formCompany!: FormCompanyComponent;
  @ViewChild('formPerson') formPerson!: FormPersonComponent;
  @ViewChild('formBankAccount') formBankAccount!: FormArrayBankAccountComponent;

  // Datos de entrada
  @Input() data: Client = null;
  @Input() dataCompany: Company = null;
  @Input() dataPerson: Person = null;
  @Input() dataReset: boolean = false;

  // Datos de salida
  @Output() submit = new EventEmitter<any>();
  @Output() cancel = new EventEmitter<any>();


  // COMPARTIDO
  shareBankAccounts: BankAccount[] = [];
  

  // PAISES
  listCountries: CountryList[] = [];

  // Formulario para buscar cliente
  isClientPerson: boolean = true;
  listTypeClientLocal: any[] = [
    {id: 'RE', name: 'Particular'}, // Residencial
    {id: 'ME', name: 'Micro Empresa'}, // Micro Empresa'
    {id: 'PM', name: 'PYMES'}, // PYMES
    {id: 'CO', name: 'Corporativo'}, // PYMES
  ];

  listTypeClientFilter: any[] = [];

  // IDENTIFICACIONES
  listIdentifications: IdentificationDocument[] = [];
  
  // CONTACTOS
  listContacts: Contact[] = [];

  // CUENTAS BANCARIAS
  listBankAccount: BankAccount[] = [];

  // DATOS DE LA PERSONA OBTENIDO DEL FORMULARIO 
  dataPersonSend: Person;
  dataCompanySend: Company;

  // Formulario cliente
  isNewDataClient: boolean = true;
  submittedClient: boolean = false;
  clientForm: FormGroup;


  // CAMPOS MOSTRAR/OCULTAR
  showFieldCif: boolean = false;

  clientId: number;
  personId: number;
  companyId: number;
  legalPerson: boolean = false;

  // ID VENTA PARA SABER SI EXISTE 
  saleId: number = null;

  private subscription: Subscription = new Subscription();

  constructor(
    private cdr: ChangeDetectorRef,
    private _sharedClientService: SharedClientService,
    private _sharedSaleService: SharedSaleService,
    private _countryService: CountryService,
    private _clientService: ClientService,
    private _apiErrorFormattingService: ApiErrorFormattingService,
    private _sweetAlertService: SweetAlertService,
    private _formService: FormService,
    private formBuilder: FormBuilder
  ){

  }

  ngOnInit(): void {
    this.apiCountryList();
    this.initFClient();

    this.onChangeData();

    // Países
    this.subscription.add(
      this._countryService.listObserver$
      .pipe(distinctUntilChanged())
      .subscribe((list: CountryList[]) => {
        this.listCountries = list;
      })
    )
    

    // LIMPIAR DATOS
    this.subscription.add(
      this._sharedClientService.getClearData()
      .pipe(
        filter(value => value !== null)
      )
      .subscribe((value: boolean) =>  {
        if(value){
          this.onReset();
        }
      })
    )

    // ID VENTA
    this.subscription.add(
      this._sharedSaleService.getSaleId().subscribe((value: number) =>  this.saleId = value)
    )

    // ID PERSONA
    this.subscription.add(
      this._sharedClientService.getPersonId().subscribe((value: number) =>  this.personId = value)
    )

    // ID EMPRESA
    this.subscription.add(
      this._sharedClientService.getCompanyId().subscribe((value: number) => this.companyId = value)
    )

    // PERSONA LEGAL
    this.subscription.add(
      this._sharedClientService.getLegalPerson()
      .pipe(
        filter(value => value !== null)
      )
      .subscribe((value: boolean) =>  {
        this.legalPerson = value;
        // console.log("PERSONA LEGAL OBSERVADO:", value)
        
        if(value){
          this.listTypeClientFilter = this.listTypeClientLocal.filter((item) => item.id !== 'RE');
          this.fClient.tipo_cliente.setValue('ME');
        } else {
          this.listTypeClientFilter = this.listTypeClientLocal.filter((item) => item.id !== 'PM' && item.id !== 'CO');
          this.fClient.tipo_cliente.setValue('RE');
        }
      })
    )

    // DATOS PERSONA
    this.subscription.add(
      this._sharedClientService.getDataPerson().pipe(take(1)).subscribe((data: Person) => {
        if(data){
          this.dataPerson = data;
        }
      })
    )

    // DATOS EMPRESA
    this.subscription.add(
      this._sharedClientService.getDataCompany().pipe(take(1)).subscribe((data: Company) => {
        if(data){
          this.dataCompany = data;
        }
      })
    )

    // DATOS CLIENTE
    this.subscription.add(
      this._sharedClientService.getDataClient().pipe(take(1)).subscribe((data: Client) => {
        if(data){
          console.log("DATOS CLIENTE OBSERVADO:", this.data)
          this.data = data;
          this.shareBankAccounts = this.data.bank_accounts;
          this.clientForm.setValue(Client.cast(this.data));
          this.isNewDataClient = false;
        }
      })
    )

  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if(changes.data && !changes.data.firstChange){
      this.onChangeData();
    }

    if(changes.dataPerson && !changes.dataPerson.firstChange){
      this.onChangeDataPerson();
    }

    if(changes.dataCompany && !changes.dataCompany.firstChange){
      this.onChangeDataCompany();
    }
  }

  // DETECCIÓN DE CAMBIOS PARA CLIENTE
  onChangeData(){
    if(this.clientForm){
      if(this.data){
        this.shareBankAccounts = this.data.bank_accounts;
        this.clientForm.setValue(Client.cast(this.data));
        this.isNewDataClient = false;
      } else {
        this.shareBankAccounts = [];
        this.clientForm.setValue(new Client());
        this.isNewDataClient = true;
      }
    }
  }

  onChangeDataPerson(){
    if(this.dataPerson){
      // console.log(this.dataPerson);
    } 
  }
  
  onChangeDataCompany(){
    if(this.dataCompany){
      // console.log(this.dataCompany);
    } 
  }

  // RESETEAR FROMULARIOS
  onChangeReset(){
    if(this.dataReset){
      this.onReset();

      if(this.legalPerson){
        this.listTypeClientFilter = this.listTypeClientLocal.filter((item) => item.id !== 'RE');
        this.fClient.tipo_cliente.setValue('ME');
      } else {
        this.listTypeClientFilter = this.listTypeClientLocal.filter((item) => item.id !== 'PM' && item.id !== 'CO');
        this.fClient.tipo_cliente.setValue('RE');
      }
    }
  }

  /**
   * ****************************************************************
   * OPERACIONES CON LA API - CLIENT
   * ****************************************************************
   */
  // OPERACIONES CON LA API - PAISES
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
          if(data){
            if(data.person !== null){
              this._sharedClientService.setPersonId(data.person.id);
              this._sharedClientService.setLegalPerson(false);
            } 
            
            if(data.company !== null){
              this._sharedClientService.setCompanyId(data.company.id);
              this._sharedClientService.setLegalPerson(true);
            } 
  
            const client = Client.cast(data);
            this.clientForm.setValue(client);
            this.isNewDataClient = false;
            this.isClientPerson = client.persona_juridica? false: true;
            this._sharedClientService.setClientId(client.id);
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

  // Registrar cliente
  private apiClientRegister(data: Client){
    this._sweetAlertService.loadingUp()
    this.subscription.add(
      this._clientService.register(data).subscribe((response: ResponseApi) => {
        this._sweetAlertService.stop();
        if(response.code == 201){
          const {person, company, client} = response.data;
          const dataEmit: any = {};

          if(person){
            this.dataPerson = Person.cast(person);
            this._sharedClientService.setPersonId(person.id);
            this._sharedClientService.setLegalPerson(false);
            this._sharedClientService.setDataPerson(Person.cast(person));
            dataEmit.personas_id = person.id;
            dataEmit.persona_juridica = false;
          }
          
          if(company){
            this.dataCompany = Company.cast(company);
            this._sharedClientService.setCompanyId(company.id);
            this._sharedClientService.setDataCompany(Company.cast(company));
            this._sharedClientService.setLegalPerson(true);
            dataEmit.empresas_id = company.id;
            dataEmit.persona_juridica = true;
          }
          
          if(client){
            this.data = client;
            this.clientForm.setValue(Client.cast(client));
            this.isNewDataClient = false;
            this._sharedClientService.setClientId(client.id);
            this._sharedClientService.setDataClient(Client.cast(client));
            dataEmit.clientes_id = client.id;
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
  private apiClientUpdate(data: Client, id: number){
    this._sweetAlertService.loadingUp()
    this.subscription.add(
      this._clientService.update(data, id).subscribe((response: ResponseApi) => {
        this._sweetAlertService.stop();
        if(response.code == 200){
          const {person, company, client} = response.data;

          // const dataInstallation = InstallationList.cast(person?.addresses[0]);
          // this._sharedSaleService.setDataInstallation({...dataInstallation, id: null});

          if(person){
            this.dataPerson = Person.cast(person);
            this._sharedClientService.setPersonId(person.id);
            this._sharedClientService.setDataPerson(Person.cast(person));
            this._sharedClientService.setLegalPerson(false);
          }

          if(company){
            this.dataCompany = Company.cast(company);
            this._sharedClientService.setCompanyId(company.id);
            this._sharedClientService.setDataCompany(Company.cast(company));
            this._sharedClientService.setLegalPerson(true);
          }

          if(client){
            this.clientForm.setValue(Client.cast(client));
            this._sharedClientService.setClientId(client.id);
            this._sharedClientService.setDataClient(Client.cast(client));
            this.isNewDataClient = false;
            this.shareBankAccounts = client.bank_accounts;
            this.data = client;
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

    if(this.legalPerson){
      this.listTypeClientFilter = this.listTypeClientLocal.filter((item) => item.id !== 'RE');
      this.fClient.tipo_cliente.setValue('ME');
    } else {
      this.listTypeClientFilter = this.listTypeClientLocal.filter((item) => item.id !== 'PM' && item.id !== 'CO');
      this.fClient.tipo_cliente.setValue('RE');
    }
  }

  /**
   * CREAR VALIDACIONES DEL FORMGROUP
   * @param model 
   * @returns 
   */
  private getFormGroupDataClient(model?: Client): object {
    return {
      ...this._formService.modelToFormGroupData(model),
      tipo_cliente: [model?.tipo_cliente || 'RE', [Validators.required, Validators.maxLength(25)]],
      codigo_carga: [model?.codigo_carga, [Validators.nullValidator, Validators.maxLength(50)]],
      segmento_vodafond: [model?.segmento_vodafond, [Validators.nullValidator, Validators.maxLength(50)]],
      persona_juridica: [model?.persona_juridica, [Validators.nullValidator]],
      // cta_bco: [model?.cta_bco, [Validators.nullValidator, Validators.maxLength(50)]],
    }
  }


  /* CAMBIAR DE TIPO DE CLIENTE */
  onChangeFieldTypeClient(){
    const tipoClienteValue = this.clientForm.get('tipo_cliente').value;
    this._sharedClientService.setTypeClient(tipoClienteValue);
  }



  // RESET FORMS - CLIENT
  resetFormClient(){
    this.clientForm.reset();
    this.isNewDataClient = true;
    this.fClient.is_active.setValue(1);


    // Eliminar las variables locales
    this._sharedClientService.setPersonId(null);
    this._sharedClientService.setCompanyId(null);
    this._sharedClientService.setClientId(null);
    this._sharedClientService.setLegalPerson(null);
  }

  
  
  /**
   * ************************************************************
   * CAPTURAR DATOS DE LOS FORMULARIOS REFERENCIADOS
   * ************************************************************
   */
  // PERSONA
  onDataPerson(event: any){
    let {emit, person, identifications, contacts} = event;
    if(emit){
      const dPerson = Person.cast(person);
      this.dataPersonSend = dPerson;

      if(identifications.length > 0){
        this.listIdentifications = IdentificationDocument.casts(identifications);
      }

      if(contacts.length > 0){
        this.listContacts = Contact.casts(contacts);
      }
    } else {
      this.dataPersonSend = null;
      this.listIdentifications = [];
      this.listContacts = [];
    }

    setTimeout(() => {
      this.onSubmit();
    }, 0);
  }

  // EMPRESA
  onDataCompany(event: any){
    let {emit, company, identifications, contacts} = event;
    if(emit){
      const dCompany = Company.cast(company);
      this.dataCompanySend = dCompany;

      if(identifications.length > 0){
        this.listIdentifications = IdentificationDocument.casts(identifications);
      }

      if(contacts.length > 0){
        this.listContacts = Contact.casts(contacts);
      }
    } else {
      this.dataCompanySend = null;
      this.listIdentifications = [];
      this.listContacts = [];
    }

    setTimeout(() => {
      this.onSubmit();
    }, 0);
  }

  // CUENTA BANCARIAS
  onDataBankAccount(event: any){
    let {emit, values} = event;
    if(emit){
      this.listBankAccount = BankAccount.casts(values);
    } else {
      this.listBankAccount = [];
    }
  }

  // DATOS DE PERSONA
  submitPerson(){
    const identifications = this.formPerson.submitIdentification();
    const contacts = this.formPerson.submitContact();
    if(this.formPerson.personForm.invalid || !identifications || !contacts){
      // this._sweetAlertService.showTopEnd({title: 'Validación de datos', message: 'Campos obligatorios vacíos, para persona', type: 'warning', timer: 1500});
      return false;
    } else {
      this.formPerson.personForm.get('identifications').setValue(IdentificationDocument.casts(identifications));
      this.formPerson.personForm.get('contacts').setValue(Contact.casts(contacts));
      return this.formPerson.personForm.value;
    }
  }

  // DATOS DE EMPRESA
  submitCompany(){
    const identifications = this.formCompany.submitIdentification();
    const contacts = this.formCompany.submitContact();
    if(this.formCompany.companyForm.invalid || !identifications || !contacts){
      // this._sweetAlertService.showTopEnd({title: 'Validación de datos', message: 'Campos obligatorios vacíos, para persona', type: 'warning', timer: 1500});
      return false;
    } else {
      this.formCompany.companyForm.get('identifications').setValue(IdentificationDocument.casts(identifications));
      this.formCompany.companyForm.get('contacts').setValue(Contact.casts(contacts));
      return this.formCompany.companyForm.value;
    }
  }

  // DATOS DE CUENTAS BANCARIAS
  submitBankAccount(){
    if(this.formBankAccount.formListBankAccount.invalid){
      // this._sweetAlertService.showTopEnd({title: 'Validación de datos', message: 'Campos obligatorios vacíos, para cuentas bancarias', type: 'warning', timer: 1500});
      return false;
    } else {
      return this.formBankAccount.formListBankAccount.value;
    }
  }

  
  /**
   * ************************************************************
   * EMITIR EL VALOR DEL FORMULARIO
   * ************************************************************
   */
  execSubmit(){
    this.submittedClient = true;
    // this._sharedClientService.setSubmitData(true);
    if(this.legalPerson){
      // DATOS EMPRESA
      this.dataCompanySend = this.submitCompany();

    } else {
      // DATOS PERSONA
      this.dataPersonSend = this.submitPerson();
    }



    // CUENTAS BANCARIAS
    const bankAccounts = this.submitBankAccount();
    if(bankAccounts){
      this.listBankAccount = BankAccount.casts(bankAccounts);
    } else {
      this.listBankAccount = [];
    }


    this.onSubmit();
  }

  onSubmit() {
    if(this.legalPerson && !this.dataCompanySend){
      this._sweetAlertService.showTopEnd({title: 'Validación de datos', message: 'Campos obligatorios vacíos', type: 'warning', timer: 1500});
      return
    }

    if(!this.legalPerson && !this.dataPersonSend){
      this._sweetAlertService.showTopEnd({title: 'Validación de datos', message: 'Campos obligatorios vacíos', type: 'warning', timer: 1500});
      return
    }

    if(this.clientForm.invalid || this.listBankAccount.length == 0){
      this._sweetAlertService.showTopEnd({title: 'Validación de datos', message: 'Campos obligatorios vacíos', type: 'warning', timer: 1500});
    } else {
      const values: Client = this.clientForm.value;
      values.bank_accounts = this.listBankAccount;
      values.persona_juridica = this.legalPerson;

      // TIPO DE CLIENTE
      if(this.legalPerson){
        if(this.companyId){
          values.empresas_id = this.companyId;
        }
        values.company = this.dataCompanySend;
      } else {
        if(this.personId){
          values.personas_id = this.personId;
        }
        values.person = this.dataPersonSend;
      }


      if(this.isNewDataClient){
        this._sweetAlertService.showConfirmationAlert('¿Estas seguro de registrar el cliente?').then((confirm) => {
          if(confirm.isConfirmed){
            this.apiClientRegister(values);
          }
        });
      } else {
        this._sweetAlertService.showConfirmationAlert('¿Estas seguro de actualizar el cliente?').then((confirm) => {
          if(confirm.isConfirmed){
            this.apiClientUpdate(values, values.id);
          }
        });
      }     
    }
  }

  onCancel(){
    // this.onReset();
    // this.focusTipoCliente.nativeElement.focus();
    this._sharedClientService.setClearData(true);
    this.cancel.emit({message: 'Cancelado'});
  }

  onReset(){
    this.submittedClient = false;
    this.isNewDataClient = true;
    this.clientForm.reset(new Client());
    this.clientForm.get('tipo_cliente').setValue('RE');
    this.clientForm.get('is_active').setValue(1);
    this._sharedClientService.setPersonId(null);
    this._sharedClientService.setCompanyId(null);
    this._sharedClientService.setClientId(null);
    this._sharedClientService.setDataClient(null);
    this._sharedClientService.setDataPerson(null);
    this._sharedClientService.setDataCompany(null);
    // this._sharedClientService.setLegalPerson(false);
    // this._sharedClientService.setTypeClient(null);
    this.dataPerson = null;
    this.dataCompany = null;
    this.dataReset = false;
    this.shareBankAccounts = [];
  }



  
}
