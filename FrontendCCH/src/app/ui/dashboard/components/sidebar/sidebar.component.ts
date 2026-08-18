import { Component, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { SidebarService } from '../../../../core/services/sidebar.service';
import { SIDEBAR_OPTIONS } from '../../../../core/shared/shared/constants/sidebarOptions.constants';
import { SidebarOptionComponent } from './sidebar-option/sidebar-option.component';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [
    MatIconModule,
    SidebarOptionComponent
  ],
  template: `
    <aside
      class="sidebar"
      [class.sidebar--collapsed]="isCollapsed"
    >

      <div class="sidebar__top">
        <div class="sidebar__logo-container">
          <img
            class="logo"
            src="assets/image/logocredi.png"
          />
        </div>

        <div class="sidebar__options">

          @for (option of options; track option.route) {

            <sidebar-option
              [optionName]="isCollapsed ? '' : option.optionName"
              [route]="option.route"
              [icon]="option.icon"
              [exactRoute]="option.route === '/administrador'"
            />

          }

        </div>

      </div>


      <div class="sidebar__bottom">

        <button
          type="button"
          class="collapse-button"
          (click)="toggleSidebar()"
        >
          <mat-icon>
            {{ isCollapsed ? 'chevron_right' : 'chevron_left' }}
          </mat-icon>
        </button>

        <div class="sidebar__divider"></div>


        <div class="user-info">

          <mat-icon class="user-icon">
            account_circle
          </mat-icon>
          @if (!isCollapsed) {
            <div class="user-info__text">
              <p class="store">
                TIENDA MATRIZ
              </p>
              <p class="user">
                JUAN PABLO COLLI
              </p>
            </div>
          }

        </div>
      </div>
    </aside>
  `,
  styleUrl: './sidebar.component.scss'
})
export class SidebarComponent implements OnInit {

  isCollapsed: boolean = false;
  options = SIDEBAR_OPTIONS;

  constructor(
    private sidebarService: SidebarService,
    private router: Router
  ) {}


  ngOnInit(): void {
    this.sidebarService.sidebarState.subscribe(state => {
      this.isCollapsed = state;
    });
  }


  toggleSidebar(): void {
    this.sidebarService.toggleSidebar();
  }


  onLogout(): void {
    this.router.navigate(['/login']);
  }

}
