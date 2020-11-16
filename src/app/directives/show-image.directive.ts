import {Directive, ElementRef} from '@angular/core';

@Directive({
  selector: '[appShowImage]'
})
export class ShowImageDirective {

  constructor(private el: ElementRef) { }

}
