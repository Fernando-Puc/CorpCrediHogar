import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { TextInputComponent } from '../../../../generic components/input/input.component.';
import { ActionButtonComponent } from '../../../../generic components/actionButton/actionButton.component';
import { SafeHtmlPipe } from '../../../../../core/shared/shared/pipes/safeHtml.pipe';
import { editIcon, trashIcon } from '../../../../../core/shared/shared/constants/icons.constants';
import { getProvidersDto, getWarehousesDto } from '../../../../../core/models/catalogs';
import { getproductsDto } from '../../../../../core/models/products';
import { createPurchaseDto, PurchaseMovementView } from '../../../../../core/models/purchases';
import { ResponseGet } from '../../../../../core/models/responses';
import { makeRequired } from '../../../../../core/validators/makeRequired.validator';
import { CatalogsService } from '../../../../../core/services/catalogs.service';
import { ProductsService } from '../../../../../core/services/products.service';
import { PurchasesService } from '../../../../../core/services/purchases.service';
import { round2 } from '../../../../../core/utils/purchase-calc';
import { ConfirmUnsavedComponent } from '../../../../dialog/confirm-unsaved/confirm-unsaved.component';
import { UNSAVED_DIALOG } from '../../../../../core/models/dialog';
import { Addpurchasemovement, PurchaseMovementDialogData } from './addpurchasemovement/addpurchasemovement';
import { from } from 'rxjs';

@Component({
  selector: 'app-createpurchases',
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgSelectModule,
    TextInputComponent,
    ActionButtonComponent,
    SafeHtmlPipe,
  ],
  templateUrl: './createpurchases.html',
  styleUrl: './createpurchases.scss',
})
export class Createpurchases implements OnInit {
  formgroup: FormGroup;
  providers: getProvidersDto[] = [];
  products: getproductsDto[] = [];
  warehouses: getWarehousesDto[] = [];
  movimientos: PurchaseMovementView[] = [];

  subtotal = 0;
  descuentos = 0;
  impuestos = 0;
  total = 0;
  totalProductos = 0;

  errorMessage: string = '';
  isSaving: boolean = false;
  actionIcons = [editIcon, trashIcon];

  constructor(
    private router: Router,
    private catalogs: CatalogsService,
    private productss: ProductsService,
    private purchasesservice: PurchasesService,
    private dialog: MatDialog,
    private ChangeDetectorRef: ChangeDetectorRef,
  ) {
    this.formgroup = new FormGroup({
      serie: new FormControl('', [makeRequired]),
      folio: new FormControl('', [makeRequired]),
      proveedor: new FormControl('', [makeRequired]),
      concepto: new FormControl('Compra', [makeRequired]),
    });
  }

  ngOnInit(): void {
    this.catalogs.getProviders().subscribe((response: ResponseGet<getProvidersDto[]>) => {
      this.providers = response.data;
      this.ChangeDetectorRef.markForCheck();
    });

    this.catalogs.getWarehouses().subscribe((response: ResponseGet<getWarehousesDto[]>) => {
      this.warehouses = response.data;
      this.ChangeDetectorRef.markForCheck();
    });

    this.productss.getProducts().subscribe((response: ResponseGet<getproductsDto[]>) => {
      this.products = response.data;
      this.ChangeDetectorRef.markForCheck();
    });
  }


  openMovementDialog(index?: number): void {
    const data: PurchaseMovementDialogData = {
      products: this.products,
      warehouses: this.warehouses,
      movement: index !== undefined ? this.movimientos[index] : undefined,
    };

    const dialogRef = this.dialog.open(Addpurchasemovement, {
      width: '1200px',
      data,
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe((result?: PurchaseMovementView) => {
      if (!result) return;

      if (index !== undefined) {
        this.movimientos = this.movimientos.map((m, i) => (i === index ? result : m));
      } else {
        this.movimientos = [...this.movimientos, result];
      }
      this.calcularTotales();
      this.ChangeDetectorRef.markForCheck();
    });
  }

  eliminarMovimiento(index: number): void {
    this.movimientos = this.movimientos.filter((_, i) => i !== index);
    this.calcularTotales();
    this.ChangeDetectorRef.markForCheck();
  }


  calcularTotales(): void {
    this.totalProductos = this.movimientos.reduce((s, m) => s + m.Cantidad, 0);
    this.subtotal = round2(this.movimientos.reduce((s, m) => s + m.Neto, 0));
    this.descuentos = round2(this.movimientos.reduce((s, m) => s + m.Descuento, 0));
    this.impuestos = round2(this.movimientos.reduce((s, m) => s + m.IVA, 0));
    this.total = round2(this.subtotal - this.descuentos + this.impuestos);
  }

  onSubmit(): void {
    this.errorMessage = '';

    if (this.formgroup.invalid) {
      this.formgroup.markAllAsTouched();
      return;
    }

    if (this.movimientos.length === 0) {
      this.errorMessage = 'Debes agregar al menos un producto a la compra';
      return;
    }

    const createPurchase: createPurchaseDto = {
      Serie: this.formgroup.value.serie,
      Folio: this.formgroup.value.folio,
      IDProveedor: Number(this.formgroup.value.proveedor),
      Concepto: this.formgroup.value.concepto,
      movimientos: this.movimientos.map(m => ({
        IDProducto: m.IDProducto,
        IDAlmacen: m.IDAlmacen,
        Cantidad: m.Cantidad,
        Precio: m.Precio,
        DescuentoPorcentaje: m.DescuentoPorcentaje,
        TasaIVA: m.TasaIVA,
      })),
    };

    this.isSaving = true;
    this.purchasesservice.createPurchase(createPurchase).subscribe({
      next: () => {
        this.router.navigate(['administrador/almacen/compras']);
      },
      error: (error: HttpErrorResponse) => {
        this.isSaving = false;
        this.errorMessage = error.error?.message ?? 'No se pudo registrar la compra';
      },
    });
  }

  closeDialog(): void {
    this.dialog.closeAll();
    this.router.navigate(['administrador/almacen/compras']);

  }

  openDialog(): void {
    const dialogref = this.dialog.open(ConfirmUnsavedComponent, {
      width: '30%',
      data: UNSAVED_DIALOG,
      disableClose: true,
    });

    dialogref.afterClosed().subscribe(resp => {
      if (resp) {
        this.closeDialog();
      }
    });
  }

  searchProvider = (term: string, item: getProvidersDto): boolean => {
  return `${item.Codigo} ${item.Nombre} ${item.RFC}`
    .toLowerCase()
    .includes(term.trim().toLowerCase());
  };
}
