import { CreateLineDto } from './../../../../../core/models/catalogs';
import { Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule, FormGroup, FormControl } from '@angular/forms';
import { TextInputComponent } from '../../../../generic components/input/input.component.';
import { ActionButtonComponent } from '../../../../generic components/actionButton/actionButton.component';
import { CommonModule } from '@angular/common';
import { CatalogsService } from '../../../../../core/services/catalogs.service';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { makeRequired } from '../../../../../core/validators/makeRequired.validator';
import { ConfirmUnsavedComponent } from '../../../../dialog/confirm-unsaved/confirm-unsaved.component';
import { UNSAVED_DIALOG } from '../../../../../core/models/dialog';

@Component({
  selector: 'app-createline',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, TextInputComponent, ActionButtonComponent, FormsModule],
  templateUrl: './createline.html',
  styleUrl: './createline.scss',
})
export class Createline {
  formGroup: FormGroup;
  isLoading: boolean = false;

  constructor(private catalogs: CatalogsService, private dialog: MatDialog, private dialogRef: MatDialogRef<Createline>){
    this.formGroup = new FormGroup({
      nombre: new FormControl('', [makeRequired])
    });
  }

  onSubmit(){
    if(this.formGroup.invalid){
      this.formGroup.markAllAsTouched();
      return;
    }

    const createLineDto: CreateLineDto = {
      Nombre: this.formGroup.value.nombre
    };

    this.isLoading = true;
    this.catalogs.createLine(createLineDto).subscribe(
      (response) => {
        console.log('Empresa creada exitosamente', response);
        this.isLoading = false;
        this.dialogRef.close(true);
      },
      (error) => {
        console.error('Error al registrar el producto', error);
        this.isLoading = false;
      });
  }

  closeDialog():void{
    this.dialogRef.close(false);
  }

  openDialog(){
    const dialogref = this.dialog.open(ConfirmUnsavedComponent,{
      width: '30',
      data: UNSAVED_DIALOG,
      disableClose: true
      });
      dialogref.afterClosed().subscribe(resp => {
      if(resp){
      this.closeDialog();
      }
    });
  }
}

