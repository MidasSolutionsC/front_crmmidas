import { ChangeDetectorRef, Component, ElementRef, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription, distinctUntilChanged } from 'rxjs';
import { BankAccount, BankAccountList, ResponseApi, TypeBankAccount, TypeBankAccountList } from 'src/app/core/models';
import { ApiErrorFormattingService, BankAccountService, FormService, SharedClientService, SweetAlertService, TypeBankAccountService } from 'src/app/core/services';

@Component({
  selector: 'app-form-client-bank-account',
  templateUrl: './form-client-bank-account.component.html',
  styleUrls: ['./form-client-bank-account.component.scss']
})
export class FormClientBankAccountComponent implements OnInit, OnDestroy, OnChanges {
  @ViewChild('focusTipoCuenta') focusTipoCuenta: ElementRef<HTMLInputElement>;

  // Datos de entrada
  @Input() data: BankAccount = null;

  // Datos de salida
  @Output() submit = new EventEmitter<any>();
  @Output() cancel = new EventEmitter<any>();

  // FORMULARIO DOCUMENT
  isNewData: boolean = true;
  submitted: boolean = false;
  bankAccountForm: FormGroup;

  
  clientId: number;

  // Tipo de cuentas
  listTypeBankAccount: TypeBankAccount[] = [];

    
  private subscription: Subscription = new Subscription();

  constructor(
    private cdr: ChangeDetectorRef,
    private _sharedClientService: SharedClientService,
    private _typeBankAccountService: TypeBankAccountService,
    private _bankAccountService: BankAccountService,
    private _formService: FormService,
    private _apiErrorFormattingService: ApiErrorFormattingService,
    private _sweetAlertService: SweetAlertService,
    private formBuilder: FormBuilder
  ){}


