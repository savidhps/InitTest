import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { DashboardService, DashboardStats } from './services/dashboard.service';
import { AuthService } from '../../core/services/auth.service';
import { NotificationService } from '../../core/services/notification.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DashboardComponent implements OnInit {
  stats: DashboardStats = {};
  loading = true;
  isAdmin = false;

  constructor(
    private dashboardService: DashboardService,
    private authService: AuthService,
    private notificationService: NotificationService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.isAdmin = this.authService.isAdmin();
    this.loadStats();
  }

  loadStats(): void {
    this.loading = true;
    this.cdr.markForCheck();
    
    this.dashboardService.getStats().subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this.stats = response.data.stats;
        }
        this.loading = false;
        this.cdr.markForCheck();
      },
      error: (error) => {
        console.error('Dashboard stats error:', error);
        this.loading = false;
        this.cdr.markForCheck();
        this.notificationService.showError('Failed to load dashboard stats');
      }
    });
  }

  refresh(): void {
    this.notificationService.showInfo('Refreshing dashboard...');
    this.loadStats();
  }
}
