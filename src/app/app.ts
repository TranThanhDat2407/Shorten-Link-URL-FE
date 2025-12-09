import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {FaIconLibrary, FontAwesomeModule} from '@fortawesome/angular-fontawesome';
import {faTwitter} from '@fortawesome/free-brands-svg-icons/faTwitter';
import {faGoogle} from '@fortawesome/free-brands-svg-icons/faGoogle';
import {HttpClient} from '@angular/common/http';
import {environment} from './environments/environment';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, FontAwesomeModule],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('short-link-fe');

  constructor(library: FaIconLibrary,private http: HttpClient) {
    library.addIcons(faTwitter,faGoogle);
  }

  ngOnInit() {
    setInterval(() => {
      this.http.get(environment.apiUrl + "/actuator/health").subscribe();
    }, 5 * 60 * 1000); // 5 phút
  }

}
