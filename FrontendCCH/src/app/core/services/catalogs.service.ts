import { HttpClient } from '@angular/common/http';
import { ConstantsService } from './constants.service';
import { Injectable } from "@angular/core";
import { Observable } from 'rxjs';
import { ResponseGet } from '../models/responses';
import { Linea, Marca, UnidadMedida } from '../models/catalogs';

@Injectable({
  providedIn: 'root'
})

export class CatalogsService{
  private URL = ConstantsService.HTTP+'catalogs/';

  constructor(private http: HttpClient) {}

  getProductLines():Observable<ResponseGet<Linea[]>>{
    return this.http.get<ResponseGet<Linea[]>>(this.URL + "lineas")
  }

  getProductBrands(): Observable<ResponseGet<Marca[]>>{
    return this.http.get<ResponseGet<Marca[]>>(this.URL + "marcas")
  }

  getUnitMeasurement(): Observable<ResponseGet<UnidadMedida[]>>{
    return this.http.get<ResponseGet<UnidadMedida[]>>(this.URL + "umedida")
  }





}
