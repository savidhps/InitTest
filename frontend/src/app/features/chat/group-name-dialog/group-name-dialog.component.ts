import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-group-name-dialog',
  templateUrl: './group-name-dialog.component.html',
  styleUrls: ['./group-name-dialog.component.scss']
})
export class GroupNameDialogComponent {
  groupNameControl = new FormControl('', [
    Validators.required,
    Validators.minLength(3),
    Validators.maxLength(50)
  ]);

  constructor(
    private dialogRef: MatDialogRef<GroupNameDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { users: any[] }
  ) {}

  create(): void {
    if (this.groupNameControl.valid) {
      this.dialogRef.close({ groupName: this.groupNameControl.value });
    }
  }

  cancel(): void {
    this.dialogRef.close();
  }
}
