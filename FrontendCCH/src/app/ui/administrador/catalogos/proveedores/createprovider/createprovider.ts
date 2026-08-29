import { NgSelectModule } from '@ng-select/ng-select';
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormBuilder, FormControl, FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { filter, debounceTime, distinctUntilChanged, switchMap, catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { CatalogsService } from '../../../../../core/services/catalogs.service';
import { makeRequired } from '../../../../../core/validators/makeRequired.validator';
import { createProviderDto } from '../../../../../core/models/catalogs';
import { TextInputComponent } from '../../../../generic components/input/input.component.';
import { ActionButtonComponent } from '../../../../generic components/actionButton/actionButton.component';
import { ConfirmSaveComponent } from '../../../../dialog/confirm-save/confirm-save.component';
import { UNSAVED_DIALOG, NOT_FOUND_POSTALG } from '../../../../../core/models/dialog';
import { ConfirmUnsavedComponent } from '../../../../dialog/confirm-unsaved/confirm-unsaved.component';

@Component({
  selector: 'app-createprovider',
  standalone: true,
  imports: [ CommonModule, ReactiveFormsModule, TextInputComponent, ActionButtonComponent, NgSelectModule, FormsModule],
  templateUrl: './createprovider.html',
  styleUrl: './createprovider.scss',
})
export class Createprovider implements OnInit {
  formGroup: FormGroup;
  colonias: string[] = [];
  estados: string[] = [];
  municipios: string[] = [];
  ciudades: string[] = [];

  constructor(
    private router: Router,
    private catalogs: CatalogsService,
    private dialog: MatDialog,
  ) {
    this.formGroup = new FormGroup({
      codigo: new FormControl('', [makeRequired]),
      nombre: new FormControl('', [makeRequired]),
      rfc: new FormControl('', [makeRequired]),

      pais: new FormControl('Mexico', [makeRequired] ),
      codigoPostal: new FormControl('', [makeRequired]),
      estado: new FormControl('', [makeRequired]),
      municipio: new FormControl('', [makeRequired]),
      ciudad: new FormControl('', [makeRequired]),
      colonia: new FormControl('', [makeRequired]),
      calle: new FormControl(''),
      numInterior: new FormControl(''),
      numExterior: new FormControl(''),
    });
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

  onSubmit(): void {
    if (this.formGroup.invalid) {
      this.formGroup.markAllAsTouched();
    } else {
      const createProviderDto: createProviderDto = {
        Codigo: this.formGroup.value.codigo,
        Nombre: this.formGroup.value.nombre,
        RFC: this.formGroup.value.rfc,
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

      this.catalogs.createProvider(createProviderDto).subscribe(
        (response) => {
          console.log('Proveedor creado exitosamente', response);
          this.router.navigate(['administrador/catalogs/proveedores']);
        },
        (error) => {
          console.error('Error al registrar el proveedor', error);
        }
      );
    }
  }

  closeDialog(): void {
    this.dialog.closeAll();
    this.router.navigate(['administrador/catalogs/proveedores']);
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
