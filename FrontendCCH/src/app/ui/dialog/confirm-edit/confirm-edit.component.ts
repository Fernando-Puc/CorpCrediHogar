import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { ActionButtonComponent } from '../../generic components/actionButton/actionButton.component';
import { DialogData } from '../../../core/models/dialog';


@Component({
  selector: 'app-confirm-edit',
  standalone: true,
  imports: [MatDialogModule,ActionButtonComponent],
  templateUrl: './confirm-edit.component.html',
  styleUrl: './confirm-edit.component.scss'
})
export class ConfirmEditComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: DialogData) {}
}
