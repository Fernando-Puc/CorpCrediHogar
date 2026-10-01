import { getBranchDto, editProviderDto } from './../../../../../core/models/catalogs';
import { Component, OnInit } from '@angular/core';
import { ActionButtonComponent } from '../../../../generic components/actionButton/actionButton.component';
import { TextInputComponent } from '../../../../generic components/input/input.component.';
import { NgSelectModule } from '@ng-select/ng-select';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CatalogsService } from '../../../../../core/services/catalogs.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { makeRequired } from '../../../../../core/validators/makeRequired.validator';
import { catchError, debounce, debounceTime, distinctUntilChanged, filter, of, switchMap } from 'rxjs';
import { ConfirmSaveComponent } from '../../../../dialog/confirm-save/confirm-save.component';
import { NOT_FOUND_POSTALG, UNSAVED_DIALOG } from '../../../../../core/models/dialog';
import { ConfirmUnsavedComponent } from '../../../../dialog/confirm-unsaved/confirm-unsaved.component';

@Component({
  selector: 'app-editbranch',
  standalone: true,
  imports: [ActionButtonComponent, TextInputComponent, NgSelectModule, ReactiveFormsModule, CommonModule],
  templateUrl: './editbranch.html',
  styleUrl: './editbranch.scss',
})
export class Editbranch implements OnInit {
  formGroup: FormGroup;
  colonias: string[] = [];
  estados: string[] = [];
  municipios: string[] = [];
  ciudades: string[] = [];
  private IDBranch: number | undefined;
  private IDDomicilio: number | undefined;
  private branch: getBranchDto | undefined;

  constructor(private router: Router, private catalogs: CatalogsService, private route: ActivatedRoute, private dialog: MatDialog){
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
      numExterior: new FormControl(''),
    });
  }

  ngOnInit(): void {
    this.IDBranch = parseInt(this.route.snapshot.paramMap.get('IDSucursal') ?? '');
    if(this.IDBranch){
      this.loadBranchData();
    }

    this.formGroup.get('codigoPostal')?.valueChanges.pipe(
      filter(cp => cp?.length === 5),
      debounceTime(400),
      distinctUntilChanged(),
      switchMap(cp =>
        this.catalogs.searchForCP(cp).pipe(
          catchError(() => {
            this.limpiarDomicilio();
            this.mostrarCPNoEncontrado();
            return of (null);
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

    mostrarCPNoEncontrado(): void{
      this.dialog.open(ConfirmSaveComponent, {
        width: '30%',
        data: NOT_FOUND_POSTALG,
        disableClose: true,
      });
    }

    loadBranchData(){
      if(this.IDBranch){
        this.catalogs.getBranch(this.IDBranch).subscribe(resp => {
          this.branch = resp.data;
          if(this.branch){
            this.IDDomicilio = this.branch.domicilios.IDDomicilio;
            this.estados = [this.branch.domicilios.Estado];
            this.municipios = [this.branch.domicilios.Municipio];
            this.ciudades = [this.branch.domicilios.Ciudad];
            this.colonias = [this.branch.domicilios.Colonia];

            this.formGroup.patchValue({
              codigo: this.branch.Codigo,
              nombre: this.branch.Nombre,
              pais: this.branch.domicilios.Pais,
              codigoPostal: this.branch.domicilios.CodigoPostal,
              estado: this.branch.domicilios.Estado,
              municipio: this.branch.domicilios.Municipio,
              ciudad: this.branch.domicilios.Ciudad,
              colonia: this.branch.domicilios.Colonia,
              calle: this.branch.domicilios.Calle,
              numInterior: this.branch.domicilios.NumInterior,
              numExterior: this.branch.domicilios.NumExterior,
            },
            {
              emitEvent: false
            });
          }
        });
      }
    }

    onSubmit(){
      if(this.formGroup.invalid){
        this.formGroup.markAllAsTouched();
        return;
      }

      if(this.IDBranch === undefined){
        return;
      }

      if(this.IDDomicilio === undefined){
        console.error('No se encontró el IDDomicilio de la sucursal');
        return;
      }

      const editBranchDto = {
        IDSucursal: this.IDBranch,
        Codigo: this.formGroup.value.codigo,
        Nombre: this.formGroup.value.nombre,
        domicilio: {
          IDDomicilio: this.IDDomicilio,
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

      this.catalogs.editBranch(editBranchDto).subscribe(
        (response) => {
          console.log('Sucursal editada exitosamente', response);
          this.router.navigate(['administrador/catalogs/sucursales']);
        },
        (error) => {
          console.error('Error al editar la sucursal', error);
        });
    }


    closeDialog(){
      this.dialog.closeAll();
      this.router.navigate(['administrador/catalogs/sucursales']);
    }

    openDialog(){
      const dialogref = this.dialog.open(ConfirmUnsavedComponent, {
        width: '30%',
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
