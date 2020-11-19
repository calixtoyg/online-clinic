import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowCommentAndAnswersComponent } from './show-comment-and-answers.component';

describe('ShowCommentAndAnswersComponent', () => {
  let component: ShowCommentAndAnswersComponent;
  let fixture: ComponentFixture<ShowCommentAndAnswersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShowCommentAndAnswersComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowCommentAndAnswersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
