import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { io, Socket } from 'socket.io-client';
import { environment } from '../../../../environments/environment';
import { AuthService } from '../../../core/services/auth.service';
import { ChatRoom, Message } from '../../../core/models/chat.model';
import { ApiResponse } from '../../../core/models/user.model';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private socket!: Socket;
  private messagesSubject = new BehaviorSubject<Message[]>([]);
  public messages$ = this.messagesSubject.asObservable();

  private typingSubject = new BehaviorSubject<any>(null);
  public typing$ = this.typingSubject.asObservable();

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {
    this.initSocket();
  }

  private initSocket(): void {
    const token = this.authService.getAccessToken();
    
    this.socket = io(environment.wsUrl, {
      auth: { token },
      transports: ['websocket', 'polling']
    });

    this.socket.on('connect', () => {
      console.log('✅ Socket connected');
    });

    this.socket.on('disconnect', () => {
      console.log('❌ Socket disconnected');
    });

    this.socket.on('message-received', (data: { message: Message }) => {
      const currentMessages = this.messagesSubject.value;
      this.messagesSubject.next([...currentMessages, data.message]);
    });

    this.socket.on('typing-indicator', (data: any) => {
      this.typingSubject.next(data);
    });

    this.socket.on('error', (error: any) => {
      console.error('Socket error:', error);
    });
  }

  // HTTP Methods
  getRooms(): Observable<ApiResponse<{ rooms: ChatRoom[] }>> {
    return this.http.get<ApiResponse<{ rooms: ChatRoom[] }>>(
      `${environment.apiUrl}/chat/rooms`
    );
  }

  createRoom(data: { name?: string; type: string; participants: string[] }): Observable<ApiResponse<{ room: ChatRoom }>> {
    return this.http.post<ApiResponse<{ room: ChatRoom }>>(
      `${environment.apiUrl}/chat/rooms`,
      data
    );
  }

  getMessages(roomId: string, page: number = 1, limit: number = 50): Observable<ApiResponse<{ messages: Message[]; pagination: any }>> {
    return this.http.get<ApiResponse<{ messages: Message[]; pagination: any }>>(
      `${environment.apiUrl}/chat/rooms/${roomId}/messages?page=${page}&limit=${limit}`
    );
  }

  uploadFile(file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post(`${environment.apiUrl}/chat/upload`, formData);
  }

  // Socket Methods
  joinRoom(roomId: string): void {
    this.socket.emit('join-room', { roomId });
  }

  leaveRoom(roomId: string): void {
    this.socket.emit('leave-room', { roomId });
  }

  sendMessage(roomId: string, content: string, messageType: string = 'text', attachments: any[] = []): void {
    this.socket.emit('send-message', {
      roomId,
      content,
      messageType,
      attachments
    });
  }

  startTyping(roomId: string): void {
    this.socket.emit('typing-start', { roomId });
  }

  stopTyping(roomId: string): void {
    this.socket.emit('typing-stop', { roomId });
  }

  clearMessages(): void {
    this.messagesSubject.next([]);
  }

  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
    }
  }
}
