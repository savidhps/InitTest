import { User } from './user.model';

export interface ChatRoom {
  _id: string;
  name?: string;
  type: 'group' | 'private';
  participants: User[];
  createdBy: User;
  lastMessageAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface Message {
  _id: string;
  roomId: string;
  senderId: User;
  content: string;
  messageType: 'text' | 'image' | 'file';
  attachments: Attachment[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Attachment {
  fileName: string;
  fileUrl: string;
  fileSize: number;
  fileType: string;
}

export interface TypingIndicator {
  userId: string;
  roomId: string;
  isTyping: boolean;
}
