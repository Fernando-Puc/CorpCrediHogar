import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { makeRequired } from '../../core/validators/makeRequired.validator';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule, ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {
  loginForm: FormGroup;

  constructor(private fb: FormBuilder, private router: Router)
  {
    this.loginForm = new FormGroup({
      usuario: new FormControl('', [makeRequired]),
      contraseña: new FormControl ('', [makeRequired]),
    });
  }

    onSubmit(): void {
      if (this.loginForm.valid) {
        this.router.navigate(['dashboard/inicio']);
      } else {
        this.loginForm.markAllAsTouched();
      }
    }

    get usuario(){
      return this.loginForm.get('usuario');
    }

    get contrasenia(){
      return this.loginForm.get('contraseña');
  }
}

