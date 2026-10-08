import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TextInputComponent } from '../../../../generic components/input/input.component.';
import { ActionButtonComponent } from '../../../../generic components/actionButton/actionButton.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { createWarehouseDto, Empresas, getBranchesDto} from '../../../../../core/models/catalogs';
import { CatalogsService } from '../../../../../core/services/catalogs.service';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { makeRequired } from '../../../../../core/validators/makeRequired.validator';
import { ResponseGet } from '../../../../../core/models/responses';
import { ConfirmUnsavedComponent } from '../../../../dialog/confirm-unsaved/confirm-unsaved.component';
import { UNSAVED_DIALOG } from '../../../../../core/models/dialog';

@Component({
  selector: 'app-createwarehouse',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, TextInputComponent, ActionButtonComponent, NgSelectModule, FormsModule],
  templateUrl: './createwarehouse.html',
  styleUrl: './createwarehouse.scss',
})
export class Createwarehouse  implements OnInit{
  formgroup: FormGroup;
  Empresa: Empresas[] = [];
  Sucursal: getBranchesDto[] = [];

  constructor(private router: Router, private catalogs: CatalogsService, private dialog: MatDialog){
    this.formgroup = new FormGroup({
      codigo: new FormControl('', [makeRequired]),
      nombre: new FormControl('', [makeRequired]),
      empresa: new FormControl('', [makeRequired]),
      sucursal: new FormControl('', [makeRequired]),
    });

    this.catalogs.getCompanies().subscribe((response: ResponseGet<Empresas[]>)=> {
      this.Empresa = response.data;
    });

    this.catalogs.getBranches().subscribe((response: ResponseGet<getBranchesDto[]>)=> {
      this.Sucursal = response.data;
    });
  }

  onSubmit(){
    if (this.formgroup.invalid){
      this.formgroup.markAllAsTouched();
    }else{
      const createWarehouse: createWarehouseDto = {
        Codigo: this.formgroup.value.codigo,
        Nombre: this.formgroup.value.nombre,
        IDEmpresa: this.formgroup.value.empresa,
        IDSucursal: this.formgroup.value.sucursal,
      };

      this.catalogs.createWarehouse(createWarehouse).subscribe(
        (response) => {
          console.log('Almacen creado exitosamente', response);
          this.router.navigate(['administrador/catalogs/almacenes']);
        },
        (error) => {
          console.error('Error al registrar el producto', error);
        }
      )
    }
  }

  ngOnInit(): void {

  }

  closeDialog(){
    this.dialog.closeAll();
    this.router.navigate(['administrador/catalogs/almacenes']);
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
      })
    }

}
