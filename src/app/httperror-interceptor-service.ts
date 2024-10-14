import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { inject } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { catchError, Observable, throwError } from 'rxjs';

export class HttpErrorInterceptorService implements HttpInterceptor {
  toast = inject(ToastrService);
  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    console.log('interceptor is starting now...');
    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        const errorMessage = this.setError(error);
        console.log(error);
        this.toast.error(errorMessage);
        return throwError(errorMessage);
      })
    );
  }
  setError(error: HttpErrorResponse): string {
    let errorMessage = 'Unknown error occured';
    if (error.error instanceof ErrorEvent) {
      errorMessage = error.error.message;
    } else {
      if (error.status !== 0) {
        errorMessage = error.error.ErrorMessage;
      }
    }
    return errorMessage;
  }
}
