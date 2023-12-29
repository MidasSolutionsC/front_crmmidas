import { ChangeDetectorRef, Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { Subscription } from 'rxjs';
import { ResponseApi } from 'src/app/core/models';
import { ApiErrorFormattingService, FormService, SaleService, SweetAlertService } from 'src/app/core/services';

@Component({
  selector: 'app-modal-retail',
  templateUrl: './modal-retail.component.html',
  styleUrls: ['./modal-retail.component.scss']
})
export class ModalRetailComponent implements OnInit, OnDestroy, OnChanges {
  // DATOS DE ENTRADAS
  @Input() dataInput: any = null;

  // REFERENCIA AL MODAL ACTUAL
  modalRefCurrent?: BsModalRef;

  // DATOS DEL MODAL
  dataModal: any = {
    title: 'Datos de la venta'
  };

  // Form 
  isNewData: boolean = false;
  submitted: boolean = false;
  saleForm: FormGroup;


  private subscription: Subscription = new Subscription();

  constructor(
    public modalRef: BsModalRef,
    private cdr: ChangeDetectorRef,
    private formBuilder: FormBuilder,
    private _formService: FormService,
    private _saleService: SaleService,
    private _apiErrorFormattingService: ApiErrorFormattingService,
    private _sweetAlertService: SweetAlertService,
  ) { }

  ngOnInit(): void {
    this.initForm()

    this.onChanges()
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }


  ngOnChanges(changes: SimpleChanges): void {
    if (changes.dataInput && !changes.dataInput.firstChange) {
      this.onChanges();
    }
  }


  /***
   * ***************************************************************
   * DETECTAR CAMBIOS EN LA VARIABLE DE ENTRADA
   * ***************************************************************
   */
  onChanges() {
    if (this.dataInput) {
      // console.log("DATOS DE LA VENTA:", this.dataInput);
      if (this.saleForm) {
        this.saleForm.get('retailx_id').setValue(this.dataInput.retailx_id);
        this.saleForm.get('smart_id').setValue(this.dataInput.smart_id);
        this.saleForm.get('direccion_smart_id').setValue(this.dataInput.direccion_smart_id);
      }
    }
  }





  /***
   * ***************************************************************
   * OPERACIONES DE OTROS COMPONENTES
   * ***************************************************************
   */


  /**
   * ****************************************************************
   * OPERACIONES CON LA API
   * ****************************************************************
   */


  private apiSaleUpdate(data: any, id: number) {
    this._sweetAlertService.loadingUp()
    this._saleService.update(data, id).subscribe((response: ResponseApi) => {
      this._sweetAlertService.stop();
      if (response.code == 200) {
        const data: any = response.data[0]
        this.modalRef?.hide();
      }

      if (response.code == 422) {
        if (response.errors) {
          const textErrors = this._apiErrorFormattingService.formatAsHtml(response.errors);
          this._sweetAlertService.showTopEnd({ type: 'error', title: response.message, message: textErrors });
        }
      }

      if (response.code == 500) {
        if (response.errors) {
          this._sweetAlertService.showTopEnd({ type: 'error', title: response.errors?.message, message: response.errors?.error });
        }
      }
    }, (error: ResponseApi) => {
      this._sweetAlertService.stop();
      console.log(error);
    });
  }


  /**
  * Form data get
  */
  get form() {
    return this.saleForm.controls;
  }

  /**
   * INICIAR FORMULARTO CON LAS VALIDACIONES
   * @param model 
   */
  private initForm() {
    const obj = {
      retailx_id: null,
      smart_id: null,
      direccion_smart_id: null,
    };
    const formGroupData = this.getFormGroupData(obj);
    this.saleForm = this.formBuilder.group(formGroupData);
  }

  /**
   * CREAR VALIDACIONES DEL FORMGROUP
   * @param model 
   * @returns 
   */
  private getFormGroupData(model: any): object {
    return {
      ...this._formService.modelToFormGroupData(model),
      retailx_id: [model.retailx_id || '', [Validators.nullValidator, Validators.maxLength(25)]],
      smart_id: [model.smart_id || '', [Validators.nullValidator, Validators.maxLength(25)]],
      direccion_smart_id: [model.direccion_smart_id || '', [Validators.nullValidator, Validators.maxLength(25)]],
    }
  }



  
  /**
    * Save
  */
  saveData() {
    this.submitted = true;
    if (!this.saleForm.valid) {
      this._sweetAlertService.showTopEnd({ title: 'Validación de datos', message: 'Campos obligatorios vacíos', type: 'warning', timer: 1500 });
    } else {
      const values: any = this.saleForm.value;
      values.nro_orden = this.dataInput.nro_orden;
      values.clientes_id = this.dataInput.clientes_id;

      // Actualizar datos
      this._sweetAlertService.showConfirmationAlert('¿Estas seguro de modificar los datos?').then((confirm) => {
        if (confirm.isConfirmed) {
          this.apiSaleUpdate(values, this.dataInput.id);
        }
      });
    }

    this.submitted = true;
  }

}
