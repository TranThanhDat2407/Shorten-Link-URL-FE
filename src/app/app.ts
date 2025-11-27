import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {FaIconLibrary, FontAwesomeModule} from '@fortawesome/angular-fontawesome';
import {faTwitter} from '@fortawesome/free-brands-svg-icons/faTwitter';
import {faGoogle} from '@fortawesome/free-brands-svg-icons/faGoogle';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, FontAwesomeModule],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('short-link-fe');

  constructor(library: FaIconLibrary) {
    library.addIcons(faTwitter,faGoogle);
  }
}
