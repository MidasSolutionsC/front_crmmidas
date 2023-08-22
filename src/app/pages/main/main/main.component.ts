import { Component } from '@angular/core';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent {
  // bread crumb items
  breadCrumbItems: Array<{}>;

  constructor(){}

  ngOnInit(): void {
    this.breadCrumbItems = [{ label: 'Dashboard'}, { label: 'Inicio', active: true }];
  }
}
