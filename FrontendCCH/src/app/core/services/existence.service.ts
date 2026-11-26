import { Injectable } from '@angular/core';
import { ConstantsService } from './constants.service';
import { HttpClient } from '@angular/common/http';
import { ResponseGet } from '../models/responses';
import { ExistenciaDto, HistorialCostoDto } from '../models/existences';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class ExistencesService {
  private URL = ConstantsService.HTTP + 'existencias/';

  constructor(private http: HttpClient) {}

  getExistences(IDProducto: number, IDEmpresa: number): Observable<ResponseGet<ExistenciaDto[]>> {
    return this.http.get<ResponseGet<ExistenciaDto[]>>(
      this.URL + '?IDProducto=' + IDProducto + '&IDEmpresa=' + IDEmpresa
    );
  }

  getCostHistory(IDProducto: number, IDEmpresa: number): Observable<ResponseGet<HistorialCostoDto[]>>{
    return this.http.get<ResponseGet<HistorialCostoDto[]>>(
      this.URL + 'historialcostos?IDProducto=' + IDProducto + '&IDEmpresa=' + IDEmpresa
    );
  }
}

