import { ChangeDetectorRef, Component, ElementRef, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Contact, ContactList, ResponseApi } from 'src/app/core/models';
import { ApiErrorFormattingService, ContactService, FormService, SharedClientService, SweetAlertService } from 'src/app/core/services';

@Component({
  selector: 'app-form-client-contact',
  templateUrl: './form-client-contact.component.html',
  styleUrls: ['./form-client-contact.component.scss']
})
export class FormClientContactComponent implements OnInit, OnDestroy, OnChanges {
  @ViewChild('focusTipo') focusTipo: ElementRef<HTMLInputElement>;

  // Datos de entrada
  @Input() data: Contact = null;

  // Datos de salida
  @Output() submit = new EventEmitter<any>();
  @Output() cancel = new EventEmitter<any>();

  // isLocalData: boolean = false;

  // FORMULARIO DOCUMENT
  isNewData: boolean = true;
  submitted: boolean = false;
  contactForm: FormGroup;

  clientId: number;
  personId: number;
  companyId: number;
  legalPerson: boolean = false;
    
  private subscription: Subscription = new Subscription();

  constructor(
    private cdr: ChangeDetectorRef,
    private _sharedClientService: SharedClientService,
    private _contactService: ContactService,
    private _formService: FormService,
    private _apiErrorFormattingService: ApiErrorFormattingService,
    private _sweetAlertService: SweetAlertService,
    private formBuilder: FormBuilder
  ){}


