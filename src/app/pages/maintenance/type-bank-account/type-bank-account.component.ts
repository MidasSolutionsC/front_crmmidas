import { Component } from '@angular/core';
import { FormControl, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Subscription, distinctUntilChanged } from 'rxjs';
import { Breadcrumb, ResponseApi, TypeBankAccount, TypeBankAccountList } from 'src/app/core/models';
import { ApiErrorFormattingService, FormService, SweetAlertService } from 'src/app/core/services';
import { TypeBankAccountService } from 'src/app/core/services/maintenance/type-bank-account.service';

@Component({
  selector: 'app-type-bank-account',
  templateUrl: './type-bank-account.component.html',
  styleUrls: ['./type-bank-account.component.scss']
})
export class TypeBankAccountComponent {
  modalRef?: BsModalRef;

  dataModal = {
    title: 'Agregar tipo de cuentas bancarias',
    isNew: true,
    btnCancel: 'Cancelar',
    btnAdd: 'Registrar'
  }

  // bread crumb items
  titleBreadCrumb: string = 'Tipo de cuentas bancarias';
  breadCrumbItems: Array<{}>;
  typeBankAccountForm!: UntypedFormGroup;
  submitted: boolean = false;

  // Table data
  // content?: any;
  lists?: TypeBankAccountList[];
  
  private subscription: Subscription = new Subscription();

  constructor(
    private modalService: BsModalService, 
    private _typeBankAccountService: TypeBankAccountService,
    private _formService: FormService,
    private _apiErrorFormattingService: ApiErrorFormattingService,
    private _sweetAlertService: SweetAlertService,
    private formBuilder: UntypedFormBuilder) {
      
  }

  ngOnInit(): void {
    this.breadCrumbItems = Breadcrumb.casts([{ label: 'Mantenimiento'}, { label: 'Man. de tipos'}, { label: 'Tipos de cuenta bancarias', active: true }]);

    this.initForm();
    this.listDataApi();
    this.subscription.add(
      this._typeBankAccountService.listObserver$
      // .pipe(distinctUntilChanged())
      .pipe(
        distinctUntilChanged(
          (prevList, currentList) =>
            prevList.map(item => item.id).join(',') === currentList.map(item => item.id).join(',')
        )
      )
      .subscribe((list: TypeBankAccountList[]) => {
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
    this._typeBankAccountService.getAll(forceRefresh).subscribe((response: ResponseApi) => {
      this._sweetAlertService.stop();
      if(response.code == 200){}

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

  private saveDataApi(data: TypeBankAccount){
    this._sweetAlertService.loadingUp()
    this.subscription.add(
      this._typeBankAccountService.register(data).subscribe((response: ResponseApi) => {
        this._sweetAlertService.stop();
        if(response.code == 201){
          const data: TypeBankAccountList = TypeBankAccountList.cast(response.data[0]);
          this._typeBankAccountService.addObjectObserver(data);
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

  private updateDataApi(data: TypeBankAccount, id: number){
    this._sweetAlertService.loadingUp()
    this._typeBankAccountService.update(data, id).subscribe((response: ResponseApi) => {
      this._sweetAlertService.stop();
      if(response.code == 200){
        const data: TypeBankAccountList = TypeBankAccountList.cast(response.data[0]);
        this._typeBankAccountService.updateObjectObserver(data);
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
    this._typeBankAccountService.delete(id).subscribe((response: ResponseApi) => {
      this._sweetAlertService.stop();
      if(response.code == 200){
        const data: TypeBankAccountList = TypeBankAccountList.cast(response.data[0]);
        this._typeBankAccountService.removeObjectObserver(data.id);
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
    return this.typeBankAccountForm.controls;
  }

  /**
   * INICIAR FORMULARTO CON LAS VALIDACIONES
   * @param model 
   */
  private initForm(){
    const typeBankAccount = new TypeBankAccount();
    const formGroupData = this.getFormGroupData(typeBankAccount);
    this.typeBankAccountForm = this.formBuilder.group(formGroupData);
  }

  /**
   * CREAR VALIDACIONES DEL FORMGROUP
   * @param model 
   * @returns 
   */
  private getFormGroupData(model: TypeBankAccount): object {
    return {
      ...this._formService.modelToFormGroupData(model),
      nombre: ['', [Validators.required, Validators.maxLength(50)]],
      abreviacion: ['', [Validators.required, Validators.maxLength(15)]],
      // descripcion: ['', [Validators.nullValidator, Validators.maxLength(150)]],
      is_active: [true, [Validators.nullValidator]],
      descripcion: new FormControl(
        {
          value: model.descripcion,
          disabled: false
        },
        [Validators.nullValidator, Validators.minLength(5)]
      ),
    }
  }


  
  /**
   * Open modal
   * @param content modal content
   */
  openModal(content: any) {
    this.initForm();
    this.dataModal.title = 'Agregar tipo de cuenta bancarias';
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
  saveData() {
    if (this.typeBankAccountForm.valid) {
      if (this.typeBankAccountForm.get('id')?.value) {
        const id = this.typeBankAccountForm.get('id')?.value;
        const values = this.typeBankAccountForm.value;

        this._sweetAlertService.showConfirmationAlert('¿Estas seguro de modificar el tipo de cuenta bancaria?').then((confirm) => {
          if(confirm.isConfirmed){
            this.updateDataApi(values, id);
          }
        });

      } else {
        const values = this.typeBankAccountForm.value;
        this._sweetAlertService.showConfirmationAlert('¿Estas seguro de registrar el tipo de cuenta bancaria?').then((confirm) => {
          if(confirm.isConfirmed){
            this.saveDataApi(values);
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
    this.dataModal.title = 'Editar tipo de cuenta bancaria';
    this.dataModal.btnAdd = 'Actualizar';

    // Cargando datos al formulario 
    var data = this.lists.find((data: { id: any; }) => data.id === id);
    const typeBankAccount = TypeBankAccount.cast(data);
    this.typeBankAccountForm = this.formBuilder.group({...this._formService.modelToFormGroupData(typeBankAccount), id: [data.id]});
  }


  /**
   * Eliminar un registro
   * @param id id del registro a eliminar
   */
  deleteRow(id: any){
    this._sweetAlertService.showConfirmationAlert('¿Estas seguro de eliminar el tipo de documento?').then((confirm) => {
      if(confirm.isConfirmed){
        this.deleteDataApi(id);
      }
    });
  }

}
