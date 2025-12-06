import {Component, OnInit, inject, PLATFORM_ID} from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import {AuthService} from '../../../core/services/auth';
import {isPlatformBrowser, NgIf} from '@angular/common';
declare var bootstrap: any;

@Component({
  selector: 'app-reset-password',
  imports: [FormsModule, NgIf],
  templateUrl: './reset-password.html',
  styleUrl: './reset-password.scss',
})
export class ResetPasswordComponent implements OnInit {

  private router = inject(Router);
  private authService = inject(AuthService);
  private platformId = inject(PLATFORM_ID);

  email = '';
  newPassword = '';
  confirmPassword = '';
  errorMessage = '';
  isLoading = false;

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      const state = window.history.state;
      this.email = state?.email || '';
    }

    if (!this.email) {
      this.router.navigate(['/forgot-password']);
    }
  }

  submit() {
    this.errorMessage = '';

    if (this.newPassword !== this.confirmPassword) {
      this.errorMessage = 'Passwords do not match';
      return;
    }

    this.isLoading = true;

    const modalEl = document.getElementById('resetSuccessModal');
    const modal = new bootstrap.Modal(modalEl);
    modal.show();

    const body = {
      newPassword: this.newPassword,
      confirmPassword: this.confirmPassword
    };

    this.authService.resetPassword(body).subscribe({
      next: () => {
        this.isLoading = false;
        setTimeout(() => {
          modal.hide();
          this.router.navigate(['/login'], {
            state: { message: 'Password reset successfully!' }
          });
        }, 5000);
      },
      error: err => {
        this.errorMessage = err.error?.message || 'Something went wrong';
        this.isLoading = false;
      }
    });
  }



}
