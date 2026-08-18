import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-catalogosmenu',
  standalone: true,
  imports: [MatIconModule, RouterLink],
  templateUrl: './catalogosmenu.html',
  styleUrl: './catalogosmenu.scss',
})
export class Catalogosmenu {}
