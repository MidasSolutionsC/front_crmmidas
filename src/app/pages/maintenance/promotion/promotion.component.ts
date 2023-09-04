import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Subscription, distinctUntilChanged } from 'rxjs';
import { Breadcrumb, Promotion, PromotionList, ResponseApi, TypeServiceList } from 'src/app/core/models';
import { ApiErrorFormattingService, FormService, PromotionService, SweetAlertService, TypeServiceService } from 'src/app/core/services';

@Component({
  selector: 'app-promotion',
  templateUrl: './promotion.component.html',
  styleUrls: ['./promotion.component.scss']
})
export class PromotionComponent implements OnInit, OnDestroy{
  modalRef?: BsModalRef;

  dataModal = {
    title: 'Crear promoción',
  }

  // bread crumb items
  titleBreadCrumb: string = 'Promociones';
  breadCrumbItems: Array<{}>;
  
  // Form 
  isNewData: boolean = true;
  submitted: boolean = false;
  promotionForm: FormGroup;


  // Table data
  // content?: any;
  lists?: PromotionList[];

  // Tipo de servicios;
  listServices?: TypeServiceList[];
  
  private subscription: Subscription = new Subscription();

  constructor(
    private modalService: BsModalService, 
    private _typeServiceService: TypeServiceService,
    private _promotionService: PromotionService,
    private _formService: FormService,
    private _apiErrorFormattingService: ApiErrorFormattingService,
    private _sweetAlertService: SweetAlertService,
    private formBuilder: FormBuilder) {

  }

  ngOnInit(): void {
    this.breadCrumbItems = Breadcrumb.casts([{ label: 'Mantenimiento'},{ label: 'Promociones', active: true }]);

    this.initForm();
    this.listDataApi();
    this.apiTypeServiceList();

    // Promociones
    this.subscription.add(
      this._promotionService.listObserver$
      // .pipe(distinctUntilChanged())
      .pipe(
        distinctUntilChanged(
          (prevList, currentList) =>
            prevList.map(item => item.id).join(',') === currentList.map(item => item.id).join(',')
        )
      )
      .subscribe((list: PromotionList[]) => {
        this.lists = list;
      })
    );

    // Tipo de servicios
    this.subscription.add(
      this._typeServiceService.listObserver$
      .pipe(distinctUntilChanged())
      .subscribe((list: TypeServiceList[]) => {
        this.listServices = list;
      })
    );
  }
  
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  /**
   * ****************************************************************
   * OPERACIONES CON LA API
   * ****************************************************************
   */
  public listDataApi(forceRefresh: boolean = false){
    this._sweetAlertService.loadingUp('Obteniendo datos')
    this._promotionService.getAll(forceRefresh).subscribe((response: ResponseApi) => {
      this._sweetAlertService.stop();
      if(response.code == 200){
        this.lists = response.data;
      }

      if(response.code == 500){
        if(response.errors){
          this._sweetAlertService.showTopEnd({type: 'error', title: response.errors?.message, message: response.errors?.error});
        }
      }
    }, (error: any) => {
      this._sweetAlertService.stop();
      console.log(error);
    });
  }

