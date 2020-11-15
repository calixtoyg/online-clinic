import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PossibleDatesComponent } from './possible-dates.component';

describe('PossibleDatesComponent', () => {
  let component: PossibleDatesComponent;
  let fixture: ComponentFixture<PossibleDatesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PossibleDatesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PossibleDatesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
