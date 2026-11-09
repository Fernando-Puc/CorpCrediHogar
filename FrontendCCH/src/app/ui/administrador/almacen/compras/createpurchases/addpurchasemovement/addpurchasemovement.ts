import { UnidadMedida } from './../../../../../../core/models/catalogs';
import { CommonModule } from '@angular/common';
import { Component, Inject, ChangeDetectorRef } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { NgSelectModule } from '@ng-select/ng-select';
import { TextInputComponent } from '../../../../../generic components/input/input.component.';
import { ActionButtonComponent } from '../../../../../generic components/actionButton/actionButton.component';
import { makeRequired } from '../../../../../../core/validators/makeRequired.validator';
import { getWarehousesDto } from '../../../../../../core/models/catalogs';
import { getproductsDto } from '../../../../../../core/models/products';
import { PurchaseMovementView } from '../../../../../../core/models/purchases';
import { calculateMovement } from '../../../../../../core/utils/purchase-calc';

export interface PurchaseMovementDialogData {
  products: getproductsDto[];
  warehouses: getWarehousesDto[];
  movement?: PurchaseMovementView;
}

@Component({
  selector: 'app-addpurchasemovement',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, NgSelectModule, TextInputComponent, ActionButtonComponent],
  templateUrl: './addpurchasemovement.html',
  styleUrl: './addpurchasemovement.scss',
})
export class Addpurchasemovement {
  formGroup: FormGroup;
  products: getproductsDto[];
  warehouses: getWarehousesDto[];
  isEdit: boolean;
  errorMessage: string = '';

  ivaOptions = [
    { value: 0.16, label: '16 %' },
    { value: 0, label: '0 %' },
  ];

  constructor(
    private dialogRef: MatDialogRef<Addpurchasemovement, PurchaseMovementView>,
    @Inject(MAT_DIALOG_DATA) public data: PurchaseMovementDialogData,
  ) {
    this.products = data.products;
    this.warehouses = data.warehouses;
    this.isEdit = !!data.movement;

    const m = data.movement;
    this.formGroup = new FormGroup({
      producto: new FormControl(m?.IDProducto ?? '', [makeRequired]),
      almacen: new FormControl(m?.IDAlmacen ?? '', [makeRequired]),
      cantidad: new FormControl(m ? String(m.Cantidad) : '', [makeRequired]),
      precio: new FormControl(m ? String(m.Precio) : '', [makeRequired]),
      descuentoPorcentaje: new FormControl(m ? String(m.DescuentoPorcentaje) : '0'),
      tasaIVA: new FormControl(m?.TasaIVA ?? 0.16),
    });
  }


  searchProduct = (term: string, item: getproductsDto): boolean => {
    return `${item.codigo} ${item.nombre}`.toLowerCase().includes(term.trim().toLowerCase());
  };

  searchWarehouse = (term: string, item: getWarehousesDto): boolean => {
  return `${item.Codigo ?? ''} ${item.Nombre}`.toLowerCase().includes(term.trim().toLowerCase());
};

  get preview() {
    const v = this.formGroup.value;
    return calculateMovement(
      Number(v.cantidad) || 0,
      Number(v.precio) || 0,
      Number(v.descuentoPorcentaje) || 0,
      Number(v.tasaIVA ?? 0),
    );
  }

  onSave(): void {
    this.errorMessage = '';

    if (this.formGroup.invalid) {
      this.formGroup.markAllAsTouched();
      return;
    }

    const v = this.formGroup.value;
    const cantidad = Number(v.cantidad);
    const precio = Number(v.precio);
    const pct = Number(v.descuentoPorcentaje || 0);
    const tasa = Number(v.tasaIVA ?? 0.16);

    if (!Number.isFinite(cantidad) || cantidad <= 0) {
      this.errorMessage = 'La cantidad debe ser mayor a 0';
      return;
    }
    if (!Number.isFinite(precio) || precio < 0) {
      this.errorMessage = 'El precio no es válido';
      return;
    }
    if (!Number.isFinite(pct) || pct < 0 || pct > 100) {
      this.errorMessage = 'El descuento debe estar entre 0 y 100';
      return;
    }

    const producto = this.products.find(p => p.IDProducto === Number(v.producto));
    const almacen = this.warehouses.find(w => w.IDAlmacen === Number(v.almacen));
    const calc = calculateMovement(cantidad, precio, pct, tasa);

    this.dialogRef.close({
      IDProducto: Number(v.producto),
      IDAlmacen: Number(v.almacen),
      CodigoProducto: producto ? `${producto.codigo}` : '',
      NombreProducto: producto ? `${producto.nombre}` : '',
      UnidadMedidaProducto: producto ? `${producto.unidadMedida.nombre}`: '',
      NombreAlmacen: almacen?.Nombre ?? '',
      Cantidad: cantidad,
      Precio: precio,
      DescuentoPorcentaje: pct,
      TasaIVA: tasa,
      Neto: calc.neto,
      Descuento: calc.descuento,
      IVA: calc.iva,
      Total: calc.total,
    });
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
