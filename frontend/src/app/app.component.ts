import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './core/services/auth.service';
import { Observable } from 'rxjs';
import { User } from './core/models/user.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'DashSphere';
  currentUser$!: Observable<User | null>;
  isAuthenticated = false;

  constructor(
    public authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Subscribe to user changes
    this.currentUser$ = this.authService.currentUser$;
    this.currentUser$.subscribe(user => {
      this.isAuthenticated = !!user;
      
      // If user is authenticated and on auth page, redirect to dashboard
      if (user && this.router.url.startsWith('/auth')) {
        this.router.navigate(['/dashboard']);
      }
      // If not authenticated and not on auth page, redirect to login
      else if (!user && !this.router.url.startsWith('/auth')) {
        this.router.navigate(['/auth/login']);
      }
    });
  }

  logout(): void {
    this.authService.logout();
  }

  navigateTo(path: string): void {
    this.router.navigate([path]);
  }
}
