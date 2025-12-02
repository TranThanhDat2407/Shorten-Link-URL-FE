import {Component, inject} from '@angular/core';
import {AsyncPipe} from '@angular/common';
import {AuthService} from '../../../../core/services/auth';
import {RouterLink} from '@angular/router';

@Component({
  selector: 'app-header',
  imports: [
    AsyncPipe,
    RouterLink
  ],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class Header {
  private authService = inject(AuthService);

  // Observable để template dùng async pipe
  currentUser$ = this.authService.currentUser$;

  logout(): void {
    this.authService.logout();
  }
}
