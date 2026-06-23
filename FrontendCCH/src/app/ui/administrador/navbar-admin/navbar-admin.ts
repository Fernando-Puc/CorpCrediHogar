import { Component } from '@angular/core';
import { RouterLink, RouterOutlet } from "@angular/router";
import { NgModule } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';


@Component({
  selector: 'app-navbar-admin',
  imports: [RouterLink, MatIconModule, RouterOutlet],
  templateUrl: './navbar-admin.html',
  styleUrl: './navbar-admin.scss',
})
export class NavbarAdmin {

}
