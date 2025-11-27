import {Component, CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';

@Component({
  selector: 'app-not-found',
  imports: [],
  templateUrl: './not-found.html',
  styleUrl: './not-found.scss',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class NotFoundComponent {
  goBack() {
    window.history.back();
  }
}
