import { CommonModule } from '@angular/common';
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActionButtonComponent } from '../../../../generic components/actionButton/actionButton.component';
import { SafeHtmlPipe } from '../../../../../core/shared/shared/pipes/safeHtml.pipe';
import { getProvidersDto } from '../../../../../core/models/catalogs';
import { chevronLeftIcon, chevronRightIcon, editIcon, eyeIcon, trashIcon } from '../../../../../core/shared/shared/constants/icons.constants';
import { CatalogsService } from '../../../../../core/services/catalogs.service';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';

@Component({
  selector: 'app-providerslist',
  imports: [FormsModule, CommonModule, ActionButtonComponent, SafeHtmlPipe],
  templateUrl: './providerslist.html',
  styleUrl: './providerslist.scss',
})
export class Providerslist implements OnInit {
  providers: getProvidersDto[] = [];
  filteredProviders: getProvidersDto[] = [];
  pageIndex: number = 0;
  pageSize: number = 15;
  providerCount: number = 0;
  numberOfPages: number = 0;
  searchTerm: string = '';
  isresult: boolean = true;
  isloading: boolean = true;
  paginationIcons = {left: chevronLeftIcon, right: chevronRightIcon};
  actionIcons= [eyeIcon, editIcon, trashIcon];

  constructor(private router: Router, private service: CatalogsService, private changeDetectorRef: ChangeDetectorRef, private dialog: MatDialog){}

  ngOnInit(): void {
    this.getAllProviders();
  }

  getAllProviders(): void{
    this.isloading = true;
    this.service.getProviders().subscribe({
      next: response => {
        const providersData: getProvidersDto[] = Array.isArray(response.data) ? response.data: [];
        this.providers = [...providersData].sort(
          (providerA: getProvidersDto, providerB: getProvidersDto) => {
            const codigoA = String(providerA.Codigo ?? '');
            const codigoB = String(providerB.Codigo ?? '');
            return codigoA.localeCompare(codigoB, undefined,
              {numeric: true, sensitivity: 'base'}
            );
          });

          this.filteredProviders = [...this.providers];
          this.pageIndex = 0;
          this.isresult = this.providers.length > 0;
          this.isloading = false;
          this.updatePagination();
          this.changeDetectorRef.markForCheck();
      },

      error: error => {
        this.providers= [];
        this.filteredProviders = [];
        this.pageIndex= 0;
        this.providerCount = 0;
        this.numberOfPages = 0;
        this.isresult = false;
        this.isloading = false;
        this.changeDetectorRef.markForCheck();
      }
    });
  }

  updatePagination(): void{
    this.providerCount = this.filteredProviders.length;
    this.numberOfPages = this.providerCount > 0 ?
      Math.ceil(this.providerCount / this.pageSize): 0;
    if(this.numberOfPages ===0){
      this.pageIndex = 0;
    }
  }

  filterProviders(term: string): void{
    const normalizedTerm = term.trim().toLowerCase();
    if(!normalizedTerm){
      this.filteredProviders = [...this.providers];
      this.pageIndex = 0;
      this.updatePagination();
      return;
    }

    this.filteredProviders = this.providers.filter(provider => {
      const providerValues = [
        provider.Codigo,
        provider.Nombre,
        provider.RFC,
        provider.FechaRegistro
      ];
      return providerValues.some(value => {
        return String(value ?? '').toLowerCase().includes(normalizedTerm);
      });
    });

    this.pageIndex = 0;
    this.updatePagination();
  }

  onSearch(): void {
    this.filterProviders(this.searchTerm);
  }

  onInputChange():void{
    if(!this.searchTerm.trim()){
      this.filteredProviders = [
        ...this.providers
      ];
      this.pageIndex = 0;
      this.updatePagination();
    }
  }

  getPagedData(): getProvidersDto[]{
    const start = this.pageIndex * this.pageSize;
    const end = start + this.pageSize;
    let providersPage = this.filteredProviders.slice(start, end);
    if(providersPage.length < this.pageSize){
      const emptyProvidersCount = this.pageSize - providersPage.length;
      const emptyProviders= Array.from({length: emptyProvidersCount}, () => ({} as getProvidersDto));
      providersPage = providersPage.concat(emptyProviders);
    }
    return providersPage;
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

  }

  viewProvider(): void{

  }


  editProvider(): void{

  }

  deleteProvider(): void{

  }
}
