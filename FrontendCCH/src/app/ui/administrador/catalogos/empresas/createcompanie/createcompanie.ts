import { CatalogsService } from './../../../../../core/services/catalogs.service';
import { createCompanieDto } from './../../../../../core/models/catalogs';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TextInputComponent } from '../../../../generic components/input/input.component.';
import { ActionButtonComponent } from '../../../../generic components/actionButton/actionButton.component';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { makeRequired } from '../../../../../core/validators/makeRequired.validator';
import { Router } from '@angular/router';
import { NgSelectModule } from '@ng-select/ng-select';
import { ConfirmSaveComponent } from '../../../../dialog/confirm-save/confirm-save.component';
import { ConfirmUnsavedComponent } from '../../../../dialog/confirm-unsaved/confirm-unsaved.component';
import { UNSAVED_DIALOG } from '../../../../../core/models/dialog';


@Component({
  selector: 'app-createcompanie',
  imports: [CommonModule, ReactiveFormsModule, TextInputComponent, ActionButtonComponent, NgSelectModule, FormsModule],
  templateUrl: './createcompanie.html',
  styleUrl: './createcompanie.scss',
})
export class Createcompanie {
  formGroup: FormGroup;
  isLoading: boolean = false;

  constructor(private router: Router, private catalogs: CatalogsService, private dialog: MatDialog, private dialogRef: MatDialogRef<Createcompanie>){
    this.formGroup = new FormGroup({
      folio: new FormControl('', [makeRequired]),
      nombre: new FormControl('', [makeRequired])
    });
  }



  onSubmit(){
    if(this.formGroup.invalid){
      this.formGroup.markAllAsTouched();
      return;
    }

      const createCompanieDto: createCompanieDto ={
        Folio: this.formGroup.value.folio,
        Nombre: this.formGroup.value.nombre,
      };

      this.isLoading = true;

      this.catalogs.createCompanie(createCompanieDto).subscribe(
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
    const dialogref = this.dialog.open(ConfirmUnsavedComponent, {
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
