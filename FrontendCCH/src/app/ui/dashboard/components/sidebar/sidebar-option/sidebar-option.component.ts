import { Component, Input } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'sidebar-option',
  standalone: true,
  imports: [
    RouterLink,
    RouterLinkActive,
    MatIconModule
  ],
    template: `
    <a
      class="sidebar__menu-option"
      [routerLink]="route"
      routerLinkActive="sidebar__menu-option--active"
      [routerLinkActiveOptions]="{ exact: exactRoute }"
    >

      <mat-icon>
        {{ icon }}
      </mat-icon>

      @if (optionName) {
        <span>{{ optionName }}</span>
      }

    </a>
  `,
  styleUrl: './sidebar-option.component.scss'
  })
export class SidebarOptionComponent {

  @Input({ required: true })
  optionName: string = '';

  @Input({ required: true })
  route: string = '';

  @Input({ required: true })
  icon: string = '';

  @Input()
  exactRoute: boolean = false;
}
