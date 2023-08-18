import { Component } from '@angular/core';
import { ResponseApi } from 'src/app/core/models/response-api.model';
import { User } from 'src/app/core/models/user.model';
import { TypeDocumentService } from 'src/app/core/services/type-document.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent {
  // bread crumb items
  breadCrumbItems: Array<{}>;

  constructor(private typeDocumentService: TypeDocumentService){}

  ngOnInit(): void {
    this.breadCrumbItems = [{ label: 'Dashboard'}, { label: 'Inicio', active: true }];

    this.listDocument();
  }

  private listDocument(){
    this.typeDocumentService.getAll().subscribe((result: User[]) => {
      console.log(result)
    });
  }
}
