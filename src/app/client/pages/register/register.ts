import {ChangeDetectorRef, Component, inject, NgZone} from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../../core/services/auth';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import {RegisterRequest} from '../../../common/models/request/register-request.model';

const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,63}$/;
@Component({
  selector: 'app-register',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './register.html',
  styleUrl: './register.scss',
})
export class RegisterComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);
  private cdr = inject(ChangeDetectorRef);
  private zone = inject(NgZone);


  isLoading = false;
  errorMessage = '';
  errorRetypeMessage = '';
  successMessage = '';
  // Biến để theo dõi form đã được gửi hay chưa, giúp hiển thị lỗi sau khi submit
  submitted = false;
  showSuccessModal = false;

  // Đã thêm 'fullName' vào form group
  registerForm = this.fb.group({
    email: ['', [Validators.required, Validators.pattern(EMAIL_REGEX)]],
    password: ['', [Validators.required]],
    retypePassword: ['', [Validators.required]],
  });

  // Getter tiện lợi để truy cập các control của form
  get fullName() {
    return this.registerForm.get('fullName');
  }
  get email() {
    return this.registerForm.get('email');
  }
  get password() {
    return this.registerForm.get('password');
  }

  get retypePassword() {
    return this.registerForm.get('retypePassword');
  }

  onSubmit() {
    this.submitted = true;
    this.errorMessage = ''; // Xóa lỗi cũ

    // 1. Kiểm tra tính hợp lệ cơ bản của form (required, minLength, pattern)
    if (this.registerForm.invalid) {
      return;
    }

    // 2. ⭐ Thêm kiểm tra mật khẩu khớp nhau ngay trong hàm submit
    const passwordValue = this.password?.value;
    const retypePasswordValue = this.retypePassword?.value;

    if (passwordValue !== retypePasswordValue) {
      // Đặt lỗi 'mismatch' và hiển thị thông báo chung
      this.errorRetypeMessage = 'The re-entered password does not match.';

      // Bạn có thể tùy chọn đặt lỗi lên control cụ thể để hiển thị lỗi chi tiết hơn
      this.retypePassword?.setErrors({ mismatch: true });
      this.cdr.detectChanges();
      return;
    }

    // Nếu mật khẩu khớp, đảm bảo xóa lỗi nếu có
    if (this.retypePassword?.hasError('mismatch')) {
      const errors = this.retypePassword.errors;
      if (errors) {
        delete errors['mismatch'];
        this.retypePassword.setErrors(Object.keys(errors).length === 0 ? null : errors);
      }
    }


    this.isLoading = true;
    this.successMessage = '';

    const formValue = this.registerForm.value;

    // Lấy dữ liệu, KHÔNG LẤY retypePassword
    const registerData: RegisterRequest = {
      email: formValue.email?.trim() ?? '',
      password: formValue.password ?? '',
    };

    this.authService.register(registerData).subscribe({

      next: (res) => {
        this.isLoading = false;
        this.showSuccessModal = true;
        this.cdr.detectChanges();
        setTimeout(() => this.router.navigate(['/login']), 5000);
      },
      error: (err) => {
        this.zone.run(() => {
        this.isLoading = false;
        const apiError = err.error?.message;
        this.errorMessage =  'Email already exists ' +
          'or an unknown system error occurred!';
        this.cdr.detectChanges();
      });
      },
    });

  }

}
