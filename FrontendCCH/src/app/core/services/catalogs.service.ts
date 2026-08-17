import { editBrandDto, getBrandDto } from './../models/catalogs';
import { HttpClient } from '@angular/common/http';
import { ConstantsService } from './constants.service';
import { Injectable } from "@angular/core";
import { Observable } from 'rxjs';
import { ResponseGet, ResponsePPD } from '../models/responses';
import { CreateBrandDto, createCompanieDto, CreateLineDto, createUMedidaDto, editEmpresaDto, editLineDto, editUnidadMedidaDto, Empresas, getEmpresaDto, GetLineDto, GetUnidadMedidaDto, Linea, Marca, UnidadMedida } from '../models/catalogs';
import { Editcompanie } from '../../ui/administrador/catalogos/empresas/editcompanie/editcompanie';
import { editProductDto } from '../models/products';

@Injectable({
  providedIn: 'root'
})

export class CatalogsService{
  private URL = ConstantsService.HTTP+'catalogs/';

  constructor(private http: HttpClient) {}

  //Lines

  getProductLines():Observable<ResponseGet<Linea[]>>{
    return this.http.get<ResponseGet<Linea[]>>(this.URL + "lineas")
  }

  createLine(line: CreateLineDto): Observable<ResponsePPD>{
    return this.http.post<ResponsePPD>(this.URL + "crearlinea", line);
  }

  getLine(IDLinea: number): Observable<ResponseGet<GetLineDto>>{
  return this.http.get<ResponseGet<GetLineDto>>(this.URL + 'verlinea/' + IDLinea);
}

  editLine(line: editLineDto):Observable<ResponsePPD>{
    return this.http.put<ResponsePPD>(`${this.URL}actualizarlinea/${line.IDLinea}`, line);
  }

  deleteLine(IDLinea: number): Observable<ResponsePPD>{
  return this.http.delete<ResponsePPD>(this.URL + "eliminarlinea/" + IDLinea);
}


  //Brands

  getProductBrands(): Observable<ResponseGet<Marca[]>>{
    return this.http.get<ResponseGet<Marca[]>>(this.URL + "marcas")
  }

  getBrand(IDMarca: number): Observable<ResponseGet<getBrandDto>>{
    return this.http.get<ResponseGet<getBrandDto>>(this.URL + 'vermarca/' + IDMarca)

  }

  createBrand(brand: CreateBrandDto): Observable<ResponsePPD>{
    return this.http.post<ResponsePPD>(this.URL + "crearmarca", brand);
  }

  editBrand(brand: editBrandDto): Observable<ResponsePPD>{
    return this.http.put<ResponsePPD>(`${this.URL}actualizarmarca/${brand.IDMarca}`, brand);
  }

  deleteBrand(IDMarca: number): Observable<ResponsePPD>{
    return this.http.delete<ResponsePPD>(this.URL + "eliminarmarca/" + IDMarca);
  }

  //Unit Measurement

  getUnitMeasurement(): Observable<ResponseGet<UnidadMedida[]>>{
    return this.http.get<ResponseGet<UnidadMedida[]>>(this.URL + "umedida");
  }

  createUnitMeasurement(measurement: createUMedidaDto): Observable<ResponsePPD>{
    return this.http.post<ResponsePPD>(this.URL + "crearunidad", measurement);
  }

  getUMeasurment(IDUnidadMedida: number ): Observable<ResponseGet<GetUnidadMedidaDto>>{
    return this.http.get<ResponseGet<GetUnidadMedidaDto>>(this.URL + "verunidad/" + IDUnidadMedida);
  }

  editUMeasurement(measurement: editUnidadMedidaDto): Observable<ResponsePPD>{
    return this.http.put<ResponsePPD>(`${this.URL}actualizarunidad/${measurement.IDUnidadMedida}`, measurement);
  }

  deleteUMeasurement(IDUnidadMedida: number): Observable<ResponsePPD>{
    return this.http.delete<ResponsePPD>(this.URL + "eliminarunidad/" + IDUnidadMedida);
  }

  //Companies
  createCompanie(companie: createCompanieDto): Observable<ResponsePPD>{
    return this.http.post<ResponsePPD>(this.URL + "crearempresa", companie);
  }

  getCompanies(): Observable<ResponseGet<Empresas[]>>{
    return this.http.get<ResponseGet<Empresas[]>>(this.URL + "empresas")
  }

  deleteCompanie(IDEmpresa: number): Observable<ResponsePPD>{
    return this.http.delete<ResponsePPD>(this.URL + "eliminarempresa/" + IDEmpresa);
  }

  getCompanie(IDEmpresa: number): Observable<ResponseGet<getEmpresaDto>>{
    return this.http.get<ResponseGet<getEmpresaDto>>(this.URL + 'verempresa/' + IDEmpresa);
  }

  editCompanie(companie: editEmpresaDto):Observable<ResponsePPD>{
    return this.http.put<ResponsePPD>(`${this.URL}actualizarempresa/${companie.IDEmpresa}`, companie);
  }

}
