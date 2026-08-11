import { Linea } from './../../../../../core/models/catalogs';
import { ChangeDetectorRef, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActionButtonComponent } from '../../../../generic components/actionButton/actionButton.component';
import { SafeHtmlPipe } from '../../../../../core/shared/shared/pipes/safeHtml.pipe';
import { chevronLeftIcon, chevronRightIcon, editIcon, trashIcon} from '../../../../../core/shared/shared/constants/icons.constants';
import { CatalogsService } from '../../../../../core/services/catalogs.service';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Createline } from '../createline/createline';

@Component({
  selector: 'app-lineaslist',
  standalone: true,
  imports: [FormsModule, CommonModule, ActionButtonComponent, SafeHtmlPipe],
  templateUrl: './lineaslist.html',
  styleUrl: './lineaslist.scss',
})
export class Lineaslist implements OnInit{
  lines: Linea[] = [];
  filteredLines: Linea[] = [];
  pageIndex: number = 0;
  pageSize: number= 15;
  lineCount: number = 0;
  numberOfPages: number = 0;
  searchTerm: string = '';
  isresult: boolean = true;
  isloading: boolean = true;
  paginationIcons= {left: chevronLeftIcon, right: chevronRightIcon};
  actionIcons = [editIcon, trashIcon];


  constructor (private router: Router, private service: CatalogsService, private changeDetectorRef: ChangeDetectorRef, private dialog: MatDialog){}

  ngOnInit(): void{
    this.getAllLines();
  }

  getAllLines(): void {
    this.isloading = true;
    this.service.getProductLines().subscribe({
      next: response => {
        const lineData: Linea[] = Array.isArray(response.data) ? response.data: [];
        this.lines = [...lineData].sort(
          (lineaA: Linea, lineaB: Linea) => {
            const idA = String(lineaA.IDLinea ?? '');
            const idB = String(lineaB.IDLinea ?? '');
            return idA.localeCompare(idB, undefined,
              {numeric: true, sensitivity: 'base'}
            );
          });

          this.filteredLines = [...this.lines];
          this.pageIndex = 0;
          this.isresult = this.lines.length > 0;
          this.isloading = false;
          this.updatePagination();
          this.changeDetectorRef.markForCheck();
      },

      error: error => {
        this.lines = [];
        this.filteredLines = [];
        this.pageIndex = 0;
        this.lineCount = 0;
        this.numberOfPages = 0;
        this.isresult = false;
        this.isloading = false;
        this.changeDetectorRef.markForCheck();
      }
    });
  }

  updatePagination(): void{
    this.lineCount = this.filteredLines.length;
    this.numberOfPages = this.lineCount > 0 ?
      Math.ceil(this.lineCount / this.pageSize): 0;
    if (this.numberOfPages > 0 && this.pageIndex >=this.numberOfPages){
      this.pageIndex = this.numberOfPages -1;
    }
    if (this.numberOfPages === 0){
      this.pageIndex = 0;
    }
  }

  filterLines(term: string): void{
    const  normalizedTerm = term.trim().toLowerCase();
    if(!normalizedTerm){
      this.filteredLines = [...this.lines];
      this.pageIndex = 0;
      this.updatePagination();
      return;
    }

    this.filteredLines = this.lines.filter(line =>{
      const lineValues= [
        line.IDLinea,
        line.Nombre,
      ];
      return lineValues.some(value =>{
        return String(value ?? '').toLowerCase().includes(normalizedTerm);
      });
    });
    this.pageIndex = 0;
    this.updatePagination();
  }

  onSearch():void{
    if(!this.searchTerm.trim()){
      this.filteredLines = [
        ...this.lines
      ];
      this.pageIndex = 0;
      this.updatePagination();
    }
  }

  onInputChange(): void{
    if(!this.searchTerm.trim()){
      this.filteredLines = [
        ...this.lines
      ];
      this.pageIndex = 0;
      this.updatePagination();
    }
  }

  getPagedData(): Linea[]{
    const start = this.pageIndex * this.pageSize;
    const end = start + this.pageSize;
    let linesPage = this.filteredLines.slice(start, end);
    if (linesPage.length < this.pageSize){
      const emptylinesCount = this.pageSize - linesPage.length;
      const emptylines = Array.from({length: emptylinesCount}, () => ({} as Linea));
      linesPage = linesPage.concat(emptylines);
    }
    return linesPage;
  }


  nextPage(): void {
    if (this.pageIndex < this.numberOfPages -1){
      this.pageIndex++;
    }
  }

  previousPage(): void{
    if (this.pageIndex>0){
      this.pageIndex--;
    }
  }


  navigateToAddNew(): void{
    const dialogRef = this.dialog.open(Createline, {
      width: '600px',
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe(result =>{
      if(result){
        this.getAllLines();
      }
    });
  }


  editLine(IDLine: number):void{
    this.router.navigate(['']);
  }

    deleteLine(IDLine: number):void{
    this.router.navigate(['']);
  }






}
