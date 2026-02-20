import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { LoginComponent } from './login.component';
import { AuthService } from '../../../core/services/auth.service';
import { NotificationService } from '../../../core/services/notification.service';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let routerSpy: jasmine.SpyObj<Router>;
  let notificationServiceSpy: jasmine.SpyObj<NotificationService>;

  beforeEach(async () => {
    const authSpy = jasmine.createSpyObj('AuthService', ['login', 'isAuthenticated']);
    const routerSpyObj = jasmine.createSpyObj('Router', ['navigate']);
    const notificationSpy = jasmine.createSpyObj('NotificationService', ['showError', 'showSuccess']);

    authSpy.isAuthenticated.and.returnValue(false); // Default to not authenticated

    await TestBed.configureTestingModule({
      declarations: [LoginComponent],
      imports: [
        ReactiveFormsModule,
        NoopAnimationsModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        MatCardModule,
        MatIconModule,
        MatDividerModule
      ],
      providers: [
        { provide: AuthService, useValue: authSpy },
        { provide: Router, useValue: routerSpyObj },
        { provide: NotificationService, useValue: notificationSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    authServiceSpy = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    routerSpy = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    notificationServiceSpy = TestBed.inject(NotificationService) as jasmine.SpyObj<NotificationService>;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize login form', () => {
    expect(component.loginForm).toBeDefined();
    expect(component.loginForm.get('email')).toBeDefined();
    expect(component.loginForm.get('password')).toBeDefined();
  });

  it('should validate email field', () => {
    const emailControl = component.loginForm.get('email');
    
    emailControl?.setValue('');
    expect(emailControl?.hasError('required')).toBe(true);
    
    emailControl?.setValue('invalid-email');
    expect(emailControl?.hasError('email')).toBe(true);
    
    emailControl?.setValue('valid@email.com');
    expect(emailControl?.valid).toBe(true);
  });

  it('should validate password field', () => {
    const passwordControl = component.loginForm.get('password');
    
    passwordControl?.setValue('');
    expect(passwordControl?.hasError('required')).toBe(true);
    
    passwordControl?.setValue('12345');
    expect(passwordControl?.hasError('minlength')).toBe(true);
    
    passwordControl?.setValue('validpassword');
    expect(passwordControl?.valid).toBe(true);
  });

  it('should call authService.login on valid form submission', () => {
    const mockResponse: any = {
      success: true,
      message: 'Login successful',
      data: {
        user: { _id: '1', email: 'test@test.com', role: 'user', firstName: 'Test', lastName: 'User' },
        accessToken: 'token',
        refreshToken: 'refresh'
      }
    };
    
    authServiceSpy.login.and.returnValue(of(mockResponse));
    
    component.loginForm.setValue({
      email: 'test@test.com',
      password: 'password123'
    });
    
    component.onSubmit();
    
    expect(authServiceSpy.login).toHaveBeenCalledWith('test@test.com', 'password123');
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/dashboard']);
  });

  it('should handle login error', () => {
    authServiceSpy.login.and.returnValue(throwError(() => ({ error: { message: 'Invalid credentials' } })));
    
    component.loginForm.setValue({
      email: 'test@test.com',
      password: 'wrongpassword'
    });
    
    component.onSubmit();
    
    expect(notificationServiceSpy.showError).toHaveBeenCalled();
    expect(component.loading).toBe(false);
  });

  it('should not submit invalid form', () => {
    component.loginForm.setValue({
      email: '',
      password: ''
    });
    
    component.onSubmit();
    
    expect(authServiceSpy.login).not.toHaveBeenCalled();
  });
});
