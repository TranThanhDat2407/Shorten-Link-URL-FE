import { Routes } from '@angular/router';
// import { AdminGuard } from './core/guards/admin.guard';

export const routes: Routes = [
  // CLIENT ROUTES - đường dẫn bình thường /
  {
    path: '',
    loadComponent: () => import('./client/layout/client-layout/client-layout')
      .then(c => c.ClientLayoutComponent),
    children: [
      { path: '', loadComponent: () => import('./client/pages/home/home')
          .then(c => c.HomeComponent) },
      {
        path: ':code',
        loadComponent: () => import('./client/pages/redirect/redirect')
          .then(c => c.RedirectComponent)
      },
      // { path: 'login', loadComponent: () => import('./client/pages/login/login.component').then(c => c.LoginComponent) },
      // các trang client khác thêm ở đây
    ]
  },

  // ADMIN ROUTES - bắt đầu bằng /admin

  // {
  //   path: 'admin',
  //   loadComponent: () => import('./admin/layout/admin-layout/admin-layout.component')
  //     .then(c => c.AdminLayoutComponent),
  //   canActivate: [AdminGuard],
  //   children: [
  //     { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  //     { path: 'dashboard', loadComponent: () => import('./admin/pages/dashboard/dashboard.component').then(c => c.DashboardComponent) },
  //     // các trang admin khác
  //   ]
  // },

  { path: '**', redirectTo: '' }
];
