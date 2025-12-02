import { Component } from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {AdminHeader} from '../../shared/components/admin-header/admin-header';

@Component({
  selector: 'app-admin-layout',
  imports: [
    RouterOutlet,
    AdminHeader
  ],
  templateUrl: './admin-layout.html',
  styleUrl: './admin-layout.scss',
})
export class AdminLayoutComponent {

}
