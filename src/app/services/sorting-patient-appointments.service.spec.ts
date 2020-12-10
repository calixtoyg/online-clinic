import { TestBed } from '@angular/core/testing';

import { SortingPatientAppointmentsService } from './sorting-patient-appointments.service';

describe('SortingPatientAppointmentsService', () => {
  let service: SortingPatientAppointmentsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SortingPatientAppointmentsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
