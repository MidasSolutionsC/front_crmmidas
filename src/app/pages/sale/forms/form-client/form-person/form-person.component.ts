import { ChangeDetectorRef, Component, ElementRef, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BehaviorSubject, Subscription, debounceTime, distinctUntilChanged, filter, take } from 'rxjs';
import { Contact, CountryList, IdentificationDocument, Person, ResponseApi } from 'src/app/core/models';
import { UbigeoList } from 'src/app/core/models/api/maintenance/ubigeo.model';
import { ApiErrorFormattingService, CountryService, FormService, PersonService, SharedClientService, SweetAlertService, UbigeoService } from 'src/app/core/services';

import { FormIdentificationComponent } from '../form-identification/form-identification.component';
import { FormArrayContactComponent } from '../form-client-contact/form-array-contact/form-array-contact.component';

@Component({
  selector: 'app-form-person',
  templateUrl: './form-person.component.html',
  styleUrls: ['./form-person.component.scss']
})
export class FormPersonComponent implements OnInit, OnDestroy, OnChanges {
  @ViewChild('paises_id') focusPais: ElementRef<HTMLInputElement>;

  @ViewChild('formIdentification') formIdentification!: FormIdentificationComponent;
  @ViewChild('formContact') formContact!: FormArrayContactComponent;

  

  // Datos de entrada
  @Input() hiddenButtons: boolean = false;
  @Input() data: Person = null;
  @Input() submitted: boolean = false;
  @Input() listCountries: CountryList[] = [];
  
  // Datos de salida
  @Output() submit = new EventEmitter<any>();
  @Output() cancel = new EventEmitter<any>();

  
  isNewData: boolean = true;
  // submitted: boolean = false;
  personForm: FormGroup;

  // COMPARTIDO
  shareIdentifications: IdentificationDocument[] = [];
  shareContacts: Contact[] = [];
  
  // IDENTIFICACIONES
  listIdentification: IdentificationDocument[] = [];

  // CONTACTOS
  listContact: Contact[] = [];

  // PAISES
  // listCountries: CountryList[] = [];
  nameCountrySelected: string = null;

  // UBIGEOS
  listUbigeos: UbigeoList[] = [];

  private subscription: Subscription = new Subscription();

  constructor(
    private cdr: ChangeDetectorRef,
    private _sharedClientService: SharedClientService,
    private _personService: PersonService,
    private _countryService: CountryService,
    private _ubigeoService: UbigeoService,
    private _apiErrorFormattingService: ApiErrorFormattingService,
    private _sweetAlertService: SweetAlertService,
    private _formService: FormService,
    private formBuilder: FormBuilder
  ) { }

  ngOnInit(): void {
    this.initForm();
    
    this.searchOptionUbigeo('');
    this.onChangeData();

    // RESETEAR DATOS
    this.subscription.add(
      this._sharedClientService.getClearData()
      .pipe(
        filter(value => value !== null)
      )
      .subscribe((value: boolean) => {
        if(value){
          this.onReset();
        }
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

  // DATOS EMITIDOS - RECIBIDOS
  onChangeData() {
    if (this.personForm) {
      if (this.data) {
        // console.log("DATOS EN PERSONA:", this.data);
        this.shareIdentifications = this.data.identifications;
        this.shareContacts = this.data.contacts;
        this.personForm.setValue(Person.cast(this.data));
        this.isNewData = false;
      } else {
        this.personForm.setValue(new Person());
        this.isNewData = true;
        this.shareIdentifications = [];
        this.shareContacts = [];
      }
    }
  }



    /**
   * ****************************************************************
   * OPERACIONES CON LA API FORÁNEOS
   * ****************************************************************
   */
  // Buscar ubigeos
  public searchOptionUbigeo(search: string) {
    this._ubigeoService.getSearch({search}).subscribe((response: ResponseApi) => {
      if(response.code == 200){
        this.listUbigeos = response.data;
      }

      if(response.code == 500){
        if(response.errors){
          this._sweetAlertService.showTopEnd({type: 'error', title: response.errors?.message, message: response.errors?.error});
        }
      }
    }, (error: any) => {
      console.log(error);
    });
  }


  /**
   * *****************************************************************
   * FORMULARIO  - REGISTRAR PERSONA 
   * *****************************************************************
   */
  get f() {
    return this.personForm.controls;
  }

  /**
   * INICIAR FORMULARTO CON LAS VALIDACIONES
   * @param model 
   */
  private initForm() {
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
      paises_id: [model?.paises_id, [Validators.required, Validators.min(1)]],
      codigo_ubigeo: [model?.codigo_ubigeo, [Validators.nullValidator, Validators.maxLength(50)]],
      nombres: [model?.nombres, [Validators.required, Validators.maxLength(50)]],
      nacionalidad: [model?.nacionalidad, [Validators.required, Validators.maxLength(50)]],
      apellido_paterno: [model?.apellido_paterno, [Validators.required, Validators.maxLength(50)]],
      apellido_materno: [model?.apellido_materno, [Validators.required, Validators.maxLength(50)]],
      fecha_nacimiento: [model?.fecha_nacimiento, [Validators.nullValidator, Validators.maxLength(20)]],
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
      this.personForm.get('nacionalidad').setValue(country.nombre);
      // if(!this.personForm.get('nacionalidad').value){
      // }
    }
  }


  /**
 * ************************************************************
 * CAPTURAR DATOS DE LOS FORMULARIOS REFERENCIADOS
 * ************************************************************
 */    
  // DATOS DEL FORM - IDENTIFICACIONES
  submitIdentification(){
    if(this.formIdentification.formDataIdentification.invalid){
      // this._sweetAlertService.showTopEnd({title: 'Validación de datos', message: 'Campos obligatorios vacíos, para identificaciones', type: 'warning', timer: 1500});
      return false;
    } else {
      return this.formIdentification.formDataIdentification.value;
    }
  }
  
  // DATOS DEL FORM - CONTACTOS
  submitContact(){
    if(this.formContact.formListContact.invalid){
      // this._sweetAlertService.showTopEnd({title: 'Validación de datos', message: 'Campos obligatorios vacíos, para contactos', type: 'warning', timer: 1500});
      return false;
    } else {
      return this.formContact.formListContact.value;
    }
  }


  /**
 * ************************************************************
 * EMITIR EL VALOR DEL FORMULARIO
 * ************************************************************
 */
  onSubmit() {
    this.submitted = true;
    
    if (this.personForm.invalid || this.listIdentification.length == 0 || this.listContact.length == 0) {
      this._sweetAlertService.showTopEnd({ title: 'Validación de datos', message: 'Campos obligatorios vacíos', type: 'warning', timer: 1500 });
      this.submit.emit({emit: false});
    } else {
      this.personForm.get('identifications').setValue(this.listIdentification);
      const values = this.personForm.value;
      this.submit.emit({ emit: true, person: values, identifications: this.listIdentification, contacts: this.listContact});
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
    this.personForm.reset(new Person());
  }
}
