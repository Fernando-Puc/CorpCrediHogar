import { Component } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TextInputComponent } from "../../generic components/input/input.component.";
import { makeRequired } from '../../../core/validators/makeRequired.validator';
import { ActionButtonComponent } from '../../generic components/actionButton/actionButton.component';




@Component({
  selector: 'app-clientes',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, TextInputComponent, ActionButtonComponent],
  templateUrl: './clientes.html',
  styleUrl: './clientes.scss'
})
export class Clientes {

  clientes: any[] = [];
  formGroup: FormGroup;

  constructor(private fb: FormBuilder) {

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
  }
}

