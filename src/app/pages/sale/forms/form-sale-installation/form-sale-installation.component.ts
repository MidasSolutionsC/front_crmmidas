import { ChangeDetectorRef, Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription, filter } from 'rxjs';
import { Address, AddressList, Installation, InstallationList, ResponseApi } from 'src/app/core/models';
import { AddressService, ApiErrorFormattingService, FormService, InstallationService, SharedClientService, SharedSaleService, SweetAlertService, TempInstallationService } from 'src/app/core/services';

@Component({
  selector: 'app-form-sale-installation',
  templateUrl: './form-sale-installation.component.html',
  styleUrls: ['./form-sale-installation.component.scss']
})
export class FormSaleInstallationComponent implements OnInit, OnDestroy, OnChanges{

  @Input() data: Installation = null;
  
  // Datos de salida
  @Output() submit = new EventEmitter<any>();
  @Output() cancel = new EventEmitter<any>();

  isNewData: boolean = true;
  submitted: boolean = false;
  installationForm: FormGroup;

  // INSTALACIONES OBTENIDAS DEL CLIENTE
  listInstallation: Installation[] = [];
  listAddress: Address[] = [];

  isOtherDirection: boolean = false;
  
  saleId: number;
  clientId: number;
  personId: number;
  companyId: number;
  legalPerson: boolean = false;

  private subscription: Subscription = new Subscription();
  
  constructor(
    private cdr: ChangeDetectorRef,
    private _installationService: InstallationService,
    private _tempInstallationService: TempInstallationService,
    private _addressService: AddressService,
    private _sharedClientService: SharedClientService,
    private _shareSaleService: SharedSaleService,
    private _formService: FormService,
    private _apiErrorFormattingService: ApiErrorFormattingService,
    private _sweetAlertService: SweetAlertService,
    private formBuilder: FormBuilder
  ){}

