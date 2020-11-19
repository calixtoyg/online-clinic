import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TodayAppointmentsPatientsComponent } from './today-appointments-patients.component';

describe('TodayAppointmentsPatientsComponent', () => {
  let component: TodayAppointmentsPatientsComponent;
  let fixture: ComponentFixture<TodayAppointmentsPatientsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TodayAppointmentsPatientsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TodayAppointmentsPatientsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
