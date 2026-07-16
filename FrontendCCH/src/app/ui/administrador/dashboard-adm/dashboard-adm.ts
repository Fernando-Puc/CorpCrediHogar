import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-dashboard-adm',
  standalone: true,
  imports: [
    MatIconModule,
    RouterLink   // <-- Agrega esto
  ],
  templateUrl: './dashboard-adm.html',
  styleUrl: './dashboard-adm.scss',
})
export class DashboardAdm {}
