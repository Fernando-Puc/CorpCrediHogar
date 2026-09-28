import { editProviderDto } from './../../../../../core/models/catalogs';
import { Component, OnInit } from '@angular/core';
import { ActionButtonComponent } from '../../../../generic components/actionButton/actionButton.component';
import { MatCheckbox } from '@angular/material/checkbox';
import { TextInputComponent } from '../../../../generic components/input/input.component.';
import { NgSelectModule } from '@ng-select/ng-select';
import { ReactiveFormsModule, FormGroup, FormControl } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { getProviderDto } from '../../../../../core/models/catalogs';
import { ActivatedRoute, Router } from '@angular/router';
import { CatalogsService } from '../../../../../core/services/catalogs.service';
import { MatDialog } from '@angular/material/dialog';
import { makeRequired } from '../../../../../core/validators/makeRequired.validator';
import { NOT_FOUND_POSTALG, UNSAVED_DIALOG } from '../../../../../core/models/dialog';
import { ConfirmSaveComponent } from '../../../../dialog/confirm-save/confirm-save.component';
import { catchError, debounceTime, distinctUntilChanged, filter, of, switchMap } from 'rxjs';
import { ConfirmUnsavedComponent } from '../../../../dialog/confirm-unsaved/confirm-unsaved.component';

@Component({
  selector: 'app-editprovider',
  standalone: true,
  imports: [ActionButtonComponent, TextInputComponent, NgSelectModule, ReactiveFormsModule, CommonModule],
  templateUrl: './editprovider.html',
  styleUrl: './editprovider.scss',
})
export class Editprovider implements OnInit {
  formGroup: FormGroup;
  colonias: string[] = [];
  estados: string[] = [];
  municipios: string[] = [];
  ciudades: string[] = [];
  private IDProvider: number | undefined;
  private IDDomicilio: number | undefined;
  private provider: getProviderDto | undefined;



  constructor(private router: Router, private catalogs: CatalogsService, private route: ActivatedRoute,
    private dialog: MatDialog){
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

    ngOnInit(){
      this.IDProvider = parseInt(this.route.snapshot.paramMap.get('IDProveedor') ?? '');
      if(this.IDProvider){
        this.loadProviderData();
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

    loadProviderData(){
      if(this.IDProvider){
        this.catalogs.getProvider(this.IDProvider).subscribe(resp => {
          this.provider = resp.data;
          if(this.provider){
            this.IDDomicilio = this.provider.domicilio.IDDomicilio;
            this.estados = [this.provider.domicilio.Estado];
            this.municipios = [this.provider.domicilio.Municipio];
            this.ciudades = [this.provider.domicilio.Ciudad];
            this.colonias = [this.provider.domicilio.Colonia];

            this.formGroup.patchValue({
              codigo: this.provider.Codigo,
              nombre: this.provider.Nombre,
              rfc: this.provider.RFC,
              pais: this.provider.domicilio.Pais,
              codigoPostal: this.provider.domicilio.CodigoPostal,
              estado: this.provider.domicilio.Estado,
              municipio: this.provider.domicilio.Municipio,
              ciudad: this.provider.domicilio.Ciudad,
              colonia: this.provider.domicilio.Colonia,
              calle: this.provider.domicilio.Calle,
              numInterior: this.provider.domicilio.NumInterior,
              numExterior: this.provider.domicilio.NumExterior,
            },
          {
            emitEvent: false
          });
          }
        });
      }
    }

    onSubmit(){
      if (this.formGroup.invalid){
        this.formGroup.markAllAsTouched();
        return;
      }

      if(this.IDProvider === undefined){
        return;
      }

      if(this.IDDomicilio === undefined){
        console.error('No se encontró el IDDomicilio del proveedor');
        return;
      }

      const editProviderDto = {
        IDProveedor: this.IDProvider,
        Codigo: this.formGroup.value.codigo,
        Nombre: this.formGroup.value.nombre,
        RFC: this.formGroup.value.rfc,
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

      this.catalogs.editProvider(editProviderDto).subscribe(
        (response) => {
          console.log('Proveedor editado exitosamente', response);
          this.router.navigate(['administrador/catalogs/proveedores']);
        },
        (error) => {
          console.error('Error al editar el proveedor', error);
        });
    }

    closeDialog(){
      this.dialog.closeAll();
      this.router.navigate(['administrador/catalogs/proveedores']);
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
