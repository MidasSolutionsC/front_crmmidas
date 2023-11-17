import { ChangeDetectorRef, Component, ElementRef, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription, distinctUntilChanged } from 'rxjs';
import { ResponseApi, SaleHistory, SaleHistoryList, TypeStatusList } from 'src/app/core/models';
import { ApiErrorFormattingService, FormService, SweetAlertService, TempSaleHistoryService, TypeStatusService } from 'src/app/core/services';

@Component({
  selector: 'app-form-sale-history',
  templateUrl: './form-sale-history.component.html',
  styleUrls: ['./form-sale-history.component.scss']
})
export class FormSaleHistoryComponent implements OnInit, OnDestroy, OnChanges{

  @ViewChild('focusTipoEstado') focusTipoEstado: ElementRef;

  // Datos de entrada
  @Input() data: SaleHistory = null;

  // Datos de salida
  @Output() submit = new EventEmitter<any>();
  @Output() cancel = new EventEmitter<any>();

  // FORMULARIO DOCUMENT
  isNewData: boolean = true;
  submitted: boolean = false;
  historyForm: FormGroup;

  
  // Tipo de servicios;
  listTypeStatus?: TypeStatusList[];
    
  private subscription: Subscription = new Subscription();

  constructor(
    private cdr: ChangeDetectorRef,
    private _tmpSaleHistoryService: TempSaleHistoryService,
    private _typeStatusService: TypeStatusService,
    private _formService: FormService,
    private _apiErrorFormattingService: ApiErrorFormattingService,
    private _sweetAlertService: SweetAlertService,
    private formBuilder: FormBuilder
  ){}


  ngOnInit(): void {
    // Instanciar form
    this.initForm();

    // Listado
    this.apiTypeStatusList();

    // Tipo de estados
    this.subscription.add(
      this._typeStatusService.listObserver$
      .pipe(distinctUntilChanged())
      .subscribe((list: TypeStatusList[]) => {
        this.listTypeStatus = list;
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
      this.historyForm.setValue({...this.data});
      this.isNewData = false;
      // setTimeout(() => {
      //   if(this.focusTipoEstado){
      //     this.focusTipoEstado.nativeElement.focus();
      //   }
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
  private apiSaleHistorySave(data: SaleHistory){
    this._sweetAlertService.loadingUp()
    this.subscription.add(
      this._tmpSaleHistoryService.register(data).subscribe((response: ResponseApi) => {
        this._sweetAlertService.stop();
        if(response.code == 201){
          if(response.data[0]){
            const data: SaleHistoryList = SaleHistoryList.cast(response.data[0]);
            this._tmpSaleHistoryService.addObjectObserver(data);
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
          this._sweetAlertService.showTopEnd({type: 'error', title: 'Error al registrar el historial', message: error.message, timer: 2500});
        }
      })
    )
  }

  private apiSaleHistoryUpdate(data: SaleHistory | FormData, id: number){
    this._sweetAlertService.loadingUp()
    this.subscription.add(
      this._tmpSaleHistoryService.update(data, id).subscribe((response: ResponseApi) => {
        this._sweetAlertService.stop();
        if(response.code == 200){
          if(response.data[0]){
            const data: SaleHistoryList = SaleHistoryList.cast(response.data[0]);
            this._tmpSaleHistoryService.updateObjectObserver(data);
            this.submit.emit({saved: true});
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
          this._sweetAlertService.showTopEnd({type: 'error', title: 'Error al actualizar el comentario', message: error.message, timer: 2500});
        }
      })
    )
  }


  /**
   * *******************************************************
   * OPERACIONES DE TABLAS FORÁNEAS
   * *******************************************************
   */
  // Tipo documento
  public apiTypeStatusList(forceRefresh: boolean = false){
    this._sweetAlertService.loadingUp('Obteniendo datos')
    this._typeStatusService.getAll(forceRefresh).subscribe((response: ResponseApi) => {
      this._sweetAlertService.stop();
      if(response.code == 200){
        // this.listTypeStatus = response.data;
      }

      if(response.code == 500){
        if(response.errors){
          this._sweetAlertService.showTopEnd({type: 'error', title: response.errors?.message, message: response.errors?.error});
        }
      }
    }, (error: any) => {
      this._sweetAlertService.stop();
      // console.log(error);
    });
  }


    
  /**
   * ***********************************************
   * OBTENER EL FORM CONTROL - DOCUMENTO
   * ***********************************************
   */
  get f() {
    return this.historyForm.controls;
  }

  /**
   * INICIAR FORMULARTO CON LAS VALIDACIONES
   * @param model 
   */
  private initForm(model: SaleHistory = new SaleHistory()){
    const formGroupData = this.getFormGroupData(model);
    this.historyForm = this.formBuilder.group(formGroupData);
  }

  /**
   * CREAR VALIDACIONES DEL FORMGROUP
   * @param model 
   * @returns 
   */
  private getFormGroupData(model: SaleHistory): object {
    return {
      ...this._formService.modelToFormGroupData(model),
      tipo: [model.tipo, [Validators.required]],
      tipo_estados_id: [model.tipo_estados_id, [Validators.required, Validators.min(1)]],
      comentario: [model.comentario || '', [Validators.nullValidator, Validators.maxLength(250)]],
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

    if(this.historyForm.invalid){
      this._sweetAlertService.showTopEnd({title: 'Validación de datos', message: 'Campos obligatorios vacíos', type: 'warning', timer: 1500});
    } else {
      const values: SaleHistory = this.historyForm.value;
      const idVenta = localStorage.getItem('ventas_id');
      if(idVenta !== null && idVenta !== undefined){
        values.ventas_id = parseInt(idVenta);
      }

      if(this.isNewData){
        this._sweetAlertService.showConfirmationAlert('¿Estas seguro de registrar el historial?').then((confirm) => {
          if(confirm.isConfirmed){
            this.apiSaleHistorySave(values);
          }
        });
      } else {
        this._sweetAlertService.showConfirmationAlert('¿Estas seguro de actualizar el historial?').then((confirm) => {
          if(confirm.isConfirmed){
            this.apiSaleHistoryUpdate(values, values.id);
          }
        });
      }
    }

  }

  onCancel(){
    this.onReset();
    // this.focusTipoEstado.nativeElement.focus();
    this.cancel.emit({message: 'Cancelado'});
  }

  onReset(){
    this.submitted = false;
    this.isNewData = true;
    this.historyForm.reset(new SaleHistory());
    this.historyForm.controls.is_active.setValue(1);
  }
}
