import { Component, OnChanges, OnDestroy, OnInit, SimpleChanges, TemplateRef, ViewChild } from '@angular/core';
import { Breadcrumb, Calendar, CalendarList, ResponseApi } from 'src/app/core/models';

import { CalendarOptions, DateSelectArg, EventClickArg, EventApi, EventInput, EventSourceFuncArg, EventSourceInput, EventDropArg } from '@fullcalendar/core';
import esLocale from '@fullcalendar/core/locales/es'
import interactionPlugin, { DateClickArg } from '@fullcalendar/interaction';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription, distinctUntilChanged, of } from 'rxjs';
import { ApiErrorFormattingService, CalendarService, FormService, SweetAlertService } from 'src/app/core/services';
import * as moment from 'moment'
import { FullCalendarComponent } from '@fullcalendar/angular';


@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss']
})
export class CalendarComponent implements OnInit, OnDestroy {
  modalRef?: BsModalRef;
  @ViewChild('modalContent') modalContent: TemplateRef<any>;
  @ViewChild('calendar') calendarComponent: FullCalendarComponent;

  dataModal = {
    title: 'Crear tipo de servicios',
  }
  
  // bread crumb items
  titleBreadCrumb: string = 'Calendario';
  breadCrumbItems: Array<{}>;

  categories: any[];
  calendarEvents: EventInput[] = [];
  calendarEventSource: any[] = [];
  eventsPromise: Promise<EventInput>;
  
  newEventDate: DateClickArg;

  // Datos iniciales del calendario
  calendarOptions: CalendarOptions = {
    locale: esLocale,
    plugins: [
      interactionPlugin,
      dayGridPlugin,
      timeGridPlugin,
      listPlugin,
    ],
    headerToolbar: {
      left: 'dayGridMonth,dayGridWeek,dayGridDay,today',
      center: 'title',
      right: 'prevYear,prev,next,nextYear'
    },
    views: {
      day: {
        slotDuration: '00:30:00', // Duración de cada ranura en la vista de día
        slotLabelInterval: '01:00:00' // Intervalo para mostrar etiquetas de las horas en la vista de día
      },
      week: {
        slotDuration: '00:30:00', // Duración de cada ranura en la vista de semana
        slotLabelInterval: '01:00:00' // Intervalo para mostrar etiquetas de las horas en la vista de semana
      }
    },
    initialView: "dayGridMonth",
    slotDuration: '00:30:00',
    themeSystem: "bootstrap",
    initialEvents: this.calendarEvents,
    height: 690,
    contentHeight: 650,
    weekends: true,
    weekNumbers: true,
    editable: true,
    selectable: true,
    selectMirror: true,
    dayMaxEvents: true,
    events: [],
    dateClick: this.handleDateClick.bind(this),
    eventClick: this.handleEventClick.bind(this),
    eventsSet: this.handleEvents.bind(this),
    select: this.handleSelect.bind(this),
    eventDrop: this.handleEventDrop.bind(this),
    eventTimeFormat: { // like '14:30:00'
      hour: '2-digit',
      minute: '2-digit',
      meridiem: false,
      hour12: true
    },
  };
    
  // Form 
  isNewData: boolean = true;
  submitted: boolean = false;
  calendarForm: FormGroup;


  // Table data
  // content?: any;
  lists?: CalendarList[];

  private subscription: Subscription = new Subscription();

  constructor(
    private modalService: BsModalService, 
    private _calendarService: CalendarService,
    private _formService: FormService,
    private _apiErrorFormattingService: ApiErrorFormattingService,
    private _sweetAlertService: SweetAlertService,
    private formBuilder: FormBuilder) {

  }

  ngOnInit(): void {
    this.breadCrumbItems = Breadcrumb.casts([{ label: 'Aplicación'}, { label: 'Calendario', active: true }]);
    this.initForm();
    this.listDataApi();
    this._fetchData();

    this.subscription.add(
      this._calendarService.listObserver$
      // .pipe(distinctUntilChanged())
      .subscribe((list: CalendarList[]) => {
        this.lists = list;
        if(this.lists){
          this.calendarEventSource = this.lists.map((item, index) => {
            const data: any = {};
            data.id = item.id.toString();
            data.title = item.titulo;
            data.start = `${item.fecha_inicio} ${item.hora_inicio}`;
            data.end = `${item.fecha_final} ${item.hora_final}`;
            data.className = item.color;
            return data;
          });

          this.eventsPromise = Promise.resolve(this.calendarEventSource);
          // this.calendarOptions.events = this.calendarEventSource;
        }
      })
    );

  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }



