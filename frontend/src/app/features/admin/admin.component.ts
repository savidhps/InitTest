import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { AdminService } from './services/admin.service';
import { NotificationService } from '../../core/services/notification.service';
import { User } from '../../core/models/user.model';
import { AddUserDialogComponent } from './add-user-dialog/add-user-dialog.component';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit {
  displayedColumns: string[] = ['firstName', 'lastName', 'email', 'role', 'status', 'createdAt', 'actions'];
  dataSource = new MatTableDataSource<User>([]);
  loading = true;
  totalUsers = 0;

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private adminService: AdminService,
    private notificationService: NotificationService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }

  loadUsers(page: number = 1): void {
    this.loading = true;
    this.adminService.getUsers(page, 50).subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this.dataSource.data = response.data.users;
          this.totalUsers = response.data.pagination?.total || 0;
        }
        this.loading = false;
      },
      error: (error) => {
        this.loading = false;
        this.notificationService.showError('Failed to load users');
      }
    });
  }

  changeRole(user: User, newRole: 'admin' | 'user'): void {
    if (confirm(`Change ${user.firstName} ${user.lastName}'s role to ${newRole}?`)) {
      this.adminService.updateUser(user._id, { role: newRole }).subscribe({
        next: (response) => {
          if (response.success) {
            this.notificationService.showSuccess('User role updated successfully');
            this.loadUsers();
          }
        },
        error: (error) => {
          this.notificationService.showError('Failed to update user role');
        }
      });
    }
  }

  changeStatus(user: User, newStatus: 'active' | 'inactive'): void {
    if (confirm(`Change ${user.firstName} ${user.lastName}'s status to ${newStatus}?`)) {
      this.adminService.updateUser(user._id, { status: newStatus }).subscribe({
        next: (response) => {
          if (response.success) {
            this.notificationService.showSuccess('User status updated successfully');
            this.loadUsers();
          }
        },
        error: (error) => {
          this.notificationService.showError('Failed to update user status');
        }
      });
    }
  }

  deleteUser(user: User): void {
    if (confirm(`Are you sure you want to delete ${user.firstName} ${user.lastName}? This action cannot be undone.`)) {
      this.adminService.deleteUser(user._id).subscribe({
        next: (response) => {
          if (response.success) {
            this.notificationService.showSuccess('User deleted successfully');
            this.loadUsers();
          }
        },
        error: (error) => {
          this.notificationService.showError('Failed to delete user');
        }
      });
    }
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  refresh(): void {
    this.notificationService.showInfo('Refreshing users...');
    this.loadUsers();
  }

  openAddUserDialog(): void {
    const dialogRef = this.dialog.open(AddUserDialogComponent, {
      width: '600px',
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.createUser(result);
      }
    });
  }

  createUser(userData: any): void {
    this.adminService.createUser(userData).subscribe({
      next: (response) => {
        if (response.success) {
          this.notificationService.showSuccess('User created successfully');
          this.loadUsers();
        }
      },
      error: (error) => {
        const message = error.error?.message || 'Failed to create user';
        this.notificationService.showError(message);
      }
    });
  }
}
