import { TipoContacto } from './../../../../core/models/catalogs';
import { NgSelectModule } from '@ng-select/ng-select';
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
//import { Component } from '@angular/core';
import {ReactiveFormsModule, FormGroup, FormBuilder, FormControl, FormsModule,} from '@angular/forms';
import { TextInputComponent } from '../../../generic components/input/input.component.';
import { ActionButtonComponent } from '../../../generic components/actionButton/actionButton.component';
import { makeRequired } from '../../../../core/validators/makeRequired.validator';
import { Router } from '@angular/router';
import { Linea } from '../../../../core/models/catalogs';
import { Marca } from '../../../../core/models/catalogs';
import { UnidadMedida } from '../../../../core/models/catalogs';
import { MatCheckboxModule } from '@angular/material/checkbox';

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

//catalogo de las lineas de los productos
export class Createproducts implements OnInit {
  productos: any[] = [];
  Linea: Linea[] = [
    {
      id: 1,
      descripcion: 'Linea Blanca',
    },
    {
      id: 2,
      descripcion: 'Electronica',
    },
    {
      id: 3,
      descripcion: 'Electrodomesticos',
    },
    {
      id: 4,
      descripcion: 'Muebles',
    },
    {
      id: 5,
      descripcion: 'Rodada',
    },
    {
      id: 6,
      descripcion: 'Otros',
    },
  ];

  //catalogo de marcas

  formGroup: FormGroup;
  marca: any[] = [];
  Marca: Marca[] = [
    {
      id: 1,
      descripcion: 'Mabe',
    },
    {
      id: 2,
      descripcion: 'Midea',
    },
    {
      id: 3,
      descripcion: 'Hisense',
    },
    {
      id: 4,
      descripcion: 'Mirage',
    },
    {
      id: 5,
      descripcion: 'Aiwa',
    },
    {
      id: 6,
      descripcion: 'Misik',
    },
  ];

  //catalogo de unidades de medida
  UnidadMedida: UnidadMedida[] = [
    {
      id: 1,
      descripcion: 'Pieza',
    }
  ];

  constructor(
    private fb: FormBuilder,
    private router: Router,
  ) {
    this.formGroup = new FormGroup({
      codigo: new FormControl('', [makeRequired]),
      nombre: new FormControl('', [makeRequired]),
      linea: new FormControl('', [makeRequired]),
      marca: new FormControl('', [makeRequired]),
      unidadMedida: new FormControl('', [makeRequired]),
      claveSAT: new FormControl('', [makeRequired]),
      sinClaveSAT: new FormControl(false),
      fechaRegistro: new FormControl('', [makeRequired]),
    });
  }

  guardar() {
    if (this.formGroup.invalid) {
      this.formGroup.markAllAsTouched();
      return;
    }

    this.productos.push(this.formGroup.value);
    this.formGroup.reset();
    this.router.navigate(['administrador/productos']);
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

