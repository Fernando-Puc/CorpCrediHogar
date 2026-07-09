import { TipoContacto } from './../../../../core/models/catalogs';
import { NgSelectModule } from '@ng-select/ng-select';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormBuilder, FormControl, FormsModule } from '@angular/forms';
import { TextInputComponent } from '../../../generic components/input/input.component.';
import { ActionButtonComponent } from '../../../generic components/actionButton/actionButton.component';
import { makeRequired } from '../../../../core/validators/makeRequired.validator';
import { Router } from '@angular/router';



@Component({
  selector: 'app-createclientes',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, TextInputComponent, ActionButtonComponent, NgSelectModule, FormsModule, CommonModule],
  templateUrl: './createclientes.html',
  styleUrl: './createclientes.scss',
})
export class Createclientes {

  clientes: any[] = [];
  TipoContacto: TipoContacto[] = [
    {
    id: 1,
    descripcion: 'cliente',
    }
  ];
  formGroup: FormGroup;

  constructor(private fb: FormBuilder, private router: Router){
    this.formGroup = new FormGroup({
      nombres: new FormControl('', [makeRequired]),
      apellidos: new FormControl('', [makeRequired]),
      tipoContacto: new FormControl('', [makeRequired]),
      telefono: new FormControl('', [makeRequired]),
      direccion: new FormControl('', [makeRequired]),
    });
  }

    guardar() {
    if (this.formGroup.invalid) {
      this.formGroup.markAllAsTouched();
      return;
    }

    this.clientes.push(this.formGroup.value);
    this.formGroup.reset();
    this.router.navigate(['administrador/clientes']);
  }
}
