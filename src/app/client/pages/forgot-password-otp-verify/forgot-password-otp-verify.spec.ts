import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ForgotPasswordOtpVerify } from './forgot-password-otp-verify';

describe('ForgotPasswordOtpVerify', () => {
  let component: ForgotPasswordOtpVerify;
  let fixture: ComponentFixture<ForgotPasswordOtpVerify>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ForgotPasswordOtpVerify]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ForgotPasswordOtpVerify);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
