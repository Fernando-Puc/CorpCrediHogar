import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActionButtonComponent } from '../../../../generic components/actionButton/actionButton.component';
import { SafeHtmlPipe } from '../../../../../core/shared/shared/pipes/safeHtml.pipe';
import { getWarehouseDto, getWarehousesDto } from '../../../../../core/models/catalogs';
import { chevronLeftIcon, chevronRightIcon, editIcon, eyeIcon, trashIcon } from '../../../../../core/shared/shared/constants/icons.constants';
import { CatalogsService } from '../../../../../core/services/catalogs.service';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';

@Component({
  selector: 'app-warehouseslist',
  standalone: true,
  imports: [CommonModule, FormsModule, ActionButtonComponent, SafeHtmlPipe],
  templateUrl: './warehouseslist.html',
  styleUrl: './warehouseslist.scss',
})
export class Warehouseslist implements OnInit{
  warehouses: getWarehousesDto[] = [];
  filteredWarehouses: getWarehousesDto[] = [];
  pageIndex: number = 0;
  pageSize: number = 15;
  warehouseCount: number = 0;
  numberOfPages: number = 0;
  searchTerm: string = '';
  isresult: boolean = true;
  isloading: boolean = true;
  paginationIcons = {left: chevronLeftIcon, right: chevronRightIcon};
  actionIcons = [eyeIcon, editIcon, trashIcon];

  constructor(private router: Router, private service: CatalogsService, private changeDetectorRef: ChangeDetectorRef, private dialog: MatDialog){}

  ngOnInit(): void {
    this.getAllWarehouses();
  }

  getAllWarehouses(): void{
    this.isloading = true;
    this.service.getWarehouses().subscribe({
      next: response => {
        const warehousesData: getWarehouseDto[] = Array.isArray(response.data) ? response.data: [];
        this.warehouses = [...warehousesData].sort(
          (warehouseA: getWarehouseDto, warehouseB: getWarehouseDto) => {
            const codigoA = String(warehouseA.Codigo ?? '');
            const codigoB = String(warehouseB.Codigo ?? '');
            return codigoA.localeCompare(codigoB, undefined, {numeric: true, sensitivity: 'base'}
          );
          });

          this.filteredWarehouses = [...this.warehouses];
          this.pageIndex = 0;
          this.isresult = this.warehouses.length > 0;
          this.isloading = false;
          this.updatePagination();
          this.changeDetectorRef.markForCheck();
      },

      error: error => {
        this.warehouses = [];
        this.filteredWarehouses = [];
        this.pageIndex = 0;
        this.warehouseCount = 0;
        this.numberOfPages = 0;
        this.isresult = false;
        this.isloading = false;
        this.changeDetectorRef.markForCheck();
      }
    });
  }

  updatePagination():void {
    this.warehouseCount = this.filteredWarehouses.length;
    this.numberOfPages = this.warehouseCount > 0 ?
      Math.ceil(this.warehouseCount / this.pageSize): 0;
    if(this.numberOfPages ===0){
      this.pageIndex = 0;
    }
  }

  filterWarehouses(term: string): void{
    const normalizedTerm = term.trim().toLowerCase();
    if(!normalizedTerm){
      this.filteredWarehouses = [...this.warehouses];
      this.pageIndex = 0;
      this.updatePagination();
      return;
    }

    this.filteredWarehouses = this.warehouses.filter(warehouse => {
      const warehouseValues = [
        warehouse.Codigo,
        warehouse.Nombre,
        warehouse.FechaRegistro,
        warehouse.sucursal.Nombre
      ];
      return warehouseValues.some(value => {
        return String(value ?? '').toLowerCase().includes(normalizedTerm);
      });
    });

    this.pageIndex = 0;
    this.updatePagination();
  }

  onSearch(): void{
    this.filterWarehouses(this.searchTerm);
  }

  onInputChange(): void{
    if(!this.searchTerm.trim()){
      this.filteredWarehouses= [
        ...this.warehouses
      ];
      this.pageIndex = 0;
      this.updatePagination();
    }
  }

  getPagedData(): getWarehousesDto[]{
    const start = this.pageIndex * this.pageSize;
    const end = start + this.pageSize;
    let warehousesPage = this.filteredWarehouses.slice(start, end);
    if(warehousesPage.length < this.pageSize){
      const emptyWarehousesCount = this.pageSize - warehousesPage.length;
      const emptyWarehouses = Array.from({length: emptyWarehousesCount}, () => ({} as getWarehousesDto));
      warehousesPage = warehousesPage.concat(emptyWarehouses);
    }
    return warehousesPage;
  }

  nextPage(): void{
    if(this.pageIndex < this.numberOfPages - 1){
      this.pageIndex++;
    }
  }

    previousPage():void{
    if (this.pageIndex > 0){
      this.pageIndex--;
    }
  }

  navigateToAddNew(): void{
    this.router.navigate(['administrador/catalogs/crearalmacen']);
  }

  viewWarehouse(IDWarehouse: number): void{
  }

  editWarehouse(IDWarehouse: number): void{

  }

  deleteWarehouse(IDWarehouse: number): void{

  }

}