  /**
   * ****************************************************************
   * FULL CALENDAR EVENTS
   * ****************************************************************
   */
  showMonthEvents() {
    // Este método muestra los eventos de un mes dado
    const calendarApi = this.calendarComponent.getApi();
    const view = calendarApi.view; // Obtener la vista actual
    console.log("VISTA ACTUAL:",view);
    // const start = view.start; // Obtener el inicio del intervalo visible
    // const end = view.end; // Obtener el fin del intervalo visible
    // console.log(start.format('YYYY-MM-DD')); // Mostrar el inicio en formato año-mes-día
    // console.log(end.format('YYYY-MM-DD')); // Mostrar el fin en formato año-mes-día
    // Aquí puedes aplicar los filtros a la API usando start y end
  }
  
   
  /**
   * Event click modal show
   */
  handleDateClick(arg: DateClickArg) {
    this.newEventDate = arg;
  }
   
  /**
   * Event click modal show
   */
  handleEventClick(arg: EventClickArg) {
    this.dataModal.title = 'Editar agenda';
    this.isNewData = false;
    this.submitted = false;

    var data = this.lists.find((data: { id: any; }) => data.id === parseInt(arg.event.id));
    const calendar = Calendar.cast(data);
    this.calendarForm = this.formBuilder.group({
      ...this._formService.modelToFormGroupData(calendar), 
      id: [data.id],
    });

    this.modalRef = this.modalService.show(this.modalContent, { class: 'modal-md' });
  }
   
  /**
   * Event select  modal show
   */
  handleSelect(arg: DateSelectArg) {
    this.isNewData = true;
    this.dataModal.title = 'Crear agenda';
    this.submitted = false;
    this.initForm();
    this.f.fecha_inicio.setValue(arg.startStr);
    const endDate = moment(arg.endStr).subtract(1, 'day').format('YYYY-MM-DD');
    this.f.fecha_final.setValue(endDate);
    this.f.hora_inicio.setValue('06:00:00');
    this.f.hora_final.setValue('08:00:00');
    
    this.modalRef = this.modalService.show(this.modalContent, { class: 'modal-md' });
  }
   
  /**
   * Event drop modal show
   */
  handleEventDrop(arg: EventDropArg) {
    console.log("EVENT DROP:", arg);
    // this.editEvent = clickInfo.event;
    // var categories = clickInfo.event.classNames;
    // this.formEditData = this.formBuilder.group({
    //   editTitle: clickInfo.event.title,
    //   editcategories: categories instanceof Array?clickInfo.event.classNames[0]:clickInfo.event.classNames,
    // });
    // this.modalRef = this.modalService.show(this.editmodalShow);
  }

  /**
   * Events bind in calander
   * @param events events
   */
  handleEvents(events: EventApi[]) {
    // console.log("Events:", events)
    // this.currentEvents = events;  
    // console.log("HANDLE EMIT:",events)
  }


  
  /**
   * Fetches the data
   */
  private _fetchData() {
    let eventGuid = 0;
    function createEventId() {
        return String(eventGuid++);
    }

    this.categories = [
      {
        name: 'Rojo',
        value: 'bg-danger'
      },
      {
        name: 'Verde',
        value: 'bg-success'
      },
      {
        name: 'Azul',
        value: 'bg-primary'
      },
      {
        name: 'Celeste',
        value: 'bg-info'
      },
      {
        name: 'Negro',
        value: 'bg-dark'
      },
      {
        name: 'Amarillo',
        value: 'bg-warning'
      },
    ];

    // Calender Event Data
    this.calendarEvents = [];    
  }



