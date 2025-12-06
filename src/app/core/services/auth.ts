import {Inject, Injectable, PLATFORM_ID} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { LoginRequest } from '../../common/models/request/login-request.model';
import { AuthResponse } from '../../common/models/response/auth-response.model';
import {BehaviorSubject, map, Observable, tap} from 'rxjs';
import { Router } from '@angular/router';
import {API_URLS} from '../../common/constants/api.constants';
import { isPlatformBrowser } from '@angular/common';
import {RegisterResponse} from '../../common/models/response/register-response';
import {RegisterRequest} from '../../common/models/request/register-request.model';
import {VerifyOtpRequest} from '../../common/models/request/verify-otp-request';
import {ResetPasswordRequest} from '../../common/models/request/reset-password-request';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
// Theo dõi trạng thái đăng nhập
  private currentUserSubject = new BehaviorSubject<any>(null);
  currentUser$ = this.currentUserSubject.asObservable();

  isLoggedIn$ = this.currentUserSubject.pipe(
    map(user => !!user)
  );

  constructor(
    private http: HttpClient,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    // Kiểm tra xem đã đăng nhập chưa (khi reload trang)
    // this.checkLoginStatus();
    setTimeout(() => this.checkLoginStatus(), 0);
  }

  login(credentials: any): Observable<any> {
    return this.http.post<any>(API_URLS.AUTH.LOGIN, credentials, {
      withCredentials: true
    }).pipe(
      tap(response => {
        // Lưu thông tin user (có thể lưu thêm vào localStorage nếu muốn)
        const user = {
          fullName: response.fullName,
          role: response.role,
          pictureUrl: response.pictureUrl,
          email: credentials.email // hoặc lấy từ token nếu cần
        };
        this.currentUserSubject.next(user);

        // Optional: lưu một chút info vào localStorage để reload trang vẫn biết đã login
        localStorage.setItem('currentUser', JSON.stringify(user));
      })
    );
  }

  logoutAdmin() {
    this.currentUserSubject.next(null);
    localStorage.removeItem('currentUser');
    this.http.post(API_URLS.AUTH.LOGOUT, {}, { withCredentials: true });
  }


  logout() {
    // Gọi backend để xóa refresh token (nếu bạn có endpoint /logout)
    this.http.post(API_URLS.AUTH.LOGOUT, {}, { withCredentials: true }).subscribe({
      next: () => this.handleLogoutSuccess(),
      error: () => this.handleLogoutSuccess()
    });
  }

  private handleLogoutSuccess(noRedirect: boolean = false) {
    this.currentUserSubject.next(null);
    localStorage.removeItem('currentUser');
    this.router.navigate(['/login']);
  }

  private checkLoginStatus() {
    // >>> THÊM KIỂM TRA MÔI TRƯỜNG <<<
    if (isPlatformBrowser(this.platformId)) {
      const user = localStorage.getItem('currentUser');
      if (user) {
        this.currentUserSubject.next(JSON.parse(user));
      }
    }
  }

  refreshToken() {
    return this.http.post<any>(API_URLS.AUTH.REFRESH_TOKEN, {}, { withCredentials: true });
  }

  getCurrentUser() {
    return this.currentUserSubject.value;
  }

  getCurrentUserSync(): any {
    // Đảm bảo luôn có giá trị mới nhất (trong trường hợp đang delay)
    let user = this.currentUserSubject.value;
    if (!user && isPlatformBrowser(this.platformId)) {
      const saved = localStorage.getItem('currentUser');
      if (saved) {
        try {
          user = JSON.parse(saved);
          this.currentUserSubject.next(user); // đồng bộ luôn
        } catch {}
      }
    }
    return user;
  }

  setCurrentUser(user: any): Promise<void> { // Hoặc Observable<any>
    return new Promise(resolve => {
      // Tác vụ Đồng bộ
      localStorage.setItem('currentUser', JSON.stringify(user));
      this.currentUserSubject.next(user);

      // Hoàn thành Promise sau khi lưu trữ xong
      resolve();
    });
  }

  loginWithGoogle() {
    window.location.href = API_URLS.AUTH.GOOGLE_LOGIN;
  }

  register(data: RegisterRequest) {
    return this.http.post<RegisterResponse>(API_URLS.AUTH.REGISTER, data);
  }

  sendOtp(email: string) {
    return this.http.post(API_URLS.AUTH.FORGOT_PASSWORD, { email });
  }

  verifyOtp(data: VerifyOtpRequest) {
    return this.http.post(API_URLS.AUTH.VERIFY_OTP,data ,{ withCredentials: true });
  }

  resetPassword(data: ResetPasswordRequest) {
    return this.http.post(API_URLS.AUTH.RESET_PASSWORD, data ,{ withCredentials: true });
  }

}
