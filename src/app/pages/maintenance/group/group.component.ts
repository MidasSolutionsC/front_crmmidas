import { CdkStepper } from '@angular/cdk/stepper';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Observable, Subscription, debounceTime, distinctUntilChanged, of } from 'rxjs';
import { Breadcrumb, CampusList, CountryList, Group, GroupList, MemberList, Pagination, ResponseApi, ResponsePagination, TypeDocumentList, TypeUserList, UserPersonList } from 'src/app/core/models';
import { ApiErrorFormattingService, CampusService, CountryService, FormService, GroupService, MemberService, SweetAlertService, TypeDocumentService, TypeUserService, UserService } from 'src/app/core/services';
import { ModalDetailComponent } from './modals/modal-detail/modal-detail.component';
import { ExportAsService, ExportAsConfig, SupportedExtensions } from 'ngx-export-as';

@Component({
  selector: 'app-group',
  templateUrl: './group.component.html',
  styleUrls: ['./group.component.scss']
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
  lists?: GroupList[] = [];


  // EXPORTS DATA TABLE
  exportAsConfig: ExportAsConfig = {
    type: 'pdf', // the type you want to download
    elementIdOrContent: 'tableGroup', // the id of html/table element
  }

  config: ExportAsConfig = {
    type: 'pdf',
    elementIdOrContent: 'tableGroup',
    options: {
      jsPDF: {
        orientation: 'landscape'
      },
      pdfCallbackFn: this.pdfCallbackFn // to add header and footer
    }
  };

  // SERVER SIDE - GROUP
  groupPage: number = 1;
  groupPerPage: number = 5;
  groupSearch: string = '';
  groupColumn: string = '';
  groupOrder: 'asc' | 'desc' = 'desc';
  groupCountElements: number[] = [2, 5, 10, 25, 50, 100];
  groupTotal: number = 0;
  groupPagination: Pagination = new Pagination();

  // Integrantes
  listMembers: MemberList[] = [];
  listMemberIdDeleted: number[] = [];

  // Sedes
  listDocuments?: TypeDocumentList[];
  listCampus?: CampusList[];


  // Listar usuarios
  loadingDataUsers: boolean = false;
  asyncUsers: Observable<UserPersonList[]>;
  listUsers?: UserPersonList[];
  listUserSelected?: UserPersonList[] = [];
  listUserSelectedId?: any[] = [];

  // USUARIO - NGX DATA TABLE
  userRows: any[] = [];
  // userColumns: any[] = [];
  userOffset: number = 0;
  userCount: number = 3;
  userLimit = 10;
  userColumns = [
    { prop: 'nombre_usuario', name: 'Usuario' },
    { prop: 'nombres', name: 'Nombres' },
    { prop: 'apellido_paterno', name: 'Apellido paterno' },
    { prop: 'apellido_materno', name: 'Apellido materno' }
  ];


  // TABLE USER - ANGULAR DATA TABLE
  dtOptions: any = {};
  dtColumns: DataTables.ColumnSettings[] = [];

  // TABLE USUARIOS - SERVER SIDE
  page: number = 1;
  perPage: number = 5;
  search: string = '';
  column: string = '';
  order: 'asc' | 'desc' = 'desc';
  countElements: number[] = [2, 5, 10, 25, 50, 100];
  total: number = 0;
  pagination: Pagination;

  // CHECKED USERS - SELECCIÓN DE USUARIOS EN LA TABLA
  selectAll: boolean = false;
  
  private subscription: Subscription = new Subscription();

  constructor(
    private exportAsService: ExportAsService,
    private cdr: ChangeDetectorRef,
    private _modalService: BsModalService, 
    private _typeDocumentService: TypeDocumentService,
    private _campusService: CampusService,
    private _memberService: MemberService,
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
    // this.listDataApi();

    this.apiTypeDocumentList();
    this.apiCampusList();


    // PAGINACIÓN DATA TABLE
    this.apiGroupListPagination();
    this.apiUserListPagination();

    // CONFIG - ANGULAR DATATABLE
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 10,
      responsive: true,
      // dom: 'Bfrtip',
      // dom: 'lBfrtip',
      // dom: 'lftiprB',
      dom: '<"top d-flex flex-wrap justify-content-sm-between justify-content-center"lf>Brt<"bottom d-flex flex-wrap justify-content-sm-between justify-content-center"ip><"clear">',
      language: {
        url: 'assets/languages/dataTable/spanish.json'
      },
      buttons: [
        // 'columnsToggle',
        'colvis',
        'copy',
        'print',
        'excel',
        {
          text: 'PDF',
          key: '1',
          action: function (e: any, dt: any, node: any, config: any) {
            console.log(dt, node)
          }
        }
      ],
      noJquery: true,
    };

    // Grupos
    // this.subscription.add(
    //   this._groupService.listObserver$
    //   // .pipe(distinctUntilChanged())
    //   .pipe(
    //     distinctUntilChanged(
    //       (prevList, currentList) =>
    //         prevList.map(item => item.id).join(',') === currentList.map(item => item.id).join(',')
    //     )
    //   )
    //   .subscribe((list: GroupList[]) => {
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

    // Sedes
    this.subscription.add(
      this._campusService.listObserver$
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
   * GENERAR EXPORTACIONES DE DATOS - TABLE
   * ****************************************************************
   */
  exportAsString(type: SupportedExtensions, opt?: string) {
    this.config.elementIdOrContent = '<div> test string </div>';
    this.exportAs(type, opt);
    setTimeout(() => {
      this.config.elementIdOrContent = 'tableGroup';
    }, 1000);
  }

  exportAs(type: SupportedExtensions, opt?: string) {
    this.config.type = type;
    if (opt) {
      this.config.options.jsPDF.orientation = opt;
      // this.config.options.jsPDF.orientation = 'portrait';
      this.config.options.jsPDF.unit = 'mm';
      this.config.options.jsPDF.format = 'a4';
      this.config.options.jsPDF.compress = true;
      this.config.options.jsPDF.scale = 3;
      this.config.options.jsPDF.fonts = [
        {
          family: 'Arial',
          style: 'normal',
          src: 'path/to/arial.ttf' // Ruta a la fuente TrueType (ttf) incrustada
        }
      ];
    }
    this.exportAsService.save(this.config, 'grupos').subscribe(() => {
      // save started
    });
    
    // this.exportAsService.get(this.config).subscribe(content => {
    //   const link = document.createElement('a');
    //   const fileName = 'export.pdf';

    //   link.href = content;
    //   link.download = fileName;
    //   link.click();
    //   console.log(content);
    // });
  }
  
  pdfCallbackFn (pdf: any) {
    // example to add page number as footer to every page of pdf
    const noOfPages = pdf.internal.getNumberOfPages();
    for (let i = 1; i <= noOfPages; i++) {
      pdf.setPage(i);
      pdf.text('Pagina ' + i + ' de ' + noOfPages, pdf.internal.pageSize.getWidth() - 50, pdf.internal.pageSize.getHeight() - 10);
    }
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
      if(error.message){
        this._sweetAlertService.showTopEnd({type: 'error', title: 'Error', message: error.message, timer: 2500});
      }
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

          this.apiGroupListPagination();
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

        this.apiGroupListPagination();
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
    }, (error: any) => {
      this._sweetAlertService.stop();
      if(error.message){
        this._sweetAlertService.showTopEnd({type: 'error', title: 'Error al actualizar grupo', message: error.message, timer: 2500});
      }
    });
  }

  private deleteDataApi(id: number){
    this._sweetAlertService.loadingUp()
    this._groupService.delete(id).subscribe((response: ResponseApi) => {
      this._sweetAlertService.stop();
      if(response.code == 200){
        const data: GroupList = GroupList.cast(response.data[0]);
        this._groupService.removeObjectObserver(data.id);
        this.apiGroupListPagination();
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
      if(error.message){
        this._sweetAlertService.showTopEnd({type: 'error', title: 'Error al eliminar grupo', message: error.message, timer: 2500});
      }
    });
  }


  /**
   * ****************************************************************
   * SERVER SIDE - GRUPOS
   * ****************************************************************
   */
  // DATA TABLE
  apiGroupListPagination(): void {
    this.subscription.add(
      this._groupService.getPagination({
        page: this.groupPage.toString(),
        perPage: this.groupPerPage.toString(),
        search: this.groupSearch,
        column: this.groupColumn,
        order: this.groupOrder
      }).pipe(debounceTime(250)).subscribe((response: ResponsePagination) => {
        if(response.code == 200){
          this.groupPagination = Pagination.cast(response.data);
          this.groupPage = response.data.current_page;
          this.groupTotal = response.data.total;
          this.lists = this.groupPagination.data;
        }

        if(response.code == 500){
          if(response.errors){
            this._sweetAlertService.showTopEnd({type: 'error', title: response.errors?.message, message: response.errors?.error});
          }
        }
      }, (error: any) => {
        if(error.message){
          this._sweetAlertService.showTopEnd({type: 'error', title: 'Error al cargar grupos', message: error.message, timer: 2500});
        }
      })
    ); 
  }

  getPageGroup(event: any){
    const {page, itemsPerPage} = event;
    this.groupPage = page;
    this.groupPerPage = itemsPerPage;
    this.cdr.detectChanges();
    setTimeout(() => {
      this.apiGroupListPagination();
    }, 0);
  }


  
  /**
   * ****************************************************************
   * OPERACIONES DE TABLAS FORÁNEAS
   * ****************************************************************
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
      console.log(error);
      this._sweetAlertService.stop();
      if(error.message){
        this._sweetAlertService.showTopEnd({type: 'error', title: 'Error al cargar tipo de documentos', message: error.message, timer: 2500});
      }
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
      console.log(error);
      this._sweetAlertService.stop();
      if(error.message){
        this._sweetAlertService.showTopEnd({type: 'error', title: 'Error al cargar sedes', message: error.message, timer: 2500});
      }
    });
  }
  
  // Obtener lista de integrantes
  public apiMemberListByGroup(groupId: number){
    this._sweetAlertService.loadingUp('Obteniendo datos de integrantes')
    this._memberService.getByGroup(groupId).subscribe((response: ResponseApi) => {
      this._sweetAlertService.stop();
      if(response.code == 200){
        this.listMembers = response.data;
      }

      if(response.code == 500){
        if(response.errors){
          this._sweetAlertService.showTopEnd({type: 'error', title: response.errors?.message, message: response.errors?.error});
        }
      }
    }, (error: any) => {
      console.log(error);
      this._sweetAlertService.stop();
      if(error.message){
        this._sweetAlertService.showTopEnd({type: 'error', title: 'Error al cargar integrantes', message: error.message, timer: 2500});
      }
    });
  }


  /**
   * TABLA DE DATOS DE USUARIOS - SERVER SIDE
   */

  // DATA TABLE
  apiUserListPagination(): void {
    this.subscription.add(
      this._userService.getPagination({
        page: this.page.toString(),
        perPage: this.perPage.toString(),
        search: this.search,
        column: this.column,
        order: this.order
      }).pipe(debounceTime(250)).subscribe((response: ResponsePagination) => {
        if(response.code == 200){
          this.pagination = Pagination.cast(response.data);
          this.asyncUsers = of(this.pagination.data);
          this.page = response.data.current_page;
          this.total = response.data.total;
          // this.listUsers = this.pagination.data;

          this.userRows = response.data.data;
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


  // EVENTOS DEL NGX DATA TABLE - USUARIO
  onPageUser(event: any) {
    this.userOffset = event.offset;
  }

  onActivateUser(event: any) {
    console.log(event);
  }

  onSelectUser(event: any) {
    console.log(event);
  }



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

    setTimeout(() => {
      this.processingMemberGroup();
    }, 0);
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

    setTimeout(() => {
      this.processingMemberGroup();
    }, 0);
  }

  /**
   * PROCESAR LOS INTEGRANTES SELECCIONADOS - CAPTURAR SOLO LOS ID
   */
  processingMemberGroup(){
    this.listUserSelectedId = this.listUserSelected.map((data) => data.id);
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
   * Validar si el usuario ya es un miembro del grupo 
   * @param id id del usuario
   * @returns 
   */
  getRowIsMember(id: any){
    return this.listMembers.some((item) => item.usuarios_id === id);
  }





  /**
   * ELIMINAR USUARIO - MIEMBRO DEL GRUPO
   */
  deleteMemberUser(memberId: number){
    // Buscar en el array de nuevos integrantes
    const member = this.listMembers.find((member) => member.id === memberId);

    if(member){
      this._sweetAlertService.showConfirmationAlert('¿Estas seguro de eliminar al integrante?').then((confirm) => {
        if(confirm.isConfirmed){
          this.listMemberIdDeleted.push(member.id);
          this.listMembers = this.listMembers.filter((item) => item.id !== member.id);
        }
      });
    }

  }

  /**
   * ELIMINAR USUARIO - SELECCIONADO
   */
  deleteUserSelected(userId: number){
    // Buscar en el array de nuevos integrantes
    const userSelected = this.listUserSelected.find((item) => item.id == userId);

    if(userSelected){
      this._sweetAlertService.showConfirmationAlert('¿Estas seguro de eliminar al integrante?').then((confirm) => {
        if(confirm.isConfirmed){
          this.toggleSelection(userSelected);
        }
      });
    }
  }


  /**
   * OBTENER NOMBRE DEL SEDE SELECCIONADO
   */
  get nameSede(){
    const campus = this.listCampus.find((item) => item.id === parseInt(this.f.sedes_id.value));
    return campus.nombre;
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
    this.listMembers = [];
    this.listMemberIdDeleted = [];
    this.listUserSelectedId = [];
    this.listUserSelected = [];
    
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
        if(values?.integrantes.length <= 0){
          this._sweetAlertService.showTopEnd({title: 'Validación de integrantes', message: 'No se encontró integrantes para crear el grupo', type: 'warning', timer: 1500});
          return;
        }
        // Crear nuevo registro
        this._sweetAlertService.showConfirmationAlert('¿Estas seguro de registrar el grupo?').then((confirm) => {
          if(confirm.isConfirmed){
            this.saveDataApi(values);
          }
        });
      } else {
        values['integrantesEliminados'] = this.listMemberIdDeleted;
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
    this.openModal(content);
    this.dataModal.title = 'Editar grupo';
    this.isNewData = false;

    // Cargando datos al formulario 
    var data = this.lists.find((data: { id: any; }) => data.id === id);
    const group = Group.cast(data);

    this.groupForm = this.formBuilder.group({
      ...this._formService.modelToFormGroupData(group), 
      id: [data.id]
    });

    // Obtener los integrantes del grupo
    this.apiMemberListByGroup(group.id);
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


  /**
   * *******************************************************************
   * DETALLE DE GRUPO - MODAL FORÁNEO
   * *******************************************************************
   */
  openModalDetailGroup(group: GroupList){
    const initialState = {
      group
    }

    this.modalRef = this.modalService.show(ModalDetailComponent, {initialState, class: 'modal-xl'});
  }
}
