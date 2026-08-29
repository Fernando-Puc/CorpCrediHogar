import { CommonModule } from '@angular/common';
import { Component, Inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { getProviderDto } from '../../../../../core/models/catalogs';
import { CatalogsService } from '../../../../../core/services/catalogs.service';

@Component({
  selector: 'app-viewprovider',
  standalone: true,
  imports: [MatIconModule, MatDialogModule, MatButtonModule, CommonModule],
  templateUrl: './viewprovider.html',
  styleUrl: './viewprovider.scss',
})
export class Viewprovider implements OnInit{
  public provider?: getProviderDto;

  constructor(@Inject(MAT_DIALOG_DATA) public IDProvider: number, private catalogs: CatalogsService, private ChangeDetectorRef: ChangeDetectorRef){}

  ngOnInit(){
    this.catalogs.getProvider(this.IDProvider).subscribe(obj=>{
      this.provider = obj.data;
      this.ChangeDetectorRef.markForCheck();
    });
  }
}
