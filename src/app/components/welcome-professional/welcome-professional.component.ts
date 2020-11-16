import {Component, OnInit} from '@angular/core';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {ShowReviewModalComponent} from '../show-review-modal/show-review-modal.component';

@Component({
  selector: 'app-welcome-professional',
  templateUrl: './welcome-professional.component.html',
  styleUrls: ['./welcome-professional.component.css']
})
export class WelcomeProfessionalComponent implements OnInit {
  year: number;
  month: number;
  day: number;
  email: string;

  constructor(private modalService: NgbModal) { }

  ngOnInit(): void {
    this.email = localStorage.getItem('email');
    const today = new Date();
    this.year = today.getFullYear();
    this.month = today.getMonth();
    this.day = today.getDate();
  }

  open() {
    const modalRef = this.modalService.open(ShowReviewModalComponent);
    modalRef.componentInstance.email =  '';
    modalRef.componentInstance.review = '';
  }
}
