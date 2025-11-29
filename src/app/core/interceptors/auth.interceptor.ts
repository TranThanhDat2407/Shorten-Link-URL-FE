import { HttpErrorResponse, HttpEvent, HttpHandlerFn, HttpRequest } from '@angular/common/http';
import { inject } from '@angular/core';
import { BehaviorSubject, Observable, catchError, filter, switchMap, take, throwError } from 'rxjs';
import { AuthService } from '../services/auth';

let isRefreshing = false;
const refreshTokenSubject = new BehaviorSubject<string | null>(null);

export function authInterceptor(
  req: HttpRequest<unknown>,
  next: HttpHandlerFn
): Observable<HttpEvent<unknown>> {
  const authService = inject(AuthService);

  const authReq = req.clone({ withCredentials: true });

  return next(authReq).pipe(
    catchError((error: HttpErrorResponse) => {
      console.log('[Auth Interceptor] Error:', error.status, error.url); // THÊM LOG NÀY ĐỂ DEBUG

      if (
        (error.status === 401 || error.status === 403) &&
        !req.url.includes('/refresh') &&
        !req.url.includes('/login')
      ) {

        console.log('[Auth Interceptor] 401 detected → trying refresh token');
        return handle401Error(authReq, next, authService);
      }

      return throwError(() => error);
    })
  );

  function handle401Error(
    request: HttpRequest<any>,
    next: HttpHandlerFn,
    authService: AuthService
  ): Observable<HttpEvent<any>> {
    if (!isRefreshing) {
      isRefreshing = true;
      refreshTokenSubject.next(null);

      return authService.refreshToken().pipe(
        switchMap(() => {
          isRefreshing = false;
          refreshTokenSubject.next('done');
          return next(request.clone({withCredentials: true}));
        }),
        catchError((err: HttpErrorResponse) => {
          isRefreshing = false;

          // Đây chính là chỗ bạn cần: KHI REFRESH FAIL → XÓA HẾT USER
          console.log('Refresh token failed → force logout');
          authService.forceLogout(); // XÓA currentUser NGAY LẬP TỨC

          return throwError(() => err);
        })
      );
    }

    return refreshTokenSubject.pipe(
      filter(token => token !== null),
      take(1),
      switchMap(() => next(request.clone({withCredentials: true})))
    );
  }
}
