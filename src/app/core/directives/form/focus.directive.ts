import { AfterViewInit, Directive, ElementRef, Input, Renderer2 } from '@angular/core';

@Directive({
  selector: '[appFocus]'
})
export class FocusDirective implements AfterViewInit {

  @Input('appFocus') shouldFocus: boolean = false;

  constructor(private el: ElementRef, private renderer: Renderer2) { }

  ngAfterViewInit(): void {
    if (this.shouldFocus) {
      this.renderer.selectRootElement(this.el.nativeElement).focus();
    }
  }
}
