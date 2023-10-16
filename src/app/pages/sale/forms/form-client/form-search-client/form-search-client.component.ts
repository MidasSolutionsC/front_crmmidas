import { Component } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-form-search-client',
  templateUrl: './form-search-client.component.html',
  styleUrls: ['./form-search-client.component.scss']
})
export class FormSearchClientComponent {
  // Formulario para buscar usuarios
  userSearchForm: FormGroup;
  
  constructor(){}
}
