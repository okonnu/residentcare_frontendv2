import { HttpContextToken, HttpInterceptorFn, HttpRequest } from '@angular/common/http';
import { inject } from "@angular/core";
import { AuthService } from "./auth.service";
import { switchMap } from "rxjs/operators";
import { MatSnackBar } from '@angular/material/snack-bar';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
    const snackBar = inject(MatSnackBar);
    const authSvc = inject(AuthService);
    // whenever this HttpContextToken is attached to a request 
    // as we did to login request earlier
    // it means the user does not need to be authenticated 
    // so we don't attach authorization header
    if (req.context.get(IS_PUBLIC)) {
        return next(req);
    }
    if (authSvc.isAuthenticated()) {
        const authRequest = addAuthorizationHeader(req);
        return next(authRequest);
    } else {
        snackBar.open('Your session has expired, please log in again', '', {
            duration: 5000,
            panelClass: ['error-snackbar']
        });
        authSvc.logout();
        return authSvc.refreshToken().pipe(
            switchMap(() => {
                const authRequest = addAuthorizationHeader(req);
                return next(authRequest);
            })
        );
    }
};
const addAuthorizationHeader = (req: HttpRequest<any>) => {
    const token = sessionStorage.getItem('access_token');
    return req.clone({
        headers: req.headers.set('Authorization', `Bearer ${token}`)
    });
};
export const IS_PUBLIC = new HttpContextToken(() => false);
