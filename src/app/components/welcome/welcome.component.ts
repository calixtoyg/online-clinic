import {Component, OnInit} from '@angular/core';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {CreateUserModalComponent} from '../create-user-modal/create-user-modal.component';
import {Profile} from '../../enum/profile.enum';
import {CalendarService} from '../../services/calendar.service';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.css']
})
export class WelcomeComponent implements OnInit {

  constructor(private modalService: NgbModal) {
  }

  ngOnInit(): void {
  }

  open() {
    const modalRef = this.modalService.open(CreateUserModalComponent);
    modalRef.componentInstance.options = Object.keys(Profile)
      .map(value => Profile[value][0].toUpperCase() + Profile[value].slice(1, Profile[value].length));
    modalRef.componentInstance.name = 'some name';
  }

}
