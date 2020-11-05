import { Component, OnInit } from '@angular/core';
import {NgbModal, NgbModalRef} from '@ng-bootstrap/ng-bootstrap';
import {LoginComponent} from '../login/login.component';
import {AuthenticationService} from '../../services/authentication.service';

@Component({
  selector: 'app-navbar-header',
  templateUrl: './navbar-header.component.html',
  styleUrls: ['./navbar-header.component.css']
})
export class NavbarHeaderComponent implements OnInit {
  private modalRef: NgbModalRef;
  loggedIn = false;

  constructor(private modalService: NgbModal, public authentication: AuthenticationService) { }

  ngOnInit(): void {
   this.authentication.isLoggedIn().subscribe(value => {
     this.loggedIn = !!value;
   });
  }

  openLogin() {
    this.modalRef = this.modalService.open(LoginComponent);
    this.modalRef.result.then(value => {
      this.loggedIn = value;
    });
  }

  logout() {
    this.authentication.logout();
    this.loggedIn = false;
  }
}
