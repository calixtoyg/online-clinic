import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WelcomePatientComponent } from './welcome-patient.component';

describe('WelcomePatientComponent', () => {
  let component: WelcomePatientComponent;
  let fixture: ComponentFixture<WelcomePatientComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WelcomePatientComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WelcomePatientComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
