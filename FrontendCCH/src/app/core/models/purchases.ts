export interface getPurchasesDto {
  IDCompra: number;
  Serie: string;
  Folio: string;
  IDProveedor: number;
  FechaRegistro: string;
  Concepto: string;
  TotalProductos: number;
  Subtotal: number;
  Descuentos: number;
  Impuestos: number;
  Total: number;
  Estado: string;
  proveedor?: { Codigo: string; Nombre: string };
}

export interface PurchaseMovementDto {
  IDProducto: number;
  IDAlmacen: number;
  Cantidad: number;
  Precio: number;
  DescuentoPorcentaje: number;
  TasaIVA: number;
}

export interface PurchaseMovementView extends PurchaseMovementDto {
  CodigoProducto: string;
  NombreProducto: string;
  UnidadMedidaProducto: string;
  NombreAlmacen: string;
  Neto: number;
  Descuento: number;
  IVA: number;
  Total: number;
}

export interface createPurchaseDto {
  Serie: string;
  Folio: string;
  IDProveedor: number;
  Concepto: string;
  movimientos: PurchaseMovementDto[];
}
