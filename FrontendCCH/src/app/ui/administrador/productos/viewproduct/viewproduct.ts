import { ProductsService } from './../../../../core/services/products.service';
import { ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { getproductDto } from '../../../../core/models/products';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import {MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { ActionButtonComponent } from "../../../generic components/actionButton/actionButton.component";

@Component({
  selector: 'app-viewproduct',
  standalone: true,
  imports: [MatIconModule, MatDialogModule, MatButtonModule, CommonModule, ActionButtonComponent],
  templateUrl: './viewproduct.html',
  styleUrl: './viewproduct.scss',
})
export class Viewproduct implements OnInit{

  public producto?: getproductDto;

  constructor(@Inject(MAT_DIALOG_DATA) public IDProducto: number, private ProductsService: ProductsService, private ChangeDetectorRef: ChangeDetectorRef){}

  ngOnInit(){
    this.ProductsService.getProduct(this.IDProducto).subscribe(obj=>{
      this.producto = obj.data;

      this.ChangeDetectorRef.markForCheck();
    });
  }


}
