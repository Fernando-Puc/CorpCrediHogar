import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { ActionButtonComponent } from '../../generic components/actionButton/actionButton.component';
import { DialogData } from '../../../core/models/dialog';



@Component({
  selector: 'app-confirm-unsaved',
  standalone: true,
  imports: [MatDialogModule,ActionButtonComponent],
  templateUrl: './confirm-unsaved.component.html',
  styleUrl: './confirm-unsaved.component.scss'
})
export class ConfirmUnsavedComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: DialogData) {}
}