import { CommonModule } from '@angular/common';
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActionButtonComponent } from '../../../../generic components/actionButton/actionButton.component';
import { SafeHtmlPipe } from '../../../../../core/shared/shared/pipes/safeHtml.pipe';
import { Marca } from '../../../../../core/models/catalogs';
import { chevronLeftIcon, chevronRightIcon, editIcon, trashIcon } from '../../../../../core/shared/shared/constants/icons.constants';
import { CatalogsService } from '../../../../../core/services/catalogs.service';
import { MatDialog } from '@angular/material/dialog';
import { Createbrand } from '../createbrand/createbrand';

@Component({
  selector: 'app-brandlist',
  standalone: true,
  imports: [FormsModule, CommonModule, ActionButtonComponent, SafeHtmlPipe],
  templateUrl: './brandlist.html',
  styleUrl: './brandlist.scss',
})
export class Brandlist implements OnInit {
  brands: Marca[] = [];
  filteredBrands: Marca[] = [];
  pageIndex: number = 0;
  pageSize: number = 15;
  brandCount: number = 0;
  numberOfPages: number = 0;
  searchTerm: string = '';
  isresult: boolean = true;
  isloading: boolean = true;
  paginationIcons = {left: chevronLeftIcon, right: chevronRightIcon};
  actionIcons= [editIcon, trashIcon];

  constructor (private service: CatalogsService, private ChangeDetectorRef: ChangeDetectorRef, private dialog: MatDialog){}

  ngOnInit(): void {
    this.getAllBrands();
  }

  getAllBrands():void {
    this.isloading = true;
    this.service.getProductBrands().subscribe({
      next: response => {
        const brandData: Marca[] = Array.isArray(response.data) ? response.data: [];
        this.brands = [...brandData].sort(
          (brandA: Marca, brandB: Marca) => {
            const idA = String(brandA.IDMarca ?? '');
            const idB = String(brandB.IDMarca ?? '');
            return idA.localeCompare(idB, undefined,
              {numeric: true, sensitivity: 'base'}
            );
          });

          this.filteredBrands = [...this.brands];
          this.pageIndex= 0;
          this.isresult = this.brands.length > 0;
          this.isloading = false;
          this.updatePagination();
          this.ChangeDetectorRef.markForCheck();
        },

        error: error => {
          this.brands = [];
          this.filteredBrands = [];
          this.pageIndex = 0;
          this.brandCount = 0;
          this.numberOfPages = 0;
          this.isresult = false;
          this.isloading = false;
          this.ChangeDetectorRef.markForCheck();
        }
    });
  }




  updatePagination():void{
    this.brandCount = this.filteredBrands.length;
    this.numberOfPages = this.brandCount > 0 ?
      Math.ceil(this.brandCount / this.pageSize): 0;
    if (this.numberOfPages > 0 && this.pageIndex >= this.numberOfPages){
      this.pageIndex = this.numberOfPages -1;
    }
    if (this.numberOfPages === 0){
      this.pageIndex = 0;
    }
  }


  filterBrands(term: string): void {
    const normalizedTerm = term.trim().toLowerCase();
    if(!normalizedTerm){
      this.filteredBrands = [...this.brands];
      this.pageIndex = 0;
      this.updatePagination();
      return;
    }

    this.filteredBrands = this.brands.filter(brand => {
      const brandValues = [
        brand.IDMarca,
        brand.Nombre
      ];
      return brandValues.some(value => {
        return String(value ?? '').toLowerCase().includes(normalizedTerm);
      });
    });
    this.pageIndex = 0;
    this.updatePagination();
  }

  onSearch(): void{
    if(!this.searchTerm.trim()){
      this.filteredBrands = [
        ...this.brands
      ];
      this.pageIndex = 0;
      this.updatePagination();
    }
  }

  onInputChange(): void{
    if(!this.searchTerm.trim()){
      this.filteredBrands = [
        ...this.brands
      ];
      this.pageIndex = 0;
      this.updatePagination();
    }
  }

  getPagedData(): Marca[]{
    const start = this.pageIndex * this.pageSize;
    const end = start + this.pageSize;
    let brandsPage = this.filteredBrands.slice(start, end);
    if (brandsPage.length < this.pageSize){
      const emptybrandCount = this.pageSize - brandsPage.length;
      const emptybrands = Array.from({length: emptybrandCount}, () => ({} as Marca));
      brandsPage = brandsPage.concat(emptybrands);
    }
    return brandsPage;
  }


  nextPage(): void{
    if (this.pageIndex < this.numberOfPages -1){
      this.pageIndex++;
    }
  }


  previousPage():void{
    if (this.pageIndex>0){
      this.pageIndex--;
    }
  }

  navigateToAddNew(): void{
    const dialogRef = this.dialog.open(Createbrand, {
      width: '600px',
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe(result =>{
      if(result){
        this.getAllBrands();
      }
    });
  }

  editBrand(): void{

  }

  deleteBrand(): void{

  }
}