  /**
   * ****************************************************************
   * OPERACIONES CON LA API
   * ****************************************************************
   */
  public listDataApi(forceRefresh: boolean = false){
    this._sweetAlertService.loadingUp('Obteniendo datos')
    this._calendarService.getAll(forceRefresh).subscribe((response: ResponseApi) => {
      this._sweetAlertService.stop();
      if(response.code == 200){
        this.lists = response.data;
        if(this.lists){
          this.calendarEventSource = this.lists.map((item, index) => {
            const data: any = {};
            data.id = item.id.toString();
            data.title = item.titulo;
            data.start = `${item.fecha_inicio} ${item.hora_inicio}`;
            data.end = `${item.fecha_final} ${item.hora_final}`;
            data.className = item.color;
            return data;
          });

          this.calendarOptions.events = this.calendarEventSource;
        }
        
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

  private saveDataApi(data: Calendar){
    this._sweetAlertService.loadingUp()
    this.subscription.add(
      this._calendarService.register(data).subscribe((response: ResponseApi) => {
        this._sweetAlertService.stop();
        if(response.code == 201){
          if(response.data[0]){
            const data: CalendarList = CalendarList.cast(response.data[0]);
            this._calendarService.addObjectObserver(data);
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

  private updateDataApi(data: Calendar, id: number){
    this._sweetAlertService.loadingUp()
    this._calendarService.update(data, id).subscribe((response: ResponseApi) => {
      this._sweetAlertService.stop();
      if(response.code == 200){
        const data: CalendarList = CalendarList.cast(response.data[0]);
        this._calendarService.updateObjectObserver(data);
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
    this._calendarService.delete(id).subscribe((response: ResponseApi) => {
      this._sweetAlertService.stop();
      if(response.code == 200){
        const data: CalendarList = CalendarList.cast(response.data[0]);
        this._calendarService.removeObjectObserver(data.id);
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
  get f() {
    return this.calendarForm.controls;
  }

  /**
   * INICIAR FORMULARTO CON LAS VALIDACIONES
   * @param model 
   */
  private initForm(){
    const calendar = new Calendar();
    const formGroupData = this.getFormGroupData(calendar);
    this.calendarForm = this.formBuilder.group(formGroupData);
  }

  /**
   * CREAR VALIDACIONES DEL FORMGROUP
   * @param model 
   * @returns 
   */
  private getFormGroupData(model: Calendar): object {
    return {
      ...this._formService.modelToFormGroupData(model),
      titulo: ['', [Validators.required, Validators.maxLength(50)]],
      descripcion: ['', [Validators.nullValidator, Validators.maxLength(500)]],
      fecha_inicio: ['', [Validators.required]],
      hora_inicio: ['', [Validators.required]],
      color: ['', [Validators.nullValidator]],
      is_seen: [false, [Validators.nullValidator]],
      is_active: [true, [Validators.nullValidator]],
    }
  }

  /**
   * Open modal
   * @param content modal content
   */
  openModal() {
    this.initForm();
    this.isNewData = true;
    this.dataModal.title = 'Crear agenda';
    this.submitted = false;
    this.modalRef = this.modalService.show(this.modalContent, { class: 'modal-md' });
    this.modalRef.onHide.subscribe(() => {});
  }


  /**
    * Save
  */
  saveData() {
    if(!this.calendarForm.valid){
      this._sweetAlertService.showTopEnd({title: 'Validación de datos', message: 'Campos obligatorios vacíos', type: 'warning', timer: 1500});
    } else {
      const values: Calendar = this.calendarForm.value;

      if(this.isNewData){
        // Crear nuevo registro
        this._sweetAlertService.showConfirmationAlert('¿Estas seguro de registrar la agenda?').then((confirm) => {
          if(confirm.isConfirmed){
            this.saveDataApi(values);
          }
        });
      } else {
        // Actualizar datos
        this._sweetAlertService.showConfirmationAlert('¿Estas seguro de modificar la agenda?').then((confirm) => {
          if(confirm.isConfirmed){
            this.updateDataApi(values, values.id);
          }
        });
      }
    }


    // const values: Calendar = this.calendarForm.value;
    // // const calendarApi = this.newEventDate.view.calendar;
    // this.calendar.getApi().addEvent({
    //   id: '12',
    //   title: values.titulo,
    //   start: `${values.fecha_inicio} ${values.hora_inicio}`,
    //   end: `${values.fecha_final} ${values.hora_final}`,
    //   className: values.color + ' ' + 'text-white'
    // });

    // this.submitted = true;
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
    const calendar = Calendar.cast(data);
    this.calendarForm = this.formBuilder.group({...this._formService.modelToFormGroupData(calendar), id: [data.id]});
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
