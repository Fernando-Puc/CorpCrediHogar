import { CommonModule } from '@angular/common';
import { Component, Inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { getWarehouseDto } from '../../../../../core/models/catalogs';
import { CatalogsService } from '../../../../../core/services/catalogs.service';

@Component({
  selector: 'app-viewwarehouse',
  imports: [MatIconModule, MatDialogModule, MatButtonModule, CommonModule],
  templateUrl: './viewwarehouse.html',
  styleUrl: './viewwarehouse.scss',
})
export class Viewwarehouse implements OnInit{
  public warehouse?: getWarehouseDto;

  constructor(@Inject(MAT_DIALOG_DATA) public IDWarehouse: number, private catalogs: CatalogsService, private ChangeDetectorRef: ChangeDetectorRef){}

  ngOnInit(): void {
    this.catalogs.getWarehouse(this.IDWarehouse).subscribe(obj=>{
      this.warehouse = obj.data;
      this.ChangeDetectorRef.markForCheck();
    });
  }
}
