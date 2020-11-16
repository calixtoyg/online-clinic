import {Component, Input, OnInit} from '@angular/core';
import {Review} from '../../model/review';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-show-review-modal',
  templateUrl: './show-review-modal.component.html',
  styleUrls: ['./show-review-modal.component.css']
})
export class ShowReviewModalComponent implements OnInit {
  @Input() email: string;
  @Input() review: Review;

  constructor(public activeModal: NgbActiveModal) { }

  ngOnInit(): void {
  }

}
