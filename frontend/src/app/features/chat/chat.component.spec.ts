import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ChatComponent } from './chat.component';
import { ChatService } from './services/chat.service';
import { AuthService } from '../../core/services/auth.service';
import { NotificationService } from '../../core/services/notification.service';
import { of } from 'rxjs';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';
import { MatListModule } from '@angular/material/list';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

describe('ChatComponent', () => {
  let component: ChatComponent;
  let fixture: ComponentFixture<ChatComponent>;
  let chatServiceSpy: jasmine.SpyObj<ChatService>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let notificationServiceSpy: jasmine.SpyObj<NotificationService>;

  beforeEach(async () => {
    const chatSpy = jasmine.createSpyObj('ChatService', [
      'getRooms', 'getMessages', 'joinRoom', 'leaveRoom', 
      'sendMessage', 'reconnectSocket', 'clearMessages', 'stopTyping', 'startTyping'
    ], {
      messages$: of([]),
      typing$: of(null)
    });
    
    const authSpy = jasmine.createSpyObj('AuthService', ['getCurrentUser']);
    const notificationSpy = jasmine.createSpyObj('NotificationService', ['showError', 'showSuccess', 'showInfo']);

    await TestBed.configureTestingModule({
      declarations: [ChatComponent],
      imports: [
        HttpClientTestingModule,
        NoopAnimationsModule,
        FormsModule,
        MatListModule,
        MatFormFieldModule,
        MatInputModule,
        MatIconModule,
        MatButtonModule,
        MatDividerModule,
        MatProgressSpinnerModule
      ],
      providers: [
        { provide: ChatService, useValue: chatSpy },
        { provide: AuthService, useValue: authSpy },
        { provide: NotificationService, useValue: notificationSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ChatComponent);
    component = fixture.componentInstance;
    chatServiceSpy = TestBed.inject(ChatService) as jasmine.SpyObj<ChatService>;
    authServiceSpy = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    notificationServiceSpy = TestBed.inject(NotificationService) as jasmine.SpyObj<NotificationService>;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load rooms on init', () => {
    chatServiceSpy.getRooms.and.returnValue(of({
      success: true,
      data: { rooms: [] }
    } as any));

    authServiceSpy.getCurrentUser.and.returnValue({
      _id: '123',
      email: 'test@test.com',
      firstName: 'Test',
      lastName: 'User',
      role: 'user'
    } as any);

    fixture.detectChanges(); // Trigger ngOnInit
    
    expect(chatServiceSpy.getRooms).toHaveBeenCalled();
  });

  it('should initialize with current user', () => {
    authServiceSpy.getCurrentUser.and.returnValue({
      _id: '123',
      email: 'test@test.com',
      firstName: 'Test',
      lastName: 'User',
      role: 'user'
    } as any);

    chatServiceSpy.getRooms.and.returnValue(of({
      success: true,
      data: { rooms: [] }
    } as any));

    fixture.detectChanges(); // Trigger ngOnInit
    
    expect(component.currentUserId).toBe('123');
  });

  it('should not send empty message', () => {
    component.messageContent = '';
    component.sendMessage();
    
    expect(chatServiceSpy.sendMessage).not.toHaveBeenCalled();
  });

  it('should send message with content', () => {
    component.selectedRoom = {
      _id: 'room1',
      name: 'Test Room',
      type: 'group',
      participants: []
    } as any;
    
    component.messageContent = 'Hello';
    component.sendMessage();
    
    expect(chatServiceSpy.sendMessage).toHaveBeenCalledWith('room1', 'Hello');
    expect(component.messageContent).toBe('');
  });

  it('should track messages by id', () => {
    const message = { _id: 'msg1' } as any;
    const result = component.trackByMessageId(0, message);
    
    expect(result).toBe('msg1');
  });
});
