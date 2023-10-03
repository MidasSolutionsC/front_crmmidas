import { AfterViewInit, ChangeDetectorRef, Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription, distinctUntilChanged } from 'rxjs';
import { DetailFixedLine, DetailMobileLine, InstallationList, OperatorList, ResponseApi, SaleDetail, TypeDocumentList, TypeStatusList } from 'src/app/core/models';
import { ApiErrorFormattingService, FormService, OperatorService, SweetAlertService, TempInstallationService, TypeDocumentService, TypeStatusService } from 'src/app/core/services';

@Component({
  selector: 'app-form-sale-detail',
  templateUrl: './form-sale-detail.component.html',
  styleUrls: ['./form-sale-detail.component.scss']
})
export class FormSaleDetailComponent implements OnInit, OnDestroy, OnChanges {

  // Datos de entrada
  @Input() typeService: string = null;
  @Input() data: SaleDetail = null;

  // Datos de salida
  @Output() formSubmit = new EventEmitter<any>();
  @Output() cancel = new EventEmitter<any>();

  // DETALLE SERVICIO
  isNewData: boolean = false;
  submitted: boolean = false;
  saleDetailForm: FormGroup;

  // ENFOQUES
  focusTypeDocumentMobile: boolean = false;

  // FORM LINEA FIJA
  fixedLineForm: FormGroup;
  
  // FORM LINEA MOVIL
  mobileLineForm: FormGroup;
  
  // FORM LINEA TV
  tvLineForm: FormGroup;

  // Tipo documentos
  listTypeDocuments?: TypeDocumentList[] = [];

  // Tipo de servicios;
  listTypeStatus?: TypeStatusList[];
  
  // Operadores;
  listOperators?: OperatorList[] = [];

  // Lista de instalaciones
  tmpListInstallationOptions: InstallationList[] = [];

  
  private subscription: Subscription = new Subscription();

  constructor(
    private cdr: ChangeDetectorRef,
    private _tempInstallationService: TempInstallationService,
    private _operatorService: OperatorService,
    private _typeStatusService: TypeStatusService,
    private _typeDocumentService: TypeDocumentService,
    private _formService: FormService,
    private _apiErrorFormattingService: ApiErrorFormattingService,
    private _sweetAlertService: SweetAlertService,
    private formBuilder: FormBuilder
  ){
  }


