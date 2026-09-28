import { CommonModule } from '@angular/common';
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActionButtonComponent } from '../../../../generic components/actionButton/actionButton.component';
import { SafeHtmlPipe } from '../../../../../core/shared/shared/pipes/safeHtml.pipe';
import { getBranchesDto } from '../../../../../core/models/catalogs';
import { chevronLeftIcon, chevronRightIcon, editIcon, eyeIcon, trashIcon } from '../../../../../core/shared/shared/constants/icons.constants';
import { CatalogsService } from '../../../../../core/services/catalogs.service';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { _IdGenerator } from '@angular/cdk/a11y';

@Component({
  selector: 'app-brancheslist',
  imports: [FormsModule, CommonModule, ActionButtonComponent, SafeHtmlPipe],
  templateUrl: './brancheslist.html',
  styleUrl: './brancheslist.scss',
})
export class Brancheslist implements OnInit{
  branches: getBranchesDto[] = [];
  filteredBranches: getBranchesDto[] = [];
  pageIndex: number = 0;
  pageSize: number = 15;
  branchCount: number = 0;
  numberOfPages: number = 0;
  searchTerm: string = '';
  isresult: boolean = true;
  isloading: boolean = true;
  paginationIcons = {left: chevronLeftIcon, right: chevronRightIcon};
  actionIcons = [eyeIcon, editIcon, trashIcon];

  constructor(private router: Router, private service: CatalogsService, private ChangeDetectorRef: ChangeDetectorRef, private dialog: MatDialog){}

  ngOnInit(): void {
    this.getAllBranches();
  }

  getAllBranches(): void{
    this.isloading = true;
    this.service.getBranches().subscribe({
      next: response => {
        const branchesData: getBranchesDto[] = Array.isArray(response.data) ? response.data: [];
        this.branches = [...branchesData].sort(
          (branchA: getBranchesDto, branchB: getBranchesDto) => {
            const codigoA = String(branchA.Codigo ?? '');
            const codigoB = String(branchB.Codigo ?? '');
            return codigoA.localeCompare(codigoB, undefined,
              {numeric: true, sensitivity: 'base'}
            );
          });

          this.filteredBranches = [...this.branches];
          this.pageIndex = 0;
          this.isresult = this.branches.length > 0;
          this.isloading = false;
          this.updatePagination();
          this.ChangeDetectorRef.markForCheck();
      },
      error: error => {
        this.branches= [];
        this.filteredBranches = [];
        this.pageIndex = 0;
        this.branchCount = 0;
        this.numberOfPages = 0;
        this.isresult = false;
        this.isloading = false;
        this.ChangeDetectorRef.markForCheck();
      }
    });
  }

  updatePagination(): void {
    this.branchCount = this.filteredBranches.length;
    this.numberOfPages = this.branchCount > 0 ?
      Math.ceil(this.branchCount / this.pageSize): 0;
    if(this.numberOfPages === 0){
      this.pageIndex = 0;
    }
  }

  filterBranches(term: string): void{
    const normalizedTerm = term.trim().toLowerCase();
    if(!normalizedTerm){
      this.filteredBranches = [...this.branches];
      this.pageIndex = 0;
      this.updatePagination();
      return;
    }

    this.filteredBranches = this.branches.filter(branch => {
      const branchValues = [
        branch.Codigo,
        branch.Nombre,
      ];
      return branchValues.some(value => {
        return String(value ?? '').toLowerCase().includes(normalizedTerm);
      });
    });

    this.pageIndex = 0;
    this.updatePagination();
  }

  onSearch(): void{
    this.filterBranches(this.searchTerm);
  }

  onInputChange():void{
    if(!this.searchTerm.trim()){
      this.filteredBranches = [
        ...this.branches
      ];
      this.pageIndex = 0;
      this.updatePagination();
    }
  }

  getPagedData(): getBranchesDto[]{
    const start = this.pageIndex * this.pageSize;
    const end = start + this.pageSize;
    let branchesPage = this.filteredBranches.slice(start, end);
    if(branchesPage.length < this.pageSize){
      const emptyBranchesCount = this.pageSize - this.branches.length;
      const emptyBranches = Array.from({length: emptyBranchesCount}, () => ({} as getBranchesDto));
      branchesPage = branchesPage.concat(emptyBranches);
    }
    return branchesPage;
  }

  nextPage(): void{
    if(this.pageIndex < this.numberOfPages -1){
      this.pageIndex++;
    }
  }

  previousPage():void{
    if (this.pageIndex > 0){
      this.pageIndex--;
    }
  }

  navigateToAddNew(): void{
    this.router.navigate(['administrador/catalogs/crearsucursal']);
  }

  // viewBranch(IDSucursal: number): void{
  //   this.dialog.open(ViewBranch, {
  //     width: '1000px',
  //     height: '950',
  //     data: IDSucursal
  //   });
  // }

  editProvider(IDSucursal: number): void{
    this.router.navigate(['/admininstrador/editarsucursal', IDSucursal])
  }
}
