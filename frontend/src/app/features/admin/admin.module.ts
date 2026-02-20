import { NgModule } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { AdminRoutingModule } from './admin-routing.module';
import { AdminComponent } from './admin.component';
import { AddUserDialogComponent } from './add-user-dialog/add-user-dialog.component';

@NgModule({
  declarations: [
    AdminComponent,
    AddUserDialogComponent
  ],
  imports: [
    SharedModule,
    AdminRoutingModule
  ]
})
export class AdminModule { }
