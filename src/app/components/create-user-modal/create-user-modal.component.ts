import {ChangeDetectorRef, Component, Input, OnInit} from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {UsersService} from '../../services/users.service';
import {AngularFireStorage} from '@angular/fire/storage';
import {AuthenticationService} from '../../services/authentication.service';
import * as firebase from 'firebase';

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
  firstImage: any;
  secondImage: any;

  constructor(public activeModal: NgbActiveModal, private fb: FormBuilder, private cd: ChangeDetectorRef, private authentication: AuthenticationService) {
  }

  ngOnInit(): void {
    window.recaptchaVerifier = new firebase.auth.RecaptchaVerifier('submit-user-creation');
    this.userForm = this.fb.group({
      name: ['', Validators.required],
      lastname: ['', Validators.required],
      email: ['', Validators.email],
      password: ['', Validators.required],
      profile: ['', Validators.required],
      specializations: [''],
    });
    this.firstImage = {};
    this.secondImage = {};

    this.userForm.controls.profile.valueChanges.subscribe(value => {
      if (value.toLowerCase() === 'patient') {
       this.userForm.addControl('firstImage', new FormControl('', [Validators.required]));
       this.userForm.addControl('secondImage', new FormControl('', [Validators.required]));
       this.userForm.updateValueAndValidity();
      } else {
        this.userForm.removeControl('firstImage');
        this.userForm.removeControl('secondImage');
      }
    });
  }


  setProfile(option: any): void {
    console.log(option);
    this.profile = option;
  }


  submit() {
    // this.authentication.sendSignInLinkToEmail(this.userForm.value.email, this.userForm.value.password);
    // if (this.userForm.valid) {
    //   this.authentication.createUser(this.userForm.value.email, this.userForm.value.password, {
    //     ...this.userForm.value,
    //     firstImage: this.firstImage,
    //     secondImage: this.secondImage
    //   }).finally(
    //     this.activeModal.close
    //   );
    // }

  }

  onFileChange(event: Event, id: string) {

    // @ts-ignore
    if (event.target.files && event.target.files.length) {
      // @ts-ignore
      const [file] = event.target.files;
      if (id === 'firstImage') {
        this.firstImage = file;
      } else {
        this.secondImage = file;
      }
      // this.userForm.patchValue({
      //   [id]: file
      // });
      // console.log("somegjasgjasg");
      //
      //   // need to run CD since file load runs outside of zone
      // }
      // console.log("stop here");
    }
  }


}