  ngOnInit(): void {
    // Instanciar form
    this.initForm();
    this.onChangeData();
    
    // ID PERSONA
    this.subscription.add(
      this._sharedClientService.getPersonId().subscribe((value: number) =>  this.personId = value)
    )

    // ID EMPRESA
    this.subscription.add(
      this._sharedClientService.getCompanyId().subscribe((value: number) => this.companyId = value)
    )

    // ID CLIENTE
    this.subscription.add(
      this._sharedClientService.getClientId().subscribe((value: number) => this.clientId = value)
    )

    // PERSONA LEGAL
    this.subscription.add(
      this._sharedClientService.getLegalPerson().subscribe((value: boolean) =>  this.legalPerson = value)
    )

  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
  
  ngOnChanges(changes: SimpleChanges): void {
    if(changes.data && !changes.data.firstChange){
     this.onChangeData();
    }
  }

  // DATOS EMITIDOS
  onChangeData(){
    if(this.data){
      if(this.contactForm){
        this.contactForm.setValue(Contact.cast(this.data));
      }
      this.isNewData = false;
      // setTimeout(() => {
      //   this.focusTipo.nativeElement.focus();
      // }, 50);
    } else {
      this.isNewData = true;
    }
  }



  /**
   * ****************************************************************
   * OPERACIONES CON LA API - TEMPORAL
   * ****************************************************************
   */
  private apiContactSave(data: Contact | FormData){
    this._sweetAlertService.loadingUp()
    this.subscription.add(
      this._contactService.register(data).subscribe((response: ResponseApi) => {
        this._sweetAlertService.stop();
        if(response.code == 201){
          if(response.data[0]){
            const data: ContactList = ContactList.cast(response.data[0]);
            const tipo_text = `
              ${data.tipo == 'TEL'? 'teléfono': ''} 
              ${data.tipo == 'FIJ'? 'teléfono fijo': ''} 
              ${data.tipo == 'EML'? 'correo electrónico': ''} 
            `;
            data.tipo_text = tipo_text;
            this._contactService.addObjectObserver(data);
            this.submit.emit({saved: true, data});
            this.onReset();
          }
        }

        if(response.code == 422){
          if(response.errors){
            const textErrors = this._apiErrorFormattingService.formatAsHtml(response.errors);
            this._sweetAlertService.showTopEnd({type: 'error', title: response.message, message: textErrors});
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
          this._sweetAlertService.showTopEnd({type: 'error', title: 'Error al registrar el contacto', message: error.message, timer: 2500});
        }
      })
    )
  }

  private apiContactUpdate(data: Contact | FormData, id: number){
    this._sweetAlertService.loadingUp()
    this.subscription.add(
      this._contactService.update(data, id).subscribe((response: ResponseApi) => {
        this._sweetAlertService.stop();
        if(response.code == 200){
          if(response.data[0]){
            const data: ContactList = ContactList.cast(response.data[0]);
            const tipo_text = `
              ${data.tipo == 'TEL'? 'teléfono': ''} 
              ${data.tipo == 'FIJ'? 'teléfono fijo': ''} 
              ${data.tipo == 'EML'? 'correo electrónico': ''} 
            `;
            data.tipo_text = tipo_text;
            this._contactService.updateObjectObserver(data);
            this.onReset();
            this.submit.emit({updated: true, data});
          }
        }

        if(response.code == 422){
          if(response.errors){
            const textErrors = this._apiErrorFormattingService.formatAsHtml(response.errors);
            this._sweetAlertService.showTopEnd({type: 'error', title: response.message, message: textErrors});
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
          this._sweetAlertService.showTopEnd({type: 'error', title: 'Error al actualizar el contacto', message: error.message, timer: 2500});
        }
      })
    )
  }



    
  /**
   * ***********************************************
   * OBTENER EL FORM CONTROL - DOCUMENTO
   * ***********************************************
   */
  get f() {
    return this.contactForm.controls;
  }

  /**
   * INICIAR FORMULARTO CON LAS VALIDACIONES
   * @param model 
   */
  private initForm(model: Contact = new Contact()){
    const formGroupData = this.getFormGroupData(model);
    this.contactForm = this.formBuilder.group(formGroupData);
  }

  /**
   * CREAR VALIDACIONES DEL FORMGROUP
   * @param model 
   * @returns 
   */
  private getFormGroupData(model: Contact): object {
    return {
      ...this._formService.modelToFormGroupData(model),
      tipo: [model.tipo || '', [Validators.required, Validators.maxLength(3)]],
      contacto: [model.contacto || '', [Validators.required, Validators.maxLength(100)]],
      is_primary: [model.is_primary || 0, [Validators.nullValidator]],
      is_active: [1, [Validators.nullValidator]],
    }
  }




  /**
   * ************************************************************
   * EMITIR EL VALOR DEL FORMULARIO
   * ************************************************************
   */
  onSubmit() {
    this.submitted = true;

    if(this.contactForm.invalid){
      this._sweetAlertService.showTopEnd({title: 'Validación de datos', message: 'Campos obligatorios vacíos', type: 'warning', timer: 1500});
    } else {
      const values: Contact = this.contactForm.value;

      // TIPO DE CLIENTE
      if(this.legalPerson){
        if(this.companyId){
          values.empresas_id = this.companyId;
        }
      } else {
        if(this.personId){
          values.personas_id = this.personId;
        }
      }


      if(this.isNewData){
        this._sweetAlertService.showConfirmationAlert('¿Estas seguro de registrar el contacto?').then((confirm) => {
          if(confirm.isConfirmed){
            if(!this.personId && !this.companyId){
              // GUARDAR EN MEMORIA LOCAL
              const data = ContactList.cast(values);
              const tipo_text = `
                ${data.tipo == 'TEL'? 'teléfono': ''} 
                ${data.tipo == 'FIJ'? 'teléfono fijo': ''} 
                ${data.tipo == 'EML'? 'correo electrónico': ''} 
              `;
              data.tipo_text = tipo_text;

              this.submit.emit({savedLocal: true, data});
              this.onReset();
            } else {
              // GUARDAR EN LA BASE DE DATOS
              this.apiContactSave(values);
            }
          }
        });
      } else {
        this._sweetAlertService.showConfirmationAlert('¿Estas seguro de actualizar el contacto?').then((confirm) => {
          if(confirm.isConfirmed){
            if(!this.personId && !this.companyId){
              // GUARDAR EN MEMORIA LOCAL
              const data = ContactList.cast(values);
              const tipo_text = `
                ${data.tipo == 'TEL'? 'teléfono': ''} 
                ${data.tipo == 'FIJ'? 'teléfono fijo': ''} 
                ${data.tipo == 'EML'? 'correo electrónico': ''} 
              `;
              data.tipo_text = tipo_text;

              this.submit.emit({updatedLocal: true, data});
              this.onReset();
            } else {
              // GUARDAR EN LA BASE DE DATOS
              this.apiContactUpdate(values, values.id);
            }
          }
        });
      }     
    }
  }

  onCancel(){
    this.onReset();
    // this.focusTipo.nativeElement.focus();
    this.cancel.emit({message: 'Cancelado'});
  }

  onReset(){
    this.submitted = false;
    this.isNewData = true;
    this.contactForm.reset();
    this.contactForm.controls.is_primary.setValue(0);
    this.contactForm.controls.is_active.setValue(1);
  }
}
