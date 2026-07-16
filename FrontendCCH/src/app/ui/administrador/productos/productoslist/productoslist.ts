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
  selector: 'app-productoslist',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, TextInputComponent, ActionButtonComponent, SafeHtmlPipe],
  templateUrl: './productoslist.html',
  styleUrl: './productoslist.scss',
})
export class Productoslist {
  productoslist:any[]=[];
  formGroup: FormGroup;

   actionIcons = [eyeIcon, editIcon, trashIcon];
    paginationIcons = {
    left: chevronLeftIcon,
    right: chevronRightIcon,
  };

   constructor(private fb: FormBuilder, private router: Router) {

    this.formGroup = new FormGroup({
      codigo: new FormControl('', [makeRequired]),
      nombre: new FormControl('', [makeRequired]),
      linea: new FormControl('', [makeRequired]),
      marca: new FormControl('', [makeRequired]),
      unidad_de_medida: new FormControl('', [makeRequired]),
      clave_SAT: new FormControl('', [makeRequired]),
    });
  }
   navigateToAddNew(){
    this.router.navigate(['/administrador/createproducts']);
  }
  guardar() {
    if (this.formGroup.invalid) {
      this.formGroup.markAllAsTouched();
      return;
    }

    this.productoslist.push(this.formGroup.value);

    this.formGroup.reset();
  }
}
