import { Component, Inject, OnInit } from '@angular/core';
import { TextInputComponent } from '../../../../generic components/input/input.component.';
import { ActionButtonComponent } from '../../../../generic components/actionButton/actionButton.component';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { UnidadMedida } from '../../../../../core/models/catalogs';
import { CatalogsService } from '../../../../../core/services/catalogs.service';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { makeRequired } from '../../../../../core/validators/makeRequired.validator';
import { ConfirmSaveComponent } from '../../../../dialog/confirm-save/confirm-save.component';
import { UNSAVED_DIALOG } from '../../../../../core/models/dialog';

@Component({
  selector: 'app-editumedida',
  standalone: true,
  imports: [TextInputComponent, ActionButtonComponent, ReactiveFormsModule, CommonModule],
  templateUrl: './editumedida.html',
  styleUrl: './editumedida.scss',
})
export class Editumedida implements OnInit{
  formGroup: FormGroup;
  isLoading: boolean = false;

  private IDUnidadMedida: number | undefined;
  private umedida: UnidadMedida | undefined;

  constructor(private catalogs: CatalogsService, private dialog: MatDialog,
    private dialogRef: MatDialogRef<Editumedida>, @Inject(MAT_DIALOG_DATA) public data: {IDUnidadMedida: number}
  ){
    this.formGroup = new FormGroup({
      nombre: new FormControl('', [makeRequired]),
    });
  }

  ngOnInit(){
    this.IDUnidadMedida = this.data.IDUnidadMedida;
    if(this.IDUnidadMedida){
      this.loadUnitData();
    }
  }

  loadUnitData(){
    if(this.IDUnidadMedida){
      this.catalogs.getUMeasurment(this.IDUnidadMedida).subscribe(resp=>{
        this.umedida = resp.data;
        if(this.umedida){
          this.formGroup.patchValue({
            nombre: this.umedida.Nombre
          });
        }
      });
      }
    }

  onSubmit(){
    if(this.formGroup.invalid){
      this.formGroup.markAllAsTouched();
    }

    if(this.IDUnidadMedida === undefined){
      return;
    }

    const updateUmeasurement = {
      IDUnidadMedida: this.IDUnidadMedida,
      Nombre: this.formGroup.value.nombre
    };

    this.catalogs.editUMeasurement(updateUmeasurement).subscribe(
      (response) => {
        console.log('Unidad de medida actualizada correctamente', response);
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
      })
    }


  }