  ngOnInit(): void {
    // Instanciar form
    this.initForm();
    this.onChangeData();

    // ID CLIENTE
    this.subscription.add(
      this._sharedClientService.getClientId().subscribe((value: number) => this.clientId = value)
    )


    this.apiATypeBankAccountList();

    // Subscriptionciones
    this.subscription.add(
      this._typeBankAccountService.listObserver$
      .pipe(distinctUntilChanged())
      .subscribe((list: TypeBankAccountList[]) => {
        this.listTypeBankAccount = list;
      })
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
  
  ngOnChanges(changes: SimpleChanges): void {
    if(changes.data && !changes.data.firstChange){
     this.onChangeData();
    }
  }

  
  onChangeData(){
    if(this.data){
      if(this.bankAccountForm){
        this.bankAccountForm.setValue(BankAccount.cast(this.data));
      }

      this.isNewData = false;
      // setTimeout(() => {
      //   this.focusTipoCuenta.nativeElement.focus();
      // }, 50);
    } else {
      this.isNewData = true;
    }
  }



  /**
   * ****************************************************************
   * OPERACIONES CON LA API
   * ****************************************************************
   */
  private apiBankAccountSave(data: BankAccount | FormData){
    this._sweetAlertService.loadingUp()
    this.subscription.add(
      this._bankAccountService.register(data).subscribe((response: ResponseApi) => {
        this._sweetAlertService.stop();
        if(response.code == 201){
          if(response.data[0]){
            const data: BankAccountList = BankAccountList.cast(response.data[0]);
            const typeBankAccount = this.listTypeBankAccount.find((obj) => obj.id == data.tipo_cuentas_bancarias_id);
            data.tipo_cuentas_bancarias_nombre = typeBankAccount.nombre;
            this._bankAccountService.addObjectObserver(data);
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
          this._sweetAlertService.showTopEnd({type: 'error', title: 'Error al registrar la cuenta bancaria', message: error.message, timer: 2500});
        }
      })
    )
  }

  private apiBankAccountUpdate(data: BankAccount | FormData, id: number){
    this._sweetAlertService.loadingUp()
    this.subscription.add(
      this._bankAccountService.update(data, id).subscribe((response: ResponseApi) => {
        this._sweetAlertService.stop();
        if(response.code == 200){
          if(response.data[0]){
            const data: BankAccountList = BankAccountList.cast(response.data[0]);
            const typeBankAccount = this.listTypeBankAccount.find((obj) => obj.id == data.tipo_cuentas_bancarias_id);
            data.tipo_cuentas_bancarias_nombre = typeBankAccount.nombre;
            this._bankAccountService.updateObjectObserver(data);
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
          this._sweetAlertService.showTopEnd({type: 'error', title: 'Error al actualizar la cuenta bancaria', message: error.message, timer: 2500});
        }
      })
    )
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
        // this._typeBankAccountService.addArrayObserver(response.data);
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
   * ***********************************************
   * OBTENER EL FORM CONTROL - DOCUMENTO
   * ***********************************************
   */
  get f() {
    return this.bankAccountForm.controls;
  }

  /**
   * INICIAR FORMULARTO CON LAS VALIDACIONES
   * @param model 
   */
  private initForm(model: BankAccount = new BankAccount()){
    const formGroupData = this.getFormGroupData(model);
    this.bankAccountForm = this.formBuilder.group(formGroupData);
  }

  /**
   * CREAR VALIDACIONES DEL FORMGROUP
   * @param model 
   * @returns 
   */
  private getFormGroupData(model: BankAccount): object {
    return {
      ...this._formService.modelToFormGroupData(model),
      tipo_cuentas_bancarias_id: [model.tipo_cuentas_bancarias_id || '', [Validators.required, Validators.min(1)]],
      cuenta: [model.cuenta || '', [Validators.required, Validators.maxLength(50)]],
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

    if(this.bankAccountForm.invalid){
      this._sweetAlertService.showTopEnd({title: 'Validación de datos', message: 'Campos obligatorios vacíos', type: 'warning', timer: 1500});
    } else {
      const values: BankAccount = this.bankAccountForm.value;
      if(this.clientId){
        values.clientes_id = this.clientId;
      }


      if(this.isNewData){
        this._sweetAlertService.showConfirmationAlert('¿Estas seguro de registrar la cuenta bancaria?').then((confirm) => {
          if(confirm.isConfirmed){
            if(!this.clientId){
              // GUARDAR EN MEMORIA LOCAL
              const data = BankAccountList.cast(values);
              const TypeBankAccount = this.listTypeBankAccount.find((obj) => obj.id == data.tipo_cuentas_bancarias_id);
              data.tipo_cuentas_bancarias_nombre = TypeBankAccount.nombre; 
              this.submit.emit({savedLocal: true, data});
              this.onReset();
            } else {
              // GUARDAR EN LA BASE DE DATOS
              this.apiBankAccountSave(values);
            }
          }
        });
      } else {
        this._sweetAlertService.showConfirmationAlert('¿Estas seguro de actualizar la cuenta bancaria?').then((confirm) => {
          if(confirm.isConfirmed){
            if(!this.clientId){
              // ACTUALIZAR EN MEMORIA LOCAL
              const data = BankAccountList.cast(values);
              const TypeBankAccount = this.listTypeBankAccount.find((obj) => obj.id == data.tipo_cuentas_bancarias_id);
              data.tipo_cuentas_bancarias_nombre = TypeBankAccount.nombre; 
              this.submit.emit({updatedLocal: true, data});
              this.onReset();
            } else {
              // ACTUALIZAR EN LA BASE DE DATOS
              this.apiBankAccountUpdate(values, values.id);
            }
          }
        });
      }     
    }
  }

  onCancel(){
    this.onReset();
    // this.focusTipoCuenta.nativeElement.focus();
    this.cancel.emit({message: 'Cancelado'});
  }

  onReset(){
    this.submitted = false;
    this.isNewData = true;
    this.bankAccountForm.reset(new BankAccount());
    this.bankAccountForm.controls.is_primary.setValue(0);
    this.bankAccountForm.controls.is_active.setValue(1);
  }
}