  ngOnInit(): void {
    this.initForm();
    // this.onChangeData();

    // ID PERSONA
    this.subscription.add(
      this._sharedClientService.getPersonId().pipe(filter(value => value !== null)).subscribe((value: number) =>  this.personId = value)
    )

    // ID VENTA
    this.subscription.add(
      this._shareSaleService.getSaleId().pipe(filter(value => value !== null)).subscribe((value: number) =>  this.saleId = value)
    )

    // ID EMPRESA
    this.subscription.add(
      this._sharedClientService.getCompanyId().pipe(filter(value => value !== null)).subscribe((value: number) => this.companyId = value)
    )

    // PERSONA LEGAL
    this.subscription.add(
      this._sharedClientService.getLegalPerson().pipe(filter(value => value !== null)).subscribe((value: boolean) => this.legalPerson = value)
    )

    // ID   cliente
    this.subscription.add(
      this._sharedClientService.getClientId().pipe(filter(value => value !== null)).subscribe((value: number) => this.clientId = value)
    )

    // DIRECCIÓN DEL CLIENTE - RELLENAR FORMULARIO
    this.subscription.add(
      this._sharedClientService.getAddress().pipe(filter((data) => data !== null)).subscribe(async(data: Address[]) => {
        if(data){
          this.listAddress = data;
          const lastAddress = data[data.length - 1];

          if(lastAddress){            
            const installation = await this.apInstallationGetByAddress(lastAddress?.id);
            if(installation){
              delete installation.id;
              delete installation.ventas_id;
              this._shareSaleService.setDataInstallation(installation);
            } else {
              const reqInstallation = InstallationList.cast(lastAddress);
              delete reqInstallation.id;
              reqInstallation.direcciones_id = lastAddress.id;
              this._shareSaleService.setDataInstallation(reqInstallation);
              this.installationForm.setValue(Installation.cast(lastAddress));
            }
          }
        }
      })
    )

    // DIRECCIÓN DEL CLIENTE - INSTALACIÓN
    this.subscription.add(
      this._shareSaleService.getDataInstallation().pipe(filter((data) => data !== null)).subscribe((data: InstallationList) => {
        if(data){
          const requestInstallation = Installation.cast(data);
          this.listInstallation = [requestInstallation];
          if(data.id){
            this.isNewData = false;
            this.installationForm.setValue(requestInstallation);
          } else {
            this.installationForm.setValue(requestInstallation);
          }
        }
      })
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

  // DETECCIÓN DE CAMBIOS PARA CLIENTE
  onChangeData(){
    if(this.installationForm){
      if(this.data){
        this.installationForm.setValue(Installation.cast(this.data));
        this.isNewData = false;
      } else {
        this.installationForm.setValue(new Installation());
        this.isNewData = true;
      }
    }
  }
  

  
  /**
   * ***************************************************************
   * FORM CONTROLS - INSTALACIONES
   * ***************************************************************
   */
  get f() {
    return this.installationForm.controls;
  }

  /**
   * INICIAR FORMULARTO CON LAS VALIDACIONES
   * @param model 
   */
  private initForm(){
    const installation = new Installation();
    const formGroupData = this.getFormGroupInstallation(installation);
    this.installationForm = this.formBuilder.group(formGroupData);
  }

  /**
   * CREAR VALIDACIONES DEL FORMGROUP
   * @param model 
   * @returns 
   */
  private getFormGroupInstallation(model: Installation): object {
    return {
      ...this._formService.modelToFormGroupData(model),
      tipo: ['', [Validators.required, Validators.maxLength(50)]],
      ventas_id: ['', [Validators.nullValidator, Validators.min(1)]],
      direccion: ['', [Validators.required, Validators.maxLength(150)]],
      localidad: ['', [Validators.required, Validators.maxLength(70)]],
      provincia: ['', [Validators.required, Validators.maxLength(70)]],
      codigo_postal: ['', [Validators.required, Validators.maxLength(5)]],
      is_active: [true, [Validators.nullValidator]],
    }
  }

  // ES OTRA DIRECCIÓN
  onChangeOtherDirection(event: any){
    if(event){
      this.installationForm.reset(new Installation());
      this.isNewData = true;
    } else {
      if(this.listInstallation.length > 0){
        const installation = this.listInstallation[this.listInstallation.length - 1];
        this.installationForm.setValue(installation);

        if(installation.id){
          this.isNewData = false;
        }
      }
    }
  }


    /**
   * ****************************************************************
   * OPERACIONES CON LA API - DIRECCIONES  
   * ****************************************************************
   */
  private apiAddressRegister(data: Address){
    this._sweetAlertService.loadingUp()
    this.subscription.add(
      this._addressService.register(data).subscribe((response: ResponseApi) => {
        this._sweetAlertService.stop();
        if(response.code == 201){
          if(response.data[0]){
            const data: AddressList = AddressList.cast(response.data[0]);
            const direccion_completo = `
              ${data.tipo} 
              ${data.direccion} 
              ${data.numero != ''? ', '+ data.numero: ''} 
              ${data.escalera != ''? ', '+ data.escalera: ''} 
              ${data.portal != ''? ', '+ data.portal: ''} 
              ${data.planta != ''? ', '+ data.planta: ''} 
              ${data.puerta != ''? ', '+ data.puerta: ''}
            `;
            data.direccion_completo = direccion_completo;
            this._addressService.addObjectObserver(data);

            // --- REGISTRAR INSTALACIÓN
            const installation = Installation.cast(data);
            if(this.saleId){
              installation.ventas_id = this.saleId;
            }
      
            this.apiInstallationRegister({...installation, direcciones_id: data.id, id: null});
          
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
  

  private apiAddressUpdate(data: Address, id: number){
    this._sweetAlertService.loadingUp()
    this.subscription.add(
      this._addressService.update(data, id).subscribe((response: ResponseApi) => {
        this._sweetAlertService.stop();
        if(response.code == 200){
          if(response.data[0]){
            const data: AddressList = AddressList.cast(response.data[0]);
            const direccion_completo = `
              ${data.tipo} 
              ${data.direccion} 
              ${data.numero != ''? ', '+ data.numero: ''} 
              ${data.escalera != ''? ', '+ data.escalera: ''} 
              ${data.portal != ''? ', '+ data.portal: ''} 
              ${data.planta != ''? ', '+ data.planta: ''} 
              ${data.puerta != ''? ', '+ data.puerta: ''}
            `;
            data.direccion_completo = direccion_completo;
            this._addressService.updateObjectObserver(data);
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
          this._sweetAlertService.showTopEnd({type: 'error', title: 'Error al actualizar la dirección', message: error.message, timer: 2500});
        }
      })
    )
  }


  /**
   * ****************************************************************
   * OPERACIONES CON LA API - INSTALACIONES  
   * ****************************************************************
   */
  // REGISTRAR
  private apiInstallationRegister(data: Installation){
    this._sweetAlertService.loadingUp()
    this.subscription.add(
      this._installationService.register(data).subscribe((response: ResponseApi) => {
        this._sweetAlertService.stop();
        if(response.code == 201){
          if(response.data[0]){
            const data: InstallationList = InstallationList.cast(response.data[0]);
            const direccion_completo = `
              ${data.tipo} 
              ${data.direccion} 
              ${data.numero != ''? ', '+ data.numero: ''} 
              ${data.escalera != ''? ', '+ data.escalera: ''} 
              ${data.portal != ''? ', '+ data.portal: ''} 
              ${data.planta != ''? ', '+ data.planta: ''} 
              ${data.puerta != ''? ', '+ data.puerta: ''}
            `;
            data.direccion_completo = direccion_completo;
            this._installationService.addObjectObserver(data);
            
            // GUARDAR EN EL LOCAL STORAGE SOLO SI NO SE ENCUENTRA 
            this._shareSaleService.setSaleId(data.ventas_id);
            this._shareSaleService.setInstallationId(data.id);
            this._shareSaleService.setDataInstallation(data);
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
          this._sweetAlertService.showTopEnd({type: 'error', title: 'Error al registrar la instalación', message: error.message, timer: 2500});
        }
      })
    )
  }

  // ACTUALIZAR
  private apiInstallationUpdate(data: Installation, id: number){
    this._sweetAlertService.loadingUp()
    this.subscription.add(
      this._installationService.update(data, id).subscribe((response: ResponseApi) => {
        this._sweetAlertService.stop();
        if(response.code == 200){
          if(response.data[0]){
            const data: InstallationList = InstallationList.cast(response.data[0]);
            const direccion_completo = `
              ${data.tipo} 
              ${data.direccion} 
              ${data.numero != ''? ', '+ data.numero: ''} 
              ${data.escalera != ''? ', '+ data.escalera: ''} 
              ${data.portal != ''? ', '+ data.portal: ''} 
              ${data.planta != ''? ', '+ data.planta: ''} 
              ${data.puerta != ''? ', '+ data.puerta: ''}
            `;
            data.direccion_completo = direccion_completo;
            this._installationService.updateObjectObserver(data);
            this._sharedClientService.setSaleId(data.ventas_id);
            this._shareSaleService.setInstallationId(data.id);
            this._shareSaleService.setDataInstallation(data);
          }
        }

        if(response.code == 422){
          if(response.errors){
            const textErrors = this._apiErrorFormattingService.formatAsHtml(response.errors);
            this._sweetAlertService.showTopEnd({type: 'error', title: response.message, message: textErrors});
          }
        }

        if(response.code == 400){
          if(response.errors){
            this._sweetAlertService.showTopEnd({type: 'error', title: response.errors?.message, message: response.errors?.error});
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
          this._sweetAlertService.showTopEnd({type: 'error', title: 'Error al actualizar la instalación', message: error.message, timer: 2500});
        }
      })
    )
  }
  
  // OBTENER DATOS DE LA INSTALACIÓN
  public apInstallationGetByAddress(addressId: number): Promise<InstallationList>{
    this._sweetAlertService.loadingUp('Obteniendo datos');

    return new Promise((resolve, reject) => {
      this._installationService.getByAddress(addressId).subscribe(
        (response: ResponseApi) => {
          this._sweetAlertService.stop();
  
          if (response.code === 200) {
            const installation = response.data[0];
            resolve(installation);
          }
  
          if (response.code === 500) {
            if (response.errors) {
              this._sweetAlertService.showTopEnd({
                type: 'error',
                title: response.errors?.message,
                message: response.errors?.error
              });
            }
            reject(response);
          }
        },
        (error: any) => {
          this._sweetAlertService.stop();
          if (error.message) {
            this._sweetAlertService.showTopEnd({
              type: 'error',
              title: 'Error al listar las instalación',
              message: error.message,
              timer: 2500
            });
          }
          reject(error);
        }
      );
    });
  }



  /**
   * ****************************************************************
   * OPERACIONES CON LA API - INSTALACIONES TEMPORALES  
   * ****************************************************************
   */
  public apiTempInstallationList(forceRefresh: boolean = false){
    this._sweetAlertService.loadingUp('Obteniendo datos')
    this._tempInstallationService.getAll(forceRefresh).subscribe((response: ResponseApi) => {
      this._sweetAlertService.stop();
      if(response.code == 200){
        // this.tmpListInstallations = response.data;
      }

      if(response.code == 500){
        if(response.errors){
          this._sweetAlertService.showTopEnd({type: 'error', title: response.errors?.message, message: response.errors?.error});
        }
      }
    }, (error: any) => {
      this._sweetAlertService.stop();
      if(error.message){
        this._sweetAlertService.showTopEnd({type: 'error', title: 'Error al listar las instalación', message: error.message, timer: 2500});
      }
    });
  }

  // Buscar instalaciones
  public apiTempInstallationSearch(search: string) {
    if(!this.saleId){
      return null;
    }
    this._tempInstallationService.getSearch({search, ventas_id: this.saleId}).subscribe((response: ResponseApi) => {
      this._sweetAlertService.stop();
      if(response.code == 200){
        // this.tmpListInstallationOptions = response.data;
      }

      if(response.code == 500){
        if(response.errors){
          this._sweetAlertService.showTopEnd({type: 'error', title: response.errors?.message, message: response.errors?.error});
        }
      }
    }, (error: any) => {
      this._sweetAlertService.stop();
      if(error.message){
        this._sweetAlertService.showTopEnd({type: 'error', title: 'Error al listar las instalación', message: error.message, timer: 2500});
      }
    });
  }


  public apiTempInstallationFilterSale(saleId: number){
    this._sweetAlertService.loadingUp('Obteniendo datos')
    this._tempInstallationService.getBySale(saleId).subscribe((response: ResponseApi) => {
      this._sweetAlertService.stop();
      if(response.code == 200){
        // this.tmpListInstallations = response.data;
        this._tempInstallationService.addArrayObserver(response.data);
      }

      if(response.code == 500){
        if(response.errors){
          this._sweetAlertService.showTopEnd({type: 'error', title: response.errors?.message, message: response.errors?.error});
        }
      }
    }, (error: any) => {
      this._sweetAlertService.stop();
      if(error.message){
        this._sweetAlertService.showTopEnd({type: 'error', title: 'Error al listar las instalación', message: error.message, timer: 2500});
      }
    });
  }

  // REGISTRAR
  private apiTempInstallationRegister(data: Installation){
    this._sweetAlertService.loadingUp()
    this.subscription.add(
      this._tempInstallationService.register(data).subscribe((response: ResponseApi) => {
        this._sweetAlertService.stop();
        if(response.code == 201){
          if(response.data[0]){
            const data: InstallationList = InstallationList.cast(response.data[0]);
            const direccion_completo = `
              ${data.tipo} 
              ${data.direccion} 
              ${data.numero != ''? ', '+ data.numero: ''} 
              ${data.escalera != ''? ', '+ data.escalera: ''} 
              ${data.portal != ''? ', '+ data.portal: ''} 
              ${data.planta != ''? ', '+ data.planta: ''} 
              ${data.puerta != ''? ', '+ data.puerta: ''}
            `;
            data.direccion_completo = direccion_completo;
            this._tempInstallationService.addObjectObserver(data);
            
            // GUARDAR EN EL LOCAL STORAGE SOLO SI NO SE ENCUENTRA 
            this._shareSaleService.setSaleId(data.ventas_id);
            this._shareSaleService.setInstallationId(data.id);
            this._shareSaleService.setDataInstallation(data);
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
          this._sweetAlertService.showTopEnd({type: 'error', title: 'Error al registrar la instalación', message: error.message, timer: 2500});
        }
      })
    )
  }

  // ACTUALIZAR
  private apiTempInstallationUpdate(data: Installation, id: number){
    this._sweetAlertService.loadingUp()
    this.subscription.add(
      this._tempInstallationService.update(data, id).subscribe((response: ResponseApi) => {
        this._sweetAlertService.stop();
        if(response.code == 200){
          if(response.data[0]){
            const data: InstallationList = InstallationList.cast(response.data[0]);
            const direccion_completo = `
              ${data.tipo} 
              ${data.direccion} 
              ${data.numero != ''? ', '+ data.numero: ''} 
              ${data.escalera != ''? ', '+ data.escalera: ''} 
              ${data.portal != ''? ', '+ data.portal: ''} 
              ${data.planta != ''? ', '+ data.planta: ''} 
              ${data.puerta != ''? ', '+ data.puerta: ''}
            `;
            data.direccion_completo = direccion_completo;
            this._tempInstallationService.updateObjectObserver(data);
            this._sharedClientService.setSaleId(data.ventas_id);
            this._shareSaleService.setInstallationId(data.id);
            this._shareSaleService.setDataInstallation(data);
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
          this._sweetAlertService.showTopEnd({type: 'error', title: 'Error al actualizar la instalación', message: error.message, timer: 2500});
        }
      })
    )
  }

  private apiTempInstallationDelete(id: number){
    this._sweetAlertService.loadingUp()
    this._tempInstallationService.delete(id).subscribe((response: ResponseApi) => {
      this._sweetAlertService.stop();
      if(response.code == 200){
        const data: InstallationList = InstallationList.cast(response.data[0]);
        this._tempInstallationService.removeObjectObserver(data.id);
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
    }, (error: ResponseApi) => {
      this._sweetAlertService.stop();
      if(error.message){
        this._sweetAlertService.showTopEnd({type: 'error', title: 'Error al eliminar la instalación', message: error.message, timer: 2500});
      }
    });
  }
  


   /**
   * ************************************************************
   * EMITIR EL VALOR DEL FORMULARIO
   * ************************************************************
   */
  onSubmit() {
    this.submitted = true;

    if(this.installationForm.invalid){
      this._sweetAlertService.showTopEnd({title: 'Validación de datos', message: 'Campos obligatorios vacíos', type: 'warning', timer: 1500});
    } else {
      const values: Installation = this.installationForm.value;
      let valuesAddress = Address.cast(values);

      if(this.listAddress.length > 0){
        const dataPrev = this.listAddress[0];
        valuesAddress = {...valuesAddress, personas_id: dataPrev.personas_id, empresas_id: dataPrev.empresas_id};
      }

      // TIPO DE CLIENTE
      if(this.legalPerson){
        if(this.companyId){
          valuesAddress.empresas_id = this.companyId;
        }
      } else {
        if(this.personId){
          valuesAddress.personas_id = this.personId;
        }
      }

      if(this.saleId){
        values.ventas_id = this.saleId;
      }


      if(this.isNewData){
        this._sweetAlertService.showConfirmationAlert('¿Estas seguro de registrar la dirección?').then((confirm) => {
          if(confirm.isConfirmed){
            this.apiAddressRegister(valuesAddress);
          }
        });
      } else {
        this._sweetAlertService.showConfirmationAlert('¿Estas seguro de actualizar la dirección?').then((confirm) => {
          if(confirm.isConfirmed){
            this.apiInstallationUpdate(values, values.id);
          }
        });
      }     
    }
  }

  onCancel(){
    // this.onReset();
    // this.focusTipoCliente.nativeElement.focus();
    this._sharedClientService.setClearData(true);
    this.cancel.emit({message: 'Cancelado'});
  }

  onReset(){
    this.submitted = false;
    this.isNewData = true;
    this.installationForm.reset(new Installation());
  }
}
