import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-write-review-modal',
  templateUrl: './write-review-modal.component.html',
  styleUrls: ['./write-review-modal.component.css']
})
export class WriteReviewModalComponent implements OnInit {
  reviewForm: FormGroup;
  disableSubmit: boolean;

  constructor(private fb: FormBuilder, public activeModal: NgbActiveModal) { }

  ngOnInit(): void {
    this.reviewForm = this.fb.group({
      content: ['', Validators.required],
      score: ['', Validators.required],

    });
  }

  submit() {
    //TODO call review service
  }
}
