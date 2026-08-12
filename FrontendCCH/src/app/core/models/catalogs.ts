export interface TipoContacto{
  id: number,
  descripcion: string;
}

export interface Linea{
  IDLinea: number,
  Nombre: string;
}

export interface CreateLineDto{
  Nombre: string;
}

export interface GetLineDto{
  IDLinea: number,
  Nombre: string;
}

export interface editLineDto{
  IDLinea: number,
  Nombre: string;
}

export interface Marca{
  IDMarca: number,
  Nombre: string;
}
export interface UnidadMedida{
  IDUnidadMedida: number,
  Nombre: string;
}

export interface Empresas{
  IDEmpresa: number,
  Folio: string,
  Nombre: string
}

export interface createCompanieDto{
  Folio: string,
  Nombre: string
}

export interface getEmpresaDto{
  IDEmpresa:number,
  Folio: string,
  Nombre: string
}

export interface editEmpresaDto{
  IDEmpresa:number,
  Folio: string,
  Nombre: string
}

