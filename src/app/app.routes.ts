import { Routes } from '@angular/router';
import {UserDashboardComponent} from './client/pages/dashboard/dashboard';
import { AuthGuard } from './core/guards/auth.guard';
import {RoleGuard} from './core/guards/role.guard';
import {MyLinkComponent} from './client/pages/my-link/my-link';

export const routes: Routes = [
  // CLIENT ROUTES - đường dẫn bình thường /
  {
    path: '',
    loadComponent: () => import('./client/layout/client-layout/client-layout')
      .then(c => c.ClientLayoutComponent),
    children: [
      { path: '', loadComponent: () => import('./client/pages/home/home')
          .then(c => c.HomeComponent) },

      { path: 'not-found', loadComponent: () => import('./client/pages/not-found/not-found')
          .then(c => c.NotFoundComponent) },

      { path: 'login', loadComponent: () => import('./client/pages/login/login')
      .then(c => c.LoginComponent) },

      {
        path: 'google-success',
        loadComponent: () => import('./client/pages/google-success/google-success')
          .then(c => c.GoogleSuccessComponent)
      },

      { path: 'register', loadComponent: () => import('./client/pages/register/register')
          .then(c => c.RegisterComponent) },

      { path: 'user/dashboard', loadComponent: () => import('./client/pages/dashboard/dashboard')
          .then(c => c.UserDashboardComponent),
          canActivate: [AuthGuard, RoleGuard],
          data: { roles: ['USER', 'ROLE_USER'] }
      },

      { path: 'user/my-link', loadComponent: () => import('./client/pages/my-link/my-link')
          .then(c => c.MyLinkComponent),
        canActivate: [AuthGuard, RoleGuard],
        data: { roles: ['USER', 'ROLE_USER'] }
      },

      {
        path: ':code',
        loadComponent: () => import('./client/pages/redirect/redirect')
          .then(c => c.RedirectComponent)
      },
      // các trang client khác thêm ở đây
    ]
  },

  // ADMIN ROUTES - bắt đầu bằng /admin

  // {
  //   path: 'admin',
  //   loadComponent: () => import('./admin/layout/admin-layout/admin-layout.component')
  //     .then(c => c.AdminLayoutComponent),
  //   canActivate: [AuthGuard, RoleGuard],
  //   data: { roles: ['ADMIN', 'ROLE_ADMIN'] }
  //   children: [
  //     { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  //     { path: 'dashboard', loadComponent: () => import('./admin/pages/dashboard/dashboard.component').then(c => c.DashboardComponent) },
  //     // các trang admin khác
  //   ]
  // },

  { path: '**', redirectTo: '/not-found' }
];
