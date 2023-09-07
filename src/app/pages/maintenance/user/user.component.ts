import { ChangeDetectorRef, Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Subscription, debounceTime, distinctUntilChanged } from 'rxjs';
import { Breadcrumb, CountryList, Pagination, ResponseApi, ResponsePagination, TypeDocumentList, TypeUserList, UserPerson, UserPersonList } from 'src/app/core/models';
import { ApiErrorFormattingService, CountryService, FormService, SweetAlertService, TypeDocumentService, TypeUserService, UserService } from 'src/app/core/services';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent {
  modalRef?: BsModalRef;

  dataModal = {
    title: 'Crear usuarios',
  }

  // bread crumb items
  titleBreadCrumb: string = 'Usuarios';
  breadCrumbItems: Array<{}>;
  
  // Form 
  isNewData: boolean = true;
  submitted: boolean = false;
  userForm: FormGroup;

  // TABLE USUARIOS - SERVER SIDE
  page: number = 1;
  perPage: number = 5;
  search: string = '';
  column: string = '';
  order: 'asc' | 'desc' = 'desc';
  countElements: number[] = [5, 10, 25, 50, 100];
  total: number = 0;
  pagination: Pagination = new Pagination();


  // Table data
  // content?: any;
  lists?: UserPersonList[] = [];

  // Tipo documentos
  listDocuments?: TypeDocumentList[];

  // Paises
  listCountries?: CountryList[];

  // Paises
  listTypeUsers?: TypeUserList[];
  
  private subscription: Subscription = new Subscription();

  constructor(
    private cdr: ChangeDetectorRef,
    private modalService: BsModalService, 
    private _typeDocumentService: TypeDocumentService,
    private _countryService: CountryService,
    private _userService: UserService,
    private _typeUserService: TypeUserService,
    private _formService: FormService,
    private _apiErrorFormattingService: ApiErrorFormattingService,
    private _sweetAlertService: SweetAlertService,
    private formBuilder: FormBuilder) {

  }

  ngOnInit(): void {
    this.breadCrumbItems = Breadcrumb.casts([{ label: 'Mantenimiento'}, { label: 'Usuarios', active: true }]);

    this.initForm();
    // this.listDataApi();
    this.apiCountryList();
    this.apiTypeDocumentList();
    this.apiTypeUserList();
    this.apiUserListPagination();

    // Usuarios
    // this.subscription.add(
    //   this._userService.listObserver$
    //   .pipe(
    //     distinctUntilChanged(
    //       (prevList, currentList) =>
    //         prevList.map(item => item.id).join(',') === currentList.map(item => item.id).join(',')
    //     )
    //   )
    //   .subscribe((list: UserPersonList[]) => {
    //     this.lists = list;
    //   })
    // );

    // Tipo de documentos
    this.subscription.add(
      this._typeDocumentService.typeDocuments$
      .pipe(distinctUntilChanged())
      .pipe(
        distinctUntilChanged((prevList, currentList) =>
            prevList.map(item => item.id).join(',') === currentList.map(item => item.id).join(',')
            )
          )
          .subscribe((list: TypeDocumentList[]) => {
            this.listDocuments = list;
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

    // Tipo de usuarios
    this.subscription.add(
      this._typeUserService.listObserver$
      .pipe(distinctUntilChanged())
      .pipe(
        distinctUntilChanged((prevList, currentList) =>
            prevList.map(item => item.id).join(',') === currentList.map(item => item.id).join(',')
            )
          )
          .subscribe((list: TypeUserList[]) => {
            this.listTypeUsers = list;
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
    this._userService.getAll(forceRefresh).subscribe((response: ResponseApi) => {
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

  private saveDataApi(data: UserPerson){
    this._sweetAlertService.loadingUp()
    this.subscription.add(
      this._userService.register(data).subscribe((response: ResponseApi) => {
        this._sweetAlertService.stop();
        if(response.code == 201){
          if(response.data){
            const {person, user} = response.data;
            const dataUser = {...person, ...user.data};
            const data: UserPersonList = UserPersonList.cast(dataUser);
            this._userService.addObjectObserver(data);
          }

          this.apiUserListPagination();
          this.modalRef?.hide();
        }

        if(response.code == 422){
          if(response.errors){
            const {user_errors, person_errors} = response.errors;
            let textErrors = '';

            if(person_errors){
              textErrors += this._apiErrorFormattingService.formatAsHtml(person_errors);
            }

            if(user_errors){
              textErrors += this._apiErrorFormattingService.formatAsHtml(user_errors);
            }

            if(textErrors != ''){
              this._sweetAlertService.showTopEnd({type: 'error', title: response.message, message: textErrors});
            }

          }
          
        }

        if(response.code == 500){
          if(response.errors){
            this._sweetAlertService.showTopEnd({type: 'error', title: response.errors?.message, message: response.errors?.error});
          }
        }
      }, (error) => {
        this._sweetAlertService.stop();
        if(error?.error){
          console.log(error);
          this._sweetAlertService.showTopEnd({type: 'error', title: 'Error', message: error?.error?.message});

        }
      })
    )
  }

  private updateDataApi(data: UserPerson, id: number){
    this._sweetAlertService.loadingUp()
    this._userService.update(data, id).subscribe((response: ResponseApi) => {
      this._sweetAlertService.stop();
      if(response.code == 200){
        if(response.data){
          const {person, user} = response.data;
          const dataUser = {...person, ...user};
          const data: UserPersonList = UserPersonList.cast(dataUser);
          this._userService.updateObjectObserver(data);
        }

        this.apiUserListPagination();
        this.modalRef?.hide();
      }

      if(response.code == 422){
        if(response.errors){
          // const textErrors = this._apiErrorFormattingService.formatAsHtml(response.errors);
          // this._sweetAlertService.showTopEnd({type: 'error', title: response.message, message: textErrors});

          const {user_errors, person_errors} = response.errors;
          let textErrors = '';

          if(person_errors){
            textErrors += this._apiErrorFormattingService.formatAsHtml(person_errors);
          }

          if(user_errors){
            textErrors += this._apiErrorFormattingService.formatAsHtml(user_errors);
          }

          if(textErrors != ''){
            this._sweetAlertService.showTopEnd({type: 'error', title: response.message, message: textErrors});
          }

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
    this._userService.delete(id).subscribe((response: ResponseApi) => {
      this._sweetAlertService.stop();
      if(response.code == 200){
        const data: UserPersonList = UserPersonList.cast(response.data[0]);
        this._userService.removeObjectObserver(data.id);
        this.apiUserListPagination();
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
   * ***************************************************************
   * SERVER SIDE - USERS
   * ***************************************************************
   */
  apiUserListPagination(): void {
    this.subscription.add(
      this._userService.getPagination({
        page: this.page.toString(),
        perPage: this.perPage.toString(),
        search: this.search,
        column: this.column,
        order: this.order
      })
      .pipe(debounceTime(250))
      .subscribe((response: ResponsePagination) => {
        if(response.code == 200){
          this.pagination = Pagination.cast(response.data);
          this.lists = response.data.data;
          this.page = response.data.current_page;
          this.total = response.data.total;
        }
        
        if(response.code == 500){
          if(response.errors){
            this._sweetAlertService.showTopEnd({type: 'error', title: response.errors?.message, message: response.errors?.error});
          }
        }
      }, (error: any) => {
        if(error.message){
          this._sweetAlertService.showTopEnd({type: 'error', title: 'Error al cargar usuarios', message: error.message, timer: 2500});
        }
      })
    ); 
  }

  getPage(event: any){
    const {page, itemsPerPage} = event;
    this.page = page;
    this.perPage = itemsPerPage;
    this.cdr.detectChanges();

    setTimeout(() => {
      this.apiUserListPagination();
    }, 0);
  }

  getPageRefresh(){
    this.page = 1;
    this.perPage = 10;
    this.cdr.detectChanges();

    setTimeout(() => {
      this.apiUserListPagination();
    }, 0);
  }

  
  /**
   * OPERACIONES DE TABLAS FORÁNEAS
   */
  // Tipo documento
  public apiTypeDocumentList(forceRefresh: boolean = false){
    this._sweetAlertService.loadingUp('Obteniendo datos')
    this._typeDocumentService.getAll(forceRefresh).subscribe((response: ResponseApi) => {
      this._sweetAlertService.stop();
      if(response.code == 200){
        this.listDocuments = response.data;
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
  
  // Tipo de usuario
  public apiTypeUserList(forceRefresh: boolean = false){
    this._sweetAlertService.loadingUp('Obteniendo datos')
    this._typeUserService.getAll(forceRefresh).subscribe((response: ResponseApi) => {
      this._sweetAlertService.stop();
      if(response.code == 200){
        this.listTypeUsers = response.data;
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
    return this.userForm.controls;
  }

  /**
   * INICIAR FORMULARTO CON LAS VALIDACIONES
   * @param model 
   */
  private initForm(){
    const userPerson = new UserPerson();
    const formGroupData = this.getFormGroupData(userPerson);
    this.userForm = this.formBuilder.group(formGroupData);
  }

  /**
   * CREAR VALIDACIONES DEL FORMGROUP
   * @param model 
   * @returns 
   */
  private getFormGroupData(model: UserPerson): object {
    return {
      ...this._formService.modelToFormGroupData(model),
      nombres: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(50)]],
      apellido_paterno: ['', [Validators.required, Validators.maxLength(50)]],
      apellido_materno: ['', [Validators.required, Validators.maxLength(50)]],
      paises_id: ['', [Validators.required, Validators.min(1)]],
      tipo_usuarios_id: ['', [Validators.required, Validators.min(1)]],
      tipo_documentos_id: ['', [Validators.required, Validators.min(1)]],
      documento: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(11)]],
      nombre_usuario: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(15), Validators.pattern(/^[^\s]+$/)]],
      clave: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(16)]],
      clave_confirmation: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(16)]],
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
    this.dataModal.title = 'Crear usuario';
    this.submitted = false;
    this.modalRef = this.modalService.show(content, { class: 'modal-md' });
    this.modalRef.onHide.subscribe(() => {});
  }


  /**
    * Save
  */
  saveData() {
    if(!this.userForm.valid){
      this._sweetAlertService.showTopEnd({title: 'Validación de datos', message: 'Campos obligatorios vacíos', type: 'warning', timer: 1500});
    } else {
      const values: UserPerson = this.userForm.value;

      if(this.isNewData){
        // Crear nuevo registro
        this._sweetAlertService.showConfirmationAlert('¿Estas seguro de registrar el usuario?').then((confirm) => {
          if(confirm.isConfirmed){
            this.saveDataApi(values);
          }
        });
      } else {
        // Actualizar datos
        this._sweetAlertService.showConfirmationAlert('¿Estas seguro de modificar el usuario?').then((confirm) => {
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
    const userPerson = UserPerson.cast(data);
    this.userForm = this.formBuilder.group({
      ...this._formService.modelToFormGroupData(userPerson), 
      personas_id: [data.personas_id], 
      clave: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(16)]],
      clave_confirmation: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(16)]],
      id: [data.id]
    });
  }


  /**
   * Eliminar un registro
   * @param id id del registro a eliminar
   */
  deleteRow(id: any){
    this._sweetAlertService.showConfirmationAlert('¿Estas seguro de eliminar el usuario?').then((confirm) => {
      if(confirm.isConfirmed){
        this.deleteDataApi(id);
      }
    });
  }
}
