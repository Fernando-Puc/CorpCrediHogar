export interface ExistenciaDto {
  IDExistencia: number;
  IDProducto: number;
  IDAlmacen: number;
  Existencia: number;
  CostoPromedio: number;
  UltimoCosto: number;
  UltimaActualizacion: string;

  ExistenciaTotalEmpresa? : number;
  CostoPromedioEmpresa?: number;
  UltimoCostoEmpresa?: number;

  producto?: {
    Codigo: string;
    Nombre: string;
  };
  almacen?: {
    Codigo: string;
    Nombre: string;
    empresa?: {
      IDEmpresa: number;
      Nombre: string;
    };
  };
}

export interface ExistenciaView extends ExistenciaDto {
  CodigoAlmacen: string;
  NombreAlmacen: string;
}

export interface HistorialCostoDto {
  IDMovimiento: number;
  FechaRegistro: string;
  Serie: string;
  Folio: string;
  NombreProveedor: string;
  NombreAlmacen: string;
  Precio: number;
  DescuentoPorcentaje: number;
  Cantidad: number;
  Neto: number;
  Descuento: number;
  CostoUnitario: number;
}
