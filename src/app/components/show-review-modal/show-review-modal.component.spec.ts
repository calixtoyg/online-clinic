import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowReviewModalComponent } from './show-review-modal.component';

describe('ShowReviewModalComponent', () => {
  let component: ShowReviewModalComponent;
  let fixture: ComponentFixture<ShowReviewModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShowReviewModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowReviewModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
