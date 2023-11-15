import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Subscription, distinctUntilChanged } from 'rxjs';
import { Breadcrumb, ResponseApi, TypeService, TypeServiceList } from 'src/app/core/models';
import { ApiErrorFormattingService, FormService, SweetAlertService } from 'src/app/core/services';
import { TypeServiceService } from 'src/app/core/services';

@Component({
  selector: 'app-type-service',
  templateUrl: './type-service.component.html',
  styleUrls: ['./type-service.component.scss']
})
export class TypeServiceComponent implements OnInit, OnDestroy {
  modalRef?: BsModalRef;

  dataModal = {
    title: 'Crear tipo de servicios',
  }

  // bread crumb items
  titleBreadCrumb: string = 'Tipo de servicios';
  breadCrumbItems: Array<{}>;
  
  // Form 
  isNewData: boolean = true;
  submitted: boolean = false;
  typeServiceForm: FormGroup;


  // Table data
  // content?: any;
  lists?: TypeServiceList[];
  
  private subscription: Subscription = new Subscription();

  constructor(
    private modalService: BsModalService, 
    private _typeServiceService: TypeServiceService,
    private _formService: FormService,
    private _apiErrorFormattingService: ApiErrorFormattingService,
    private _sweetAlertService: SweetAlertService,
    private formBuilder: FormBuilder) {

  }

  ngOnInit(): void {
    this.breadCrumbItems = Breadcrumb.casts([{ label: 'Mantenimiento'}, { label: 'Man. de tipos'}, { label: 'Tipos de servicios', active: true }]);

    this.initForm();
    this.listDataApi();
    this.subscription.add(
      this._typeServiceService.listObserver$
      // .pipe(distinctUntilChanged())
      .pipe(
        distinctUntilChanged(
          (prevList, currentList) =>
            prevList.map(item => item.id).join(',') === currentList.map(item => item.id).join(',')
        )
      )
      .subscribe((list: TypeServiceList[]) => {
        this.lists = list;
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
    this._typeServiceService.getAll(forceRefresh).subscribe((response: ResponseApi) => {
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

  private saveDataApi(data: TypeService){
    this._sweetAlertService.loadingUp()
    this.subscription.add(
      this._typeServiceService.register(data).subscribe((response: ResponseApi) => {
        this._sweetAlertService.stop();
        if(response.code == 201){
          if(response.data[0]){
            const data: TypeServiceList = TypeServiceList.cast(response.data[0]);
            this._typeServiceService.addObjectObserver(data);
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

  private updateDataApi(data: TypeService, id: number){
    this._sweetAlertService.loadingUp()
    this._typeServiceService.update(data, id).subscribe((response: ResponseApi) => {
      this._sweetAlertService.stop();
      if(response.code == 200){
        const data: TypeServiceList = TypeServiceList.cast(response.data[0]);
        this._typeServiceService.updateObjectObserver(data);
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
    this._typeServiceService.delete(id).subscribe((response: ResponseApi) => {
      this._sweetAlertService.stop();
      if(response.code == 200){
        const data: TypeServiceList = TypeServiceList.cast(response.data[0]);
        this._typeServiceService.removeObjectObserver(data.id);
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
   * Form data get
   */
  get form() {
    return this.typeServiceForm.controls;
  }

  /**
   * INICIAR FORMULARTO CON LAS VALIDACIONES
   * @param model 
   */
  private initForm(){
    const typeService = new TypeService();
    const formGroupData = this.getFormGroupData(typeService);
    this.typeServiceForm = this.formBuilder.group(formGroupData);
  }

  /**
   * CREAR VALIDACIONES DEL FORMGROUP
   * @param model 
   * @returns 
   */
  private getFormGroupData(model: TypeService): object {
    return {
      ...this._formService.modelToFormGroupData(model),
      nombre: [model.nombre || '', [Validators.required, Validators.maxLength(50)]],
      icono: [model.icono || '', [Validators.required, Validators.maxLength(100)]],
      descripcion: ['', [Validators.nullValidator, Validators.maxLength(150)]],
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
    this.dataModal.title = 'Crear tipo de servicio';
    this.submitted = false;
    this.modalRef = this.modalService.show(content, { class: 'modal-md' });
    this.modalRef.onHide.subscribe(() => {});
  }


  /**
    * Save
  */
  saveData() {
    if(!this.typeServiceForm.valid){
      this._sweetAlertService.showTopEnd({title: 'Validación de datos', message: 'Campos obligatorios vacíos', type: 'warning', timer: 1500});
    } else {
      const values: TypeService = this.typeServiceForm.value;

      if(this.isNewData){
        // Crear nuevo registro
        this._sweetAlertService.showConfirmationAlert('¿Estas seguro de registrar el tipo de servicio?').then((confirm) => {
          if(confirm.isConfirmed){
            this.saveDataApi(values);
          }
        });
      } else {
        // Actualizar datos
        this._sweetAlertService.showConfirmationAlert('¿Estas seguro de modificar el tipo de servicio?').then((confirm) => {
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
    this.dataModal.title = 'Editar tipo de servicio';
    this.isNewData = false;
    this.submitted = false;
    // Cargando datos al formulario 
    var data = this.lists.find((data: { id: any; }) => data.id === id);
    const typeService = TypeService.cast(data);
    this.typeServiceForm = this.formBuilder.group({...this._formService.modelToFormGroupData(typeService), id: [data.id]});
  }


  /**
   * Eliminar un registro
   * @param id id del registro a eliminar
   */
  deleteRow(id: any){
    this._sweetAlertService.showConfirmationAlert('¿Estas seguro de eliminar el tipo de servicio?').then((confirm) => {
      if(confirm.isConfirmed){
        this.deleteDataApi(id);
      }
    });
  }
}
