import { getproductsDto } from './../models/products';
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
}
