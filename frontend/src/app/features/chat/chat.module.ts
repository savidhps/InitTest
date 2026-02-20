import { NgModule } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { ChatRoutingModule } from './chat-routing.module';
import { ChatComponent } from './chat.component';
import { UserSearchDialogComponent } from './user-search-dialog/user-search-dialog.component';
import { GroupNameDialogComponent } from './group-name-dialog/group-name-dialog.component';

@NgModule({
  declarations: [
    ChatComponent,
    UserSearchDialogComponent,
    GroupNameDialogComponent
  ],
  imports: [
    SharedModule,
    ChatRoutingModule
  ]
})
export class ChatModule { }
