import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription, distinctUntilChanged } from 'rxjs';
import { BankAccount, BankAccountList, ResponseApi } from 'src/app/core/models';
import { BankAccountService, SharedClientService, SweetAlertService } from 'src/app/core/services';

@Component({
  selector: 'app-table-client-bank-account',
  templateUrl: './table-client-bank-account.component.html',
  styleUrls: ['./table-client-bank-account.component.scss']
})
export class TableClientBankAccountComponent implements OnInit, OnDestroy {
  // Collapse
  isCollapseForm: boolean = true;
  isCollapseList: boolean = false;

  // Datos emitidos al formulario
  dataForm: BankAccount;

  // Lista de documentos
  listBankAccount: BankAccountList[] = [];

  private subscription: Subscription = new Subscription();

  constructor(
    private _sharedClientService: SharedClientService,
    private _bankAccountService: BankAccountService,
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
    


    // Subscriptionciones
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
        // 
      }
    });
  }
}
