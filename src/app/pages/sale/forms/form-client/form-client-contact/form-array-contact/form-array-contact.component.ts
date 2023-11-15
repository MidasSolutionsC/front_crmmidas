import { ChangeDetectorRef, Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription, filter } from 'rxjs';
import { Contact } from 'src/app/core/models';
import { ApiErrorFormattingService, FormService, SharedClientService, SweetAlertService } from 'src/app/core/services';

@Component({
  selector: 'app-form-array-contact',
  templateUrl: './form-array-contact.component.html',
  styleUrls: ['./form-array-contact.component.scss']
})
export class FormArrayContactComponent implements OnInit, OnDestroy, OnChanges {

  @Input() data: Contact[] = [];
  @Input() submitted: boolean = false;

  // Datos de salida
  @Output() submit = new EventEmitter<any>();
  @Output() cancel = new EventEmitter<any>();

  // MOSTRAR LISTA
  showList: boolean = true;

  isNewData: boolean = true;
  // submitted: boolean = false;
  contactForm: FormGroup;

  // Tipo documentos
  listTypeContact: any[] = [
    { id: 'EML', name: 'Correo electrónico' },
    { id: 'CEL', name: 'Celular' },
    { id: 'TEL', name: 'Teléfono' },
    { id: 'TEF', name: 'Teléfono fijo' },
  ];

  legalPerson: boolean = false;
  typeClientText: string = '';

  private subscription: Subscription = new Subscription();

  constructor(
    private cdr: ChangeDetectorRef,
    private _sharedClientService: SharedClientService,
    private _formService: FormService,
    private _apiErrorFormattingService: ApiErrorFormattingService,
    private _sweetAlertService: SweetAlertService,
    private formBuilder: FormBuilder
  ) { }

  ngOnInit(): void {
    this.contactForm = this.formBuilder.group({
      formList: this.formBuilder.array([]),
    }),

    this.formListContact.push(this.fieldContact({tipo: 'EML', is_primary: 1 }));
    this.formListContact.push(this.fieldContact({tipo: 'CEL', is_primary: 1 }));

    this.onChangeData(); // CAMBIOS INICIALES

    // SUMMIT - EMITIR DATOS HACIA AFUERA
    // this.subscription.add(
    //   this._sharedClientService.getSubmitData()
    //     .pipe(filter(value => value !== null))
    //     .subscribe((value: boolean) => {
    //       if (value) {
    //         this.onSubmit();
    //       }
    //     })
    // )

    // RESETEAR DATOS
    this.subscription.add(
      this._sharedClientService.getClearData()
        .pipe(filter(value => value !== null))
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

  // DATOS EMITIDOS
  onChangeData() {
    if (this.contactForm) {
      this.contactForm = this.formBuilder.group({
        formList: this.formBuilder.array([]),
      })

      if (this.data.length > 0) {
        this.data.forEach((item) => {
          this.formListContact.push(this.fieldContact(Contact.cast(item)));
          
        })
        this.isNewData = false;
      } else {
        this.formListContact.push(this.fieldContact({tipo: 'EML', is_primary: 1 }));
        this.formListContact.push(this.fieldContact({tipo: 'CEL', is_primary: 1 }));
        this.isNewData = true;
      }
    }
  }



  /**
 * *******************************************************
 * AGREGAR MÁS CAMPOS DE TIPO Y DOCUMENTO
 * *******************************************************
 */

  fieldContact(model: Contact = new Contact()): FormGroup {
    const formGroup = this.formBuilder.group({
      ...this._formService.modelToFormGroupData(model),
      tipo: [model.tipo || '', [Validators.required, Validators.maxLength(3)]],
      contacto: [model.contacto || '', [Validators.required, Validators.maxLength(100)]],
      is_primary: [model.is_primary || 0, [Validators.nullValidator]],
      is_active: [1, [Validators.nullValidator]],
    });


    return formGroup;
  }



  get formListContact(): FormArray {
    return this.contactForm.get('formList') as FormArray;
  }

  // OCULTAR BOTON DE CERRAR
  get visibleCloseBtn(){
    let minItems = 1;
    return this.formListContact.length > 1;
  }

  // ELIMINAR UN OBJETO DE IDENTIFICACIÓN
  removeFieldContact(i: number) {
    this.formListContact.removeAt(i);
  }

  // AÑADIR NUEVO OBJETO DE IDENTIFICACIÓN
  addFieldContact() {
    this.showList = true;
    this.formListContact.push(this.fieldContact());
  }



  /**
 * ************************************************************
 * EMITIR EL VALOR DEL FORMULARIO
 * ************************************************************
 */
  onSubmit() {
    this.submitted = true;
    if (this.formListContact.invalid) {
      this._sweetAlertService.showTopEnd({ title: 'Validación de datos', message: 'Campos obligatorios vacíos', type: 'warning', timer: 1500 });
      this.submit.emit({ emit: false, values: [] });
    } else {
      const values = this.formListContact.value;
      this.submit.emit({ emit: true, values });
    }
  }

  onCancel() {
    this.onReset();
    this.cancel.emit({ message: 'Cancelado' });
  }

  onReset() {
    this.submitted = false;
    this.isNewData = true;
    this.formListContact.reset();
    this.formListContact.clear();
    this.formListContact.push(this.fieldContact({tipo: 'EML', is_primary: 1 }));
    this.formListContact.push(this.fieldContact({tipo: 'CEL', is_primary: 1 }));
  }
}

