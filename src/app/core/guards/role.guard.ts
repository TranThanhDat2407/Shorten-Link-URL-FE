// src/app/guards/role.guard.ts
import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, Router, UrlTree } from '@angular/router';
import { AuthService } from '../services/auth';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class RoleGuard implements CanActivate {

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  canActivate(route: ActivatedRouteSnapshot): Observable<boolean | UrlTree> {

    const expectedRoles: string[] = route.data['roles'] as string[] || [];

    return this.authService.currentUser$.pipe(
      take(1),
      map(user => {

        // 1. Chưa đăng nhập → về login
        if (!user) {
          const returnUrl = this.router.routerState.snapshot.url;
          return this.router.createUrlTree(['/login'], { queryParams: { returnUrl } });
        }

        console.log('RoleGuard - User role hiện tại:', user.role);

        // 2. Không yêu cầu role nào → cho qua
        if (expectedRoles.length === 0) {
          return true;
        }

        // 3. Kiểm tra role
        const hasRole = expectedRoles.some(expected =>
          user.role === expected ||
          user.role === 'ROLE_USER' ||
          user.role?.startsWith('ROLE_')
      );

        // 4. Không có quyền → về trang từ chối
        if (!hasRole) {
          return this.router.createUrlTree(['/access-denied']);
          // hoặc ['/'], ['/user/dashboard'] tùy bạn
        }

        // 5. OK → cho vào
        return true;
      })
    );
  }
}
