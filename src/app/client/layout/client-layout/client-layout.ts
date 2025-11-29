import {Component, inject} from '@angular/core';
import {Header} from '../../shared/components/header/header';
import {Footer} from '../../shared/components/footer/footer';
import {RouterOutlet} from '@angular/router';
import {map} from 'rxjs';
import {AuthService} from '../../../core/services/auth';
import {AsyncPipe, NgIf} from '@angular/common';
import {Sidebar} from '../../shared/components/sidebar/sidebar';

@Component({
  selector: 'app-client-layout',
  imports: [
    Header,
    Footer,
    RouterOutlet,
    AsyncPipe,
    Sidebar,
    NgIf
  ],
  templateUrl: './client-layout.html',
  styleUrl: './client-layout.scss',
})
export class ClientLayoutComponent {
  authService = inject(AuthService);
  isLoggedIn$ = this.authService.currentUser$.pipe(
    map(user => !!user)
  );

}
