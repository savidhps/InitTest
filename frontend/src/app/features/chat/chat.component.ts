import { Component, OnInit, OnDestroy, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { ChatService } from './services/chat.service';
import { AuthService } from '../../core/services/auth.service';
import { NotificationService } from '../../core/services/notification.service';
import { ChatRoom, Message } from '../../core/models/chat.model';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChatComponent implements OnInit, OnDestroy {
  rooms: ChatRoom[] = [];
  selectedRoom: ChatRoom | null = null;
  messages: Message[] = [];
  messageContent = '';
  loading = true;
  sending = false;
  currentUserId: string = '';
  typingUsers: any = {};

  private destroy$ = new Subject<void>();

  constructor(
    private chatService: ChatService,
    private authService: AuthService,
    private notificationService: NotificationService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    const user = this.authService.getCurrentUser();
    if (user) {
      this.currentUserId = user._id;
    }

    this.loadRooms();
    this.subscribeToMessages();
    this.subscribeToTyping();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    
    if (this.selectedRoom) {
      this.chatService.leaveRoom(this.selectedRoom._id);
    }
  }

  loadRooms(): void {
    this.loading = true;
    this.chatService.getRooms().subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this.rooms = response.data.rooms;
          
          // Auto-select first room
          if (this.rooms.length > 0 && !this.selectedRoom) {
            this.selectRoom(this.rooms[0]);
          }
        }
        this.loading = false;
        this.cdr.markForCheck();
      },
      error: (error) => {
        this.loading = false;
        this.notificationService.showError('Failed to load chat rooms');
        this.cdr.markForCheck();
      }
    });
  }

  selectRoom(room: ChatRoom): void {
    // Leave previous room
    if (this.selectedRoom) {
      this.chatService.leaveRoom(this.selectedRoom._id);
    }

    this.selectedRoom = room;
    this.chatService.clearMessages();
    this.messages = [];

    // Join new room
    this.chatService.joinRoom(room._id);

    // Load message history
    this.loadMessages(room._id);
  }

  loadMessages(roomId: string): void {
    this.chatService.getMessages(roomId).subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this.messages = response.data.messages;
          this.cdr.markForCheck();
          setTimeout(() => this.scrollToBottom(), 100);
        }
      },
      error: (error) => {
        this.notificationService.showError('Failed to load messages');
      }
    });
  }

  subscribeToMessages(): void {
    this.chatService.messages$
      .pipe(takeUntil(this.destroy$))
      .subscribe(messages => {
        if (messages.length > 0) {
          this.messages = [...this.messages, ...messages];
          this.cdr.markForCheck();
          setTimeout(() => this.scrollToBottom(), 100);
        }
      });
  }

  subscribeToTyping(): void {
    this.chatService.typing$
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        if (data && data.roomId === this.selectedRoom?._id) {
          if (data.isTyping) {
            this.typingUsers[data.userId] = true;
          } else {
            delete this.typingUsers[data.userId];
          }
          this.cdr.markForCheck();
        }
      });
  }

  sendMessage(): void {
    if (!this.messageContent.trim() || !this.selectedRoom || this.sending) {
      return;
    }

    this.sending = true;
    this.chatService.sendMessage(
      this.selectedRoom._id,
      this.messageContent.trim()
    );

    this.messageContent = '';
    this.sending = false;
    this.chatService.stopTyping(this.selectedRoom._id);
    this.cdr.markForCheck();
  }

  onTyping(): void {
    if (this.selectedRoom && this.messageContent.trim()) {
      this.chatService.startTyping(this.selectedRoom._id);
    }
  }

  onStopTyping(): void {
    if (this.selectedRoom) {
      this.chatService.stopTyping(this.selectedRoom._id);
    }
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (!file) return;

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      this.notificationService.showError('File size must be less than 5MB');
      return;
    }

    this.notificationService.showInfo('Uploading file...');

    this.chatService.uploadFile(file).subscribe({
      next: (response) => {
        if (response.success && this.selectedRoom) {
          const attachment = response.data;
          this.chatService.sendMessage(
            this.selectedRoom._id,
            `Sent a file: ${attachment.fileName}`,
            attachment.fileType.startsWith('image/') ? 'image' : 'file',
            [attachment]
          );
          this.notificationService.showSuccess('File uploaded successfully');
        }
      },
      error: (error) => {
        this.notificationService.showError('Failed to upload file');
      }
    });
  }

  getRoomName(room: ChatRoom): string {
    if (room.type === 'group') {
      return room.name || 'Group Chat';
    }
    
    // For private chat, show other participant's name
    const otherParticipant = room.participants.find(p => p._id !== this.currentUserId);
    return otherParticipant 
      ? `${otherParticipant.firstName} ${otherParticipant.lastName}`
      : 'Private Chat';
  }

  getTypingUsersCount(): number {
    return Object.keys(this.typingUsers).length;
  }

  isMyMessage(message: Message): boolean {
    return message.senderId._id === this.currentUserId;
  }

  trackByMessageId(index: number, message: Message): string {
    return message._id;
  }

  private scrollToBottom(): void {
    try {
      const messageList = document.querySelector('.message-list');
      if (messageList) {
        messageList.scrollTop = messageList.scrollHeight;
      }
    } catch (err) {
      console.error('Scroll error:', err);
    }
  }
}
