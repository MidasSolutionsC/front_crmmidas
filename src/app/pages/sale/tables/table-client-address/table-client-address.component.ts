import { Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { Subscription, distinctUntilChanged } from 'rxjs';
import { Address, AddressList, ResponseApi } from 'src/app/core/models';
import { AddressService, ApiErrorFormattingService, SharedClientService, SweetAlertService } from 'src/app/core/services';

@Component({
  selector: 'app-table-client-address',
  templateUrl: './table-client-address.component.html',
  styleUrls: ['./table-client-address.component.scss']
})
export class TableClientAddressComponent implements OnInit, OnDestroy, OnChanges{

  @Input() dataSendApi: any = null;

  // SON DATOS LOCAL
  isDataLocal: boolean = false;
  
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
    private _apiErrorFormattingService: ApiErrorFormattingService,
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

  ngOnChanges(changes: SimpleChanges): void {
    if(changes.dataSendApi && !changes.dataSendApi.firstChange){
      this.onChangeData();
    }
  }

  onChangeData(){
    if(this.dataSendApi){
      const data: any = {};
      if(this.dataSendApi.persona_juridica){
        data.empresas_id = this.dataSendApi.empresas_id;
      } else {
        data.personas_id = this.dataSendApi.personas_id;
      }

      if(this.isDataLocal && this.listAddress.length > 0){
        data.data_array = Address.casts(this.listAddress);
        this.apiAddressSaveComplete(data);
      }
      
      // console.log(this.dataSendApi, data);
    } 
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

  private apiAddressSaveComplete(data: Address){
    this._sweetAlertService.loadingUp()
    this.subscription.add(
      this._addressService.registerComplete(data).subscribe((response: ResponseApi) => {
        this._sweetAlertService.stop();
        if(response.code == 201){
          this.listAddress = [];
          this.isDataLocal = false;

          if(response.data.length > 0){
            const arrayData = response.data.map((row: any) => {
              const direccion_completo = `
                ${row.tipo} 
                ${row.direccion} 
                ${row.numero != ''? ', '+ row.numero: ''} 
                ${row.escalera != ''? ', '+ row.escalera: ''} 
                ${row.portal != ''? ', '+ row.portal: ''} 
                ${row.planta != ''? ', '+ row.planta: ''} 
                ${row.puerta != ''? ', '+ row.puerta: ''}
              `;
              row.direccion_completo = direccion_completo;  
              return row;
            });

            this.listAddress = AddressList.casts(arrayData);
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
          this._sweetAlertService.showTopEnd({type: 'error', title: 'Error al registrar la dirección', message: error.message, timer: 2500});
        }
      })
    )
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
  
    // GUARDAR EN LOCAL
    if(event?.savedLocal){
      this.toggleList(false);
      this.isDataLocal = true;

      const index = this.listAddress.length;
      const data = AddressList.cast(event.data);
      data.id = index + 1;
      this.listAddress.push(data);
    }

    // ACTUALIZAR EN LOCAL
    if(event?.updatedLocal){
      this.toggleList(false);
      const data = AddressList.cast(event.data);
      this.listAddress = this.listAddress.map((address) => {
        if(address.id == data.id){
          return data;
        }
        return address;
      });
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
        if(this.isDataLocal){
          this.listAddress = this.listAddress.filter((address) => address.id !== id);
        } else {
          this.apiAddressDelete(id);
        }
      }
    });
  }
}
