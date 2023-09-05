import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Subscription, distinctUntilChanged } from 'rxjs';
import { Breadcrumb, CampusList, CountryList, Group, GroupList, Pagination, ResponseApi, ResponsePagination, TypeDocumentList, TypeUserList, UserPersonList } from 'src/app/core/models';
import { ApiErrorFormattingService, CampusService, CountryService, FormService, GroupService, SweetAlertService, TypeDocumentService, TypeUserService, UserService } from 'src/app/core/services';

@Component({
  selector: 'app-group',
  templateUrl: './group.component.html',
  styleUrls: ['./group.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GroupComponent {
  public get modalService(): BsModalService {
    return this._modalService;
  }
  public set modalService(value: BsModalService) {
    this._modalService = value;
  }
  modalRef?: BsModalRef;

  dataModal = {
    title: 'Crear grupo',
  }

  // bread crumb items
  titleBreadCrumb: string = 'Grupos';
  breadCrumbItems: Array<{}>;
  
  // Form 
  isNewData: boolean = true;
  submitted: boolean = false;
  groupForm: FormGroup;

  // Formulario para buscar usuarios
  userSearchForm: FormGroup;


  // Table data
  // content?: any;
  lists?: GroupList[];

  // Sedes
  listDocuments?: TypeDocumentList[];
  listCampus?: CampusList[];


  // Listar usuarios
  listUsers?: UserPersonList[];
  listUserSelected?: UserPersonList[] = [];
  listUserSelectedId?: any[] = [];

  // PAGINATION
  countTableUser: number;
  pageTableUser: number = 1;
  limitTableUser: number = 10;

  // DATA TABLE
  rows: UserPersonList[];
  columns: any[];
  count: number;
  offset: number = 0;
  limit: number = 2;
  loadingIndicator: boolean = true;
  rorderable: boolean = true;
  sorts: any[] = [];

  // TABLE USUARIOS - SERVER SIDE
  page: number = 1;
  perPage: number = 5;
  search: string = '';
  column: string = '';
  order: 'asc' | 'desc' = 'desc';
  countElements: number[] = [2, 5, 10, 25, 50, 100];
  total: number = 3;
  pagination: Pagination;

  // CHECKED USERS
  selectAll: boolean = false;
  
  private subscription: Subscription = new Subscription();

  constructor(
    private _modalService: BsModalService, 
    private _typeDocumentService: TypeDocumentService,
    private _campusService: CampusService,
    private _userService: UserService,
    private _groupService: GroupService,
    private _formService: FormService,
    private _apiErrorFormattingService: ApiErrorFormattingService,
    private _sweetAlertService: SweetAlertService,
    private formBuilder: FormBuilder) {

  }

  ngOnInit(): void {
    this.breadCrumbItems = Breadcrumb.casts([{ label: 'Mantenimiento'}, { label: 'Grupos', active: true }]);

    // Instancias de formGroup
    this.initForm();
    this.initFormUserSearch();

    // Lista de datos
    this.listDataApi();

    this.apiTypeDocumentList();
    this.apiCampusList();


    // PAGINACIÓN DATA TABLE
    this.columns = [
      {name: 'id', prop: 'id'},
      {name: 'usuario', prop: 'nombre_usuario'},
      {name: 'nombres', prop: 'personas_nombres'},
      {name: 'apellidos', prop: 'personas_apellido_paterno'},
    ];
    this.getPageDataTable();

    this.subscription.add(
      this._groupService.listObserver$
      // .pipe(distinctUntilChanged())
      .pipe(
        distinctUntilChanged(
          (prevList, currentList) =>
            prevList.map(item => item.id).join(',') === currentList.map(item => item.id).join(',')
        )
      )
      .subscribe((list: GroupList[]) => {
        this.lists = list;
      })
    );

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

    // Sedes
    this.subscription.add(
      this._campusService.listObserver$
      .pipe(distinctUntilChanged())
      .pipe(
        distinctUntilChanged((prevList, currentList) =>
            prevList.map(item => item.id).join(',') === currentList.map(item => item.id).join(',')
            )
          )
          .subscribe((list: CampusList[]) => {
            this.listCampus = list;
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
    this._groupService.getAll(forceRefresh).subscribe((response: ResponseApi) => {
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

  private saveDataApi(data: Group){
    this._sweetAlertService.loadingUp()
    this.subscription.add(
      this._groupService.register(data).subscribe((response: ResponseApi) => {
        this._sweetAlertService.stop();
        if(response.code == 201){
          if(response.data){
            const {group, member} = response.data;
            const object = {...group};
            const data: GroupList = GroupList.cast(object);
            this._groupService.addObjectObserver(data);
          }

          this.modalRef?.hide();
        }

        if(response.code == 422){
          if(response.errors){
            const {group_errors, member_errors} = response.errors;
            let textErrors = '';

            if(group_errors){
              textErrors += this._apiErrorFormattingService.formatAsHtml(group_errors);
            }

            if(member_errors){
              textErrors += this._apiErrorFormattingService.formatAsHtml(member_errors);
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

  private updateDataApi(data: Group, id: number){
    this._sweetAlertService.loadingUp()
    this._groupService.update(data, id).subscribe((response: ResponseApi) => {
      this._sweetAlertService.stop();
      if(response.code == 200){
        if(response.data){
          const {person, user} = response.data;
          const dataUser = {...person, ...user};
          const data: GroupList = GroupList.cast(dataUser);
          this._groupService.updateObjectObserver(data);
        }

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
    this._groupService.delete(id).subscribe((response: ResponseApi) => {
      this._sweetAlertService.stop();
      if(response.code == 200){
        const data: GroupList = GroupList.cast(response.data[0]);
        this._groupService.removeObjectObserver(data.id);
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
  
  // Sedes
  public apiCampusList(forceRefresh: boolean = false){
    this._sweetAlertService.loadingUp('Obteniendo datos')
    this._campusService.getAll(forceRefresh).subscribe((response: ResponseApi) => {
      this._sweetAlertService.stop();
      if(response.code == 200){
        this.listCampus = response.data;
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
   * TABLA DE DATOS DE USUARIOS - SERVER SIDE
   */

  // DATA TABLE
  getPageDataTable(): void {
    this.loadingIndicator = true;
    this._userService.getServerSide({
      page: this.page.toString(),
      perPage: this.perPage.toString(),
      search: this.search,
      column: this.column,
      order: this.order
    }).subscribe((response: ResponsePagination) => {
      if(response.code == 200){
        this.pagination = Pagination.cast(response.data);
        this.page = response.data.current_page;
        // this.listUsers = this.pagination.data;
      }
    }, (error: any) => {
      console.log(error);
    });
  }

  // getPage(): void {
  //   this._userService.getPagination({
  //     params: {
  //       offset: ((this.pageTableUser - 1) * this.limitTableUser).toString(),
  //       limit: this.limitTableUser.toString()
  //     }
  //   }).subscribe((response: ResponseApi) => {
  //     if(response.code == 200){
  //       this.listUsers = response.data.data;
  //       this.countTableUser = response.data.total;
  //     }
  //   });
  // }
  

  // onPage(event: any): void {
  //   this.offset = event.offset;
  //   this.limit = event.limit;
  //   this.getPageDataTable();
  // }

  // onSort(event: any): void {
  //   this.sorts = event.sorts;
  //   this.getPageDataTable();
  // }


  /**
   * SELECCIÓN DE USUARIOS - INTEGRANTES DEL  GRUPO
   */


  
  /**
   * Seleccionar o quitar a todos os usuarios
   */
  toggleAllSelection() {
    if (!this.selectAll) {
      this.listUserSelected = [];
    } else {
      this.listUserSelected = this.pagination.data.map((obj: any) => obj);
    }
  }

  /**
   * Activar o desactivar / usuario agregado
   * @param id id del usuario
   */
  toggleSelection(data: UserPersonList) {
    const index = this.listUserSelected.findIndex((item) => item.id === data.id);
    if (index === -1) {
      this.listUserSelected.push(data); // Agregar el ID si no está en la lista
    } else {
      this.listUserSelected.splice(index, 1); // Quitar el ID si ya está en la lista
    }
  }

  /**
   * Verificar si el usuario se encuentra agregado en el array de usuarios seleccionados para agregar al grupo
   * @param id id del usuario
   * @returns true o false
   */
  getCheckedRowUser(id: any){
    return this.listUserSelected.some((item) => item.id === id);
  }


  /**
   * PROCESAR LOS INTEGRANTES SELCCIONADOS
   */
  processingMemberGroup(){
    this.listUserSelectedId = this.listUserSelected.map((data) => data.id);
  }



  /**
   * Form data get GROUP
   */
  get f() {
    return this.groupForm.controls;
  }

  /**
   * INICIAR FORMULARTO CON LAS VALIDACIONES
   * @param model 
   */
  private initForm(){
    const group = new Group();
    const formGroupData = this.getFormGroupData(group);
    this.groupForm = this.formBuilder.group(formGroupData);
  }

  /**
   * CREAR VALIDACIONES DEL FORMGROUP
   * @param model 
   * @returns 
   */
  private getFormGroupData(model: Group): object {
    return {
      ...this._formService.modelToFormGroupData(model),
      nombre: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(50)]],
      sedes_id: ['', [Validators.required, Validators.min(0)]],
      descripcion: ['', [Validators.nullValidator, Validators.maxLength(500)]],
      is_active: [true, [Validators.nullValidator]],
    }
  }


  /**
   * FORM SEARCH USER
   */
  get fs() {
    return this.userSearchForm.controls;
  }

  private initFormUserSearch(){
    this.userSearchForm = this.formBuilder.group({
      tipo_documentos_id: ['', [Validators.nullValidator, Validators.min(0)]],
      documento: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(11)]],
      search: ['', [Validators.nullValidator]],
    });
  }


  
  /**
   * Open modal
   * @param content modal content
   */
  openModal(content: any) {
    this.initForm();
    this.isNewData = true;
    this.dataModal.title = 'Crear grupo';
    this.submitted = false;
    this.modalRef = this.modalService.show(content, { class: 'modal-xl', backdrop: 'static' });
    this.modalRef.onHide.subscribe(() => {});
  }


  /**
    * Save
  */
  saveData() {
    if(!this.groupForm.valid){
      this._sweetAlertService.showTopEnd({title: 'Validación de datos', message: 'Campos obligatorios vacíos', type: 'warning', timer: 1500});
    } else {
      const values: Group = this.groupForm.value;
      values.integrantes = this.listUserSelectedId;

      if(this.isNewData){
        // Crear nuevo registro
        this._sweetAlertService.showConfirmationAlert('¿Estas seguro de registrar el grupo?').then((confirm) => {
          if(confirm.isConfirmed){
            this.saveDataApi(values);
          }
        });
      } else {
        // Actualizar datos
        this._sweetAlertService.showConfirmationAlert('¿Estas seguro de modificar el grupo?').then((confirm) => {
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
    this.modalRef = this.modalService.show(content, { class: 'modal-xl' });
    this.dataModal.title = 'Editar grupo';
    this.isNewData = false;
    this.submitted = false;
    // Cargando datos al formulario 
    var data = this.lists.find((data: { id: any; }) => data.id === id);
    console.log(data);
    const group = Group.cast(data);
    this.groupForm = this.formBuilder.group({
      ...this._formService.modelToFormGroupData(group), 
      id: [data.id]
    });
  }


  /**
   * Eliminar un registro
   * @param id id del registro a eliminar
   */
  deleteRow(id: any){
    this._sweetAlertService.showConfirmationAlert('¿Estas seguro de eliminar el grupo?').then((confirm) => {
      if(confirm.isConfirmed){
        this.deleteDataApi(id);
      }
    });
  }
}
