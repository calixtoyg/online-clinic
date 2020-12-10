import {Component, ElementRef, Input, OnDestroy, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {AuthenticationService} from '../../services/authentication.service';
import * as firebase from 'firebase';
import {WindowService} from '../../services/window.service';
import {Speciality} from '../../enum/speciality.enum';
import {Profile} from '../../enum/profile.enum';
import {MatAutocomplete, MatAutocompleteSelectedEvent} from '@angular/material/autocomplete';
import {COMMA, ENTER} from '@angular/cdk/keycodes';
import {MatChipInputEvent} from '@angular/material/chips';
import {map, startWith} from 'rxjs/operators';
import {Observable, Subscription} from 'rxjs';

@Component({
  selector: 'app-create-user-modal',
  templateUrl: './create-user-modal.component.html',
  styleUrls: ['./create-user-modal.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class CreateUserModalComponent implements OnInit, OnDestroy {
  subs: Subscription[] = [];
  @Input() name;
  @Input() public options: any;
  profile: string;
  userForm: FormGroup;
  firstImage: any;
  secondImage: any;
  separatorKeysCodes: number[] = [ENTER, COMMA];
  windowRef: any;
  disableSubmit: boolean;
  filteredSpecializations: Observable<any>;
  chipSpecializations = [];
  specializations: string[];
  @ViewChild('specialityInput') specialityInput: ElementRef<HTMLInputElement>;
  @ViewChild('auto') matAutocomplete: MatAutocomplete;
  specializationForm = new FormControl();

  constructor(public activeModal: NgbActiveModal, private fb: FormBuilder, private windowsService: WindowService, private authentication: AuthenticationService) {
//TODO falta agregar speciality para hacer el submit

  }

  ngOnInit(): void {
    this.disableSubmit = true;
    setTimeout(() => {
      this.disableSubmit = false;
    }, 5000);
    this.windowRef = this.windowsService.windowRef;
    this.windowRef.recaptchaVerifier = new firebase.auth.RecaptchaVerifier('submit-user-creation', {
      size: 'normal',
      callback: (response) => {
        console.log(response);
        this.submitAfterCaptcha();
      },
      'expired-callback': () => {
        console.log('EXPIRED CAPTCHA');
      }
    });
    this.userForm = this.fb.group({
      name: ['', Validators.required],
      lastname: ['', Validators.required],
      email: ['', Validators.email],
      password: ['', Validators.required],
      profile: ['', Validators.required],
      specializations: [[]],
    });
    this.firstImage = {};
    this.secondImage = {};

    this.subs.push(this.userForm.controls.profile.valueChanges.subscribe(value => {
      if (value.toLowerCase() === 'patient') {
        this.userForm.addControl('firstImage', new FormControl('', [Validators.required]));
        this.userForm.addControl('secondImage', new FormControl('', [Validators.required]));
        this.userForm.updateValueAndValidity();
      } else if (value.toLowerCase() === Profile.MEDIC) {
        this.userForm.addControl('specializations', new FormControl([], [Validators.required]));
      } else {
        this.userForm.removeControl('firstImage');
        this.userForm.removeControl('secondImage');
        this.userForm.removeControl('specializations');
      }
    }));
    this.specializations = Object.keys(Speciality)
      .map(value => Speciality[value][0].toUpperCase() + Speciality[value].slice(1, Speciality[value].length));

    this.filteredSpecializations = this.specializationForm.valueChanges.pipe(
      startWith(null),
      map((specialization: string | null) => specialization ? this._filter(specialization) : this.specializations.slice())
    );
  }


  setProfile(option: any): void {
    console.log(option);
    this.profile = option;
  }


  submit() {
    // this.authentication.sendSignInLinkToEmail(this.userForm.value.email, this.userForm.value.password);
    this.render();

  }

  submitAfterCaptcha() {
    if (this.userForm.valid) {
      this.authentication.createUser(this.userForm.value.email, this.userForm.value.password, {
        ...this.userForm.value,
        specializations: this.chipSpecializations.map(value => value.toLowerCase()),
        firstImage: this.firstImage,
        secondImage: this.secondImage
      }).then((value) =>
        this.activeModal.close({successful: true, message: 'User was saved successfully'})
      ).catch(error => {
        this.activeModal.close({successful: false, message: 'There was an error during creation of employee'})
      });
    }
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


  render() {
    this.windowRef.recaptchaVerifier.render();
  }


  verify() {
    this.windowRef.recaptchaVerifier.verify().then(value => {
      console.log(value);
    });
  }

  remove(speciality: string) {
    const index = this.chipSpecializations.indexOf(speciality);

    if (index >= 0) {
      this.chipSpecializations.splice(index, 1);
    }
  }

  capitalize(speciality: string): string {
    return speciality[0].toUpperCase() + speciality.slice(1);
  }

  selectedSpeciality(event: MatAutocompleteSelectedEvent) {
    this.chipSpecializations.push(event.option.viewValue);
    this.specialityInput.nativeElement.value = '';
    this.specializationForm.setValue(null);


  }

  addSpecialization(event: MatChipInputEvent) {
    const input = event.input;
    const value = event.value;

    // Add our fruit
    if ((value || '').trim()) {
      this.chipSpecializations.push(value.trim().toLowerCase());
    }

    // Reset the input value
    if (input) {
      input.value = '';
    }
    this.specializationForm.setValue(null);
    this.userForm.value.specializations = this.chipSpecializations;

  }

  private _filter(specialization: string) {
    console.log(specialization);
    const filterValue = specialization.toLowerCase();
    return this.specializations.filter(spec => spec.toLowerCase().indexOf(filterValue) === 0);
  }

  ngOnDestroy(): void {
    this.subs.forEach(sub => sub.unsubscribe());
  }
}
