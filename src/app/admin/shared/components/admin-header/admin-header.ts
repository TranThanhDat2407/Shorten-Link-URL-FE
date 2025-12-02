import {Component, inject} from '@angular/core';
import {AsyncPipe} from "@angular/common";
import {RouterLink} from "@angular/router";
import {AuthService} from '../../../../core/services/auth';

@Component({
  selector: 'app-admin-header',
    imports: [
        AsyncPipe,
        RouterLink
    ],
  templateUrl: './admin-header.html',
  styleUrl: './admin-header.scss',
})
export class AdminHeader {
  private authService = inject(AuthService);
  currentUser$ = this.authService.currentUser$;

  logout(): void {
    this.authService.logoutAdmin();
  }


}
