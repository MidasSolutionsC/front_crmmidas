import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription, distinctUntilChanged } from 'rxjs';
import { Address, AddressList, ResponseApi } from 'src/app/core/models';
import { AddressService, SharedClientService, SweetAlertService } from 'src/app/core/services';

@Component({
  selector: 'app-table-client-address',
  templateUrl: './table-client-address.component.html',
  styleUrls: ['./table-client-address.component.scss']
})
export class TableClientAddressComponent implements OnInit, OnDestroy {
  // Collapse
  isCollapseForm: boolean = true;
  isCollapseList: boolean = false;

  // Datos emitidos al formulario
  dataForm: Address;

  // Lista de documentos
  listAddress: AddressList[] = [];
  
  private subscription: Subscription = new Subscription();

  constructor(
    private _sharedClientService: SharedClientService,
    private _addressService: AddressService,
    private _sweetAlertService: SweetAlertService,
  ){}

  ngOnInit(): void {
    
    // ID PERSONA
    this.subscription.add(
      this._sharedClientService.getPersonId().subscribe((value: number) =>  {
        if(value){
          this.apiAddressFilterPerson(value);
        } else {
          this.listAddress = [];
        }
      })
    )

    // ID EMPRESA
    this.subscription.add(
      this._sharedClientService.getCompanyId().subscribe((value: number) => {
        if(value){
          this.apiAddressFilterCompany(value);
        } else {
          this.listAddress = [];
        }
      })
    )

    // Subscriptionciones
    this.subscription.add(
      this._addressService.listObserver$
      .pipe(distinctUntilChanged())
      .subscribe((list: AddressList[]) => {
        this.listAddress = list;
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
  toggleForm(collapse: boolean = null){
    this.isCollapseForm = collapse || !this.isCollapseForm;
    if(!this.isCollapseForm){
      this.isCollapseList = true;
    }
  }


  /**
   * ****************************************************************
   * ABRIR TABLA 
   * ****************************************************************
   */
  toggleList(collapse: boolean = null){
    this.isCollapseList = collapse || !this.isCollapseList;
    if(!this.isCollapseList){
      this.isCollapseForm = true;
    }
  }


  
   /**
   * ****************************************************************
   * OPERACIONES CON LA API
   * ****************************************************************
   */
  public apiAddressFilterCompany(companyId: number){
    this._sweetAlertService.loadingUp('Obteniendo datos')
    this._addressService.getFilterCompanyId(companyId).subscribe((response: ResponseApi) => {
      this._sweetAlertService.stop();
      if(response.code == 200){
        this._addressService.addArrayObserver(response.data);
      }

      if(response.code == 500){
        if(response.errors){
          this._sweetAlertService.showTopEnd({type: 'error', title: response.errors?.message, message: response.errors?.error});
        }
      }
    }, (error: any) => {
      this._sweetAlertService.stop();
      if(error.message){
        this._sweetAlertService.showTopEnd({type: 'error', title: 'Error al cargar las direcciones', message: error.message, timer: 2500});
      }
    });
  }

  public apiAddressFilterPerson(personId: number){
    this._sweetAlertService.loadingUp('Obteniendo datos')
    this._addressService.getFilterPersonId(personId).subscribe((response: ResponseApi) => {
      this._sweetAlertService.stop();
      if(response.code == 200){
        this._addressService.addArrayObserver(response.data);
      }

      if(response.code == 500){
        if(response.errors){
          this._sweetAlertService.showTopEnd({type: 'error', title: response.errors?.message, message: response.errors?.error});
        }
      }
    }, (error: any) => {
      this._sweetAlertService.stop();
      if(error.message){
        this._sweetAlertService.showTopEnd({type: 'error', title: 'Error al cargar las direcciones', message: error.message, timer: 2500});
      }
    });
  }

  public apiAddressDelete(id: number){
    this._sweetAlertService.loadingUp('Obteniendo datos')
    this._addressService.delete(id).subscribe((response: ResponseApi) => {
      this._sweetAlertService.stop();
      if(response.code == 200){
        const data: AddressList = AddressList.cast(response.data[0]);
        this._addressService.removeObjectObserver(data.id);
      }

      if(response.code == 500){
        if(response.errors){
          this._sweetAlertService.showTopEnd({type: 'error', title: response.errors?.message, message: response.errors?.error});
        }
      }
    }, (error: any) => {
      this._sweetAlertService.stop();
      if(error.message){
        this._sweetAlertService.showTopEnd({type: 'error', title: 'Error al eliminar el historial', message: error.message, timer: 2500});
      }
    });
  }



  /**
   * ****************************************************************
   * OPERACIONES DE SALIDA DEL - FORM DOCUMENT
   * ****************************************************************
   */
  onSubmit(event: any){
    if(event?.saved){
      this.toggleList(false);
  
    }
  }

  onCancel(event: any){
    // console.log(data);
  }


  /**
   * ****************************************************************
   * OPERACIONES EN LA TABLA
   * ****************************************************************
   */
  getDataRow(data: any){
    this.dataForm = Address.cast(data);
    this.toggleForm(false);
  }

  deleteRow(id: any){
    this._sweetAlertService.showConfirmationAlert('¿Estas seguro de eliminar la dirección?').then((confirm) => {
      if(confirm.isConfirmed){
        this.apiAddressDelete(id);
      }
    });
  }
}
