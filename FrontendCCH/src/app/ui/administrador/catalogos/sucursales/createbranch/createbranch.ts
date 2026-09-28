import { createBrancheDto } from './../../../../../core/models/catalogs';
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TextInputComponent } from '../../../../generic components/input/input.component.';
import { ActionButtonComponent } from '../../../../generic components/actionButton/actionButton.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { Router } from '@angular/router';
import { CatalogsService } from '../../../../../core/services/catalogs.service';
import { MatDialog } from '@angular/material/dialog';
import { makeRequired } from '../../../../../core/validators/makeRequired.validator';
import { catchError, debounceTime, distinctUntilChanged, filter, of, switchMap } from 'rxjs';
import { ConfirmSaveComponent } from '../../../../dialog/confirm-save/confirm-save.component';
import { NOT_FOUND_POSTALG, UNSAVED_DIALOG } from '../../../../../core/models/dialog';
import { ConfirmUnsavedComponent } from '../../../../dialog/confirm-unsaved/confirm-unsaved.component';

@Component({
  selector: 'app-createbranch',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, TextInputComponent, ActionButtonComponent, NgSelectModule, FormsModule],
  templateUrl: './createbranch.html',
  styleUrl: './createbranch.scss',
})
export class Createbranch implements OnInit{
  formGroup: FormGroup;
  colonias: string[] = [];
  estados: string[] = [];
  municipios: string[] = [];
  ciudades: string[] = [];

  constructor( private router: Router, private catalogs: CatalogsService, private dialog: MatDialog){
    this.formGroup = new FormGroup({
      codigo: new FormControl('', [makeRequired]),
      nombre: new FormControl('', [makeRequired]),

      pais: new FormControl('Mexico', [makeRequired]),
      codigoPostal: new FormControl('', [makeRequired]),
      estado: new FormControl('', [makeRequired]),
      municipio: new FormControl('', [makeRequired]),
      ciudad: new FormControl('', [makeRequired]),
      colonia: new FormControl('', [makeRequired]),
      calle: new FormControl(''),
      numInterior: new FormControl(''),
      numExterior: new FormControl('')
    })
  }

  ngOnInit(): void {
    this.formGroup.get('codigoPostal')?.valueChanges.pipe(
      filter(cp => cp?.length === 5),
      debounceTime(400),
      distinctUntilChanged(),
      switchMap(cp =>
        this.catalogs.searchForCP(cp).pipe(
          catchError(() => {
            this.limpiarDomicilio();
            this.mostrarCPNoEncontrado();
            return of(null);
          })
        )
      )
    ).subscribe((resp) => {
      if (!resp?.data) return;
      const info = resp.data;

      this.estados = [info.estado];
      this.municipios = [info.municipio];
      this.ciudades = [info.ciudad];
      this.colonias = info.colonias;

      this.formGroup.patchValue({
        estado: info.estado,
        municipio: info.municipio,
        ciudad: info.ciudad,
        colonia: '',
      });
    });
  }

  limpiarDomicilio(): void {
    this.estados = [];
    this.municipios = [];
    this.ciudades = [];
    this.colonias = [];
    this.formGroup.patchValue({ estado: '', municipio: '', ciudad: '', colonia: '' });
  }

  mostrarCPNoEncontrado(): void {
    this.dialog.open(ConfirmSaveComponent, {
      width: '30%',
      data: NOT_FOUND_POSTALG,
      disableClose: true,
    });
  }

  onSubmit(): void{
    if (this.formGroup.invalid) {
      this.formGroup.markAllAsTouched();
    }else{
      const createBrancheDto: createBrancheDto = {
        Codigo: this.formGroup.value.codigo,
        Nombre: this.formGroup.value.nombre,
        domicilio: {
          Pais: this.formGroup.value.pais,
          CodigoPostal: this.formGroup.value.codigoPostal,
          Estado: this.formGroup.value.estado,
          Municipio: this.formGroup.value.municipio,
          Ciudad: this.formGroup.value.ciudad,
          Colonia: this.formGroup.value.colonia,
          Calle: this.formGroup.value.calle,
          NumInterior: this.formGroup.value.numInterior,
          NumExterior: this.formGroup.value.numExterior,
        },
        FechaRegistro: new Date().toISOString(),
        Activo: true,
      };

      this.catalogs.createBranch(createBrancheDto).subscribe(
        (response) => {
          console.log('Sucursal creada exitosamente', response);
          this.router.navigate(['administrador/catalogs/sucursales']);
        },
        (error) => {
          console.error('Error al registrar la sucursal', error);
        }
      );
    }
  }

  closeDialog(): void{
    this.dialog.closeAll();
    this.router.navigate(['administrador/catalogs/sucursales']);
  }

  openDialog(): void {
    const dialogref = this.dialog.open(ConfirmUnsavedComponent, {
      width: '30%',
      data: UNSAVED_DIALOG,
      disableClose: true,
    });
    dialogref.afterClosed().subscribe(resp => {
      if (resp) {
        this.closeDialog();
      }
    });
  }

}
