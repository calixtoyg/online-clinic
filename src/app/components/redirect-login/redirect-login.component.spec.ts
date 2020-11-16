import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RedirectLoginComponent } from './redirect-login.component';

describe('RedirectLoginComponent', () => {
  let component: RedirectLoginComponent;
  let fixture: ComponentFixture<RedirectLoginComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RedirectLoginComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RedirectLoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
