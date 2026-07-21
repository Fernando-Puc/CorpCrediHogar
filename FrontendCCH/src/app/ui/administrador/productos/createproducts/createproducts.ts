import { Linea, Marca, UnidadMedida } from './../../../../core/models/catalogs';
import { createProductDto } from './../../../../core/models/products';
import { ProductsService } from './../../../../core/services/products.service';
import { NgSelectModule } from '@ng-select/ng-select';
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {ReactiveFormsModule, FormGroup, FormBuilder, FormControl, FormsModule,} from '@angular/forms';
import { TextInputComponent } from '../../../generic components/input/input.component.';
import { ActionButtonComponent } from '../../../generic components/actionButton/actionButton.component';
import { makeRequired } from '../../../../core/validators/makeRequired.validator';
import { Router } from '@angular/router';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { CatalogsService } from '../../../../core/services/catalogs.service';
import { ResponseGet } from '../../../../core/models/responses';

@Component({
  selector: 'app-createproducts',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TextInputComponent,
    ActionButtonComponent,
    NgSelectModule,
    FormsModule,
    MatCheckboxModule,
  ],
  templateUrl: './createproducts.html',
  styleUrl: './createproducts.scss',
})

export class Createproducts implements OnInit {
  Linea: Linea[] = [];
  formGroup: FormGroup;
  Marca: Marca[] = [];
  UnidadMedida: UnidadMedida[] = [];

  constructor(
    private router: Router,
    private catalogs: CatalogsService,
    private  productService: ProductsService,
  ) {
    this.formGroup = new FormGroup({
      codigo: new FormControl('', [makeRequired]),
      nombre: new FormControl('', [makeRequired]),
      linea: new FormControl('', [makeRequired]),
      marca: new FormControl('', [makeRequired]),
      unidadMedida: new FormControl('', [makeRequired]),
      claveSAT: new FormControl('', [makeRequired]),
      sinClaveSAT: new FormControl(false),
    });

    this.catalogs.getProductLines().subscribe((response: ResponseGet<Linea[]>) => {
      this.Linea = response.data;
    });

    this.catalogs.getProductBrands().subscribe((response: ResponseGet<Marca[]>) => {
      this.Marca = response.data;
    });

    this.catalogs.getUnitMeasurement().subscribe((response: ResponseGet<UnidadMedida[]>) => {
      this.UnidadMedida = response.data;
    });
  }

  onSubmit(){
    if (this.formGroup.invalid){
      this.formGroup.markAllAsTouched();
    }else{
      const createProductDto: createProductDto = {
        Codigo: this.formGroup.value.codigo,
        Nombre: this.formGroup.value.nombre,
        ClaveSAT: this.formGroup.value.claveSAT,
        IDLinea: this.formGroup.value.linea,
        IDMarca: this.formGroup.value.marca,
        IDUnidadMedida: this.formGroup.value.unidadMedida,

      };

      this.productService.createproduct(createProductDto).subscribe(
        (response) => {
          console.log('Producto creado exitosamente', response);
          this.router.navigate(['administrador/productos']);
        },
        (error) => {
          console.error('Error al registrar el producto', error);
        }
      )
    }
  }

  ngOnInit(): void {
  this.formGroup.get('sinClaveSAT')?.valueChanges.subscribe((sinClave) => {
    const claveSAT = this.formGroup.get('claveSAT');

    if (sinClave) {
      claveSAT?.reset();
      claveSAT?.clearValidators();
      claveSAT?.disable();
    } else {
      claveSAT?.enable();
      claveSAT?.setValidators([makeRequired]);
    }

    claveSAT?.updateValueAndValidity();
  });
}
}

