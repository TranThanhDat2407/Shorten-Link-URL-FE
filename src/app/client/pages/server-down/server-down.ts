import { Component } from '@angular/core';
import {HealthCheckService} from '../../../core/services/health-check';
import {Router} from '@angular/router';

@Component({
  selector: 'app-server-down',
  imports: [],
  templateUrl: './server-down.html',
  styleUrl: './server-down.scss',
})
export class ServerDownComponent {
  constructor(private health: HealthCheckService, private router: Router) {}

  retry() {
    this.health.checkHealth().subscribe(isUp => {
      if (isUp) {
        this.router.navigate(['/']);
      }
    });
  }
}
