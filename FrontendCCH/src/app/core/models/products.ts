export interface CatalogoProductoDto {
  id: number;
  nombre: string;
}

export interface getproductsDto {
  IDProducto: number;
  codigo: string;
  nombre: string;
  claveSAT: string;
  fechaRegistro: string;
  activo: number;

  linea: CatalogoProductoDto;
  marca: CatalogoProductoDto;
  unidadMedida: CatalogoProductoDto;
}
