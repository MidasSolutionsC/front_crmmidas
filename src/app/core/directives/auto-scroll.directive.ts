import { AfterViewInit, Directive, ElementRef, Input, OnChanges, Renderer2, SimpleChanges } from '@angular/core';

@Directive({
  selector: '[appAutoScroll]'
})
export class AutoScrollDirective implements AfterViewInit, OnChanges{

  @Input() autoScroll: boolean = null;
  
  constructor(private el: ElementRef, private renderer: Renderer2) {}

  ngAfterViewInit() {
    this.scrollToBottomLazy();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.autoScroll && changes.autoScroll.currentValue) {
      this.scrollToBottomLazy();
    }
  }

  scrollToBottom() {
    try {
      // Using Renderer2 for cross-browser compatibility
      this.renderer.setProperty(this.el.nativeElement, 'scrollTop', this.el.nativeElement.scrollHeight);
    } catch (err) {
      console.error(err);
    }
  }

  public scrollToBottomLazy(el: ElementRef = null) {
    const element = el?.nativeElement || this.el.nativeElement;
    if (element) {
      setTimeout(() => {
        element.scrollTo({ top: element.scrollHeight, behavior: 'smooth' });
      }, 250);
    }
  }



}
