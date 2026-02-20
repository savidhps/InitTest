import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ChatService } from '../../features/chat/services/chat.service';
import { AuthService } from './auth.service';

describe('ChatService', () => {
  let service: ChatService;
  let authServiceSpy: jasmine.SpyObj<AuthService>;

  beforeEach(() => {
    const spy = jasmine.createSpyObj('AuthService', ['getAccessToken']);
    spy.getAccessToken.and.returnValue('mock-token');

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        ChatService,
        { provide: AuthService, useValue: spy }
      ]
    });

    service = TestBed.inject(ChatService);
    authServiceSpy = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should have messages$ observable', (done) => {
    service.messages$.subscribe((messages: any) => {
      expect(Array.isArray(messages)).toBe(true);
      done();
    });
  });

  it('should clear messages', (done) => {
    service.clearMessages();
    service.messages$.subscribe((messages: any) => {
      expect(messages.length).toBe(0);
      done();
    });
  });
});
