import { Directive, ElementRef, Input, OnChanges, SimpleChanges } from '@angular/core';

@Directive({
  selector: '[appPlayIconVisibility]'
})
export class PlayIconVisibilityDirective implements OnChanges {

  @Input() iconVisibility: boolean;

  constructor(private el: ElementRef) {
    el.nativeElement.style.opacity = '1';
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.iconVisibility) {
      if (changes.iconVisibility.currentValue) {
        this.el.nativeElement.style.opacity = '1';
      } else {
        this.el.nativeElement.style.opacity = '0';
      }
    }
  }
}
