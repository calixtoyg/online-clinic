import {Component, OnDestroy, OnInit} from '@angular/core';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {CreateUserModalComponent} from '../create-user-modal/create-user-modal.component';
import {Profile} from '../../enum/profile.enum';
import {Subject, Subscription} from 'rxjs';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {CalendarService} from '../../services/calendar.service';
import {AppointmentStatesFilter} from '../../model/appointment-states-filter';
import {parse} from 'json2csv';


@Component({
  selector: 'app-welcome-professional',
  templateUrl: './welcome-professional.component.html',
  styleUrls: ['./welcome-professional.component.css']
})
export class WelcomeProfessionalComponent implements OnInit, OnDestroy {
  year: number;
  month: number;
  day: number;
  email: string;
  alertMessage: string;
  alertType: string;
  private alertSubscription = new Subject<any>();
  subs: Subscription[] = [];
  search: string;
  filterForm: FormGroup;
  exportAppointments: any[];
  public searchAndFilter = [] as AppointmentStatesFilter[];

  constructor(private modalService: NgbModal, private fb: FormBuilder, private calendarService: CalendarService) {
  }

  ngOnInit(): void {

    this.filterForm = this.fb.group({
      search: ['', Validators.required],
      dynamic: ['', Validators.required],
      filter: ['', Validators.required],
      acceptedByPatient: ['', Validators.required],
      acceptedByProfessional: ['', Validators.required],
      done: ['', Validators.required]
    });

    this.subs.push(this.filterForm.get('search').valueChanges.subscribe(value => {
      this.setFilter({condition: 'email', filter: 'email', search: value});
    }));
    //
    this.subs.push(this.filterForm.get('acceptedByProfessional').valueChanges.subscribe(value => {
        this.setFilter({filter: value, condition: 'acceptedByProfessional'});
      }
    ));
    this.subs.push(this.filterForm.get('dynamic').valueChanges.subscribe(value => {
        this.setFilter({filter: value, condition: 'dynamic'});
      }
    ));
    this.subs.push(this.filterForm.get('acceptedByPatient').valueChanges.subscribe(value => {
        this.setFilter({filter: value, condition: 'acceptedByPatient'});
      }
    ));
    this.subs.push(this.filterForm.get('done').valueChanges.subscribe(value => {
        this.setFilter({filter: value, condition: 'done'});

      }
    ));
    this.subs.push(this.alertSubscription.subscribe(({message, successful}) => {
      this.alertMessage = message;
      this.alertType = successful ? 'success' : 'danger';
    }));
    this.email = localStorage.getItem('email');
    const today = new Date();
    this.year = today.getFullYear();
    this.month = today.getMonth();
    this.day = today.getDate();
  }

  open() {
    const modalRef = this.modalService.open(CreateUserModalComponent);
    modalRef.componentInstance.options = Object.keys(Profile)
      .map(value => Profile[value][0].toUpperCase() + Profile[value].slice(1, Profile[value].length));
    modalRef.componentInstance.name = 'some name';
    modalRef.result.then(value => {
      this.alertSubscription.next(value);
    });
  }

  ngOnDestroy(): void {
    this.subs.forEach(s => s.unsubscribe());
  }

  private setFilter(filter: AppointmentStatesFilter) {
    const filterIndex = this.searchAndFilter.findIndex(({condition}) => filter.condition === condition);
    if (filterIndex === -1) {
      this.searchAndFilter.push(filter);
    } else {
      this.searchAndFilter[filterIndex] = filter;
    }
    this.searchAndFilter = this.searchAndFilter.slice();

  }

  setExportAppointments($event: any) {
    this.exportAppointments = $event;
  }

  csvImporter() {
    const csv = parse(this.exportAppointments);
    const blob = new Blob([csv], {type: 'text/csv'});
    const downloadLink = this.downloadBlob(blob, 'appointments_' + this.year + '.csv');
    downloadLink.title = 'Export Records as CSV';
    downloadLink.classList.add('btn-link', 'download-link');
    downloadLink.textContent = 'Export Records';
    document.body.appendChild(downloadLink);
  }

  downloadBlob(blob, filename) {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename || 'download';
    const clickHandler = () => {
      setTimeout(() => {
        URL.revokeObjectURL(url);
        // @ts-ignore
        this.removeEventListener('click', clickHandler);
      }, 150);
    };
    a.addEventListener('click', clickHandler, false);
    a.click();
    return a;
  }
}