  private saveDataApi(data: Promotion){
    this._sweetAlertService.loadingUp()
    this.subscription.add(
      this._promotionService.register(data).subscribe((response: ResponseApi) => {
        this._sweetAlertService.stop();
        if(response.code == 201){
          if(response.data[0]){
            const data: PromotionList = PromotionList.cast(response.data[0]);
            this._promotionService.addObjectObserver(data);
          }

          this.modalRef?.hide();
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
        console.log(error);
      })
    )
  }

  private updateDataApi(data: Promotion, id: number){
    this._sweetAlertService.loadingUp()
    this._promotionService.update(data, id).subscribe((response: ResponseApi) => {
      this._sweetAlertService.stop();
      if(response.code == 200){
        const data: PromotionList = PromotionList.cast(response.data[0]);
        this._promotionService.updateObjectObserver(data);
        this.modalRef?.hide();
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
      console.log(error);
    });
  }

  private deleteDataApi(id: number){
    this._sweetAlertService.loadingUp()
    this._promotionService.delete(id).subscribe((response: ResponseApi) => {
      this._sweetAlertService.stop();
      if(response.code == 200){
        const data: PromotionList = PromotionList.cast(response.data[0]);
        this._promotionService.removeObjectObserver(data.id);
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
      console.log(error);
    });
  }

  
  /**
   * OPERACIONES DE TABLAS FORÁNEAS
   */
  // Tipo documento
  public apiTypeServiceList(forceRefresh: boolean = false){
    this._sweetAlertService.loadingUp('Obteniendo datos')
    this._typeServiceService.getAll(forceRefresh).subscribe((response: ResponseApi) => {
      this._sweetAlertService.stop();
      if(response.code == 200){
        this.listServices = response.data;
      }

      if(response.code == 500){
        if(response.errors){
          this._sweetAlertService.showTopEnd({type: 'error', title: response.errors?.message, message: response.errors?.error});
        }
      }
    }, (error: any) => {
      this._sweetAlertService.stop();
      console.log(error);
    });
  }


  /**
   * Form data get
   */
  get form() {
    return this.promotionForm.controls;
  }

  /**
   * INICIAR FORMULARTO CON LAS VALIDACIONES
   * @param model 
   */
  private initForm(){
    const promotion = new Promotion();
    const formGroupData = this.getFormGroupData(promotion);
    this.promotionForm = this.formBuilder.group(formGroupData);
  }

  /**
   * CREAR VALIDACIONES DEL FORMGROUP
   * @param model 
   * @returns 
   */
  private getFormGroupData(model: Promotion): object {
    return {
      ...this._formService.modelToFormGroupData(model),
      nombre: ['', [Validators.required, Validators.maxLength(50)]],
      descripcion: ['', [Validators.nullValidator, Validators.maxLength(150)]],
      tipo_servicios_id: ['', [Validators.required, Validators.min(1)]],
      tipo_descuento: ['C', [Validators.nullValidator]],
      descuento: [0, [Validators.nullValidator, Validators.min(0)]],
      fecha_inicio: [new Date().toISOString().split('T')[0], [Validators.required]],
      fecha_fin: [undefined, [Validators.nullValidator]],
      is_active: [true, [Validators.nullValidator]],
    }
  }


  
  /**
   * Open modal
   * @param content modal content
   */
  openModal(content: any) {
    this.initForm();
    this.isNewData = true;
    this.dataModal.title = 'Crear promoción';
    this.submitted = false;
    this.modalRef = this.modalService.show(content, { class: 'modal-md' });
    this.modalRef.onHide.subscribe(() => {});
  }


  /**
    * Save
  */
  saveData() {
    if(!this.promotionForm.valid){
      this._sweetAlertService.showTopEnd({title: 'Validación de datos', message: 'Campos obligatorios vacíos', type: 'warning', timer: 1500});
    } else {
      const values: Promotion = this.promotionForm.value;

      if(this.isNewData){
        // Crear nuevo registro
        this._sweetAlertService.showConfirmationAlert('¿Estas seguro de registrar la promoción?').then((confirm) => {
          if(confirm.isConfirmed){
            this.saveDataApi(values);
          }
        });
      } else {
        // Actualizar datos
        this._sweetAlertService.showConfirmationAlert('¿Estas seguro de modificar la promoción?').then((confirm) => {
          if(confirm.isConfirmed){
            this.updateDataApi(values, values.id);
          }
        });
      }
    }

    this.submitted = true;
  }

  /**
 * Open Edit modal
 * @param content modal content
 */
  editDataGet(id: any, content: any) {
    this.modalRef = this.modalService.show(content, { class: 'modal-md' });
    this.dataModal.title = 'Editar promoción';
    this.isNewData = false;
    this.submitted = false;
    // Cargando datos al formulario 
    var data = this.lists.find((data: { id: any; }) => data.id === id);
    const promotion = Promotion.cast(data);
    this.promotionForm = this.formBuilder.group({...this._formService.modelToFormGroupData(promotion), id: [data.id]});
  }


  /**
   * Eliminar un registro
   * @param id id del registro a eliminar
   */
  deleteRow(id: any){
    this._sweetAlertService.showConfirmationAlert('¿Estas seguro de eliminar la promoción?').then((confirm) => {
      if(confirm.isConfirmed){
        this.deleteDataApi(id);
      }
    });
  }
}
