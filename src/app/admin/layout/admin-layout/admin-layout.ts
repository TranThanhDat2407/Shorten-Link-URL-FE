import {Component, inject} from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {AdminHeader} from '../../shared/components/admin-header/admin-header';
import {AsyncPipe, NgIf} from "@angular/common";
import {Sidebar} from "../../../client/shared/components/sidebar/sidebar";
import {AdminSidebar} from '../../shared/components/admin-sidebar/admin-sidebar';
import {AuthService} from '../../../core/services/auth';
import {map} from 'rxjs';

@Component({
  selector: 'app-admin-layout',
  imports: [
    RouterOutlet,
    AdminHeader,
    AsyncPipe,
    NgIf,
    AdminSidebar
  ],
  templateUrl: './admin-layout.html',
  styleUrl: './admin-layout.scss',
})
export class AdminLayoutComponent {
  authService = inject(AuthService);

  isLoggedIn$ = this.authService.currentUser$.pipe(
    map(user => !!user)
  );

}
