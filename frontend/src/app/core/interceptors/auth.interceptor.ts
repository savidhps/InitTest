import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { catchError, switchMap, throwError } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const token = authService.getAccessToken();

  console.log('Auth Interceptor - URL:', req.url);
  console.log('Auth Interceptor - Token:', token ? 'Present' : 'Missing');

  // Clone request and add authorization header
  if (token && !req.url.includes('/auth/login') && !req.url.includes('/auth/register')) {
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
    console.log('Auth Interceptor - Added Authorization header');
  }

  return next(req).pipe(
    catchError(error => {
      console.log('Auth Interceptor - Error:', error.status, error.message);
      // If 401 and we have a refresh token, try to refresh
      if (error.status === 401 && localStorage.getItem('refreshToken')) {
        console.log('Auth Interceptor - Attempting token refresh');
        return authService.refreshToken().pipe(
          switchMap(() => {
            // Retry original request with new token
            const newToken = authService.getAccessToken();
            if (newToken) {
              req = req.clone({
                setHeaders: {
                  Authorization: `Bearer ${newToken}`
                }
              });
            }
            return next(req);
          }),
          catchError(refreshError => {
            console.log('Auth Interceptor - Refresh failed, logging out');
            authService.logout();
            return throwError(() => refreshError);
          })
        );
      }

      return throwError(() => error);
    })
  );
};
