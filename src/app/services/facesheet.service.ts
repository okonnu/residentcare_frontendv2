import { Injectable, signal, computed } from '@angular/core';
import { Router } from '@angular/router';

export interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  roles: string[];
  tokenExpiry: string;
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private loading = signal(false);
  private currentUser = signal<User | null>(null);
  private tokenExpiry = signal<number | null>(null);

  // Computed signal for countdown
  tokenExpiryCountdown = computed(() => {
    const expiry = this.tokenExpiry();
    if (expiry === null) return null;
    const now = Math.floor(Date.now() / 1000);
    return Math.max(expiry - now, 0);
  });
  constructor(private router: Router) { }

  async login(email: string, password: string) {
    this.loading.set(true);
    const headers = new Headers({ 'Content-Type': 'application/json' });
    const body = JSON.stringify({ email, password });

    try {
      const response = await fetch('https://residentcare-api.pepea.net/api/v1/login', {
        method: 'POST',
        headers: headers,
        body: body
      });

      if (response.ok) {
        const data = await response.json();
        const token = data.data.access_token;
        const expiry = data.data.expires_in;
        sessionStorage.setItem('access_token', JSON.stringify(data.data));

        // Decode the token to extract user information
        const userInfo = this.decodeToken(token);

        // Store user information in session storage
        sessionStorage.setItem('user_info', JSON.stringify(userInfo));

        // Update the currentUser signal
        this.currentUser.set(userInfo);

        // Set the token expiry time
        this.tokenExpiry.set(Math.floor(Date.now() / 1000) + expiry);
        console.log('Login successful:', userInfo);
        return true;
      } else {
        console.error('Login failed:', response.statusText);
        return false;
      }
    } catch (error) {
      console.error('Login error:', error);
      return false;
    } finally {
      this.loading.set(false);
    }
  }

  async logout() {
    sessionStorage.removeItem('access_token');
    sessionStorage.removeItem('user_info');
    this.currentUser.set(null);
    this.router.navigate(['/login']);
  }
  public getUser() : User | null {
    return this.currentUser();
  }

  public getUserFromSessionStorage(): User | null {
    const userInfo = sessionStorage.getItem('user_info');
    return userInfo ? JSON.parse(userInfo) : null;
  }

  private decodeToken(token: string): User {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const roles = [
      ...payload.resource_access?.['pepea-rest-api']?.roles || []
    ];
    return {
      id: payload.sub,
      firstName: payload.given_name || '',
      lastName: payload.family_name || '',
      email: payload.email || '',
      roles: roles,
      tokenExpiry: new Date(payload.exp * 1000).toISOString()
    };
  }
}