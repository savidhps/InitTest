import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { roleGuard } from './role.guard';
import { AuthService } from '../services/auth.service';

describe('roleGuard', () => {
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(() => {
    const authSpy = jasmine.createSpyObj('AuthService', ['getCurrentUser']);
    const routerSpyObj = jasmine.createSpyObj('Router', ['navigate']);

    TestBed.configureTestingModule({
      providers: [
        { provide: AuthService, useValue: authSpy },
        { provide: Router, useValue: routerSpyObj }
      ]
    });

    authServiceSpy = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    routerSpy = TestBed.inject(Router) as jasmine.SpyObj<Router>;
  });

  it('should allow access for admin role', () => {
    authServiceSpy.getCurrentUser.and.returnValue({ 
      _id: '1', 
      email: 'admin@test.com', 
      role: 'admin',
      firstName: 'Admin',
      lastName: 'User'
    } as any);
    
    const user = authServiceSpy.getCurrentUser();
    expect(user?.role).toBe('admin');
  });

  it('should deny access for non-admin role', () => {
    authServiceSpy.getCurrentUser.and.returnValue({ 
      _id: '1', 
      email: 'user@test.com', 
      role: 'user',
      firstName: 'Regular',
      lastName: 'User'
    } as any);
    
    const user = authServiceSpy.getCurrentUser();
    expect(user?.role).not.toBe('admin');
  });
});
