import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-spinner',
  templateUrl: './spinner.component.html',
  styleUrls: ['./spinner.component.css']
})
export class SpinnerComponent implements OnInit {

  constructor() {
  }

  @Input() value = 100;
  @Input() diameter = 100;
  @Input() mode = 'indeterminate';
  @Input() strokeWidth = 10;
  @Input() overlay = false;
  @Input() color = 'primary';

  ngOnInit(): void {
  }


}
