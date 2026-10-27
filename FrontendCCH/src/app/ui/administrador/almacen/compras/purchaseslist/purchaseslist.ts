import { CommonModule } from '@angular/common';
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActionButtonComponent } from '../../../../generic components/actionButton/actionButton.component';
import { SafeHtmlPipe } from '../../../../../core/shared/shared/pipes/safeHtml.pipe';
import { getPurchasesDto } from '../../../../../core/models/purchases';
import { chevronLeftIcon, chevronRightIcon, eyeIcon, trashIcon, cancelIcon } from '../../../../../core/shared/shared/constants/icons.constants';
import { PurchasesService } from '../../../../../core/services/purchases.service';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ConfirmDeleteComponent } from '../../../../dialog/confirm-delete/confirm-delete.component';
import { CANCEL_DIALOG_COMPRA, DELETE_DIALOG_COMPRA } from '../../../../../core/models/dialog';
// import { Viewpurchase } from '../viewpurchase/viewpurchase';  // siguiente componente

@Component({
  selector: 'app-purchaseslist',
  imports: [FormsModule, CommonModule, ActionButtonComponent, SafeHtmlPipe],
  templateUrl: './purchaseslist.html',
  styleUrl: './purchaseslist.scss',
})
export class Purchaseslist implements OnInit {
  purchases: getPurchasesDto[] = [];
  filteredPurchases: getPurchasesDto[] = [];
  pageIndex: number = 0;
  pageSize: number = 15;
  purchaseCount: number = 0;
  numberOfPages: number = 0;
  searchTerm: string = '';
  isresult: boolean = true;
  isloading: boolean = true;
  errorMessage: string = '';
  paginationIcons = { left: chevronLeftIcon, right: chevronRightIcon };
  actionIcons = [eyeIcon, trashIcon, cancelIcon];

  constructor(
    private router: Router,
    private service: PurchasesService,
    private changeDetectorRef: ChangeDetectorRef,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.getAllPurchases();
  }

  getAllPurchases(): void {
    this.isloading = true;
    this.service.getPurchases().subscribe({
      next: response => {
        // el backend ya las manda ordenadas por fecha, de la más reciente a la más antigua
        this.purchases = Array.isArray(response.data) ? [...response.data] : [];
        this.filteredPurchases = [...this.purchases];
        this.pageIndex = 0;
        this.isresult = this.purchases.length > 0;
        this.isloading = false;
        this.updatePagination();
        this.changeDetectorRef.markForCheck();
      },
      error: () => {
        this.purchases = [];
        this.filteredPurchases = [];
        this.pageIndex = 0;
        this.purchaseCount = 0;
        this.numberOfPages = 0;
        this.isresult = false;
        this.isloading = false;
        this.changeDetectorRef.markForCheck();
      }
    });
  }

  updatePagination(): void {
    this.purchaseCount = this.filteredPurchases.length;
    this.numberOfPages = this.purchaseCount > 0 ? Math.ceil(this.purchaseCount / this.pageSize) : 0;
    if (this.numberOfPages === 0) {
      this.pageIndex = 0;
    }
  }

  filterPurchases(term: string): void {
    const normalizedTerm = term.trim().toLowerCase();
    if (!normalizedTerm) {
      this.filteredPurchases = [...this.purchases];
      this.pageIndex = 0;
      this.updatePagination();
      return;
    }

    this.filteredPurchases = this.purchases.filter(purchase => {
      const purchaseValues = [
        purchase.Serie,
        purchase.Folio,
        purchase.proveedor?.Nombre,
        purchase.Concepto,
        purchase.FechaRegistro,
        purchase.Estado,
        purchase.Total
      ];
      return purchaseValues.some(value => String(value ?? '').toLowerCase().includes(normalizedTerm));
    });

    this.pageIndex = 0;
    this.updatePagination();
  }

  onSearch(): void {
    this.filterPurchases(this.searchTerm);
  }

  onInputChange(): void {
    if (!this.searchTerm.trim()) {
      this.filteredPurchases = [...this.purchases];
      this.pageIndex = 0;
      this.updatePagination();
    }
  }

  getPagedData(): getPurchasesDto[] {
    const start = this.pageIndex * this.pageSize;
    const end = start + this.pageSize;
    let purchasesPage = this.filteredPurchases.slice(start, end);
    if (purchasesPage.length < this.pageSize) {
      const emptyCount = this.pageSize - purchasesPage.length;
      const emptyPurchases = Array.from({ length: emptyCount }, () => ({} as getPurchasesDto));
      purchasesPage = purchasesPage.concat(emptyPurchases);
    }
    return purchasesPage;
  }

  nextPage(): void {
    if (this.pageIndex < this.numberOfPages - 1) {
      this.pageIndex++;
    }
  }

  previousPage(): void {
    if (this.pageIndex > 0) {
      this.pageIndex--;
    }
  }

  isCancelled(purchase: getPurchasesDto): boolean {
    return String(purchase.Estado ?? '').toLowerCase() === 'cancelada';
  }

  navigateToAddNew(): void {
    this.router.navigate(['administrador/crearcompra']);
  }

  viewPurchase(IDCompra: number): void {
    // Se activa cuando exista el componente Viewpurchase
    // this.dialog.open(Viewpurchase, { width: '1000px', data: IDCompra });
  }

  cancelPurchase(IDCompra: number): void {
    const dialogRef = this.dialog.open(ConfirmDeleteComponent, {
      width: '30%',
      data: CANCEL_DIALOG_COMPRA,
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.errorMessage = '';
        this.service.cancelPurchase(IDCompra).subscribe({
          next: () => this.getAllPurchases(),
          // el backend explica el motivo (existencia insuficiente, compras posteriores...)
          error: err => {
            this.errorMessage = err?.error?.message ?? 'No se pudo cancelar la compra';
            this.changeDetectorRef.markForCheck();
          }
        });
      }
    });
  }

  deletePurchase(IDCompra: number): void {
    const dialogRef = this.dialog.open(ConfirmDeleteComponent, {
      width: '30%',
      data: DELETE_DIALOG_COMPRA,
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.errorMessage = '';
        this.service.deletePurchase(IDCompra).subscribe({
          next: () => this.getAllPurchases(),
          error: err => {
            this.errorMessage = err?.error?.message ?? 'No se pudo eliminar la compra';
            this.changeDetectorRef.markForCheck();
          }
        });
      }
    });
  }
}
