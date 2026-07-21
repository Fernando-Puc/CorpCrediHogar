import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { ActionButtonComponent } from '../../generic components/actionButton/actionButton.component';
import { DialogData } from '../../../core/models/dialog';

@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [MatDialogModule,ActionButtonComponent],
  templateUrl: './not-found.component.html',
  styleUrl: './not-found.component.scss'
})
export class NotFoundComponent {

  constructor(@Inject(MAT_DIALOG_DATA) public data: DialogData) {}

}
