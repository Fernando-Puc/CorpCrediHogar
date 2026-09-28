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

export interface CreateBrandDto{
  Nombre: string,
}

export interface getBrandDto{
  IDMarca: number,
  Nombre: string
}

export interface editBrandDto{
  IDMarca: number,
  Nombre: string
}


export interface UnidadMedida{
  IDUnidadMedida: number,
  Nombre: string;
}

export interface createUMedidaDto{
  Nombre: string;
}

export interface GetUnidadMedidaDto{
  IDUnidadMedida: number,
  Nombre: string;
}

export interface editUnidadMedidaDto{
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

//Search for CP
export interface getSearchForCP{
  cp: string;
  pais: string;
  estado: string;
  municipio: string;
  ciudad: string;
  colonias: string[];
}



//Providers
export interface getProvidersDto{
  IDProveedor: number,
  Codigo: string,
  Nombre: string,
  RFC: string,
  domicilio:{
    id: number,
    pais: string,
    codigoPostal: string,
    estado: string,
    municipio: string,
    ciudad: string,
    colonia: string,
    calle: string,
    numInterior: string,
    numExterior: string,
  },
  FechaRegistro: string,
  Activo: boolean
}

//Providers
export interface getProviderDto{
  IDProveedor: number,
  Codigo: string,
  Nombre: string,
  RFC: string,
  domicilio:{
    IDDomicilio: number,
    Pais: string,
    CodigoPostal: string,
    Estado: string,
    Municipio: string,
    Ciudad: string,
    Colonia: string,
    Calle: string,
    NumInterior: string,
    NumExterior: string,
  },
  FechaRegistro: string,
  Activo: boolean
}

export interface createProviderDto{
  Codigo: string,
  Nombre: string,
  RFC: string,
  domicilio:{
    Pais: string,
    CodigoPostal: string,
    Estado: string,
    Municipio: string,
    Ciudad: string,
    Colonia: string,
    Calle: string,
    NumInterior: string,
    NumExterior: string,
  },
  FechaRegistro: string,
  Activo: boolean
}

export interface editProviderDto{
  IDProveedor: number,
  Codigo: string,
  Nombre: string,
  RFC: string,
  domicilio:{
    IDDomicilio:number,
    Pais: string,
    CodigoPostal: string,
    Estado: string,
    Municipio: string,
    Ciudad: string,
    Colonia: string,
    Calle: string,
    NumInterior: string,
    NumExterior: string,
  },
  FechaRegistro: string,
  Activo: boolean
}

