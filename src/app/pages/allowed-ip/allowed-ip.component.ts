import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Subscription, distinctUntilChanged } from 'rxjs';
import { Breadcrumb, IpAllowed, IpAllowedList, ResponseApi } from 'src/app/core/models';
import { ApiErrorFormattingService, IpAllowedService, FormService, SweetAlertService } from 'src/app/core/services';

@Component({
  selector: 'app-allowed-ip',
  templateUrl: './allowed-ip.component.html',
  styleUrls: ['./allowed-ip.component.scss']
})
export class AllowedIpComponent implements OnInit, OnDestroy {
  modalRef?: BsModalRef;

  dataModal = {
    title: 'Registrar IP permitida',
  }

  // bread crumb items
  titleBreadCrumb: string = 'IPS PERMITIDAS';
  breadCrumbItems: Array<{}>;

  // Form 
  isNewData: boolean = true;
  submitted: boolean = false;
  ipAllowedForm: FormGroup;


  // Table data
  // content?: any;
  lists?: IpAllowedList[];

  private subscription: Subscription = new Subscription();

  constructor(
    private modalService: BsModalService,
    private _ipAllowedService: IpAllowedService,
    private _formService: FormService,
    private _apiErrorFormattingService: ApiErrorFormattingService,
    private _sweetAlertService: SweetAlertService,
    private formBuilder: FormBuilder) {

  }

  ngOnInit(): void {
    this.breadCrumbItems = Breadcrumb.casts([{ label: 'Configuraciones' }, { label: 'IPs permitidas', active: true }]);

    this.initForm();
    this.listDataApi();

    this.subscription.add(
      this._ipAllowedService.listObserver$
        // .pipe(distinctUntilChanged())
        .pipe(
          distinctUntilChanged(
            (prevList, currentList) =>
              prevList.map(item => item.id).join(',') === currentList.map(item => item.id).join(',')
          )
        )
        .subscribe((list: IpAllowedList[]) => {
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
  public listDataApi(forceRefresh: boolean = false) {
    this._sweetAlertService.loadingUp('Obteniendo datos')
    this._ipAllowedService.getAll(forceRefresh).subscribe((response: ResponseApi) => {
      this._sweetAlertService.stop();
      if (response.code == 200) {
        this.lists = response.data;
      }

      if (response.code == 500) {
        if (response.errors) {
          this._sweetAlertService.showTopEnd({ type: 'error', title: response.errors?.message, message: response.errors?.error });
        }
      }
    }, (error: any) => {
      this._sweetAlertService.stop();
      console.log(error);
    });
  }

  private saveDataApi(data: IpAllowed) {
    this._sweetAlertService.loadingUp()
    this.subscription.add(
      this._ipAllowedService.register(data).subscribe((response: ResponseApi) => {
        this._sweetAlertService.stop();
        if (response.code == 201) {
          if (response.data[0]) {
            const data: IpAllowedList = IpAllowedList.cast(response.data[0]);
            this._ipAllowedService.addObjectObserver(data);
          }

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
      }, (error) => {
        this._sweetAlertService.stop();
        console.log(error);
      })
    )
  }

  private updateDataApi(data: IpAllowed, id: number) {
    this._sweetAlertService.loadingUp()
    this._ipAllowedService.update(data, id).subscribe((response: ResponseApi) => {
      this._sweetAlertService.stop();
      if (response.code == 200) {
        const data: IpAllowedList = IpAllowedList.cast(response.data[0]);
        this._ipAllowedService.updateObjectObserver(data);
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

  private deleteDataApi(id: number) {
    this._sweetAlertService.loadingUp()
    this._ipAllowedService.delete(id).subscribe((response: ResponseApi) => {
      this._sweetAlertService.stop();
      if (response.code == 200) {
        const data: IpAllowedList = IpAllowedList.cast(response.data[0]);
        this._ipAllowedService.removeObjectObserver(data.id);
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
    return this.ipAllowedForm.controls;
  }

  /**
   * INICIAR FORMULARTO CON LAS VALIDACIONES
   * @param model 
   */
  private initForm() {
    const country = new IpAllowed();
    const formGroupData = this.getFormGroupData(country);
    this.ipAllowedForm = this.formBuilder.group(formGroupData);
  }

  /**
   * CREAR VALIDACIONES DEL FORMGROUP
   * @param model 
   * @returns 
   */
  private getFormGroupData(model: IpAllowed): object {
    return {
      ...this._formService.modelToFormGroupData(model),
      ip: ['', [Validators.required, Validators.maxLength(100)]],
      descripcion: ['', [Validators.required, Validators.maxLength(250)]],
      // is_active: [true, [Validators.nullValidator]],
    }
  }



  /**
   * Open modal
   * @param content modal content
   */
  openModal(content: any) {
    this.initForm();
    this.isNewData = true;
    this.dataModal.title = 'Crear IP';
    this.submitted = false;
    this.modalRef = this.modalService.show(content, { class: 'modal-md' });
    this.modalRef.onHide.subscribe(() => { });
  }


  /**
    * Save
  */
  saveData() {
    if (!this.ipAllowedForm.valid) {
      console.log(this.ipAllowedForm)
      this._sweetAlertService.showTopEnd({ title: 'Validación de datos', message: 'Campos obligatorios vacíos', type: 'warning', timer: 1500 });
    } else {
      const values: IpAllowed = this.ipAllowedForm.value;

      if (this.isNewData) {
        // Crear nuevo registro
        this._sweetAlertService.showConfirmationAlert('¿Estas seguro de registrar la dirección IP?').then((confirm) => {
          if (confirm.isConfirmed) {
            this.saveDataApi(values);
          }
        });
      } else {
        // Actualizar datos
        this._sweetAlertService.showConfirmationAlert('¿Estas seguro de modificar la dirección IP?').then((confirm) => {
          if (confirm.isConfirmed) {
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
    this.dataModal.title = 'Editar IP';
    this.isNewData = false;
    this.submitted = false;
    // Cargando datos al formulario 
    var data = this.lists.find((data: { id: any; }) => data.id === id);
    const country = IpAllowed.cast(data);
    this.ipAllowedForm = this.formBuilder.group({ ...this._formService.modelToFormGroupData(country), id: [data.id] });
  }


  /**
   * Eliminar un registro
   * @param id id del registro a eliminar
   */
  deleteRow(id: any) {
    this._sweetAlertService.showConfirmationAlert('¿Estas seguro de eliminar la dirección IP?').then((confirm) => {
      if (confirm.isConfirmed) {
        this.deleteDataApi(id);
      }
    });
  }
}
