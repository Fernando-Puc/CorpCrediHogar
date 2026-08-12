import { Component, Inject, OnInit } from '@angular/core';
import { TextInputComponent } from '../../../../generic components/input/input.component.';
import { ActionButtonComponent } from '../../../../generic components/actionButton/actionButton.component';
import { ReactiveFormsModule, FormGroup, FormControl } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Linea } from '../../../../../core/models/catalogs';
import { CatalogsService } from '../../../../../core/services/catalogs.service';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { makeRequired } from '../../../../../core/validators/makeRequired.validator';
import { ConfirmSaveComponent } from '../../../../dialog/confirm-save/confirm-save.component';
import { UNSAVED_DIALOG } from '../../../../../core/models/dialog';

@Component({
  selector: 'app-editline',
  imports: [TextInputComponent, ActionButtonComponent, ReactiveFormsModule, CommonModule ],
  standalone: true,
  templateUrl: './editline.html',
  styleUrl: './editline.scss',
})
export class Editline implements OnInit {
  formGroup: FormGroup;
  isLoading: boolean = false;

  private IDLinea: number | undefined;
  private line: Linea | undefined;

  constructor(private catalogs: CatalogsService, private dialog: MatDialog,
    private dialogRef: MatDialogRef<Editline>, @Inject(MAT_DIALOG_DATA) public data: {IDLinea: number}
  ){
    this.formGroup = new FormGroup({
      nombre: new FormControl('', [makeRequired]),
    });
  }

  ngOnInit(){
    this.IDLinea = this.data.IDLinea;
    if(this.IDLinea){
      this.loadLineData();
    }
  }

  loadLineData(){
    if(this.IDLinea){
      this.catalogs.getLine(this.IDLinea).subscribe(resp => {
        this.line = resp.data;
        if(this.line){
          this.formGroup.patchValue({
            nombre: this.line.Nombre
          });
        }
      });
    }
  }

  onSubmit(){
    if(this.formGroup.invalid){
      this.formGroup.markAllAsTouched();
    }

    if(this.IDLinea === undefined){
      return;
    }

    const updateLineDto = {
      IDLinea: this.IDLinea,
      Nombre: this.formGroup.value.nombre,
    };

    this.catalogs.editLine(updateLineDto).subscribe(
      (response) => {
        console.log('Linea actualizada correctamente', response);
        this.dialogRef.close(true);
      },
      (error) => {
        console.error('Error al actualizar la empresa', error);
      });
  }

  closeDialog(){
    this.dialogRef.close(false);
  }

  openDialog(){
    const dialogref = this.dialog.open(ConfirmSaveComponent, {
      width: '30%',
      data: UNSAVED_DIALOG,
      disableClose:true
    });
    dialogref.afterClosed().subscribe(resp => {
      if(resp){
        this.closeDialog();
      }
    });
  }
}
