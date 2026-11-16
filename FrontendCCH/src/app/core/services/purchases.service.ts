import { Injectable, Service } from '@angular/core';
import { ConstantsService } from './constants.service';
import { HttpClient } from '@angular/common/http';
import { ResponseGet, ResponsePPD } from '../models/responses';
import { createPurchaseDto, getPurchaseDto, getPurchasesDto } from '../models/purchases';
import { Observable } from 'rxjs';
import { getProvidersDto } from '../models/catalogs';

@Injectable({
  providedIn: 'root'
})

export class PurchasesService{
  private URL = ConstantsService.HTTP+'compras/';

  constructor(private http: HttpClient) {}

  getPurchases(): Observable<ResponseGet<getPurchasesDto[]>>{
    return this.http.get<ResponseGet<getPurchasesDto[]>>(this.URL + 'obtenercompras');
  }

  getPurchase(IDPurchase: number): Observable<ResponseGet<getPurchaseDto>>{
    return this.http.get<ResponseGet<getPurchaseDto>>(this.URL + 'vercompra/' + IDPurchase);
  }


  createPurchase(purchase: createPurchaseDto): Observable<ResponsePPD>{
    return this.http.post<ResponsePPD>(this.URL + "crearcompra", purchase);
  }

  cancelPurchase(id: number): Observable<ResponsePPD>{
    return this.http.put<ResponsePPD>(`${this.URL}${id}/cancelar`, {})
  }

  deletePurchase(id: number): Observable<ResponsePPD>{
    return this.http.delete<ResponsePPD>(`${this.URL}eliminarcompra/${id}`);
  }
}
