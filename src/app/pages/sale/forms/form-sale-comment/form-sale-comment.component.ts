import { ChangeDetectorRef, Component, ElementRef, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription, filter } from 'rxjs';
import { FileUploadUtil } from 'src/app/core/helpers';
import { ResponseApi, SaleComment, SaleCommentList } from 'src/app/core/models';
import { ApiErrorFormattingService, FormService, SaleCommentService, SharedSaleService, SweetAlertService, TempSaleCommentService } from 'src/app/core/services';

@Component({
  selector: 'app-form-sale-comment',
  templateUrl: './form-sale-comment.component.html',
  styleUrls: ['./form-sale-comment.component.scss']
})
export class FormSaleCommentComponent implements OnInit, OnDestroy, OnChanges  {

  @ViewChild('focusComentario') focusComentario: ElementRef<HTMLInputElement>;

  // Datos de entrada
  @Input() data: SaleComment = null;

  // Datos de salida
  @Output() submit = new EventEmitter<any>();
  @Output() cancel = new EventEmitter<any>();

  // FORMULARIO DOCUMENT
  isNewData: boolean = true;
  submitted: boolean = false;
  commentForm: FormGroup;

  // VENTA
  saleId: number = null;

    
  private subscription: Subscription = new Subscription();

  constructor(
    private cdr: ChangeDetectorRef,
    private _sharedSaleService: SharedSaleService,
    private _tmpSaleCommentService: TempSaleCommentService,
    private _saleCommentService: SaleCommentService,
    private _formService: FormService,
    private _apiErrorFormattingService: ApiErrorFormattingService,
    private _sweetAlertService: SweetAlertService,
    private formBuilder: FormBuilder
  ){}


  ngOnInit(): void {
    // Instanciar form
    this.initForm();

    // VENTA ID
    this.subscription.add(
      this._sharedSaleService.getSaleId()
        .pipe(filter(value => value != null))
        .subscribe((value: number) => {
          this.saleId = value;
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

  
  onChangeData(){
    if(this.data){
      this.commentForm.setValue({...this.data});
      this.isNewData = false;
      setTimeout(() => {
        this.focusComentario.nativeElement.focus();
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
  private apiSaleCommentSave(data: SaleComment | FormData){
    this._sweetAlertService.loadingUp()
    this.subscription.add(
      this._saleCommentService.register(data).subscribe((response: ResponseApi) => {
        this._sweetAlertService.stop();
        if(response.code == 201){
          if(response.data[0]){
            const data: SaleCommentList = SaleCommentList.cast(response.data[0]);
            this._saleCommentService.addObjectObserver(data);
            this.submit.emit({process: 'saved', data});
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
          this._sweetAlertService.showTopEnd({type: 'error', title: 'Error al registrar el comentario', message: error.message, timer: 2500});
        }
      })
    )
  }

  private apiSaleCommentUpdate(data: SaleComment | FormData, id: number){
    this._sweetAlertService.loadingUp()
    this.subscription.add(
      this._saleCommentService.update(data, id).subscribe((response: ResponseApi) => {
        this._sweetAlertService.stop();
        if(response.code == 200){
          if(response.data[0]){
            const data: SaleCommentList = SaleCommentList.cast(response.data[0]);
            this._saleCommentService.updateObjectObserver(data);
            this.onReset();
            this.submit.emit({process: 'updated', data});
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
   * ****************************************************************
   * OPERACIONES CON LA API - TEMPORAL
   * ****************************************************************
   */
  private apiTempSaleCommentSave(data: SaleComment | FormData){
    this._sweetAlertService.loadingUp()
    this.subscription.add(
      this._tmpSaleCommentService.register(data).subscribe((response: ResponseApi) => {
        this._sweetAlertService.stop();
        if(response.code == 201){
          if(response.data[0]){
            const data: SaleCommentList = SaleCommentList.cast(response.data[0]);
            this._tmpSaleCommentService.addObjectObserver(data);
            this.submit.emit({process: 'saved', data});
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
          this._sweetAlertService.showTopEnd({type: 'error', title: 'Error al registrar el comentario', message: error.message, timer: 2500});
        }
      })
    )
  }

  private apiTempSaleCommentUpdate(data: SaleComment | FormData, id: number){
    this._sweetAlertService.loadingUp()
    this.subscription.add(
      this._tmpSaleCommentService.update(data, id).subscribe((response: ResponseApi) => {
        this._sweetAlertService.stop();
        if(response.code == 200){
          if(response.data[0]){
            const data: SaleCommentList = SaleCommentList.cast(response.data[0]);
            this._tmpSaleCommentService.updateObjectObserver(data);
            this.onReset();
            this.submit.emit({process: 'updated', data});
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
   * ***********************************************
   * OBTENER EL FORM CONTROL - DOCUMENTO
   * ***********************************************
   */
  get f() {
    return this.commentForm.controls;
  }

  /**
   * INICIAR FORMULARTO CON LAS VALIDACIONES
   * @param model 
   */
  private initForm(model: SaleComment = new SaleComment()){
    const formGroupData = this.getFormGroupData(model);
    this.commentForm = this.formBuilder.group(formGroupData);
  }

  /**
   * CREAR VALIDACIONES DEL FORMGROUP
   * @param model 
   * @returns 
   */
  private getFormGroupData(model: SaleComment): object {
    return {
      ...this._formService.modelToFormGroupData(model),
      comentario: [model.comentario, [Validators.required, Validators.maxLength(800)]],
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

    if(this.commentForm.invalid){
      this._sweetAlertService.showTopEnd({title: 'Validación de datos', message: 'Campos obligatorios vacíos', type: 'warning', timer: 1500});
    } else {
      const values: SaleComment = this.commentForm.value;
      if(this.saleId){
        values.ventas_id = this.saleId;
      }

      if(this.isNewData){
        this._sweetAlertService.showConfirmationAlert('¿Estas seguro de registrar el comentario?').then((confirm) => {
          if(confirm.isConfirmed){
            this.apiSaleCommentSave(values);
          }
        });
      } else {
        this._sweetAlertService.showConfirmationAlert('¿Estas seguro de actualizar el comentario?').then((confirm) => {
          if(confirm.isConfirmed){
            this.apiSaleCommentUpdate(values, values.id);
          }
        });
      }     
    }
  }

  onCancel(){
    this.onReset();
    this.focusComentario.nativeElement.focus();
    this.cancel.emit({message: 'Cancelado'});
  }

  onReset(){
    this.submitted = false;
    this.isNewData = true;
    this.commentForm.reset();
    this.commentForm.controls.is_active.setValue(1);
  }
}
