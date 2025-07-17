import { Injectable, signal, computed } from '@angular/core';
import { Router } from '@angular/router';

import { User } from '../models/auth.interface';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private loading = signal(false);
  private tokenExpiry = signal<number | null>(null);
  private currentUser = signal<User>({
    id: '',
    email: '',
    firstname: '',
    lastname: '',
    fullname: '',
    roles: []
  });

  // Computed signal for countdown
  tokenExpiryCountdown = computed(() => {
    const expiry = this.tokenExpiry();
    if (expiry === null) return null;
    const now = Math.floor(Date.now() / 1000);
    return Math.max(expiry - now, 0);
  });
  constructor(private router: Router) { }

  

 
  public getUser() : User | null {
    // return this.currentUser();
    return this.getUserFromSessionStorage();
  }

  public getUserFromSessionStorage(): User | null {
    const userInfo = sessionStorage.getItem('user_info');
    return userInfo ? JSON.parse(userInfo) : null;
  }

  
}