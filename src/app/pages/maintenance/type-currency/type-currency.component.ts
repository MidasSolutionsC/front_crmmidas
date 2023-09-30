import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Subscription, distinctUntilChanged } from 'rxjs';
import { Breadcrumb, CountryList, TypeCurrency, TypeCurrencyList, ResponseApi } from 'src/app/core/models';
import { ApiErrorFormattingService, CountryService, TypeCurrencyService, FormService, SweetAlertService } from 'src/app/core/services';

@Component({
  selector: 'app-type-currency',
  templateUrl: './type-currency.component.html',
  styleUrls: ['./type-currency.component.scss']
})
export class TypeCurrencyComponent {
  modalRef?: BsModalRef;

  dataModal = {
    title: 'Crear tipo de moneda',
  }

  // bread crumb items
  titleBreadCrumb: string = 'Tipo de monedas';
  breadCrumbItems: Array<{}>;
  
  // Form 
  isNewData: boolean = true;
  submitted: boolean = false;
  typeCurrencyForm: FormGroup;

  // Table data
  // content?: any;
  lists?: TypeCurrencyList[];

  // Paises
  listCountries?: CountryList[];
  
  private subscription: Subscription = new Subscription();

  constructor(
    private modalService: BsModalService, 
    private _countryService: CountryService,
    private _TypeCurrencyService: TypeCurrencyService,
    private _formService: FormService,
    private _apiErrorFormattingService: ApiErrorFormattingService,
    private _sweetAlertService: SweetAlertService,
    private formBuilder: FormBuilder) {
  }

