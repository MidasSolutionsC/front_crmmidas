import { ChangeDetectorRef, Component, OnDestroy, OnInit  } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Subscription, debounceTime, distinctUntilChanged } from 'rxjs';
import { Breadcrumb, Pagination, ResponseApi, ResponsePagination } from 'src/app/core/models';
import { TypeUserPermission, TypeUserPermissionList } from 'src/app/core/models/api/settings/type-user-permission.model';
import { ApiErrorFormattingService, FormService, SweetAlertService } from 'src/app/core/services';
import { TypeUserPermissionService } from 'src/app/core/services/api/settings/type-user.permission.service';


@Component({
  selector: 'app-type-user-permission',
  templateUrl: './type-user-permission.component.html',
  styleUrls: ['./type-user-permission.component.scss']
})
export class TypeUserPermissionComponent
 {
  modalRef?: BsModalRef;

  dataModal = {
    title: 'Crear Permisos de usuarios',
  }

  // bread crumb items
  titleBreadCrumb: string = 'Tipo de Permisos de Usuarios';
  breadCrumbItems: Array<{}>;

  // Form
  isNewData: boolean = true;
  submitted: boolean = false;
  typeUserPermissionForm: FormGroup;


  // Table data
  // content?: any;
  lists?: TypeUserPermissionList[];

  private subscription: Subscription = new Subscription();

  constructor(
    private modalService: BsModalService,
    private _typeUserPermissionService: TypeUserPermissionService,
    private _formService: FormService,
    private _apiErrorFormattingService: ApiErrorFormattingService,
    private _sweetAlertService: SweetAlertService,
    private formBuilder: FormBuilder) {

  }

  ngOnInit(): void {
    this.breadCrumbItems = Breadcrumb.casts([{ label: 'Configuraciones'}, { label: 'Tipo de Permisos de Usuario', active: true }]);

    this.initForm();
    this.listDataApi();
    this.subscription.add(
      this._typeUserPermissionService.listObserver$
      .pipe(
        distinctUntilChanged(
          (prevList, currentList) =>
            prevList.map(item => item.id).join(',') === currentList.map(item => item.id).join(',')
        )
      )
      .subscribe((list: TypeUserPermissionList[]) => {
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
    this._typeUserPermissionService.getAll(forceRefresh).subscribe((response: ResponseApi) => {
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

  private saveDataApi(data: TypeUserPermission){
    this._sweetAlertService.loadingUp()
    this.subscription.add(
      this._typeUserPermissionService.register(data).subscribe((response: ResponseApi) => {
        this._sweetAlertService.stop();
        if(response.code == 201){
          if(response.data[0]){
            const data: TypeUserPermissionList = TypeUserPermissionList.cast(response.data[0]);
            this._typeUserPermissionService.addObjectObserver(data);
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

  private updateDataApi(data: TypeUserPermission, id: number){
    this._sweetAlertService.loadingUp()
    this._typeUserPermissionService.update(data, id).subscribe((response: ResponseApi) => {
      this._sweetAlertService.stop();
      if(response.code == 200){
        const data: TypeUserPermissionList = TypeUserPermissionList.cast(response.data[0]);
        this._typeUserPermissionService.updateObjectObserver(data);
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
    this._typeUserPermissionService.delete(id).subscribe((response: ResponseApi) => {
      this._sweetAlertService.stop();
      if(response.code == 200){
        const data: TypeUserPermissionList = TypeUserPermissionList.cast(response.data[0]);
        this._typeUserPermissionService.removeObjectObserver(data.id);
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
    return this.typeUserPermissionForm.controls;
  }

  /**
   * INICIAR FORMULARTO CON LAS VALIDACIONES
   * @param model
   */
  private initForm(){
    const typeUserPermission = new TypeUserPermission();
    const formGroupData = this.getFormGroupData(typeUserPermission);
    this.typeUserPermissionForm = this.formBuilder.group(formGroupData);
  }

  /**
   * CREAR VALIDACIONES DEL FORMGROUP
   * @param model
   * @returns
   */
  private getFormGroupData(model: TypeUserPermission): object {
    return {
      ...this._formService.modelToFormGroupData(model),
      permisos_id: ['', [Validators.required, Validators.maxLength(50)]],
      tipo_usuarios_id: ['', [Validators.required, Validators.maxLength(50)]],
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
    this.dataModal.title = 'Crear Tipo de permiso de usuario';
    this.submitted = false;
    this.modalRef = this.modalService.show(content, { class: 'modal-md' });
    this.modalRef.onHide.subscribe(() => {});
  }


  /**
    * Save
  */
  saveData() {
    if(!this.typeUserPermissionForm.valid){
      this._sweetAlertService.showTopEnd({title: 'Validación de datos', message: 'Campos obligatorios vacíos', type: 'warning', timer: 1500});
    } else {
      const values: TypeUserPermission = this.typeUserPermissionForm.value;

      if(this.isNewData){
        // Crear nuevo registro
        this._sweetAlertService.showConfirmationAlert('¿Estas seguro de registrar el tipo de  permiso?').then((confirm) => {
          if(confirm.isConfirmed){
            this.saveDataApi(values);
          }
        });
      } else {
        // Actualizar datos
        this._sweetAlertService.showConfirmationAlert('¿Estas seguro de modificar el tipo de permiso?').then((confirm) => {
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
    this.dataModal.title = 'Editar tipo de permiso';
    this.isNewData = false;
    this.submitted = false;
    // Cargando datos al formulario
    var data = this.lists.find((data: { id: any; }) => data.id === id);
    const typeUserPermission = TypeUserPermission.cast(data);
    this.typeUserPermissionForm = this.formBuilder.group({...this._formService.modelToFormGroupData(typeUserPermission), id: [data.id]});
  }


  /**
   * Eliminar un registro
   * @param id id del registro a eliminar
   */
  deleteRow(id: any){
    this._sweetAlertService.showConfirmationAlert('¿Estas seguro de eliminar el tipo de permiso?').then((confirm) => {
      if(confirm.isConfirmed){
        this.deleteDataApi(id);
      }
    });
  }
}
