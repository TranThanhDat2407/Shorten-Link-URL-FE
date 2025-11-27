// login.component.ts
import {ChangeDetectorRef, Component, inject, NgZone} from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../../core/services/auth';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,63}$/;

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrls: ['./login.scss']
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);
  private cdr = inject(ChangeDetectorRef);
  private zone = inject(NgZone);


  loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.pattern(EMAIL_REGEX)]],
    password: ['', Validators.required]
  });

  isLoading = false;
  errorMessage = '';
  submitted = false
  isGoogleAccount = false;

  get email() { return this.loginForm.get('email'); }
  get password() { return this.loginForm.get('password'); }

  constructor() {
    // Nếu đã login rồi thì đá về home
    if (this.authService.getCurrentUser()) {
      this.router.navigate(['/']);
    }
  }

  onSubmit() {
    if (this.loginForm.invalid) return;

    this.isLoading = true;
    this.errorMessage = '';
    this.isGoogleAccount = false;

    this.authService.login(this.loginForm.value).subscribe({
      next: () => {
        this.isLoading = false;
        this.router.navigate(['/']);
      },
      error: (err) => {
        this.zone.run(() => {
        this.isLoading = false;
          const errorBody = err.error;
          const msg = errorBody?.message ? errorBody.message.trim() : '';
          const code = errorBody?.errorCode;

          this.isGoogleAccount = false;
          this.errorMessage = ''; // Đảm bảo reset

        if (err.error?.errorCode === 'Bad_Credential' && err.error?.message?.includes('Google')) {
          this.errorMessage = 'This is a Google-registered account. Please use the button below.';
          this.isGoogleAccount = true;
        } else {
          // Đảm bảo thông báo lỗi chung có giá trị
          this.errorMessage = 'Incorrect email or password.';
          this.isGoogleAccount = false;
        }

        // BUỘC Angular phát hiện thay đổi NGAY LẬP TỨC
        this.cdr.detectChanges();
        });
      }
    });

  }

  loginWithGoogle() {
    this.authService.loginWithGoogle();
  }
}
