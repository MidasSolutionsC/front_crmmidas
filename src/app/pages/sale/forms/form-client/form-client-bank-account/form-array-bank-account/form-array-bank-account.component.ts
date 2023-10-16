import { ChangeDetectorRef, Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription, distinctUntilChanged } from 'rxjs';
import { BankAccount, ResponseApi, TypeBankAccount, TypeBankAccountList } from 'src/app/core/models';
import { ApiErrorFormattingService, FormService, SharedClientService, SweetAlertService, TypeBankAccountService } from 'src/app/core/services';

@Component({
  selector: 'app-form-array-bank-account',
  templateUrl: './form-array-bank-account.component.html',
  styleUrls: ['./form-array-bank-account.component.scss']
})
export class FormArrayBankAccountComponent implements OnInit, OnDestroy, OnChanges {
  @Input() data: BankAccount[] = [];

  // Datos de salida
  @Output() submit = new EventEmitter<any>();
  @Output() cancel = new EventEmitter<any>();

  // MOSTRAR LISTA
  showList: boolean = true;

  isNewData: boolean = true;
  submitted: boolean = false;
  bankAccountForm: FormGroup;

  // Tipo de cuentas
  listTypeBankAccount: TypeBankAccount[] = [];
  
  legalPerson: boolean = false;
  typeClientText: string = '';

  private subscription: Subscription = new Subscription();

  constructor(
    private cdr: ChangeDetectorRef,
    private _sharedClientService: SharedClientService,
    private _typeBankAccountService: TypeBankAccountService,
    private _formService: FormService,
    private _apiErrorFormattingService: ApiErrorFormattingService,
    private _sweetAlertService: SweetAlertService,
    private formBuilder: FormBuilder
  ) { }

  ngOnInit(): void {
    this.bankAccountForm = this.formBuilder.group({
      formList: this.formBuilder.array([]),
    }),

    this.formListBankAccount.push(this.fieldBankAccount({ is_primary: 1 }));

    this.apiATypeBankAccountList();

    // Subscriptionciones
    this.subscription.add(
      this._typeBankAccountService.listObserver$
      .pipe(distinctUntilChanged())
      .subscribe((list: TypeBankAccountList[]) => {
        this.listTypeBankAccount = list;
      })
    );

    // SUMMIT - EMITIR DATOS HACIA AFUERA
    this.subscription.add(
      this._sharedClientService.getSubmitData()
        .subscribe((value: boolean) => {
          if (value) {
            this.onSubmit();
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
    if (this.bankAccountForm) {
      this.bankAccountForm = this.formBuilder.group({
        formList: this.formBuilder.array([]),
      })

      if (this?.data) {
        this?.data.forEach((item) => {
          this.formListBankAccount.push(this.fieldBankAccount(BankAccount.cast(item)));
        })
        this.isNewData = false;
      } else {
        this.isNewData = true;
      }
    }
  }


    /**
   * ****************************************************************
   * OPERACIONES CON LA API - FORÁNEOS
   * ****************************************************************
   */
  public apiATypeBankAccountList(force: boolean = false){
    this._sweetAlertService.loadingUp('Obteniendo datos')
    this._typeBankAccountService.getAll(force).subscribe((response: ResponseApi) => {
      this._sweetAlertService.stop();
      if(response.code == 200){
  
      }

      if(response.code == 500){
        if(response.errors){
          this._sweetAlertService.showTopEnd({type: 'error', title: response.errors?.message, message: response.errors?.error});
        }
      }
    }, (error: any) => {
      this._sweetAlertService.stop();
      if(error.message){
        this._sweetAlertService.showTopEnd({type: 'error', title: 'Error al cargar los tipo de cuentas bancarias', message: error.message, timer: 2500});
      }
    });
  }



  /**
 * *******************************************************
 * AGREGAR MÁS CAMPOS DE TIPO Y DOCUMENTO
 * *******************************************************
 */

  fieldBankAccount(model: BankAccount = new BankAccount()): FormGroup {
    const formGroup = this.formBuilder.group({
      ...this._formService.modelToFormGroupData(model),
      tipo_cuentas_bancarias_id: [model?.tipo_cuentas_bancarias_id || '', [Validators.required, Validators.min(1)]],
      cuenta: [model.cuenta || '', [Validators.required, Validators.maxLength(50)]],
      is_primary: [model?.is_primary || 0, [Validators.nullValidator]],
      is_active: [1, [Validators.nullValidator]],
    });


    return formGroup;
  }


  get formListBankAccount(): FormArray {
    return this.bankAccountForm.get('formList') as FormArray;
  }

  // OCULTAR BOTON DE CIERRE
  get visibleCloseBtn(){
    let minItems = 1;
    return this.formListBankAccount.length > 1;
  }

  // OCULTAR BOTON DE ADD
  get visibleAddBtn(){
    let minItems = 1;
    return this.formListBankAccount.length < 1;
  }

  // ELIMINAR UN OBJETO DE IDENTIFICACIÓN
  removeFieldBankAccount(i: number) {
    this.formListBankAccount.removeAt(i);
  }

  // AÑADIR NUEVO OBJETO DE IDENTIFICACIÓN
  addFieldBankAccount() {
    this.showList = true;
    this.formListBankAccount.push(this.fieldBankAccount());
  }



  /**
 * ************************************************************
 * EMITIR EL VALOR DEL FORMULARIO
 * ************************************************************
 */
  onSubmit() {
    this.submitted = true;
    if (this.formListBankAccount.invalid) {
      this._sweetAlertService.showTopEnd({ title: 'Validación de datos', message: 'Campos obligatorios vacíos', type: 'warning', timer: 1500 });
      this.submit.emit({ emit: false, values: []});
    } else {
      const values = this.formListBankAccount.value;
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
    this.formListBankAccount.reset();
    this.formListBankAccount.clear();
    this.formListBankAccount.push(this.fieldBankAccount({ is_primary: 1 }));
  }
}
