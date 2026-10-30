
import { Component, OnInit, OnDestroy } from '@angular/core';
import {
  Router,
  RouterOutlet,
  NavigationEnd
} from '@angular/router';
import { Subscription, filter } from 'rxjs';

import { SidebarComponent } from '../../dashboard/components/sidebar/sidebar.component';
import { SidebarService } from '../../../core/services/sidebar.service';
import { BackButtonComponent } from '../../generic components/backbutton/backbutton';

@Component({
  selector: 'app-navbar-admin',
  standalone: true,
  imports: [
    RouterOutlet,
    SidebarComponent,
    BackButtonComponent
  ],
  templateUrl: './navbar-admin.html',
  styleUrl: './navbar-admin.scss'
})
export class NavbarAdmin implements OnInit, OnDestroy {

  isCollapsed = false;
  isMobileMenuOpen = false;

  private subscriptions = new Subscription();

  constructor(
    private sidebarService: SidebarService,
    public router: Router
  ) {}

  ngOnInit(): void {
    this.subscriptions.add(
      this.sidebarService.sidebarState.subscribe(state => {
        this.isCollapsed = state;
      })
    );

    this.subscriptions.add(
      this.router.events
        .pipe(
          filter(
            (event): event is NavigationEnd =>
              event instanceof NavigationEnd
          )
        )
        .subscribe(() => {
          this.closeMobileMenu();
        })
    );
  }

  toggleMobileMenu(): void {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
  }

  closeMobileMenu(): void {
    this.isMobileMenuOpen = false;
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
