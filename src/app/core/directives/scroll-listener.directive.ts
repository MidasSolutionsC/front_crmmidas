// import { ChangeDetectorRef, Directive, ElementRef, EventEmitter, HostListener, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';

// @Directive({
//   selector: '[appScrollListener]'
// })
// export class ScrollListenerDirective implements OnChanges {
//   @Input() data: any;
//   @Input() startThreshold: number = 50; // Distancia en píxeles desde el inicio para activar el evento
//   @Input() endThreshold: number = 50; // Distancia en píxeles desde el final para activar el evento
//   @Input() loading: boolean = false;
//   @Input() totalItems: number = 0; // Tamaño de la página
//   @Input() pageSize: number = 10; // Tamaño de la página
//   @Input() currentPage: number = 1;
//   @Input() scrollWindow: boolean = false;
//   @Input() scrollDownDefault: boolean = false; // Nueva variable de entrada


//   @Output() scrollUp = new EventEmitter<any>();
//   @Output() scrollDown = new EventEmitter<any>();
//   @Output() scrollPosition = new EventEmitter<number>();

//   private lastScrollTop = 0;

//   constructor(private el: ElementRef, private cdr: ChangeDetectorRef) {}

//   ngOnChanges(changes: SimpleChanges) {
//     if (changes['scrollDownDefault'] && this.scrollDownDefault) {
//       this.scrollDown.emit({ page: this.currentPage });
//       this.scrollToBottom();
//     }
//   }

//   @HostListener('scroll', ['$event'])
//   onScroll(event: Event) {
//     const element = this.el.nativeElement;
//     const currentScrollTop = element.scrollTop;
//     const scrollHeight = element.scrollHeight;
//     const clientHeight = element.clientHeight;

//     if (!this.scrollWindow) {
//       this.scrollPosition.emit(currentScrollTop);

//       if (currentScrollTop > this.lastScrollTop && currentScrollTop + clientHeight >= scrollHeight - this.endThreshold) {
//         if(!this.loading ){
//           // && this.totalItems > (this.currentPage * this.pageSize)
//           // this.currentPage++;
//           this.scrollDown.emit({ page: this.currentPage, pageSize: this.pageSize, elementRef: this.el });
//         }
//       } else if (currentScrollTop < this.lastScrollTop && currentScrollTop <= this.startThreshold) {
//         if(!this.loading ){
//           // && this.currentPage > 1
//           // this.currentPage--;
//           this.scrollUp.emit({ page: this.currentPage, pageSize: this.pageSize, elementRef: this.el });
//         }
//       }
//     }


//     this.lastScrollTop = currentScrollTop;
//   }

//   public scrollToBottom(el: ElementRef = null) {
//     const element = el?.nativeElement || this.el.nativeElement;
//     if(element){
//       setTimeout(() => {
//         element.scrollTop = element.scrollHeight + 1500;
//         this.cdr.detectChanges()
//       }, 500);
//     }
//   }
// }


import { Directive, ElementRef, EventEmitter, HostListener, Input, OnChanges, Output, SimpleChanges } from '@angular/core';

@Directive({
  selector: '[appScrollListener]'
})
export class ScrollListenerDirective implements OnChanges{
  @Input() startThreshold: number = 50;
  @Input() endThreshold: number = 50;
  @Input() loading: boolean = false;
  @Input() pageSize: number = 10;
  @Input() currentPage: number = 1;
  @Input() scrollWindow: boolean = false;
  @Input() scrollDownDefault: boolean = false; // Nueva variable de entrada

  @Output() scrollUp = new EventEmitter<any>();
  @Output() scrollDown = new EventEmitter<any>();
  @Output() scrollPosition = new EventEmitter<number>();

  private lastScrollTop = 0;
  private storedScrollTop = 0;

  constructor(private el: ElementRef) { }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['scrollDownDefault'] && this.scrollDownDefault) {
      this.scrollDown.emit({ page: this.currentPage });
      this.scrollToBottom();
    }
  }


  @HostListener('scroll', ['$event'])
  onScroll(event: Event) {
    const element = this.el.nativeElement;
    const currentScrollTop = element.scrollTop;
    const scrollHeight = element.scrollHeight;
    const clientHeight = element.clientHeight;

    if (!this.scrollWindow) {
      this.scrollPosition.emit(currentScrollTop);

      if (currentScrollTop > this.lastScrollTop && currentScrollTop + clientHeight >= scrollHeight - this.endThreshold) {
        if (!this.loading) {
          this.scrollDown.emit({ page: this.currentPage, pageSize: this.pageSize, elementRef: this.el });
          this.storeScrollPosition();
          setTimeout(() => {
            this.scrollTo(currentScrollTop - 15); // Retrocede 100px después de hacer scroll hacia abajo
            // this.restoreScrollPosition()
          }, 100);
        }
      } else if (currentScrollTop < this.lastScrollTop && currentScrollTop <= this.startThreshold) {
        if (!this.loading) {
          this.storeScrollPosition();
          this.scrollUp.emit({ page: this.currentPage, pageSize: this.pageSize, elementRef: this.el });
          setTimeout(() => {
            this.scrollTo(Math.max(0, currentScrollTop + 15)); // Retrocede 100px después de hacer scroll hacia arriba
            // this.restoreScrollPosition()
          }, 100);
        }
      }
    }

    this.lastScrollTop = currentScrollTop;
  }

  private scrollTo(position: number): void {
    this.el.nativeElement.scrollTo({ top: position, behavior: 'smooth' });
  }

  public scrollToBottom(el: ElementRef = null) {
    const element = el?.nativeElement || this.el.nativeElement;
    if (element) {
      setTimeout(() => {
        this.el.nativeElement.scrollTo({ top: element.scrollHeight, behavior: 'smooth' });
      }, 500);
    }
  }

  private requestAnimationFrame(callback: () => void): void {
    window.requestAnimationFrame(callback);
  }

  private storeScrollPosition(): void {
    this.storedScrollTop = this.el.nativeElement.scrollTop;
  }

  private restoreScrollPosition(): void {
    this.scrollTo(this.storedScrollTop);
  }
}
