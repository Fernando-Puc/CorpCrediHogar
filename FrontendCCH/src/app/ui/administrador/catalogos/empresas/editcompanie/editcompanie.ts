import { ConfirmSaveComponent } from './../../../../dialog/confirm-save/confirm-save.component';
import { CatalogsService } from './../../../../../core/services/catalogs.service';
import { Component, Inject, OnInit } from '@angular/core';
import { ActionButtonComponent } from '../../../../generic components/actionButton/actionButton.component';
import { TextInputComponent } from '../../../../generic components/input/input.component.';
import { ReactiveFormsModule, FormGroup, FormControl } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Empresas } from '../../../../../core/models/catalogs';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { makeRequired } from '../../../../../core/validators/makeRequired.validator';
import { UNSAVED_DIALOG } from '../../../../../core/models/dialog';

@Component({
  selector: 'app-editcompanie',
  imports: [TextInputComponent, ActionButtonComponent, ReactiveFormsModule, CommonModule],
  standalone: true,
  templateUrl: './editcompanie.html',
  styleUrl: './editcompanie.scss',
})
export class Editcompanie implements OnInit {

formGroup: FormGroup;
isLoading: boolean = false;

private IDEmpresa : number | undefined;
private companie: Empresas | undefined;

constructor(private router: Router, private catalogs: CatalogsService, private dialog: MatDialog,
  private dialogRef: MatDialogRef<Editcompanie>, @Inject(MAT_DIALOG_DATA) public data: {IDEmpresa: number}){
    this.formGroup = new FormGroup({
      folio: new FormControl('', [makeRequired]),
      nombre: new FormControl('', [makeRequired]),
    });
  }

  ngOnInit(){
    this.IDEmpresa = this.data.IDEmpresa;
    if(this.IDEmpresa){
      this.loadCompanieData();
    }
  }

  loadCompanieData(){
    if(this.IDEmpresa){
      this.catalogs.getCompanie(this.IDEmpresa).subscribe(resp => {
        this.companie = resp.data;
        if(this.companie){
          this.formGroup.patchValue({
            folio: this.companie.Folio,
            nombre: this.companie.Nombre
          });
        }
      });
    }
  }

  onSubmit(){
    if(this.formGroup.invalid){
      this.formGroup.markAllAsTouched();
    }

    if (this.IDEmpresa === undefined){
      return;
    }

    const updateCompanieDto = {
      IDEmpresa: this.IDEmpresa,
      Folio: this.formGroup.value.folio,
      Nombre: this.formGroup.value.nombre,
    };



    this.catalogs.editCompanie(updateCompanieDto).subscribe(
      (response) => {
        console.log('Producto actualizado correctamente, response');
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
