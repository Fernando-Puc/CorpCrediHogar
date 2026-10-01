import { CommonModule } from '@angular/common';
import { Component, OnInit, ChangeDetectorRef, Inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { getBranchDto } from '../../../../../core/models/catalogs';
import { CatalogsService } from '../../../../../core/services/catalogs.service';

@Component({
  selector: 'app-viewbranch',
  standalone: true,
  imports: [MatIconModule, MatDialogModule, MatButtonModule, CommonModule],
  templateUrl: './viewbranch.html',
  styleUrl: './viewbranch.scss',
})
export class ViewBranch implements OnInit {
  public branch?: getBranchDto;

  constructor(@Inject(MAT_DIALOG_DATA) public IDBranch: number, private catalogs: CatalogsService, private ChangeDetectorRef: ChangeDetectorRef){}

  ngOnInit(){
    this.catalogs.getBranch(this.IDBranch).subscribe(obj=>{
      this.branch = obj.data;
      this.ChangeDetectorRef.markForCheck();
    });
  }
}
