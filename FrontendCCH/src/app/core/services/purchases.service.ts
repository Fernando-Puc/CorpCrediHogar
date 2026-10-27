import { Injectable, Service } from '@angular/core';
import { ConstantsService } from './constants.service';
import { HttpClient } from '@angular/common/http';
import { ResponseGet, ResponsePPD } from '../models/responses';
import { getPurchasesDto } from '../models/purchases';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class PurchasesService{
  private URL = ConstantsService.HTTP+'compras/';

  constructor(private http: HttpClient) {}

  getPurchases(): Observable<ResponseGet<getPurchasesDto[]>>{
    return this.http.get<ResponseGet<getPurchasesDto[]>>(this.URL + 'obtenercompras');
  }

  cancelPurchase(id: number): Observable<ResponsePPD>{
    return this.http.put<ResponsePPD>(`${this.URL}${id}/cancelar`, {})
  }

  deletePurchase(id: number): Observable<ResponsePPD>{
    return this.http.delete<ResponsePPD>(`${this.URL}eliminarcompra/${id}`);
  }
}
