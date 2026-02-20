import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';
import { User, AuthResponse, ApiResponse } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  private accessToken: string | null = null;

  constructor(
    private http: HttpClient,
    private router: Router
  ) {
    // Load user and token from storage FIRST
    this.loadUserFromStorage();
  }

  login(email: string, password: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${environment.apiUrl}/auth/login`, {
      email,
      password
    }).pipe(
      tap(response => {
        if (response.success) {
          this.setSession(response.data);
        }
      })
    );
  }

  register(userData: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
  }): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${environment.apiUrl}/auth/register`, userData).pipe(
      tap(response => {
        if (response.success) {
          this.setSession(response.data);
        }
      })
    );
  }

  logout(): void {
    const refreshToken = localStorage.getItem('refreshToken');
    
    if (refreshToken) {
      this.http.post(`${environment.apiUrl}/auth/logout`, { refreshToken })
        .subscribe();
    }

    this.clearSession();
    this.router.navigate(['/auth/login']);
  }

  refreshToken(): Observable<any> {
    const refreshToken = localStorage.getItem('refreshToken');
    return this.http.post<ApiResponse>(`${environment.apiUrl}/auth/refresh`, {
      refreshToken
    }).pipe(
      tap((response: any) => {
        if (response.success) {
          this.accessToken = response.data.accessToken;
          // Update localStorage with new token
          localStorage.setItem('accessToken', response.data.accessToken);
        }
      })
    );
  }

  getAccessToken(): string | null {
    return this.accessToken;
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  isAuthenticated(): boolean {
    return !!this.accessToken && !!this.currentUserSubject.value;
  }

  isAdmin(): boolean {
    return this.currentUserSubject.value?.role === 'admin';
  }

  private setSession(data: AuthResponse['data']): void {
    this.accessToken = data.accessToken;
    localStorage.setItem('accessToken', data.accessToken);
    localStorage.setItem('refreshToken', data.refreshToken);
    localStorage.setItem('currentUser', JSON.stringify(data.user));
    this.currentUserSubject.next(data.user);
  }

  private clearSession(): void {
    this.accessToken = null;
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
  }

  private loadUserFromStorage(): void {
    const userStr = localStorage.getItem('currentUser');
    const token = localStorage.getItem('accessToken');
    
    if (userStr && token) {
      try {
        const user = JSON.parse(userStr);
        this.accessToken = token;
        this.currentUserSubject.next(user);
      } catch (e) {
        this.clearSession();
      }
    }
  }
}
