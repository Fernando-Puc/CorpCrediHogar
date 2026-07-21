import { Createproducts } from './../../ui/administrador/productos/createproducts/createproducts';
import { createProductDto, getproductDto, getproductsDto } from './../models/products';
import { Injectable } from "@angular/core";
import { ConstantsService } from "./constants.service";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { ResponseGet, ResponsePPD } from "../models/responses";

@Injectable({providedIn: 'root'})

export class ProductsService{

  private URL = ConstantsService.HTTP+'catalogs/';

  constructor(private http: HttpClient){}

    getProducts(): Observable<ResponseGet<getproductsDto[]>>{
      return this.http.get<ResponseGet<getproductsDto[]>>(this.URL+'productos');
    }

    createproduct(product: createProductDto): Observable<ResponsePPD>{
      return this.http.post<ResponsePPD>(this.URL + "registrarproducto", product );
    }

    getProduct(IDProducto:number): Observable<ResponseGet<getproductDto>>{
      return this.http.get<ResponseGet<getproductDto>>(this.URL + 'verproducto/'+ IDProducto );
    }

    deleteProduct(IDproducto:number): Observable<ResponsePPD>{
      return this.http.delete<ResponsePPD>(this.URL + 'eliminarproducto/' + IDproducto);
    }
}
