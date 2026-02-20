import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { NotificationService } from '../services/notification.service';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const notificationService = inject(NotificationService);

  return next(req).pipe(
    catchError(error => {
      let errorMessage = 'An error occurred';

      if (error.error?.message) {
        errorMessage = error.error.message;
      } else if (error.message) {
        errorMessage = error.message;
      } else if (error.status) {
        switch (error.status) {
          case 400:
            errorMessage = 'Bad request';
            break;
          case 401:
            errorMessage = 'Unauthorized';
            break;
          case 403:
            errorMessage = 'Forbidden';
            break;
          case 404:
            errorMessage = 'Not found';
            break;
          case 500:
            errorMessage = 'Server error';
            break;
          default:
            errorMessage = `Error: ${error.status}`;
        }
      }

      // Don't show notification for 401 (handled by auth interceptor)
      if (error.status !== 401) {
        notificationService.showError(errorMessage);
      }

      return throwError(() => error);
    })
  );
};
