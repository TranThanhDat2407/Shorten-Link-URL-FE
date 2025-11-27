// guards/role.guard.ts
import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, Router } from '@angular/router';
import { AuthService } from '../services/auth';

@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  canActivate(route: ActivatedRouteSnapshot): boolean {
    const expectedRoles: string[] = route.data['roles'] as string[];
    const user = this.authService.getCurrentUser();

    if (!user) {
      this.router.navigate(['/login']);
      return false;
    }

    // Nếu không truyền roles → cho qua (chỉ cần login)
    if (!expectedRoles || expectedRoles.length === 0) {
      return true;
    }

    const hasRole = expectedRoles.some(role =>
      user.role === role || user.role === 'ROLE_' + role
    );

    if (!hasRole) {
      // Không có quyền → chuyển về trang 403 hoặc home
      this.router.navigate(['/access-denied']);
      return false;
    }

    return true;
  }
}
