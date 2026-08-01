import { CommonModule } from '@angular/common';
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormsModule } from "@angular/forms";
import { ActionButtonComponent } from '../../../../generic components/actionButton/actionButton.component';
import { SafeHtmlPipe } from '../../../../../core/shared/shared/pipes/safeHtml.pipe';
import { Empresas} from '../../../../../core/models/catalogs';
import { chevronLeftIcon, editIcon, trashIcon } from '../../../../../core/shared/shared/constants/icons.constants';
import { CatalogsService } from '../../../../../core/services/catalogs.service';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ConfirmDeleteComponent } from '../../../../dialog/confirm-delete/confirm-delete.component';
import { DELETE_DIALOG_COMPANIE } from '../../../../../core/models/dialog';

@Component({
  selector: 'app-companieslist',
  standalone: true,
  imports: [FormsModule, CommonModule, ActionButtonComponent, SafeHtmlPipe],
  templateUrl: './companieslist.html',
  styleUrl: './companieslist.scss',
})
export class Companieslist implements OnInit{
  companies: Empresas[] = [];
  filteredCompanies: Empresas[] =[];
  pageIndex: number = 0;
  pageSize: number = 15;
  companieCount: number = 0;
  numberOfPages: number = 0;
  searchTerm: string = '';
  isresult: boolean = true;
  isloading: boolean = true;
  paginationIcons = {left: chevronLeftIcon, right: chevronLeftIcon };
  actionIcons = [editIcon, trashIcon];


  constructor (private router: Router, private service: CatalogsService, private changeDetectorRef: ChangeDetectorRef, private dialog: MatDialog
  ){}

  ngOnInit(): void {
    this.getAllCompanies();
  }

  getAllCompanies(): void {
    this.isloading = true;
    this.service.getCompanies().subscribe({
      next: response => {
        const companiesData: Empresas[] = Array.isArray(response.data) ? response.data: [];
        this.companies = [...companiesData].sort(
          (companieA: Empresas, companieB: Empresas) => {
            const codigoA = String(companieA.Folio ?? '');
            const codigoB = String(companieB.Folio ?? '');
            return codigoA.localeCompare(codigoB, undefined,
              {numeric: true, sensitivity: 'base'}
            );
          });

          this.filteredCompanies = [...this.companies];
          this.pageIndex = 0;
          this.isresult = this.companies.length > 0;
          this.isloading = false;
          this.updatePagination();
          this.changeDetectorRef.markForCheck();
      },

      error: error => {
        this.companies = [];
        this.filteredCompanies = [];
        this.pageIndex = 0;
        this.companieCount = 0;
        this.numberOfPages = 0;
        this.isresult = false;
        this.isloading = false;
        this.changeDetectorRef.markForCheck();
      }
    });
  }

  updatePagination(): void {
    this.companieCount = this.filteredCompanies.length;
    this.numberOfPages = this.companieCount > 0 ?
      Math.ceil(this.companieCount / this.pageSize): 0;
    if (this.numberOfPages > 0 && this.pageIndex >= this.numberOfPages){
      this.pageIndex = this.numberOfPages - 1;
    }
    if (this.numberOfPages === 0){
      this.pageIndex = 0;
    }
  }


  filterCompanies(term: string): void{
    const normalizedTerm = term.trim().toLowerCase();
    if (!normalizedTerm){
      this.filteredCompanies = [...this.companies];
      this.pageIndex = 0;
      this.updatePagination();
      return;
    }

    this.filteredCompanies = this.companies.filter(companie => {
      const companieValues = [
        companie.Folio,
        companie.Nombre
      ];
      return companieValues.some(value => {
        return String(value ?? ''). toLowerCase().includes(normalizedTerm);
      });
    });

    this.pageIndex = 0;
    this.updatePagination();
  }

  onSearch():void{
    if (!this.searchTerm.trim()){
      this.filteredCompanies = [
        ...this.companies
      ];
      this.pageIndex = 0;
      this.updatePagination();
    }
  }

  onInputChange(): void{
    if (!this.searchTerm.trim()){
      this.filteredCompanies = [
        ...this.companies
      ];
      this.pageIndex = 0;
      this.updatePagination();
    }
  }


  getPagedData(): Empresas[]{
    const start = this.pageIndex * this.pageSize;
    const end = start + this.pageSize;
    let companiesPage = this.filteredCompanies.slice(start, end);
    if (companiesPage.length < this.pageSize){
      const emptyCompaniesCount = this.pageSize - companiesPage.length;
      const emptyCompanies = Array.from({length: emptyCompaniesCount}, () => ({} as Empresas));
      companiesPage = companiesPage.concat(emptyCompanies);
    }
    return companiesPage;
  }

  nextPage(): void{
    if (this.pageIndex < this.numberOfPages -1){
      this.pageIndex++;
    }
  }

  previousPage(): void{
    if (this.pageIndex > 0){
      this.pageIndex--;
    }
  }

  navigateToAddNew(): void{
    this.router.navigate(['/administrador/catalogs/crearempresa']);
  }

  editCompanie(IDEmpresa:number): void {
    this.router.navigate(['/administrador/catalogs/editarempresa', IDEmpresa]);
  }

  deleteCompanie(IDEmpresa: number): void{
    const dialogRef = this.dialog.open(ConfirmDeleteComponent, {
      width:'30',
      data: DELETE_DIALOG_COMPANIE,
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result=>{
      if(result){
        this.service.deleteCompanie(IDEmpresa).subscribe({
          next:() =>{
            this.getAllCompanies();
          },
          error:() => {}
        });
      }
    }
    )
  }





}
