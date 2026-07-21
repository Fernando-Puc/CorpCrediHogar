import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { ActionButtonComponent } from '../../generic components/actionButton/actionButton.component';
import { DialogData } from '../../../core/models/dialog';


@Component({
  selector: 'app-confirm-save',
  standalone: true,
  imports: [MatDialogModule,ActionButtonComponent],
  templateUrl: './confirm-save.component.html',
  styleUrl: './confirm-save.component.scss'
})
export class ConfirmSaveComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: DialogData) {}
}
