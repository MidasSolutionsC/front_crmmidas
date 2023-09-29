import { Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { Subscription, distinctUntilChanged } from 'rxjs';
import { BankAccount, BankAccountList, ResponseApi, TypeBankAccount, TypeBankAccountList } from 'src/app/core/models';
import { ApiErrorFormattingService, BankAccountService, SharedClientService, SweetAlertService, TypeBankAccountService } from 'src/app/core/services';

@Component({
  selector: 'app-table-client-bank-account',
  templateUrl: './table-client-bank-account.component.html',
  styleUrls: ['./table-client-bank-account.component.scss']
})
export class TableClientBankAccountComponent implements OnInit, OnDestroy, OnChanges {

  @Input() dataSendApi: any = null;

  // SON DATOS LOCAL
  isDataLocal: boolean = false;

  // Collapse
  isCollapseForm: boolean = true;
  isCollapseList: boolean = false;

  // Datos emitidos al formulario
  dataForm: BankAccount;

  // Tipo de cuentas
  listTypeBankAccount: TypeBankAccountList[] = [];
  
  // Lista de documentos
  listBankAccount: BankAccountList[] = [];

  private subscription: Subscription = new Subscription();

  constructor(
    private _typeBankAccountService: TypeBankAccountService,
    private _bankAccountService: BankAccountService,
    private _sharedClientService: SharedClientService,
    private _apiErrorFormattingService: ApiErrorFormattingService,
    private _sweetAlertService: SweetAlertService,
  ) { }

  ngOnInit(): void {

    // ID PERSONA
    this.subscription.add(
      this._sharedClientService.getClientId().subscribe((value: number) =>  {
        if(value){
          this.apiBankAccountFilterClient(value);
        } else {
          this.listBankAccount = [];
        }
      })
    )
    
    // Subscriptionciones - TIPO DE CUENTAS
    this.subscription.add(
      this._typeBankAccountService.listObserver$
      .pipe(distinctUntilChanged())
      .subscribe((list: TypeBankAccountList[]) => {
        this.listTypeBankAccount = list;
      })
    );

    // Subscriptionciones - CUENTAS
    this.subscription.add(
      this._bankAccountService.listObserver$
        .pipe(distinctUntilChanged())
        .subscribe((list: BankAccountList[]) => {
          this.listBankAccount = list;
        })
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if(changes.dataSendApi && !changes.dataSendApi.firstChange){
      this.onChangeData();
    }
  }

  onChangeData(){
    if(this.dataSendApi){
      const data: any = {};

      data.clientes_id = this.dataSendApi.clientes_id;

      if(this.isDataLocal && this.listBankAccount.length > 0){
        data.data_array = BankAccount.casts(this.listBankAccount);
        this.apiBankAccountSaveComplete(data);
      }
      
      // console.log(this.dataSendApi, data);
    } 
  }

  /**
   * ****************************************************************
   * ABRIR FORMULARIO 
   * ****************************************************************
   */
  toggleForm(collapse: boolean = null) {
    this.isCollapseForm = collapse || !this.isCollapseForm;
    if (!this.isCollapseForm) {
      this.isCollapseList = true;
    }
  }


  /**
   * ****************************************************************
   * ABRIR TABLA 
   * ****************************************************************
   */
  toggleList(collapse: boolean = null) {
    this.isCollapseList = collapse || !this.isCollapseList;
    if (!this.isCollapseList) {
      this.isCollapseForm = true;
    }
  }



  /**
  * ****************************************************************
  * OPERACIONES CON LA API
  * ****************************************************************
  */
  public apiBankAccountFilterClient(clientId: number) {
    this._sweetAlertService.loadingUp('Obteniendo datos')
    this._bankAccountService.getFilterClientId(clientId).subscribe((response: ResponseApi) => {
      this._sweetAlertService.stop();
      if (response.code == 200) {
        this._bankAccountService.addArrayObserver(response.data);
      }

      if (response.code == 500) {
        if (response.errors) {
          this._sweetAlertService.showTopEnd({ type: 'error', title: response.errors?.message, message: response.errors?.error });
        }
      }
    }, (error: any) => {
      this._sweetAlertService.stop();
      if (error.message) {
        this._sweetAlertService.showTopEnd({ type: 'error', title: 'Error al cargar las cuentas bancarias', message: error.message, timer: 2500 });
      }
    });
  }

  private apiBankAccountSaveComplete(data: BankAccount | FormData){
    this._sweetAlertService.loadingUp()
    this.subscription.add(
      this._bankAccountService.registerComplete(data).subscribe((response: ResponseApi) => {
        this._sweetAlertService.stop();
        if(response.code == 201){
          this.listBankAccount = [];
          this.isDataLocal = false;

          if(response.data.length > 0){
            const rows = response.data.map((row: any) => {
              const typeBankAccount = this.listTypeBankAccount.find((obj) => obj.id == row.tipo_cuentas_bancarias_id);
              row.tipo_cuentas_bancarias_nombre = typeBankAccount.nombre;
              return row;
            })

            this.listBankAccount = BankAccountList.casts(rows);
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

  public apiBankAccountDelete(id: number) {
    this._sweetAlertService.loadingUp('Obteniendo datos')
    this._bankAccountService.delete(id).subscribe((response: ResponseApi) => {
      this._sweetAlertService.stop();
      if (response.code == 200) {
        const data: BankAccountList = BankAccountList.cast(response.data[0]);
        this._bankAccountService.removeObjectObserver(data.id);
      }

      if (response.code == 500) {
        if (response.errors) {
          this._sweetAlertService.showTopEnd({ type: 'error', title: response.errors?.message, message: response.errors?.error });
        }
      }
    }, (error: any) => {
      this._sweetAlertService.stop();
      if (error.message) {
        this._sweetAlertService.showTopEnd({ type: 'error', title: 'Error al eliminar la cuenta bancaria', message: error.message, timer: 2500 });
      }
    });
  }



  /**
   * ****************************************************************
   * OPERACIONES DE SALIDA DEL - FORM DOCUMENT
   * ****************************************************************
   */
  onSubmit(event: any) {
    if (event?.saved) {
      this.toggleList(false);
    }

    // GUARDAR EN LOCAL
    if(event?.savedLocal){
      this.toggleList(false);
      this.isDataLocal = true;

      const index = this.listBankAccount.length;
      const data = BankAccountList.cast(event.data);
      data.id = index + 1;
      this.listBankAccount.push(data);
    }

    // ACTUALIZAR EN LOCAL
    if(event?.updatedLocal){
      this.toggleList(false);
      const data = BankAccountList.cast(event.data);
      this.listBankAccount = this.listBankAccount.map((row) => {
        if(row.id == data.id){
          return data;
        }
        return row;
      });
    }
  }

  onCancel(event: any) {
    // console.log(data);
  }


  /**
   * ****************************************************************
   * OPERACIONES EN LA TABLA
   * ****************************************************************
   */
  getDataRow(data: any) {
    this.dataForm = BankAccount.cast(data);
    this.toggleForm(false);
  }

  deleteRow(id: any) {
    this._sweetAlertService.showConfirmationAlert('¿Estas seguro de eliminar la cuenta bancaria?').then((confirm) => {
      if (confirm.isConfirmed) {
        if(this.isDataLocal){
          this.listBankAccount = this.listBankAccount.filter((row) => row.id !== id);
        } else {
          this.apiBankAccountDelete(id);
        }
      }
    });
  }
}
