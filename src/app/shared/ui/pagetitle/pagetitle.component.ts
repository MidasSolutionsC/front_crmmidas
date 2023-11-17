import { Component, OnInit, Input } from '@angular/core';
import { Breadcrumb } from 'src/app/core/models';

@Component({
  selector: 'app-page-title',
  templateUrl: './pagetitle.component.html',
  styleUrls: ['./pagetitle.component.scss']
})
export class PagetitleComponent implements OnInit {

  @Input() breadcrumbItems: Breadcrumb;
  @Input() title: string;

  constructor() { }

  ngOnInit() {
  }

}
