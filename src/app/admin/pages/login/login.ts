import {ChangeDetectorRef, Component, inject, NgZone} from '@angular/core';
import {FormBuilder, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {NgClass, NgIf} from '@angular/common';
import {AuthService} from '../../../core/services/auth';
import {Router} from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [
    FormsModule,
    NgIf,
    ReactiveFormsModule,
    NgClass
  ],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class AdminLoginComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);
  private cdr = inject(ChangeDetectorRef);
  private zone = inject(NgZone);


  loginForm = this.fb.group({
    email: ['', [Validators.required]],
    password: ['', Validators.required]
  });

  isLoading = false;
  errorMessage = '';
  submitted = false
  isGoogleAccount = false;

  get email() { return this.loginForm.get('email'); }
  get password() { return this.loginForm.get('password'); }

  constructor() {
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
        this.zone.run(() => {
          const currentUser = this.authService.getCurrentUser();
          if (currentUser && currentUser.role === 'ADMIN') {
            this.isLoading = false;
            this.router.navigate(['/admin/dashboard']);
          } else {
            this.isLoading = false;
            this.errorMessage = 'You are not authorized as an admin.';
            this.authService.logoutAdmin();
            this.cdr.detectChanges();
          }
        });
      },
      error: (err) => {
        this.zone.run(() => {
          this.isLoading = false;

          this.errorMessage = ''; // Đảm bảo reset

          if (err.error?.errorCode === 'Bad_Credential' && err.error?.message?.includes('Google')) {
            this.errorMessage = 'This is a Google-registered account. Please use the button below.';
            this.isGoogleAccount = true;
          } else {
            // Đảm bảo thông báo lỗi chung có giá trị
            this.errorMessage = 'Incorrect email or password.';
            this.isGoogleAccount = false;
          }

          this.cdr.detectChanges();
        });
      }
    });

  }

}
