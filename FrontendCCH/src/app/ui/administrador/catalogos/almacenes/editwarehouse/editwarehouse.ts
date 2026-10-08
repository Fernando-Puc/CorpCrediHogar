import { Component, OnInit } from '@angular/core';
import { ActionButtonComponent } from '../../../../generic components/actionButton/actionButton.component';
import { TextInputComponent } from '../../../../generic components/input/input.component.';
import { NgSelectModule } from '@ng-select/ng-select';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Empresas, getBranchesDto, getWarehouseDto } from '../../../../../core/models/catalogs';
import { CatalogsService } from '../../../../../core/services/catalogs.service';
import { MatDialog } from '@angular/material/dialog';
import { Router, ActivatedRoute } from '@angular/router';
import { makeRequired } from '../../../../../core/validators/makeRequired.validator';
import { ResponseGet } from '../../../../../core/models/responses';
import { ConfirmUnsavedComponent } from '../../../../dialog/confirm-unsaved/confirm-unsaved.component';
import { UNSAVED_DIALOG } from '../../../../../core/models/dialog';

@Component({
  selector: 'app-editwarehouse',
  imports: [ActionButtonComponent, TextInputComponent, NgSelectModule, ReactiveFormsModule, CommonModule],
  templateUrl: './editwarehouse.html',
  styleUrl: './editwarehouse.scss',
})
export class Editwarehouse implements OnInit {
  formgroup: FormGroup;
  Empresa: Empresas[] = [];
  Sucursal: getBranchesDto[] = [];
  private warehouse: getWarehouseDto | undefined;
  private IDWarehouse: number | undefined;


constructor(private router: Router, private catalogs: CatalogsService, private dialog: MatDialog, private route: ActivatedRoute){
      this.formgroup = new FormGroup({
      codigo: new FormControl('', [makeRequired]),
      nombre: new FormControl('', [makeRequired]),
    });

    this.catalogs.getCompanies().subscribe((response: ResponseGet<Empresas[]>)=> {
      this.Empresa = response.data;
    });

    this.catalogs.getBranches().subscribe((response: ResponseGet<getBranchesDto[]>)=> {
      this.Sucursal = response.data;
    });
  }

  ngOnInit(): void {
    this.IDWarehouse = parseInt(this.route.snapshot.paramMap.get('IDAlmacen') ?? '');
    if(this.IDWarehouse){
      this.loadWarehouseData();
    }
  }

  loadWarehouseData(){
    if(this.IDWarehouse){
      this.catalogs.getWarehouse(this.IDWarehouse).subscribe(resp => {
        this.warehouse = resp.data;
        if(this.warehouse){
          this.formgroup.patchValue({
            codigo: this.warehouse.Codigo,
            nombre:this.warehouse.Nombre,
          });
        }
      });
    }
  }

  onSubmit(){
    if (this.formgroup.invalid){
      this.formgroup.markAllAsTouched();
    }

    if(this.IDWarehouse === undefined){
      return;
    }

    const updateWarehouseDto = {
      IDAlmacen: this.IDWarehouse,
      Codigo: this.formgroup.value.codigo,
      Nombre: this.formgroup.value.nombre
    };

    this.catalogs.editWarehouse(updateWarehouseDto).subscribe(
      (response) => {
        console.log('Almacen actualizado correctamente', response);
        this.router.navigate(['administrador/catalogs/almacenes']);
      },
      (error) =>{
        console.error('Error al actualizar almacen', error);
      });
  }

  closeDialog(){
    this.dialog.closeAll();
    this.router.navigate(['administrador/catalogs/almacenes'])
  }

  openDialog(){
    const dialogref = this.dialog.open(ConfirmUnsavedComponent, {
      width: '30%',
      data: UNSAVED_DIALOG,
      disableClose: true
    });
    dialogref.afterClosed().subscribe(resp=>{
      if(resp){
        this.closeDialog();
      }
    })
  }
}
