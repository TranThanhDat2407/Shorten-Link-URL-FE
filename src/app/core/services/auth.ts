import {Inject, Injectable, PLATFORM_ID} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { LoginRequest } from '../../common/models/request/login-request.model';
import { AuthResponse } from '../../common/models/response/auth-response.model';
import {BehaviorSubject, map, Observable, tap} from 'rxjs';
import { Router } from '@angular/router';
import {API_URLS} from '../../common/constants/api.constants';
import { isPlatformBrowser } from '@angular/common';

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
    this.checkLoginStatus();
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

  logout() {
    // Gọi backend để xóa refresh token (nếu bạn có endpoint /logout)
    this.http.post(API_URLS.AUTH.LOGOUT, {}, { withCredentials: true }).subscribe({
      next: () => this.handleLogoutSuccess(),
      error: () => this.handleLogoutSuccess() // vẫn logout dù lỗi
    });
  }

  private handleLogoutSuccess() {
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

}
