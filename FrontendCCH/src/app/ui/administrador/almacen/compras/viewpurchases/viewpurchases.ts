import { getPurchaseDto } from './../../../../../core/models/purchases';
import { CommonModule } from '@angular/common';
import { Component, OnInit, ChangeDetectorRef, Inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { PurchasesService } from '../../../../../core/services/purchases.service';

@Component({
  selector: 'app-viewpurchases',
  imports: [MatIconModule, MatDialogModule, MatButtonModule, CommonModule],
  templateUrl: './viewpurchases.html',
  styleUrl: './viewpurchases.scss',
})

export class Viewpurchases implements OnInit{
  public purchase?: getPurchaseDto;

  constructor(@Inject(MAT_DIALOG_DATA) public IDPurchase: number, private purchases: PurchasesService, private ChangeDetectorRef: ChangeDetectorRef){}

  ngOnInit(){
    this.purchases.getPurchase(this.IDPurchase).subscribe(obj=>{
      this.purchase = obj.data;
      this.ChangeDetectorRef.markForCheck();
    })
  }

  isCancelled(estado?: string | null): boolean {
    return String(estado ?? '').toLowerCase() === 'cancelada';
  }
}
