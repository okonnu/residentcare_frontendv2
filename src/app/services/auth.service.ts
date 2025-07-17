import { DestroyRef, Injectable, inject, signal, WritableSignal } from '@angular/core';
import { HttpClient, HttpContext } from "@angular/common/http";
import { Router } from "@angular/router";
import { Observable } from "rxjs";
import { JwtHelperService } from "@auth0/angular-jwt";
import { environment } from "../../environments/environment.production";
import { Login, User, LoginResponse, LoginSuccess, RestResponse } from "../models/auth.interface";
import { IS_PUBLIC } from "./auth.interceptor";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { catchError, tap } from 'rxjs/operators';
import { of } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
    providedIn: 'root'
})

export class AuthService {
    private readonly http = inject(HttpClient);
    private readonly router = inject(Router);
    private readonly jwtHelper = inject(JwtHelperService);
    private readonly destroyRef = inject(DestroyRef);
    private snackBar = inject(MatSnackBar);
    private readonly CONTEXT = { context: new HttpContext().set(IS_PUBLIC, true) };
    private readonly TOKEN_EXPIRY_THRESHOLD_MINUTES = 5;

    get user(): WritableSignal<User | null> {
        const token = sessionStorage.getItem('access_token');
        return signal(token ? this.jwtHelper.decodeToken(token) : null);
    }

    isAuthenticated(): boolean {
        return !this.jwtHelper.isTokenExpired();
    }

    login(body: Login): Observable<RestResponse> {
        return this.http.post<RestResponse>(`${environment.apiUrl}/login`, body, this.CONTEXT)
            .pipe(
                catchError(error => {
                    if (error.status === 401 || error.status === 400) {
                        // Handle invalid credentials
                        console.error('Invalid credentials');
                        this.snackBar.open('Wrong Password or Username', '', {
                            duration: 5000,
                            panelClass: ['error-snackbar']
                        });
                    }
                    return of();
                }),
                tap(data => {
                    console.log('Login response:', data);
                    const loginSuccessData = data.data as LoginSuccess;
                    this.storeTokens(loginSuccessData);
                    console.log('Login response:', loginSuccessData);
                    this.scheduleTokenRefresh(loginSuccessData.access_token);
                    this.snackBar.open('Login successful', '', {
                        duration: 5000,
                        panelClass: ['success-snackbar']
                    });
                    this.router.navigate(['/pages']);
                })
            );
    }

    logout(): void {
        // Clear session storage and navigate to login page
        sessionStorage.removeItem('access_token');
        sessionStorage.removeItem('refresh_token');
        sessionStorage.removeItem('user_info');
        this.router.navigate(['authentication/login']);
    }

    storeTokens(data: LoginSuccess): void {
        sessionStorage.setItem('access_token', data.access_token);
        sessionStorage.setItem('user_info', JSON.stringify(this.decodeToken(data.access_token)));
        sessionStorage.setItem('refresh_token', data.refresh_token);
    }

    refreshToken(): Observable<RestResponse | null> {
        const refresh_token = sessionStorage.getItem('refresh_token');
        if (!refresh_token) {
            return of();
        }

        return this.http.post<RestResponse>(
            `${environment.apiUrl}/token/refresh`, { refresh_token }, this.CONTEXT)
            .pipe(
                catchError(() => of()),
                tap(data => {
                    const loginSuccessData = data.data as LoginSuccess;
                    this.storeTokens(loginSuccessData);
                    this.scheduleTokenRefresh(loginSuccessData.access_token);
                })
            );
    }

    scheduleTokenRefresh(token: string): void {
        const expirationTime = this.jwtHelper.getTokenExpirationDate(token)?.getTime();
        const refreshTime = expirationTime ? expirationTime - this.TOKEN_EXPIRY_THRESHOLD_MINUTES * 60 * 1000 : Date.now();
        const refreshInterval = refreshTime - Date.now();

        if (refreshInterval > 0) {
            setTimeout(() => {
                this.refreshToken()
                    .pipe(takeUntilDestroyed(this.destroyRef))
                    .subscribe();
            }, refreshInterval);
        }
    }

      private decodeToken(token: string): User {
        const payload = JSON.parse(atob(token.split('.')[1]));
        const roles = [
          ...payload.resource_access?.['residentcare-api']?.roles || []
        ];
        const firstname = payload.given_name || '';
        const lastname = payload.family_name || '';
        return {
          id: payload.sub,
          firstname: firstname,
          lastname: lastname,
          email: payload.email || '',
          fullname: `${firstname} ${lastname}`.trim(),
          roles: roles,
        };
    }
    
    public getUserFromSessionStorage(): User | null {
        const userInfo = sessionStorage.getItem('user_info');
        return userInfo ? JSON.parse(userInfo) : null;
      }

}
