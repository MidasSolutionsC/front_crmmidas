import { ChangeDetectorRef, Component, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription, filter } from 'rxjs';
import { Company, DetailTvLine, Person } from 'src/app/core/models';
import { Client } from 'src/app/core/models/api/client.model';
import { ApiErrorFormattingService, FormService, SharedClientService, SweetAlertService } from 'src/app/core/services';

@Component({
  selector: 'app-form-tv',
  templateUrl: './form-tv.component.html',
  styleUrls: ['./form-tv.component.scss']
})
export class FormTvComponent {
  
  @Input() submitted: Boolean = false;

  isNewData: boolean = true;
  // FORM LINEA FIJA
  tvLineForm: FormGroup;

  differentHolder: boolean = false;


  // CLIENTE ACTIVO
  dataClient: Client;
  dataPerson: Person;
  dataCompany: Company;

  private subscription: Subscription = new Subscription();

  constructor(
    private cdr: ChangeDetectorRef,
    private _sharedClientService: SharedClientService,
    private _formService: FormService,
    private _apiErrorFormattingService: ApiErrorFormattingService,
    private _sweetAlertService: SweetAlertService,
    private formBuilder: FormBuilder
  ){}

  ngOnInit(): void {
    this.initForm();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }


     
  /**
   * ***********************************************
   * OBTENER EL FORM CONTROL - LINEA FIJA
   * ***********************************************
   */
  get fx() {
    return this.tvLineForm.controls;
  }

  /**
   * INICIAR FORMULARIO CON LAS VALIDACIONES
   * @param model 
   */
  private initForm(model: DetailTvLine = new DetailTvLine()){
    const formGroupData = this.getFormGroupData(model);
    this.tvLineForm = this.formBuilder.group(formGroupData);
  }

  /**
   * CREAR VALIDACIONES DEL FORM GROUP
   * @param model 
   * @returns 
   */
  private getFormGroupData(model: DetailTvLine): object {
    return {
      deco: [model?.deco || false, [Validators.nullValidator]],
    }
  }
}
