import {Component, OnInit, signal} from '@angular/core';
import {Router, RouterOutlet} from '@angular/router';
import {FaIconLibrary, FontAwesomeModule} from '@fortawesome/angular-fontawesome';
import {faTwitter} from '@fortawesome/free-brands-svg-icons/faTwitter';
import {faGoogle} from '@fortawesome/free-brands-svg-icons/faGoogle';
import {HttpClient} from '@angular/common/http';
import {environment} from './environments/environment';
import {HealthCheckService} from './core/services/health-check';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, FontAwesomeModule],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App implements OnInit {
  protected readonly title = signal('short-link-fe');

  constructor(library: FaIconLibrary,private http: HttpClient,
              private healthService: HealthCheckService, private router: Router) {
    library.addIcons(faTwitter,faGoogle);
  }

  ngOnInit() {
    this.healthService.monitorHealth().subscribe((isUp) => {
      if (!isUp) {
        this.router.navigate(['/server-down']);
      }
    });
  }

}
