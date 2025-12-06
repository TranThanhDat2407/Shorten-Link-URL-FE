import {
  Component,
  ElementRef,
  QueryList,
  ViewChildren,
  inject,
  OnInit,
  AfterViewInit,
  PLATFORM_ID, ChangeDetectorRef, NgZone, signal
} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {FormsModule} from '@angular/forms';
import {isPlatformBrowser, NgForOf, NgIf} from '@angular/common';
import {AuthService} from '../../../core/services/auth';
import {VerifyOtpRequest} from '../../../common/models/request/verify-otp-request';

@Component({
  selector: 'app-forgot-password-otp-verify',
  imports: [
    FormsModule,
    NgForOf,
    NgIf,
  ],
  templateUrl: './forgot-password-otp-verify.html',
  styleUrl: './forgot-password-otp-verify.scss',
})
export class ForgotPasswordOtpVerifyComponent implements OnInit, AfterViewInit {

  private authService = inject(AuthService);
  private router = inject(Router);
  private cdr = inject(ChangeDetectorRef);
  private platformId = inject(PLATFORM_ID);
  private zone = inject(NgZone);

  otpControls = [0, 1, 2, 3, 4, 5];
  email = '';
  maskedEmail = '';
  errorMessage = '';
  isLoading = false;

  @ViewChildren('otpInput') otpInputs!: QueryList<ElementRef>;

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      const state = window.history.state;
      this.email = state?.email || '';
    }
    if (!this.email) {
      // Điều hướng lại về bước nhập email
      this.router.navigate(['/forgot-password']);
      return;
    }

    this.maskedEmail = this.maskEmail(this.email);
  }

  ngAfterViewInit() {
    setTimeout(() => this.otpInputs.first.nativeElement.focus(), 10);
  }

  maskEmail(email: string): string {
    if (!email) return '';

    const [name, domain] = email.split('@');
    return `${name.substring(0, 2)}***@${domain}`;
  }

  onInput(event: any, index: number) {
    const input = event.target;
    const value = input.value;

    if (/^[0-9]$/.test(value)) {
      if (index < 5) {
        this.otpInputs.toArray()[index + 1].nativeElement.focus();
      }
    } else {
      input.value = '';
    }
  }

  onKeyDown(event: any, index: number) {
    if (event.key === 'Backspace' && index > 0 && !event.target.value) {
      this.otpInputs.toArray()[index - 1].nativeElement.focus();
    }
  }

  onPaste(event: ClipboardEvent) {
    const text = event.clipboardData?.getData('text') ?? '';
    if (/^\d{6}$/.test(text)) {
      const chars = text.split('');
      this.otpInputs.forEach((input, i) => input.nativeElement.value = chars[i]);
    }
    event.preventDefault();
  }

  verifyOtp() {
    const otp = this.otpInputs.toArray().map(i => i.nativeElement.value).join('');

    if (otp.length !== 6) {
      this.errorMessage = 'OTP must be 6 digits';
      return;
    }

    this.isLoading = true;


    const body: VerifyOtpRequest = {
      email: this.email,
      otp: otp
    };

    this.authService.verifyOtp(body).subscribe({
      next: () => {
        this.router.navigate(
          ['/forgot-password/reset'],
          { state: { email: this.email } }
        );
      },
      error: err => {
        this.zone.run(() => {
          this.errorMessage = err.error?.message || 'Invalid OTP';
          this.isLoading = false;
          this.cdr.detectChanges();
        })
      }
    });
  }

  successMessage: string = '';
  resendDisabled = signal(false);
  counter = signal(0);
  intervalId: any;

  startCountdown() {
    this.resendDisabled.set(true);
    this.counter.set(60);

    this.intervalId = setInterval(() => {
      const newValue = this.counter() - 1;
      this.counter.set(newValue);

      if (newValue === 0) {
        clearInterval(this.intervalId);
        this.resendDisabled.set(false);
      }
    }, 1000);
  }

  resendOtp() {
    if (!this.email) return;

    this.startCountdown();

    this.authService.sendOtp(this.email).subscribe({
      next: () => {
        this.zone.run(() => {
          this.successMessage = 'OTP has been resent!';
          this.cdr.detectChanges();
          setTimeout(() => this.successMessage = '', 3000);
        })
      },
      error: err => {
        this.zone.run(() => {
        this.errorMessage = err.error?.message;
        this.cdr.detectChanges();
        })
      }
    });
  }

}
