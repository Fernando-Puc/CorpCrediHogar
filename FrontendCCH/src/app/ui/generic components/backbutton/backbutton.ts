import { Component, inject, input } from '@angular/core';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-back-button',
  standalone: true,
  imports: [MatButtonModule, MatIconModule],
  templateUrl: './backbutton.html',
  styleUrl: './backbutton.scss',
})
export class BackButtonComponent {
  private location = inject(Location);
  private router = inject(Router);

  label = input('Regresar');
  fallback = input('/');

  back() {
    if (window.history.length > 1) {
      this.location.back();
    } else {
      this.router.navigateByUrl(this.fallback());
    }
  }
}
