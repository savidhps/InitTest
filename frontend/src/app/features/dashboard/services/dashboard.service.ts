import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { ApiResponse } from '../../../core/models/user.model';

export interface DashboardStats {
  totalUsers?: number;
  activeUsers?: number;
  totalRooms?: number;
  totalMessages?: number;
  myRooms?: number;
  myMessages?: number;
  recentUsers?: any[];
  recentMessages?: any[];
}

export interface Analytics {
  userGrowth: { _id: string; count: number }[];
  messageActivity: { _id: string; count: number }[];
  roleDistribution: { _id: string; count: number }[];
}

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  constructor(private http: HttpClient) {}

  getStats(): Observable<ApiResponse<{ stats: DashboardStats }>> {
    return this.http.get<ApiResponse<{ stats: DashboardStats }>>(
      `${environment.apiUrl}/dashboard/stats`
    );
  }

  getAnalytics(): Observable<ApiResponse<{ analytics: Analytics }>> {
    return this.http.get<ApiResponse<{ analytics: Analytics }>>(
      `${environment.apiUrl}/dashboard/analytics`
    );
  }
}
