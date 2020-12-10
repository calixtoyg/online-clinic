import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfessionalStatisticsComponent } from './professional-statistics.component';

describe('ProfessionalStatisticsComponent', () => {
  let component: ProfessionalStatisticsComponent;
  let fixture: ComponentFixture<ProfessionalStatisticsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProfessionalStatisticsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfessionalStatisticsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