  ngOnInit(): void {
    this.breadCrumbItems = Breadcrumb.casts([{ label: 'Mantenimiento'}, { label: 'Tipo de monedas', active: true }]);

    this.initForm();
    this.listDataApi();
    this.apiCountryList();

    this.subscription.add(
      this._TypeCurrencyService.listObserver$
      .pipe(
        distinctUntilChanged(
          (prevList, currentList) =>
            prevList.map(item => item.id).join(',') === currentList.map(item => item.id).join(',')
        )
      )
      .subscribe((list: TypeCurrencyList[]) => {
        this.lists = list;
      })
    );

    // Países
    this.subscription.add(
      this._countryService.listObserver$
      .pipe(distinctUntilChanged())
      .pipe(
        distinctUntilChanged((prevList, currentList) =>
            prevList.map(item => item.id).join(',') === currentList.map(item => item.id).join(',')
            )
          )
          .subscribe((list: CountryList[]) => {
            this.listCountries = list;
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
    this._TypeCurrencyService.getAll(forceRefresh).subscribe((response: ResponseApi) => {
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

  private saveDataApi(data: TypeCurrency){
    this._sweetAlertService.loadingUp()
    this.subscription.add(
      this._TypeCurrencyService.register(data).subscribe((response: ResponseApi) => {
        this._sweetAlertService.stop();
        if(response.code == 201){
          if(response.data[0]){
            const data: TypeCurrencyList = TypeCurrencyList.cast(response.data[0]);
            this._TypeCurrencyService.addObjectObserver(data);
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

  private updateDataApi(data: TypeCurrency, id: number){
    this._sweetAlertService.loadingUp()
    this._TypeCurrencyService.update(data, id).subscribe((response: ResponseApi) => {
      this._sweetAlertService.stop();
      if(response.code == 200){
        const data: TypeCurrencyList = TypeCurrencyList.cast(response.data[0]);
        this._TypeCurrencyService.updateObjectObserver(data);
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
    this._TypeCurrencyService.delete(id).subscribe((response: ResponseApi) => {
      this._sweetAlertService.stop();
      if(response.code == 200){
        const data: TypeCurrencyList = TypeCurrencyList.cast(response.data[0]);
        this._TypeCurrencyService.removeObjectObserver(data.id);
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
   * *******************************************************
   * OPERACIONES DE TABLAS FORÁNEAS
   * *******************************************************
   */
  // Países
  public apiCountryList(forceRefresh: boolean = false){
    this._sweetAlertService.loadingUp('Obteniendo datos')
    this._countryService.getAll(forceRefresh).subscribe((response: ResponseApi) => {
      this._sweetAlertService.stop();
      if(response.code == 200){
        this.listCountries = response.data;
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
    return this.typeCurrencyForm.controls;
  }

  /**
   * INICIAR FORMULARTO CON LAS VALIDACIONES
   * @param model 
   */
  private initForm(){
    const ypeCurrency = new TypeCurrency();
    const formGroupData = this.getFormGroupData(ypeCurrency);
    this.typeCurrencyForm = this.formBuilder.group(formGroupData);
  }

  /**
   * CREAR VALIDACIONES DEL FORMGROUP
   * @param model 
   * @returns 
   */
  private getFormGroupData(model: TypeCurrency): object {
    return {
      ...this._formService.modelToFormGroupData(model),
      nombre: ['', [Validators.required, Validators.maxLength(50)]],
      descripcion: ['', [Validators.nullValidator, Validators.maxLength(150)]],
      paises_id: ['', [Validators.nullValidator, Validators.maxLength(150)]],
      iso_code: ['', [Validators.required, Validators.maxLength(3)]],
      simbolo: ['', [Validators.required, Validators.maxLength(10)]],
      tasa_cambio: [undefined, [Validators.nullValidator]],
      fecha_actualizado: [undefined, [Validators.nullValidator]],
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
    this.dataModal.title = 'Crear divisa';
    this.submitted = false;
    this.modalRef = this.modalService.show(content, { class: 'modal-md' });
    this.modalRef.onHide.subscribe(() => {});
  }


  /**
    * Save
  */
  saveData() {
    if(!this.typeCurrencyForm.valid){
      this._sweetAlertService.showTopEnd({title: 'Validación de datos', message: 'Campos obligatorios vacíos', type: 'warning', timer: 1500});
    } else {
      const values: TypeCurrency = this.typeCurrencyForm.value;

      if(this.isNewData){
        // Crear nuevo registro
        this._sweetAlertService.showConfirmationAlert('¿Estas seguro de registrar el tipo de moneda?').then((confirm) => {
          if(confirm.isConfirmed){
            this.saveDataApi(values);
          }
        });
      } else {
        // Actualizar datos
        this._sweetAlertService.showConfirmationAlert('¿Estas seguro de modificar el tipo de moneda?').then((confirm) => {
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
    this.openModal(content);
    this.dataModal.title = 'Editar tipo de moneda';
    this.isNewData = false;
    // Cargando datos al formulario 
    var data = this.lists.find((data: { id: any; }) => data.id === id);
    const ypeCurrency = TypeCurrency.cast(data);
    this.typeCurrencyForm = this.formBuilder.group({
      ...this._formService.modelToFormGroupData(ypeCurrency), 
      id: [data.id],
      nombre: [data.nombre, [Validators.required, Validators.maxLength(50)]],
      descripcion: [data.descripcion, [Validators.nullValidator, Validators.maxLength(150)]],
      paises_id: [data.paises_id, [Validators.nullValidator, Validators.maxLength(150)]],
      iso_code: [data.iso_code, [Validators.required, Validators.maxLength(3)]],
      simbolo: [data.simbolo, [Validators.required, Validators.maxLength(10)]],
      tasa_cambio: [data.tasa_cambio, [Validators.nullValidator]],
      fecha_actualizado: [data.fecha_actualizado, [Validators.nullValidator]],
    });
  }


  /**
   * Eliminar un registro
   * @param id id del registro a eliminar
   */
  deleteRow(id: any){
    this._sweetAlertService.showConfirmationAlert('¿Estas seguro de eliminar el tipo de moneda?').then((confirm) => {
      if(confirm.isConfirmed){
        this.deleteDataApi(id);
      }
    });
  }
}
