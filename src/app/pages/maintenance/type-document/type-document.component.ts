import { Component, OnDestroy, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Breadcrumb, TypeDocument, TypeDocumentList } from 'src/app/core/models';
import { ResponseApi } from 'src/app/core/models/response-api.model';
import { User } from 'src/app/core/models/user.model';
import { TypeDocumentListService } from './list.service';
import { TypeDocumentService } from 'src/app/core/services/maintenance';
import { ApiErrorFormattingService, FormService, SweetAlertService } from 'src/app/core/services';
import { Subscription, catchError, distinctUntilChanged, map, throwError } from 'rxjs';

@Component({
  selector: 'app-type-document',
  templateUrl: './type-document.component.html',
  styleUrls: ['./type-document.component.scss']
})
export class TypeDocumentComponent implements OnInit, OnDestroy {
  modalRef?: BsModalRef;

  dataModal = {
    title: 'Agregar tipo de documento',
    isNew: true,
    btnCancel: 'Cancelar',
    btnAdd: 'Registrar'
  }

  // bread crumb items
  titleBreadCrumb: string = 'Tipo de documentos';
  breadCrumbItems: Array<{}>;
  typeDocumentForm!: UntypedFormGroup;
  submitted: boolean = false;

  // Table data
  // content?: any;
  lists?: TypeDocumentList[];
  
  private subscription: Subscription = new Subscription();

  constructor(
    private modalService: BsModalService, 
    private _typeDocumentService: TypeDocumentService,
    private _formService: FormService,
    private _apiErrorFormattingService: ApiErrorFormattingService,
    private _sweetAlertService: SweetAlertService,
    private formBuilder: UntypedFormBuilder) {
      
  }

  ngOnInit(): void {
    this.breadCrumbItems = Breadcrumb.casts([{ label: 'Mantenimiento'}, { label: 'Man. de tipos'}, { label: 'Tipos de documentos', active: true }]);

    this.initForm();
    this.listDocument();
    this.subscription.add(
      this._typeDocumentService.typeDocuments$
      // .pipe(distinctUntilChanged())
      .pipe(
        distinctUntilChanged(
          (prevList, currentList) =>
            prevList.map(item => item.id).join(',') === currentList.map(item => item.id).join(',')
        )
      )
      .subscribe((list: TypeDocumentList[]) => {
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
  public listDocument(forceRefresh: boolean = false){
    this._sweetAlertService.loadingUp('Obteniendo datos')
    this._typeDocumentService.getAll(forceRefresh).subscribe((response: ResponseApi) => {
      this._sweetAlertService.stop();
      if(response.code == 200){}
    }, (error: any) => {
      this._sweetAlertService.stop();
      console.log(error);
    });
  }

  private saveTypeDocumentApi(data: TypeDocument){
    this._sweetAlertService.loadingUp()
    this.subscription.add(
      this._typeDocumentService.register(data).subscribe((response: ResponseApi) => {
        this._sweetAlertService.stop();
        if(response.code == 201){
          const data: TypeDocumentList = TypeDocumentList.cast(response.data[0]);
          this._typeDocumentService.addObjectObserver(data);
          console.log(data);
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

  private updateTypeDocumentApi(data: TypeDocument, id: number){
    this._sweetAlertService.loadingUp()
    this._typeDocumentService.update(data, id).subscribe((response: ResponseApi) => {
      this._sweetAlertService.stop();
      if(response.code == 200){
        const data: TypeDocumentList = TypeDocumentList.cast(response.data[0]);
        this._typeDocumentService.updateObjectObserver(data);
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

  private deleteTypeDocumentApi(id: number){
    this._sweetAlertService.loadingUp()
    this._typeDocumentService.delete(id).subscribe((response: ResponseApi) => {
      this._sweetAlertService.stop();
      if(response.code == 200){
        const data: TypeDocumentList = TypeDocumentList.cast(response.data[0]);
        this._typeDocumentService.removeObjectObserver(data.id);
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
    return this.typeDocumentForm.controls;
  }

  /**
   * INICIAR FORMULARTO CON LAS VALIDACIONES
   * @param model 
   */
  private initForm(){
    const typeDocument = new TypeDocument();
    const formGroupData = this.getFormGroupData(typeDocument);
    this.typeDocumentForm = this.formBuilder.group(formGroupData);
  }

  /**
   * CREAR VALIDACIONES DEL FORMGROUP
   * @param model 
   * @returns 
   */
  private getFormGroupData(model: TypeDocument): object {
    return {
      ...this._formService.modelToFormGroupData(model),
      nombre: ['', [Validators.required, Validators.maxLength(50)]],
      abreviacion: ['', [Validators.required, Validators.maxLength(15)]],
      is_active: [true, [Validators.nullValidator]]
    }
  }


  
  /**
   * Open modal
   * @param content modal content
   */
  openModal(content: any) {
    this.initForm();
    this.dataModal.title = 'Agregar tipo de documento';
    this.dataModal.btnAdd = 'Registrar';
    this.dataModal.isNew = true;
    this.submitted = false;
    this.modalRef = this.modalService.show(content, { class: 'modal-md' });
    this.modalRef.onHide.subscribe(() => {
      console.log("Modal formulario cerrado");
    });
  }


  /**
    * Save
  */
  saveTypeDocument() {
    if (this.typeDocumentForm.valid) {
      if (this.typeDocumentForm.get('id')?.value) {
        const id = this.typeDocumentForm.get('id')?.value;
        const values = this.typeDocumentForm.value;

        this._sweetAlertService.showConfirmationAlert('¿Estas seguro de modificar el tipo de documento?').then((confirm) => {
          if(confirm.isConfirmed){
            this.updateTypeDocumentApi(values, id);
          }
        });

      } else {
        const values = this.typeDocumentForm.value;
        this._sweetAlertService.showConfirmationAlert('¿Estas seguro de registrar el tipo de documento?').then((confirm) => {
          if(confirm.isConfirmed){
            this.saveTypeDocumentApi(values);
          }
        });

      }
    }

    this.submitted = true
  }

  /**
 * Open Edit modal
 * @param content modal content
 */
  editDataGet(id: any, content: any) {
    this.submitted = false;
    this.modalRef = this.modalService.show(content, { class: 'modal-md' });
    this.dataModal.title = 'Editar tipo de documento';
    this.dataModal.btnAdd = 'Actualizar';

    // Cargando datos al formulario 
    var data = this.lists.find((data: { id: any; }) => data.id === id);
    const typeDocument = TypeDocument.cast(data);
    this.typeDocumentForm = this.formBuilder.group({...this._formService.modelToFormGroupData(typeDocument), id: [data.id]});
  }


  /**
   * Eliminar un registro
   * @param id id del registro a eliminar
   */
  deleteRow(id: any){
    this._sweetAlertService.showConfirmationAlert('¿Estas seguro de eliminar el tipo de documento?').then((confirm) => {
      if(confirm.isConfirmed){
        this.deleteTypeDocumentApi(id);
      }
    });
  }


}
