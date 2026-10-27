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


export interface createPurchaseItemDto {
  IDProducto: number;
  IDAlmacen: number;
  Cantidad: number;
  Precio: number;
  DescuentoPorcentaje: number;
}

export interface createPurchaseDto {
  Serie: string;
  Folio: string;
  IDProveedor: number;
  FechaRegistro: string;
  Concepto: string;
  movimientos: createPurchaseItemDto[];
}
