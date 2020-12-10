import {Component, Input, OnInit} from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {Appointment} from '../../model/appointment';

@Component({
  selector: 'app-show-comment-and-answers',
  templateUrl: './show-comment-and-answers.component.html',
  styleUrls: ['./show-comment-and-answers.component.css']
})
export class ShowCommentAndAnswersComponent implements OnInit {
  @Input() appointment: Appointment;

  constructor(public activeModal: NgbActiveModal) {
  }

  ngOnInit(): void {
    console.log();
  }

}
