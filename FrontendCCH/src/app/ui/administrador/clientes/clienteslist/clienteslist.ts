import { Component } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TextInputComponent } from "../../../generic components/input/input.component.";
import { makeRequired } from '../../../../core/validators/makeRequired.validator';
import { ActionButtonComponent } from '../../../generic components/actionButton/actionButton.component';
import { chevronLeftIcon, chevronRightIcon, editIcon, eyeIcon, trashIcon } from '../../../../core/shared/shared/constants/icons.constants';
import { SafeHtmlPipe } from '../../../../core/shared/shared/pipes/safeHtml.pipe';
import { Router } from '@angular/router';



@Component({
  selector: 'app-clientes',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, TextInputComponent, ActionButtonComponent, SafeHtmlPipe],
  templateUrl: './clienteslist.html',
  styleUrl: './clienteslist.scss'
})
export class Clientes {

  clientes: any[] = [];
  formGroup: FormGroup;

  actionIcons = [eyeIcon, editIcon, trashIcon];
    paginationIcons = {
    left: chevronLeftIcon,
    right: chevronRightIcon,
  };


  constructor(private fb: FormBuilder, private router: Router) {

    this.formGroup = new FormGroup({
      nombres: new FormControl('', [makeRequired]),
      apellidos: new FormControl('', [makeRequired]),
      tipoContacto: new FormControl('', [makeRequired]),
      telefono: new FormControl('', [makeRequired]),
      direccion: new FormControl('', [makeRequired]),
    });
  }

  navigateToAddNew(){
    this.router.navigate(['/administrador/crearcliente'])
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

