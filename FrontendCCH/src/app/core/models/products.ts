export interface CatalogoProductoDto {
  id: number;
  nombre: string;
}

export interface getproductsDto {
  IDProducto: number;
  codigo: string;
  nombre: string;
  claveSAT: string;
  fechaRegistro: number;
  activo: boolean;
  linea: CatalogoProductoDto;
  marca: CatalogoProductoDto;
  unidadMedida: CatalogoProductoDto;
}

export interface getproductDto {
  IDProducto: number;
  codigo: string;
  nombre: string;
  claveSAT: string;
  fechaRegistro: number;
  activo: boolean;
  linea: CatalogoProductoDto;
  marca: CatalogoProductoDto;
  unidadMedida: CatalogoProductoDto;
}

export interface createProductDto {
  Codigo: string;
  Nombre: string;
  IDLinea: number;
  IDMarca: number;
  IDUnidadMedida: number;
  ClaveSAT: string | null;
}

export interface editProductDto {
  IDProducto: number;
  Codigo: string;
  Nombre: string;
  IDLinea: number;
  IDMarca: number;
  IDUnidadMedida: number;
  ClaveSAT: string | null;
}


