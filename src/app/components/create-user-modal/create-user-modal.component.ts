import {Component, Input, OnInit} from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';

@Component({
  selector: 'app-create-user-modal',
  templateUrl: './create-user-modal.component.html',
  styleUrls: ['./create-user-modal.component.css']
})
export class CreateUserModalComponent implements OnInit {

  @Input() name;
  @Input() public options: any;
  profile: string;
  userForm: FormGroup;

  constructor(public activeModal: NgbActiveModal, fb: FormBuilder) {
    this.userForm = fb.group({
      name: ['', Validators.required],
      lastname: ['', Validators.required],
      email: ['', Validators.email],
      password: ['', Validators.required],
      profile: ['', Validators.required],
    });

  }

  ngOnInit(): void {

  }

  setProfile(option: any): void {
    console.log(option);
    this.profile = option;
  }

  testForm() {
    console.log(this.userForm);
  }
}
