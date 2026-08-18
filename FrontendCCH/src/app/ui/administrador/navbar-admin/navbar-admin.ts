import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { SidebarComponent } from '../../dashboard/components/sidebar/sidebar.component';
import { SidebarService } from '../../../core/services/sidebar.service';

@Component({
  selector: 'app-navbar-admin',
  standalone: true,
  imports: [
    RouterOutlet,
    SidebarComponent
  ],
  templateUrl: './navbar-admin.html',
  styleUrl: './navbar-admin.scss'
})
export class NavbarAdmin implements OnInit {

  isCollapsed: boolean = false;

  constructor(
    private sidebarService: SidebarService
  ) {}


  ngOnInit(): void {

    this.sidebarService.sidebarState.subscribe(state => {
      this.isCollapsed = state;
    });

  }

}
