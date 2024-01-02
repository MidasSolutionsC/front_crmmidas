import { Directive, ElementRef, EventEmitter, HostListener, Input, Output } from '@angular/core';

@Directive({
  selector: '[appScrollListener]'
})
export class ScrollListenerDirective {
  @Input() element: any;
  @Input() scrollWindow: boolean = false;
  @Input() scrollThreshold: number = 50; // Distancia en píxeles desde el inicio o el final
  @Input() loading: boolean = false; 
  @Input() scrollDownByDefault: boolean = false;
  @Output() scrollUp = new EventEmitter<void>();
  @Output() scrollDown = new EventEmitter<void>();
  @Output() scrollPosition = new EventEmitter<number>(); // Nuevo evento de salida


  private lastScrollTop = 0;

  constructor(private el: ElementRef) {}

  @HostListener('scroll', ['$event'])
  onScroll(event: Event) {
    const element = this.el.nativeElement;
    const currentScrollTop = element.scrollTop;
    const scrollHeight = element.scrollHeight;
    const clientHeight = element.clientHeight;

    this.scrollPosition.emit(currentScrollTop); 

    if (currentScrollTop > this.lastScrollTop && currentScrollTop + clientHeight >= scrollHeight - this.scrollThreshold) {
      this.scrollDown.emit();
    } else if (currentScrollTop < this.lastScrollTop && currentScrollTop <= this.scrollThreshold) {
      this.scrollUp.emit();
    }

    this.lastScrollTop = currentScrollTop;
  }

  // @Input() data: any;
  // @Input() startThreshold: number = 50; // Distancia en píxeles desde el inicio para activar el evento
  // @Input() endThreshold: number = 50; // Distancia en píxeles desde el final para activar el evento
  // @Input() loading: boolean = false;
  // @Input() scrollToElement: boolean = false;
  // @Output() scrollUp = new EventEmitter<void>();
  // @Output() scrollDown = new EventEmitter<void>();
  // @Output() scrollPosition = new EventEmitter<number>();

  // private lastScrollTop = 0;

  // constructor(private el: ElementRef) {}

  // @HostListener('scroll', ['$event'])
  // onScroll(event: Event) {
  //   const element = this.el.nativeElement;
  //   const currentScrollTop = element.scrollTop;
  //   const scrollHeight = element.scrollHeight;
  //   const clientHeight = element.clientHeight;

  //   if (!this.scrollToElement) {
  //     this.scrollPosition.emit(currentScrollTop);

  //     if (currentScrollTop > this.lastScrollTop && currentScrollTop + clientHeight >= scrollHeight - this.endThreshold) {
  //       this.scrollDown.emit();
  //     } else if (currentScrollTop < this.lastScrollTop && currentScrollTop <= this.startThreshold) {
  //       this.scrollUp.emit();
  //     }
  //   }

  //   if (scrollHeight - currentScrollTop <= clientHeight + this.endThreshold) {
  //     if (!this.loading) {
  //       this.loading = true;
  //     }
  //   } else {
  //     if (this.loading) {
  //       this.loading = false;
  //     }
  //   }

  //   this.lastScrollTop = currentScrollTop;
  // }
}
