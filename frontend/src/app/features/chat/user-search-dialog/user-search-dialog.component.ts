import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { FormControl } from '@angular/forms';
import { debounceTime, distinctUntilChanged, switchMap, catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { User } from '../../../core/models/user.model';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-user-search-dialog',
  templateUrl: './user-search-dialog.component.html',
  styleUrls: ['./user-search-dialog.component.scss']
})
export class UserSearchDialogComponent implements OnInit {
  searchControl = new FormControl('');
  users: User[] = [];
  loading = false;
  selectedUsers: User[] = [];
  isGroupMode = false;

  constructor(
    private dialogRef: MatDialogRef<UserSearchDialogComponent>,
    private http: HttpClient,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    // Small delay to ensure auth service is initialized
    setTimeout(() => {
      this.initializeSearch();
      this.loadInitialUsers();
    }, 100);
  }

  private initializeSearch(): void {
    // Search users as user types
    this.searchControl.valueChanges
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        switchMap(query => {
          if (!query || query.trim().length === 0) {
            // Load all users when search is empty
            return this.loadUsers();
          }
          this.loading = true;
          return this.loadUsers(query);
        }),
        catchError(error => {
          console.error('Search error:', error);
          this.loading = false;
          return of({ success: false, data: { users: [] } });
        })
      )
      .subscribe({
        next: (response) => {
          if (response.success) {
            this.users = response.data.users;
          }
          this.loading = false;
        },
        error: () => {
          this.loading = false;
          this.users = [];
        }
      });
  }

  private loadUsers(query?: string) {
    const url = query 
      ? `${environment.apiUrl}/users/search?q=${encodeURIComponent(query)}&limit=20`
      : `${environment.apiUrl}/users/search?limit=20`;
    
    // Manually add authorization header
    const token = this.authService.getAccessToken();
    
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    
    return this.http.get<any>(url, { headers });
  }

  loadInitialUsers(): void {
    this.loading = true;
    this.loadUsers().subscribe({
      next: (response) => {
        if (response.success) {
          this.users = response.data.users;
        }
        this.loading = false;
      },
      error: (error) => {
        this.loading = false;
      }
    });
  }

  toggleGroupMode(): void {
    this.isGroupMode = !this.isGroupMode;
    this.selectedUsers = [];
  }

  toggleUserSelection(user: User): void {
    const index = this.selectedUsers.findIndex(u => u._id === user._id);
    if (index > -1) {
      this.selectedUsers.splice(index, 1);
    } else {
      this.selectedUsers.push(user);
    }
  }

  isUserSelected(user: User): boolean {
    return this.selectedUsers.some(u => u._id === user._id);
  }

  selectUser(user: User): void {
    if (this.isGroupMode) {
      this.toggleUserSelection(user);
    } else {
      // For 1-on-1 chat, return immediately
      this.dialogRef.close({ user, isGroup: false });
    }
  }

  createGroup(): void {
    if (this.selectedUsers.length < 2) {
      return;
    }
    this.dialogRef.close({ 
      users: this.selectedUsers, 
      isGroup: true 
    });
  }

  cancel(): void {
    this.dialogRef.close();
  }
}
