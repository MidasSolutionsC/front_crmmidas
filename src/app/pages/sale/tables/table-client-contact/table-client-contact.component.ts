import { Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { Subscription, distinctUntilChanged } from 'rxjs';
import { Contact, ContactList, ResponseApi } from 'src/app/core/models';
import { ApiErrorFormattingService, ContactService, SharedClientService, SweetAlertService } from 'src/app/core/services';

@Component({
  selector: 'app-table-client-contact',
  templateUrl: './table-client-contact.component.html',
  styleUrls: ['./table-client-contact.component.scss']
})
export class TableClientContactComponent implements OnInit, OnDestroy, OnChanges {

  @Input() dataSendApi: any = null;

  // SON DATOS LOCAL
  isDataLocal: boolean = false;
  
  // Collapse
  isCollapseForm: boolean = true;
  isCollapseList: boolean = false;

  // Datos emitidos al formulario
  dataForm: Contact;

  // Lista de documentos
  listContact: ContactList[] = [];

  private subscription: Subscription = new Subscription();

  constructor(
    private _sharedClientService: SharedClientService,
    private _contactService: ContactService,
    private _apiErrorFormattingService: ApiErrorFormattingService,
    private _sweetAlertService: SweetAlertService,
  ) { }

  ngOnInit(): void {

    // ID PERSONA
    this.subscription.add(
      this._sharedClientService.getPersonId().subscribe((value: number) =>  {
        if(value){
          this.apiContactFilterPerson(value);
        } else {
          this.listContact = [];
        }
      })
    )

    // ID EMPRESA
    this.subscription.add(
      this._sharedClientService.getCompanyId().subscribe((value: number) => {
        if(value){
          this.apiContactFilterCompany(value);
        } else {
          this.listContact = [];
        }
      })
    )

    // ID CLIENTE
    this.subscription.add(
      this._sharedClientService.getClientId().subscribe((value: number) => {
        if(value){

        }
      })
    )

    // PERSONA LEGAL
    this.subscription.add(
      this._sharedClientService.getLegalPerson().subscribe((value: boolean) =>  {
        if(value){

        }
      })
    )
    

    // Subscriptionciones
    this.subscription.add(
      this._contactService.listObserver$
        .pipe(distinctUntilChanged())
        .subscribe((list: ContactList[]) => {
          this.listContact = list;
        })
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if(changes.dataSendApi && !changes.dataSendApi.firstChange){
      this.onChangeData();
    }
  }

  onChangeData(){
    if(this.dataSendApi){
      const data: any = {};
      if(this.dataSendApi.persona_juridica){
        data.empresas_id = this.dataSendApi.empresas_id;
      } else {
        data.personas_id = this.dataSendApi.personas_id;
      }

      if(this.isDataLocal && this.listContact.length > 0){
        data.data_array = this.listContact;
        this.apiContactSaveComplete(data);
      }
      
      // console.log(this.dataSendApi, data);
    } 
  }


  /**
   * ****************************************************************
   * ABRIR FORMULARIO 
   * ****************************************************************
   */
  toggleForm(collapse: boolean = null) {
    this.isCollapseForm = collapse || !this.isCollapseForm;
    if (!this.isCollapseForm) {
      this.isCollapseList = true;
    }
  }


  /**
   * ****************************************************************
   * ABRIR TABLA 
   * ****************************************************************
   */
  toggleList(collapse: boolean = null) {
    this.isCollapseList = collapse || !this.isCollapseList;
    if (!this.isCollapseList) {
      this.isCollapseForm = true;
    }
  }



  /**
  * ****************************************************************
  * OPERACIONES CON LA API
  * ****************************************************************
  */
  public apiContactFilterCompany(companyId: number) {
    this._sweetAlertService.loadingUp('Obteniendo datos')
    this._contactService.getFilterCompanyId(companyId).subscribe((response: ResponseApi) => {
      this._sweetAlertService.stop();
      if (response.code == 200) {
        this._contactService.addArrayObserver(response.data);
      }

      if (response.code == 500) {
        if (response.errors) {
          this._sweetAlertService.showTopEnd({ type: 'error', title: response.errors?.message, message: response.errors?.error });
        }
      }
    }, (error: any) => {
      this._sweetAlertService.stop();
      if (error.message) {
        this._sweetAlertService.showTopEnd({ type: 'error', title: 'Error al cargar los contactos', message: error.message, timer: 2500 });
      }
    });
  }

  public apiContactFilterPerson(personId: number) {
    this._sweetAlertService.loadingUp('Obteniendo datos')
    this._contactService.getFilterPersonId(personId).subscribe((response: ResponseApi) => {
      this._sweetAlertService.stop();
      if (response.code == 200) {
        this._contactService.addArrayObserver(response.data);
      }

      if (response.code == 500) {
        if (response.errors) {
          this._sweetAlertService.showTopEnd({ type: 'error', title: response.errors?.message, message: response.errors?.error });
        }
      }
    }, (error: any) => {
      this._sweetAlertService.stop();
      if (error.message) {
        this._sweetAlertService.showTopEnd({ type: 'error', title: 'Error al cargar los contactos', message: error.message, timer: 2500 });
      }
    });
  }

  private apiContactSaveComplete(data: Contact){
    this._sweetAlertService.loadingUp()
    this.subscription.add(
      this._contactService.registerComplete(data).subscribe((response: ResponseApi) => {
        this._sweetAlertService.stop();
        if(response.code == 201){
          this.listContact = [];
          this.isDataLocal = false;
          console.log(response.data);

          this.listContact = ContactList.casts(response.data);
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
        if(error.message){
          this._sweetAlertService.showTopEnd({type: 'error', title: 'Error al registrar los contactos', message: error.message, timer: 2500});
        }
      })
    )
  }

  public apiContactDelete(id: number) {
    this._sweetAlertService.loadingUp('Obteniendo datos')
    this._contactService.delete(id).subscribe((response: ResponseApi) => {
      this._sweetAlertService.stop();
      if (response.code == 200) {
        const data: ContactList = ContactList.cast(response.data[0]);
        this._contactService.removeObjectObserver(data.id);
      }

      if (response.code == 500) {
        if (response.errors) {
          this._sweetAlertService.showTopEnd({ type: 'error', title: response.errors?.message, message: response.errors?.error });
        }
      }
    }, (error: any) => {
      this._sweetAlertService.stop();
      if (error.message) {
        this._sweetAlertService.showTopEnd({ type: 'error', title: 'Error al eliminar el contacto', message: error.message, timer: 2500 });
      }
    });
  }



  /**
   * ****************************************************************
   * OPERACIONES DE SALIDA DEL - FORM DOCUMENT
   * ****************************************************************
   */
  onSubmit(event: any) {
    if (event?.saved) {
      this.toggleList(false);
    }

    if(event?.savedLocal){
      this.toggleList(false);
      this.isDataLocal = true;

      const index = this.listContact.length;
      const data = ContactList.cast(event.data);
      data.id = index + 1;
      this.listContact.push(data);
    }

    if(event?.updatedLocal){
      this.toggleList(false);
      const data = ContactList.cast(event.data);
      this.listContact = this.listContact.map((contact) => {
        if(contact.id == data.id){
          return data;
        }
        return contact;
      });
    }
  }

  onCancel(event: any) {
    // console.log(data);
  }


  /**
   * ****************************************************************
   * OPERACIONES EN LA TABLA
   * ****************************************************************
   */
  getDataRow(data: any) {
    this.dataForm = Contact.cast(data);
    this.toggleForm(false);
  }

  deleteRow(id: any) {
    this._sweetAlertService.showConfirmationAlert('¿Estas seguro de eliminar el contacto?').then((confirm) => {
      if (confirm.isConfirmed) {
        if(this.isDataLocal){
          this.listContact = this.listContact.filter((contact) => contact.id !== id);
        } else {
          this.apiContactDelete(id);
        }
      }
    });
  }
}
