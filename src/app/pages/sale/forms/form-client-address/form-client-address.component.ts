import { ChangeDetectorRef, Component, ElementRef, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription, distinctUntilChanged } from 'rxjs';
import { Address, AddressList, ResponseApi, SaleList } from 'src/app/core/models';
import { AddressService, ApiErrorFormattingService, FormService, SharedClientService, SweetAlertService, TempSaleService } from 'src/app/core/services';

@Component({
  selector: 'app-form-client-address',
  templateUrl: './form-client-address.component.html',
  styleUrls: ['./form-client-address.component.scss']
})
export class FormClientAddressComponent implements OnInit, OnDestroy, OnChanges {

  @ViewChild('focusDomicilio') focusDomicilio: ElementRef<HTMLInputElement>;

  // Datos de entrada
  @Input() data: Address = null;

  // Datos de salida
  @Output() submit = new EventEmitter<any>();
  @Output() cancel = new EventEmitter<any>();

  // FORMULARIO DOCUMENT
  isNewData: boolean = true;
  submitted: boolean = false;
  addressForm: FormGroup;

  clientId: number;
  personId: number;
  companyId: number;
  legalPerson: boolean = false;
    
  private subscription: Subscription = new Subscription();

  constructor(
    private cdr: ChangeDetectorRef,
    private _sharedClientService: SharedClientService,
    private _addressService: AddressService,
    private _formService: FormService,
    private _apiErrorFormattingService: ApiErrorFormattingService,
    private _sweetAlertService: SweetAlertService,
    private formBuilder: FormBuilder
  ){}


  ngOnInit(): void {
    // Instanciar form
    this.initForm();

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

  
  onChangeData(){
    if(this.data){
      this.addressForm.setValue(Address.cast(this.data));
      this.isNewData = false;
      setTimeout(() => {
        this.focusDomicilio.nativeElement.focus();
      }, 50);
    } else {
      this.isNewData = true;
    }
  }


    /**
   * ****************************************************************
   * OPERACIONES CON LA API
   * ****************************************************************
   */
  private apiAddressSave(data: Address | FormData){
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
          this._sweetAlertService.showTopEnd({type: 'error', title: 'Error al registrar la dirección', message: error.message, timer: 2500});
        }
      })
    )
  }

  private apiAddressUpdate(data: Address | FormData, id: number){
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
            this.onReset();
            this.submit.emit({saved: true});
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
     * ***********************************************
     * OBTENER EL FORM CONTROL - DOCUMENTO
     * ***********************************************
     */
  get f() {
    return this.addressForm.controls;
  }

  /**
   * INICIAR FORMULARTO CON LAS VALIDACIONES
   * @param model 
   */
  private initForm(model: Address = new Address()){
    const formGroupData = this.getFormGroupData(model);
    this.addressForm = this.formBuilder.group(formGroupData);
  }

  /**
   * CREAR VALIDACIONES DEL FORMGROUP
   * @param model 
   * @returns 
   */
  private getFormGroupData(model: Address): object {
    return {
      ...this._formService.modelToFormGroupData(model),
      domicilio: [model.domicilio || '', [Validators.nullValidator, Validators.maxLength(150)]],
      tipo: [model.tipo || '', [Validators.required, Validators.maxLength(50)]],
      direccion: [model.direccion || '', [Validators.required, Validators.maxLength(150)]],
      localidad: [model.localidad || '', [Validators.nullValidator, Validators.maxLength(70)]],
      provincia: [model.provincia || '', [Validators.nullValidator, Validators.maxLength(70)]],
      codigo_postal: [model.codigo_postal || '', [Validators.required, Validators.maxLength(20)]],
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

    if(this.addressForm.invalid){
      this._sweetAlertService.showTopEnd({title: 'Validación de datos', message: 'Campos obligatorios vacíos', type: 'warning', timer: 1500});
    } else {
      const values: Address = this.addressForm.value;

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
        this._sweetAlertService.showConfirmationAlert('¿Estas seguro de registrar la dirección?').then((confirm) => {
          if(confirm.isConfirmed){
            if(!this.personId && !this.companyId){
              // GUARDAR EN MEMORIA LOCAL
              const data = AddressList.cast(values);
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
              this.submit.emit({savedLocal: true, data});
              this.onReset();
            } else {
              // GUARDAR EN LA BASE DE DATOS
              this.apiAddressSave(values);
            }
          }
        });
      } else {
        this._sweetAlertService.showConfirmationAlert('¿Estas seguro de actualizar la dirección?').then((confirm) => {
          if(confirm.isConfirmed){
            if(!this.personId && !this.companyId){
              // ACTUALIZAR EN MEMORIA LOCAL
              const data = AddressList.cast(values);
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
              this.submit.emit({updatedLocal: true, data});
              this.onReset();
            } else {
              // ACTUALIZAR EN LA BASE DE DATOS
              this.apiAddressUpdate(values, values.id);
            }
          }
        });
      }     
    }
  }

  onCancel(){
    this.onReset();
    this.focusDomicilio.nativeElement.focus();
    this.cancel.emit({message: 'Cancelado'});
  }

  onReset(){
    this.submitted = false;
    this.isNewData = true;
    this.addressForm.reset(new Address());
    this.addressForm.controls.is_primary.setValue(0);
    this.addressForm.controls.is_active.setValue(1);
  }
}
