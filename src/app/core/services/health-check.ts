import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {catchError, map, of, switchMap, timer} from 'rxjs';
import {API_URLS} from '../../common/constants/api.constants';

@Injectable({ providedIn: 'root' })
export class HealthCheckService {

  constructor(private http: HttpClient) {}

  checkHealth() {
    return this.http.get(API_URLS.HEALTH.CHECK).pipe(
      map(() => true),   // BE OK
      catchError(() => of(false)) // BE DOWN
    );
  }

  monitorHealth(intervalMs = 5000) {
    return timer(0, intervalMs).pipe(
      switchMap(() => this.checkHealth())
    );
  }
}
