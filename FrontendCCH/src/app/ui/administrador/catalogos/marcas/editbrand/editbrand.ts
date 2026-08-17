import { Component, Inject, OnInit } from '@angular/core';
import { TextInputComponent } from '../../../../generic components/input/input.component.';
import { ActionButtonComponent } from '../../../../generic components/actionButton/actionButton.component';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { editBrandDto, Marca } from '../../../../../core/models/catalogs';
import { CatalogsService } from '../../../../../core/services/catalogs.service';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { makeRequired } from '../../../../../core/validators/makeRequired.validator';
import { ConfirmSaveComponent } from '../../../../dialog/confirm-save/confirm-save.component';
import { UNSAVED_DIALOG } from '../../../../../core/models/dialog';

@Component({
  selector: 'app-editbrand',
  imports: [TextInputComponent, ActionButtonComponent, ReactiveFormsModule, CommonModule],
  standalone: true,
  templateUrl: './editbrand.html',
  styleUrl: './editbrand.scss',
})
export class Editbrand implements OnInit {
  formGroup: FormGroup;
  isLoading: boolean = false;

  private IDMarca: number | undefined;
  private brand: Marca | undefined;

  constructor(private catalogs: CatalogsService, private dialog: MatDialog,
    private dialogRef: MatDialogRef<editBrandDto>, @Inject(MAT_DIALOG_DATA) public data: {IDMarca: number }
  ){
    this.formGroup = new FormGroup({
      nombre: new FormControl('', [makeRequired])
    });
  }

  ngOnInit(){
    this.IDMarca = this.data.IDMarca;
    if(this.IDMarca){
      this.loadBrandData();
    }
  }

  loadBrandData(){
    if(this.IDMarca){
      this.catalogs.getBrand(this.IDMarca).subscribe(resp => {
        this.brand = resp.data;
        if(this.brand){
          this.formGroup.patchValue({
            nombre: this.brand.Nombre
          });
        }
      });
    }
  }

  onSubmit(){
    if(this.formGroup.invalid){
      this.formGroup.markAllAsTouched();
    }

    if(this.IDMarca === undefined){
      return;
    }

    const updateBrandDto = {
      IDMarca: this.IDMarca,
      Nombre: this.formGroup.value.nombre,
    };

    this.catalogs.editBrand(updateBrandDto).subscribe(
      (response) => {
        console.log('Marca actualizada correctamente', response);
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
