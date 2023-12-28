import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject, Subscription, debounceTime, distinctUntilChanged } from 'rxjs';
import { Breadcrumb, Campus, CampusList, CountryList, Pagination, PaginationResult, ResponseApi, ResponsePagination } from 'src/app/core/models';
import { UbigeoList } from 'src/app/core/models/api/maintenance/ubigeo.model';
import { ApiErrorFormattingService, CampusService, CountryService, FormService, SweetAlertService, UbigeoService } from 'src/app/core/services';
import { FileUploadUtil } from 'src/app/core/helpers';

@Component({
  selector: 'app-campus',
  templateUrl: './campus.component.html',
  styleUrls: ['./campus.component.scss']
})
export class CampusComponent {
  modalRef?: BsModalRef;
  @ViewChild('fileInput') fileInput: ElementRef<HTMLInputElement>;

  dataModal = {
    title: 'Crear Sedes',
  }

  // bread crumb items
  titleBreadCrumb: string = 'Sedes';
  breadCrumbItems: Array<{}>;
  
  // Form 
  isNewData: boolean = true;
  submitted: boolean = false;
  campusForm: FormGroup;


  
  // PAGINACIÓN
  countElements: number[] = [2, 5, 10, 25, 50, 100];
  pagination: BehaviorSubject<Pagination> = new BehaviorSubject<Pagination>({
    page: 1,
    perPage: 5,
    search: '',
    column: '',
    order: 'desc',
  });

  paginationResult: PaginationResult = new PaginationResult();

  // Table data
  // content?: any;
  lists?: CampusList[];
  
  // Paises
  listCountries?: CountryList[];
  
  // Paises
  selectedOptionUbigeo: any;
  listUbigeos?: UbigeoList[];

  // Archivos subidos
  uploadFiles: File[];

  // Previsualizar foto subido
  previewImage: any;
  
  private subscription: Subscription = new Subscription();

  constructor(
    private modalService: BsModalService, 
    private _countryService: CountryService,
    private _ubigeoService: UbigeoService,
    private _campusService: CampusService,
    private _formService: FormService,
    private _apiErrorFormattingService: ApiErrorFormattingService,
    private _sweetAlertService: SweetAlertService,
    private formBuilder: FormBuilder) {

  }

