import { Component, Inject } from '@angular/core';
import { MatDialogModule, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ActionButtonComponent } from '../../generic components/actionButton/actionButton.component';
import { DialogData } from '../../../core/models/dialog';



@Component({
  selector: 'app-confirm-delete',
  standalone: true,
  imports: [MatDialogModule, ActionButtonComponent],
  templateUrl: './confirm-delete.component.html',
  styleUrl: './confirm-delete.component.scss'
})
export class ConfirmDeleteComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: DialogData) {}
}
