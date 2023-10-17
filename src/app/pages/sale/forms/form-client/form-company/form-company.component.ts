import { ChangeDetectorRef, Component, ElementRef, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription, distinctUntilChanged, filter } from 'rxjs';
import { Company, Contact, CountryList, IdentificationDocument, ResponseApi } from 'src/app/core/models';
import { UbigeoList } from 'src/app/core/models/api/maintenance/ubigeo.model';
import { ApiErrorFormattingService, CompanyService, CountryService, FormService, SharedClientService, SweetAlertService, UbigeoService } from 'src/app/core/services';

@Component({
  selector: 'app-form-company',
  templateUrl: './form-company.component.html',
  styleUrls: ['./form-company.component.scss']
})
export class FormCompanyComponent implements OnInit, OnDestroy, OnChanges {

  // @ViewChild('paises_id') focusPais: ElementRef<HTMLInputElement>;

  // Datos de entrada
  @Input() hiddenButtons: boolean = false;
  @Input() data: Company = null;

  // Datos de salida
  @Output() submit = new EventEmitter<any>();
  @Output() cancel = new EventEmitter<any>();

  isNewData: boolean = true;
  submitted: boolean = false;
  companyForm: FormGroup;

  // COMPARTIDO
  shareIdentifications: IdentificationDocument[] = [];
  shareContacts: Contact[] = [];

  // IDENTIFICACIONES
  listIdentification: IdentificationDocument[] = [];

  // CONTACTOS
  listContact: Contact[] = [];


  // PAISES
  listCountries: CountryList[] = [];
  nameCountrySelected: string = null;

  // UBIGEOS
  listUbigeos: UbigeoList[] = [];

  private subscription: Subscription = new Subscription();

  constructor(
    private cdr: ChangeDetectorRef,
    private _countryService: CountryService,
    private _ubigeoService: UbigeoService,
    private _sharedClientService: SharedClientService,
    private _companyService: CompanyService,
    private _apiErrorFormattingService: ApiErrorFormattingService,
    private _sweetAlertService: SweetAlertService,
    private _formService: FormService,
    private formBuilder: FormBuilder
  ) { }

  ngOnInit(): void {
    this.initForm();
    this.onChangeData();

    this.apiCountryList();
    this.searchOptionUbigeo('');

    // RESETEAR DATOS
    this.subscription.add(
      this._sharedClientService.getClearData()
      .pipe(
        filter(value => value !== null)
      )
      .subscribe((value: boolean) => {
        if (value) {
          this.onReset();
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

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.data && !changes.data.firstChange) {
      this.onChangeData();
    }
  }

  // DATOS EMITIDOS
  onChangeData() {
    if (this.companyForm) {
      if (this.data) {
        this.shareIdentifications = this.data.identifications;
        this.shareContacts = this.data.contacts;
        this.companyForm.setValue(Company.cast(this.data));
        this.isNewData = false;
      } else {
        this.shareIdentifications = [];
        this.shareContacts = [];
        this.companyForm.setValue(new Company());
        this.isNewData = true;
      }
    }

  }


  /**
 * ****************************************************************
 * OPERACIONES CON LA API FORÁNEOS
 * ****************************************************************
 */

  // OPERACIONES CON LA API - BUSCAR CLIENTE
  public apiCountryList(forceRefresh: boolean = false) {
    this._sweetAlertService.loadingUp('Obteniendo datos')
    this._countryService.getAll(forceRefresh).subscribe((response: ResponseApi) => {
      this._sweetAlertService.stop();
      if (response.code == 200) {
        // this.listCountries = response.data;
      }

      if (response.code == 500) {
        if (response.errors) {
          this._sweetAlertService.showTopEnd({ type: 'error', title: response.errors?.message, message: response.errors?.error });
        }
      }
    }, (error: any) => {
      this._sweetAlertService.stop();
      if (error.message) {
        this._sweetAlertService.showTopEnd({ type: 'error', title: 'Error al listar los países', message: error.message, timer: 2500 });
      }
    });
  }

  // Buscar ubigeos
  public searchOptionUbigeo(search: string) {
    this._ubigeoService.getSearch({ search }).subscribe((response: ResponseApi) => {
      this._sweetAlertService.stop();
      if (response.code == 200) {
        this.listUbigeos = response.data;
      }

      if (response.code == 500) {
        if (response.errors) {
          this._sweetAlertService.showTopEnd({ type: 'error', title: response.errors?.message, message: response.errors?.error });
        }
      }
    }, (error: any) => {
      this._sweetAlertService.stop();
      console.log(error);
    });
  }




  /**
   * *****************************************************************
   * FORMULARIO  - REGISTRAR EMPRESA 
   * *****************************************************************
   */
  get f() {
    return this.companyForm.controls;
  }

  /**
   * INICIAR FORMULARTO CON LAS VALIDACIONES
   * @param model 
   */
  private initForm() {
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
      paises_id: [model?.paises_id, [Validators.required, Validators.min(1)]],
      codigo_ubigeo: [model?.codigo_ubigeo, [Validators.nullValidator, Validators.maxLength(50)]],
      tipo_empresa: [model?.tipo_empresa, [Validators.required, Validators.maxLength(50)]],
      razon_social: [model?.razon_social, [Validators.required, Validators.maxLength(50)]],
      nombre_comercial: [model?.nombre_comercial, [Validators.nullValidator, Validators.maxLength(50)]],
      descripcion: [model?.descripcion, [Validators.nullValidator, Validators.maxLength(50)]],
    }
  }


  /**
   * +****************************************************************
   * CAMBIAR DE PAÍS - ASIGNAR VALOR AL CAMPO NACIONALIDAD
   * +****************************************************************
   */
  onChangeCountry(id: any){
    if(id){
      const country = this.listCountries.find((item) => item.id == id);
      this.nameCountrySelected = country.nombre.toUpperCase();
      // if(!this.personForm.get('nacionalidad').value){
      // }
    }
  }



  /**
  * ************************************************************
  * CAPTURAR DATOS DE LOS FORMULARIOS REFERENCIADOS
  * ************************************************************
  */
  // FORMULARIO DE IDENTIFICACIONES
  onDataIdentification(data: any) {
    if (data.emit) {
      this.listIdentification = data.values;
    } else {
      this.listIdentification = []
    }

    setTimeout(() => {
      this.onSubmit();
    }, 250);
  }

  // FORMULARIO DE IDENTIFICACIONES
  onDataContact(data: any) {
    if (data.emit) {
      this.listContact = data.values;
    } else {
      this.listContact = []
    }
  }


    /**
  * ************************************************************
  * EMITIR EL VALOR DEL FORMULARIO
  * ************************************************************
  */
  onSubmit() {
    this.submitted = true;

    if (this.companyForm.invalid || this.listIdentification.length == 0 || this.listContact.length == 0) {
      this._sweetAlertService.showTopEnd({ title: 'Validación de datos', message: 'Campos obligatorios vacíos', type: 'warning', timer: 1500 });
      this.submit.emit({emit: false});
    } else {
      const values = this.companyForm.value;
      this.submit.emit({ emit: true, company: values, identifications: this.listIdentification, contacts: this.listContact});
    }
  }

  onCancel() {
    this.onReset();
    // this.focusPais.nativeElement.focus();
    this.cancel.emit({ message: 'Cancelado' });
  }

  onReset() {
    this.submitted = false;
    this.isNewData = true;
    this.companyForm.reset(new Company());
  }
}
