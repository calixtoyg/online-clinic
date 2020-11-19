import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WriteCommentsModalComponent } from './write-comments-modal.component';

describe('WriteCommentsModalComponent', () => {
  let component: WriteCommentsModalComponent;
  let fixture: ComponentFixture<WriteCommentsModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WriteCommentsModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WriteCommentsModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
