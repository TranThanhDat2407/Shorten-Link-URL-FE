import {ChangeDetectorRef, Component, inject, NgZone} from '@angular/core';
import {FormBuilder, ReactiveFormsModule, Validators} from '@angular/forms';
import {AuthService} from '../../../core/services/auth';
import {NgClass, NgIf} from '@angular/common';
import {Router} from '@angular/router';

@Component({
  selector: 'app-forgot-password',
  imports: [
    ReactiveFormsModule,
    NgClass,
    NgIf
  ],
  templateUrl: './forgot-password.html',
  styleUrl: './forgot-password.scss',
})
export class ForgotPasswordComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);
  private cdr = inject(ChangeDetectorRef);
  private zone = inject(NgZone);

  emailForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]]
  });

  submitted = false;
  isLoading = false;
  errorMessage = '';

  get email() {
    return this.emailForm.get('email');
  }

  submitEmail() {
    this.submitted = true;

    if (this.emailForm.invalid) return;

    const email = this.emailForm.value.email!;

    this.isLoading = true;

    this.authService.sendOtp(this.emailForm.value.email!).subscribe({
      next: () => {
        this.router.navigate(
          ['/forgot-password/verify-otp'],
          {state: {email}}
        );

      },
      error: err => {
        this.zone.run(() => {

          if(err.error?.message?.toLowerCase().includes("please wait 1 hour")){
            this.errorMessage = 'You sent to much forgot password request! ' +
              'Please wait 1 hour and try again.';
          }else if(err.error?.message?.toLowerCase().includes("before send new OTP request")){
            this.errorMessage = err.error?.message;
          }else{
            this.errorMessage = 'Something went wrong';
          }

          console.log(err.error?.message);
          this.isLoading = false;
          this.cdr.detectChanges();
        });

      }
    });
  }

  clearError() {
    this.errorMessage = '';
  }
}
