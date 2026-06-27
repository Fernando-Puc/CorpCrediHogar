import { Component } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-clientes',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './clientes.html',
  styleUrl: './clientes.scss'
})
export class Clientes {

  clientes: any[] = [];

  formulario: FormGroup;

  constructor(private fb: FormBuilder) {
    this.formulario = this.fb.group({
      nombres: [''],
      apellidos: [''],
      tipoContacto: [''],
      telefono: [''],
      direccion: ['']
    });
  }

  guardar() {

    this.clientes.push({
      ...this.formulario.value
    });

    this.formulario.reset();
  }
}

