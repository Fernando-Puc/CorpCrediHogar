import { createUMedidaDto } from './../../../../../core/models/catalogs';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TextInputComponent } from '../../../../generic components/input/input.component.';
import { ActionButtonComponent } from '../../../../generic components/actionButton/actionButton.component';
import { CatalogsService } from '../../../../../core/services/catalogs.service';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { makeRequired } from '../../../../../core/validators/makeRequired.validator';
import { ConfirmUnsavedComponent } from '../../../../dialog/confirm-unsaved/confirm-unsaved.component';
import { UNSAVED_DIALOG } from '../../../../../core/models/dialog';

@Component({
  selector: 'app-createumedida',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, TextInputComponent, ActionButtonComponent, FormsModule],
  templateUrl: './createumedida.html',
  styleUrl: './createumedida.scss',
})
export class Createumedida {
  formGroup: FormGroup;
  isLoading: Boolean = false;

  constructor(private catalogs: CatalogsService, private dialog: MatDialog, private dialogRef: MatDialogRef<Createumedida>){
    this.formGroup = new FormGroup({
      nombre: new FormControl('', [makeRequired])
    });
  }

  onSubmit(){
    if(this.formGroup.invalid){
      this.formGroup.markAllAsTouched();
      return;
    }

    const createUMedidaDto: createUMedidaDto = {
      Nombre: this.formGroup.value.nombre
    };

    this.isLoading = true;
    this.catalogs.createUnitMeasurement(createUMedidaDto).subscribe(
      (response) => {
        console.log('Unidad de medida creada exitosamente', response);
        this.isLoading = false;
        this.dialogRef.close(true);
      },
      (error) => {
        console.error('Error al registrar la unidad de medida', error);
        this.isLoading= false;
      });
  }

  closeDialog(): void{
    this.dialogRef.close(false);
  }

  openDialog(){
    const dialogref = this.dialog.open(ConfirmUnsavedComponent, {
      width: '30',
      data: UNSAVED_DIALOG,
      disableClose: true
      });
      dialogref.afterClosed().subscribe(resp => {
      if(resp){
      this.closeDialog();
      }
    })
  }
}
