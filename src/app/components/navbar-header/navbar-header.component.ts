import { Component, OnInit } from '@angular/core';
import {NgbModal, NgbModalRef} from '@ng-bootstrap/ng-bootstrap';
import {LoginComponent} from '../login/login.component';

@Component({
  selector: 'app-navbar-header',
  templateUrl: './navbar-header.component.html',
  styleUrls: ['./navbar-header.component.css']
})
export class NavbarHeaderComponent implements OnInit {
  private modalRef: NgbModalRef;

  constructor(private modalService: NgbModal) { }

  ngOnInit(): void {
  }

  openLogin() {
    this.modalRef = this.modalService.open(LoginComponent);
  }
}
