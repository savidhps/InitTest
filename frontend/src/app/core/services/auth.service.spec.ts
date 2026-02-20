import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';
import { environment } from '../../../environments/environment';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(() => {
    const routerSpyObj = jasmine.createSpyObj('Router', ['navigate']);

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        AuthService,
        { provide: Router, useValue: routerSpyObj }
      ]
    });

    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
    routerSpy = TestBed.inject(Router) as jasmine.SpyObj<Router>;

    // Clear localStorage before each test
    localStorage.clear();
  });

  afterEach(() => {
    httpMock.verify();
    localStorage.clear();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('login', () => {
    it('should login successfully and store tokens', (done) => {
      const mockResponse = {
        success: true,
        data: {
          user: {
            _id: '123',
            email: 'test@example.com',
            firstName: 'Test',
            lastName: 'User',
            role: 'user'
          },
          accessToken: 'mock-access-token',
          refreshToken: 'mock-refresh-token'
        }
      };

      service.login('test@example.com', 'password123').subscribe(response => {
        expect(response.success).toBe(true);
        expect(service.getAccessToken()).toBe('mock-access-token');
        expect(localStorage.getItem('accessToken')).toBe('mock-access-token');
        expect(localStorage.getItem('refreshToken')).toBe('mock-refresh-token');
        expect(service.getCurrentUser()?.email).toBe('test@example.com');
        done();
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/auth/login`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual({ email: 'test@example.com', password: 'password123' });
      req.flush(mockResponse);
    });

    it('should handle login failure', (done) => {
      const mockError = {
        success: false,
        message: 'Invalid credentials'
      };

      service.login('test@example.com', 'wrongpassword').subscribe({
        next: () => fail('should have failed'),
        error: (error) => {
          expect(error.error.message).toBe('Invalid credentials');
          expect(service.getAccessToken()).toBeNull();
          done();
        }
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/auth/login`);
      req.flush(mockError, { status: 401, statusText: 'Unauthorized' });
    });
  });

  describe('logout', () => {
    it('should clear session and navigate to login', () => {
      // Setup: login first
      localStorage.setItem('accessToken', 'mock-token');
      localStorage.setItem('refreshToken', 'mock-refresh');
      localStorage.setItem('currentUser', JSON.stringify({ email: 'test@example.com' }));

      service.logout();

      // Expect HTTP call
      const req = httpMock.expectOne(`${environment.apiUrl}/auth/logout`);
      expect(req.request.method).toBe('POST');
      req.flush({ success: true });

      expect(localStorage.getItem('accessToken')).toBeNull();
      expect(localStorage.getItem('refreshToken')).toBeNull();
      expect(localStorage.getItem('currentUser')).toBeNull();
      expect(service.getAccessToken()).toBeNull();
      expect(service.getCurrentUser()).toBeNull();
      expect(routerSpy.navigate).toHaveBeenCalledWith(['/auth/login']);
    });
  });

  describe('refreshToken', () => {
    it('should refresh access token successfully', (done) => {
      localStorage.setItem('refreshToken', 'mock-refresh-token');

      const mockResponse = {
        success: true,
        data: {
          accessToken: 'new-access-token'
        }
      };

      service.refreshToken().subscribe(response => {
        expect(response.success).toBe(true);
        expect(service.getAccessToken()).toBe('new-access-token');
        expect(localStorage.getItem('accessToken')).toBe('new-access-token');
        done();
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/auth/refresh`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual({ refreshToken: 'mock-refresh-token' });
      req.flush(mockResponse);
    });
  });

  describe('isAuthenticated', () => {
    it('should return true when user is authenticated', () => {
      localStorage.setItem('accessToken', 'mock-token');
      localStorage.setItem('currentUser', JSON.stringify({ 
        _id: '123',
        email: 'test@example.com',
        role: 'user'
      }));

      // Reload from storage
      service['loadUserFromStorage']();

      expect(service.isAuthenticated()).toBe(true);
    });

    it('should return false when user is not authenticated', () => {
      expect(service.isAuthenticated()).toBe(false);
    });
  });

  describe('isAdmin', () => {
    it('should return true for admin users', () => {
      localStorage.setItem('accessToken', 'mock-token');
      localStorage.setItem('currentUser', JSON.stringify({ 
        _id: '123',
        email: 'admin@example.com',
        role: 'admin'
      }));

      service['loadUserFromStorage']();

      expect(service.isAdmin()).toBe(true);
    });

    it('should return false for non-admin users', () => {
      localStorage.setItem('accessToken', 'mock-token');
      localStorage.setItem('currentUser', JSON.stringify({ 
        _id: '123',
        email: 'user@example.com',
        role: 'user'
      }));

      service['loadUserFromStorage']();

      expect(service.isAdmin()).toBe(false);
    });
  });

  describe('loadUserFromStorage', () => {
    it('should load user and token from localStorage', () => {
      const mockUser = {
        _id: '123',
        email: 'test@example.com',
        firstName: 'Test',
        lastName: 'User',
        role: 'user'
      };

      localStorage.setItem('accessToken', 'mock-token');
      localStorage.setItem('currentUser', JSON.stringify(mockUser));

      service['loadUserFromStorage']();

      expect(service.getAccessToken()).toBe('mock-token');
      const currentUser: any = service.getCurrentUser();
      expect(currentUser?.email).toBe(mockUser.email);
    });

    it('should clear session if user data is invalid', () => {
      localStorage.setItem('accessToken', 'mock-token');
      localStorage.setItem('currentUser', 'invalid-json');

      service['loadUserFromStorage']();

      expect(service.getAccessToken()).toBeNull();
      expect(service.getCurrentUser()).toBeNull();
    });
  });
});