  ngOnInit(): void {
    this.breadCrumbItems = Breadcrumb.casts([{ label: 'Mantenimiento'}, { label: 'Sedes'}]);
    this.initForm();

    this.listDataApi();
    this.apiCountryList();
    this.searchOptionUbigeo('');

    this.subscription.add(
      this._campusService.listObserver$
      // .pipe(distinctUntilChanged())
      .pipe(
        distinctUntilChanged(
          (prevList, currentList) =>
            prevList.map(item => item.id).join(',') === currentList.map(item => item.id).join(',')
        )
      )
      .subscribe((list: CampusList[]) => {
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


    // EMIT CONSULTA PAGINACIÓN
    this.subscription.add(
      this.pagination.asObservable()
        // .pipe(distinctUntilChanged())
        .subscribe((pagination: Pagination) => {
          this.apiCampusListPagination()
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
    this._campusService.getAll(forceRefresh).subscribe((response: ResponseApi) => {
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

  private saveDataApi(data: Campus | FormData){
    this._sweetAlertService.loadingUp()
    this.subscription.add(
      this._campusService.register(data).subscribe((response: ResponseApi) => {
        this._sweetAlertService.stop();
        if(response.code == 201){
          if(response.data[0]){
            const data: CampusList = CampusList.cast(response.data[0]);
            this._campusService.addObjectObserver(data);
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

  private updateDataApi(data: Campus | FormData, id: number){
    this._sweetAlertService.loadingUp()
    this._campusService.update(data, id).subscribe((response: ResponseApi) => {
      this._sweetAlertService.stop();
      if(response.code == 200){
        const data: CampusList = CampusList.cast(response.data[0]);
        this._campusService.updateObjectObserver(data);
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
    this._campusService.delete(id).subscribe((response: ResponseApi) => {
      this._sweetAlertService.stop();
      if(response.code == 200){
        const data: CampusList = CampusList.cast(response.data[0]);
        this._campusService.removeObjectObserver(data.id);
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
   * ****************************************************************
   * OPERACIONES CON LA API - CARGA ASINCRONÍA
   * ****************************************************************
   */
    public apiCampusListPagination(): void {
      this.subscription.add(
        this._campusService.getPagination(this.pagination.getValue())
          .pipe(debounceTime(250))
          .subscribe((response: ResponsePagination) => {
            if (response.code == 200) {
              this.paginationResult = PaginationResult.cast(response.data);
              this.lists = response.data.data;
            }
  
            if (response.code == 500) {
              if (response.errors) {
                this._sweetAlertService.showTopEnd({ type: 'error', title: response.errors?.message, message: response.errors?.error });
              }
            }
          }, (error: any) => {
            if (error.message) {
              this._sweetAlertService.showTopEnd({ type: 'error', title: 'Error al cargar sedes', message: error.message, timer: 2500 });
            }
          })
      );
    }
  
  
    getPage(event: any) {
      const { page, itemsPerPage: perPage } = event;
      this.pagination.next({ ...this.pagination.getValue(), page, perPage })
    }
  
    getPageRefresh() {
      this.pagination.next({ ...this.pagination.getValue(), page: 1, perPage: 10 })
    }



  /**
   * OPERACIONES DE TABLAS FORÁNEAS
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
  
  // Buscar ubigeos
  public searchOptionUbigeo(search: string) {
    this._ubigeoService.getSearch({search}).subscribe((response: ResponseApi) => {
      this._sweetAlertService.stop();
      if(response.code == 200){
        this.listUbigeos = response.data;
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
  get f() {
    return this.campusForm.controls;
  }

  /**
   * INICIAR FORMULARTO CON LAS VALIDACIONES
   * @param model 
   */
  private initForm(){
    const campus = new Campus();
    const formGroupData = this.getFormGroupData(campus);
    this.campusForm = this.formBuilder.group(formGroupData);
  }

  /**
   * CREAR VALIDACIONES DEL FORMGROUP
   * @param model 
   * @returns 
   */
  private getFormGroupData(model: Campus): object {
    return {
      ...this._formService.modelToFormGroupData(model),
      paises_id: ['', [Validators.required, Validators.min(1)]],
      nombre: ['', [Validators.required, Validators.maxLength(50)]],
      codigo_ubigeo: ['', [Validators.nullValidator, Validators.maxLength(6)]],
      codigo_postal: ['', [Validators.nullValidator, Validators.maxLength(6)]],
      fecha_apertura: [new Date().toISOString().split('T')[0], [Validators.required]],
      file: [null, [Validators.nullValidator]],
      is_active: [1, [Validators.nullValidator]],
    }
  }

  /**
   * Subir archivo
  * @param fileInput elemento input
  */
  async onFileSelected(fileInput: HTMLInputElement){
    const { files, error } = await FileUploadUtil.handleFileUploadBase64(fileInput, ['jpg', 'jpeg', 'png'], 0);

    if (files.length > 0) {
      this.f.file.setValue('file_upload');
      this.previewImage = files[0].base64;
      this.uploadFiles = files.map((file) => file.file);
    } else {
      this._sweetAlertService.showTopEnd({title: 'Archivo seleccionado', message: error, type: 'error', timer: 2500});
    }
  }

  /**
   * ELIMINAR ARCHIVO SUBIDO
   */

  clearFile() {
    if(this.fileInput){
      this.fileInput.nativeElement.value = '';
    }
    this.f.file.setValue(null);
    this.previewImage = '';
    this.uploadFiles = [];
  }


  /**
   * CAPTURAR EL VALOR SELECCIONADO EN UBIGEO
   * @param selectedItem 
   */
  onSelectUbigeo(selectedItem: any) {
    if(selectedItem){
      this.f.ciudad.setValue(selectedItem.ciudad);
      // this.f.ciudad.disable();
    } else {
      this.f.ciudad.setValue('');
      // this.f.ciudad.enable();
    }
  }
  
  
  /**
   * Open modal
   * @param content modal content
   */
  openModal(content: any) {
    this.initForm();
    this.isNewData = true;
    this.dataModal.title = 'Crear Nueva Sede';
    this.submitted = false;
    this.previewImage = null;
    this.uploadFiles = [];
    this.modalRef = this.modalService.show(content, { class: 'modal-lg modal-dialog-scrollable' });
    this.modalRef.onHide.subscribe(() => {});
  }


  /**
    * Save
  */
  saveData() {
    if(!this.campusForm.valid){
      this._sweetAlertService.showTopEnd({title: 'Validación de datos', message: 'Campos obligatorios vacíos', type: 'warning', timer: 1500});
    } else {
      const values: Campus = this.campusForm.value;
      const formData = new FormData();

      // Iterar a través de las propiedades de 'values' y agregarlas al FormData
      for (const key of Object.keys(values)) {
        formData.append(key, values[key]);
      }

      if(this.uploadFiles && this.uploadFiles.length > 0){
        this.uploadFiles.forEach((file) => {
          formData.append('file', file);
        });
      } else {
        formData.delete('file');
      }
      
      if(this.isNewData){
        // Crear nuevo registro
        this._sweetAlertService.showConfirmationAlert('¿Estas seguro de registrar la sede?').then((confirm) => {
          if(confirm.isConfirmed){
            this.saveDataApi(formData);
          }
        });
      } else {
        // Actualizar datos
        this._sweetAlertService.showConfirmationAlert('¿Estas seguro de modificar la sede?').then((confirm) => {
          if(confirm.isConfirmed){
            this.updateDataApi(formData, values.id);
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
    this.modalRef = this.modalService.show(content, { class: 'modal-lg modal-dialog-scrollable' });
    this.dataModal.title = 'Editar sede';
    this.isNewData = false;
    this.submitted = false;
    this.previewImage = '';

    // Cargando datos al formulario 
    var data: any = this.lists.find((data: { id: any; }) => data.id === id);
    data.paises_id = parseInt(data.paises_id);
    const campus = Campus.cast(data);

    this.campusForm = this.formBuilder.group({
      ...this._formService.modelToFormGroupData(campus), 
      id: [data.id], 
      file: [null, []],      
    });

    this.searchOptionUbigeo(data.ubigeos_ciudad);
  }


  /**
   * Eliminar un registro
   * @param id id del registro a eliminar
   */
  deleteRow(id: any){
    this._sweetAlertService.showConfirmationAlert('¿Estas seguro de eliminar la sede?').then((confirm) => {
      if(confirm.isConfirmed){
        this.deleteDataApi(id);
      }
    });
  }
}
