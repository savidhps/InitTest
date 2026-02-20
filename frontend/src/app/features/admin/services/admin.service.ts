import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { User, ApiResponse } from '../../../core/models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  constructor(private http: HttpClient) {}

  getUsers(page: number = 1, limit: number = 50): Observable<ApiResponse<{ users: User[]; pagination: any }>> {
    return this.http.get<ApiResponse<{ users: User[]; pagination: any }>>(
      `${environment.apiUrl}/users?page=${page}&limit=${limit}`
    );
  }

  createUser(userData: Partial<User>): Observable<ApiResponse<{ user: User }>> {
    return this.http.post<ApiResponse<{ user: User }>>(
      `${environment.apiUrl}/users`,
      userData
    );
  }

  getUser(id: string): Observable<ApiResponse<{ user: User }>> {
    return this.http.get<ApiResponse<{ user: User }>>(
      `${environment.apiUrl}/users/${id}`
    );
  }

  updateUser(id: string, data: Partial<User>): Observable<ApiResponse<{ user: User }>> {
    return this.http.patch<ApiResponse<{ user: User }>>(
      `${environment.apiUrl}/users/${id}`,
      data
    );
  }

  deleteUser(id: string): Observable<ApiResponse> {
    return this.http.delete<ApiResponse>(
      `${environment.apiUrl}/users/${id}`
    );
  }
}
