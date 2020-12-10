import {Directive, HostListener, EventEmitter, Output} from '@angular/core';
import {interval, Observable, Subject} from 'rxjs';
import {filter, takeUntil, tap} from 'rxjs/operators';

@Directive({
  selector: '[appHoldable]'
})
export class HoldableDirective {

  @Output() holdTime: EventEmitter<number> = new EventEmitter<number>();
  state: Subject<string> = new Subject<string>();
  cancel: Observable<string>;

  constructor() {
    this.cancel = this.state.pipe(
      filter(v => v === 'cancel'),
      tap(v => {
        console.log('STOPPPPPPPPPPP');
        this.holdTime.emit(0)
      })
    )
  }

  @HostListener('mouseup', ['$event'])
  @HostListener('mouseleave')
  onExit() {
    this.state.next('cancel');
  }

  @HostListener('mousedown', ['$event'])
  onHold() {
    console.log('started hold');
    this.state.next('start');
    const n = 100;
    interval(n).pipe(
      takeUntil(this.cancel),
      tap(v => {
        this.holdTime.emit(v * n);
      })
    ).subscribe();
  }

}
