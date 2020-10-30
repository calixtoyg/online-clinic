import { Component, OnInit } from '@angular/core';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {CreateUserModalComponent} from '../create-user-modal/create-user-modal.component';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.css']
})
export class WelcomeComponent implements OnInit {

  constructor(private modalService: NgbModal) { }

  ngOnInit(): void {
  }

  open() {
    const modalRef = this.modalService.open(CreateUserModalComponent);
    modalRef.componentInstance.options = ['admin', 'patient', 'professional'];
    modalRef.componentInstance.name = 'some name';
  }
}