  ngOnInit(): void {
    // Listar los tipos de documentos
    this.apiTypeDocumentList();
    this.apiTypeStatusList();
    this.apiOperatorList();

    // Tipo de documentos  observado
    this.subscription.add(
      this._typeDocumentService.typeDocuments$
      .pipe(
        distinctUntilChanged((prevList, currentList) =>
            prevList.map(item => item.id).join(',') === currentList.map(item => item.id).join(',')
            )
          )
          .subscribe((list: TypeDocumentList[]) => {
            this.listTypeDocuments = list;
      })
    );

    // Tipo de estados
    this.subscription.add(
      this._typeStatusService.listObserver$
      .pipe(distinctUntilChanged())
      .subscribe((list: TypeStatusList[]) => {
        this.listTypeStatus = list;
      })
    );

    // Operadores
    this.subscription.add(
      this._operatorService.listObserver$
      .pipe(distinctUntilChanged())
      .subscribe((list: OperatorList[]) => {
        this.listOperators = list;
      })
    );

    // INSTANCIA DEL FORMULARIOS
    this.initForm();
    this.initFormMobile();    
    this.initFormFixed();        
    this.initializeForms();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  
  ngOnChanges(changes: SimpleChanges) { 
    if((changes.data && !changes.data.firstChange) || (changes.typeService && !changes.typeService.firstChange)){
      setTimeout(() => {
        this.initializeForms();
      }, 0);
    }   
  }


  initializeForms(){
    if(this.data){
      this.apiTempInstallationSearch(''); // Filtrar direcciones
      if(this.saleDetailForm){
        this.saleDetailForm.setValue(SaleDetail.cast(this.data));
      }
    } else {
      this.data = null;
      if(this.saleDetailForm){
        this.saleDetailForm.reset();
      }

      if(this.mobileLineForm){
        this.mobileLineForm.reset();
      }

      if(this.fixedLineForm){
        this.fixedLineForm.reset();
      }
    }

    if(this.typeService){
      const json = this.data?.datos_json && JSON.stringify(this.data?.datos_json) !== '{}'? this.data.datos_json: null;
      console.log(json)

      switch(this.typeService){
        case 'mobile':
          if(json != null){
            const value = DetailMobileLine.cast(json);
            if(this.mobileLineForm){
              this.mobileLineForm.setValue(value);          
            }
          }
          break;
        case 'fixed':
          if(json != null){
            const value = DetailFixedLine.cast(json);
            if(this.fixedLineForm){
              this.fixedLineForm.setValue(value);          
            }
          }
          break;
        case 'tv':
          // this.initFormTv();
          break;

        default: break;
      }
    }
  }

  
  /**
   * ****************************************************************
   * OPERACIONES CON LA API
   * ****************************************************************
   */



  /**
   * *******************************************************
   * OPERACIONES DE TABLAS FORÁNEAS
   * *******************************************************
   */
  // Tipo documento
  public apiTypeDocumentList(forceRefresh: boolean = false){
    this._sweetAlertService.loadingUp('Obteniendo datos')
    this._typeDocumentService.getAll(forceRefresh).subscribe((response: ResponseApi) => {
      this._sweetAlertService.stop();
      if(response.code == 200){
        // this.listTypeDocuments = response.data;
      }

      if(response.code == 500){
        if(response.errors){
          this._sweetAlertService.showTopEnd({type: 'error', title: response.errors?.message, message: response.errors?.error});
        }
      }
    }, (error: any) => {
      this._sweetAlertService.stop();
      if(error.message){
        this._sweetAlertService.showTopEnd({type: 'error', title: 'Error al listar los tips de documentos', message: error.message, timer: 2500});
      }
    });
  }
  
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
      if(error.message){
        this._sweetAlertService.showTopEnd({type: 'error', title: 'Error al listar los tipos de estados', message: error.message, timer: 2500});
      }
    });
  }

  // Operadores
  public apiOperatorList(forceRefresh: boolean = false){
    this._sweetAlertService.loadingUp('Obteniendo datos')
    this._operatorService.getAll(forceRefresh).subscribe((response: ResponseApi) => {
      this._sweetAlertService.stop();
      if(response.code == 200){
        // this.listOperators = response.data;
      }

      if(response.code == 500){
        if(response.errors){
          this._sweetAlertService.showTopEnd({type: 'error', title: response.errors?.message, message: response.errors?.error});
        }
      }
    }, (error: any) => {
      this._sweetAlertService.stop();
      if(error.message){
        this._sweetAlertService.showTopEnd({type: 'error', title: 'Error al listar los operadores', message: error.message, timer: 2500});
      }
    });
  }

  
  // Buscar instalaciones
  public apiTempInstallationSearch(search: string) {
    this._tempInstallationService.getSearch({search, ventas_id: this.data?.ventas_id}).subscribe((response: ResponseApi) => {
      this._sweetAlertService.stop();
      if(response.code == 200){
        this.tmpListInstallationOptions = response.data;
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

  
  /**
   * ***********************************************
   * OBTENER EL FORM CONTROL - DETALLE
   * ***********************************************
   */
  get f() {
    return this.saleDetailForm.controls;
  }

  /**
   * INICIAR FORMULARTO CON LAS VALIDACIONES
   * @param model 
   */
  private initForm(model: SaleDetail = new SaleDetail()){
    const formGroupData = this.getFormGroupData(model);
    this.saleDetailForm = this.formBuilder.group(formGroupData);
  }

  /**
   * CREAR VALIDACIONES DEL FORMGROUP
   * @param model 
   * @returns 
   */
  private getFormGroupData(model: SaleDetail): object {
    return {
      ...this._formService.modelToFormGroupData(model),
      tipo_estados_id: [model.tipo_estados_id, [Validators.required, Validators.min(0)]],
      fecha_cierre: [model.fecha_cierre, [Validators.nullValidator]],
      observacion: [model.observacion, [Validators.nullValidator, Validators.maxLength(450)]],
      is_active: [true, [Validators.nullValidator]],
    }
  }


    
  /**
   * ***********************************************
   * OBTENER EL FORM CONTROL - LINEA TV
   * ***********************************************
   */
  get ft() {
    return this.tvLineForm.controls;
  }

  /**
   * INICIAR FORMULARIO CON LAS VALIDACIONES
   * @param model 
   */
  private initFormTv(){
    const formGroupData = this.getFormGroupDataTv();
    this.tvLineForm = this.formBuilder.group(formGroupData);
  }

  /**
   * CREAR VALIDACIONES DEL FORM GROUP
   * @param model 
   * @returns 
   */
  private getFormGroupDataTv(): object {
    return {
      nombre: ['', [Validators.required, Validators.maxLength(50)]],
    }
  }

    
  /**
   * ***********************************************
   * OBTENER EL FORM CONTROL - LINEA MOVIL
   * ***********************************************
   */
  get fm() {
    return this.mobileLineForm.controls;
  }

  /**
   * INICIAR FORMULARIO CON LAS VALIDACIONES
   * @param model 
   */
  private initFormMobile(model: DetailMobileLine = new DetailMobileLine()){
    const formGroupData = this.getFormGroupDataMobile(model);
    this.mobileLineForm = this.formBuilder.group(formGroupData);
  }

  /**
   * CREAR VALIDACIONES DEL FORM GROUP
   * @param model 
   * @returns 
   */
  private getFormGroupDataMobile(model: DetailMobileLine): object {
    return {
      tipo_documento_id: [model?.tipo_documento_id || '', [Validators.required, Validators.min(1)]],
      documento_titular: [model?.documento_titular || '', [Validators.required, Validators.maxLength(11)]],
      titular: [model?.titular || '', [Validators.required, Validators.maxLength(50)]],
      operador_donante_id: [model?.operador_donante_id || '', [Validators.nullValidator, Validators.min(1)]],
      num_portar: [model?.num_portar || '', [Validators.nullValidator, Validators.maxLength(50)]],
      icc: [model?.icc || '', [Validators.nullValidator, Validators.maxLength(50)]],
      terminal: [model?.terminal || false, [Validators.nullValidator]],
      modelo_terminal: [model?.modelo_terminal || '', [Validators.nullValidator, Validators.maxLength(150)]],
      aop: [model?.aop || '', [Validators.nullValidator, Validators.maxLength(60)]],
    }
  }
    
  /**
   * ***********************************************
   * OBTENER EL FORM CONTROL - LINEA FIJA
   * ***********************************************
   */
  get fx() {
    return this.fixedLineForm.controls;
  }

  /**
   * INICIAR FORMULARIO CON LAS VALIDACIONES
   * @param model 
   */
  private initFormFixed(model: DetailFixedLine = new DetailFixedLine()){
    const formGroupData = this.getFormGroupDataFixed(model);
    this.fixedLineForm = this.formBuilder.group(formGroupData);
  }

  /**
   * CREAR VALIDACIONES DEL FORM GROUP
   * @param model 
   * @returns 
   */
  private getFormGroupDataFixed(model: DetailFixedLine): object {
    return {
      tipo_documento_id: [model?.tipo_documento_id || '', [Validators.required, Validators.min(1)]],
      documento_titular: [model?.documento_titular || '', [Validators.required, Validators.maxLength(11)]],
      titular: [model?.titular || '', [Validators.required, Validators.maxLength(50)]],
      operador_donante_id: [model?.operador_donante_id || '', [Validators.nullValidator, Validators.min(1)]],
      num_portar: [model?.num_portar || '', [Validators.nullValidator, Validators.maxLength(50)]],
      aop: [model?.aop || '', [Validators.nullValidator, Validators.maxLength(60)]],
    }
  }




  /**
   * ***********************************************
   * EMITIR VALOREES
   * ***********************************************
   */
  onSubmit() {
    // Emitir un evento cuando se envía el formulario
    this.submitted = true;
    let data = null;

    if(this.typeService){
      switch(this.typeService){
        case 'mobile':
          data = this.submitMobile();
          break;
        case 'fixed':
          data = this.submitFixed();
          break;
        case 'tv':
          // data = this.submitTv();
          break;

        default: break;
      }
    }
    
    if(this.saleDetailForm.invalid || data == false){
      this._sweetAlertService.showTopEnd({title: 'Validación de datos', message: 'Campos obligatorios vacíos', type: 'warning', timer: 1500});
    } else {
      this.f.datos_json.setValue(data);
      this.formSubmit.emit(this.saleDetailForm.value);
    }
  }
  
  

  // Tv
  submitTv(){
    if(this.tvLineForm.invalid){
      this._sweetAlertService.showTopEnd({title: 'Validación de datos', message: 'Campos obligatorios vacíos', type: 'warning', timer: 1500});
      return false;
    } else {
      // this.formSubmit.emit(this.tvLineForm.value);
      return this.tvLineForm.value;
    }
  }

  // Mobile
  submitMobile(){
    if(this.mobileLineForm.invalid){
      this._sweetAlertService.showTopEnd({title: 'Validación de datos', message: 'Campos obligatorios vacíos', type: 'warning', timer: 1500});
      return false;
    } else {
      // this.formSubmit.emit(this.mobileLineForm.value);
      return this.mobileLineForm.value;
    }
  }

  // Fija
  submitFixed(){
    if(this.fixedLineForm.invalid){
      this._sweetAlertService.showTopEnd({title: 'Validación de datos', message: 'Campos obligatorios vacíos', type: 'warning', timer: 1500});
      return false;
    } else {
      // this.formSubmit.emit(this.fixedLineForm.value);
      return this.fixedLineForm.value;
    }
  }

  /**
   * ***********************************************
   * EMITIR VALOREES CANCELADO
   * ***********************************************
   */
  onCancel(){
    this.submitted = false;
    this.cancel.emit({message: 'Cancelado'});
  }

}
