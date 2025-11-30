// auth.guard.ts  ← CHỈ CẦN SỬA FILE NÀY LÀ XONG MÃI MÃI
import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { AuthService } from '../services/auth';
import { Observable, of } from 'rxjs';
import { map, take } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  canActivate(): Observable<boolean | UrlTree> {
    return this.authService.currentUser$.pipe(
      take(1),
      map(user => {
        if (user && user.role) {
          console.log('AuthGuard: Đã login →', user.role);
          return true;
        }

        // Lưu URL để login xong quay lại
        const returnUrl = this.router.routerState.snapshot.url;
        return this.router.createUrlTree(['/login'], {
          queryParams: { returnUrl }
        });
      })
    );
  }
}
