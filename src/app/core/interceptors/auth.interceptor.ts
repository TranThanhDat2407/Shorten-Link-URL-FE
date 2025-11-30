import { HttpErrorResponse, HttpEvent, HttpHandlerFn, HttpRequest } from '@angular/common/http';
import { inject } from '@angular/core';
import { BehaviorSubject, Observable, catchError, filter, switchMap, take, throwError } from 'rxjs';
import { AuthService } from '../services/auth';

let isRefreshing = false;
const refreshTokenSubject = new BehaviorSubject<string | null>(null);

export function authInterceptor(
  req: HttpRequest<any>,
  next: HttpHandlerFn
): Observable<HttpEvent<any>> {
  const authService = inject(AuthService);

  // Thêm withCredentials cho mọi request
  const authReq = req.clone({ withCredentials: true });

  return next(authReq).pipe(
    catchError((error: HttpErrorResponse) => {
      if (
        (error.status === 401 || error.status === 403 ) &&
        !req.url.includes('/refresh') &&
        !req.url.includes('/login')
      ) {
        return handle401Error(authReq, next);
      }
      return throwError(() => error);
    })
  );

  function handle401Error(
    request: HttpRequest<any>,
    nextFn: HttpHandlerFn
  ): Observable<HttpEvent<any>> {
    if (!isRefreshing) {
      isRefreshing = true;
      refreshTokenSubject.next(null);

      return authService.refreshToken().pipe(
        switchMap(() => {
          isRefreshing = false;
          refreshTokenSubject.next('done');
          return nextFn(request.clone({ withCredentials: true }));
        }),
        catchError((err) => {
          isRefreshing = false;
          authService.logout();
          return throwError(() => err);
        })
      );
    }

    // Đang refresh → chờ
    return refreshTokenSubject.pipe(
      filter(token => token !== null),
      take(1),
      switchMap(() => nextFn(request.clone({ withCredentials: true })))
    );
  }
}
