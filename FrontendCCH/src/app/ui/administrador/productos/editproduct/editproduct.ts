import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Linea, Marca, UnidadMedida } from '../../../../core/models/catalogs';
import { getproductDto } from '../../../../core/models/products';
import { CatalogsService } from '../../../../core/services/catalogs.service';
import { ProductsService } from '../../../../core/services/products.service';
import { MatDialog } from '@angular/material/dialog';
import { makeRequired } from '../../../../core/validators/makeRequired.validator';
import { ResponseGet } from '../../../../core/models/responses';
import { ActionButtonComponent } from "../../../generic components/actionButton/actionButton.component";
import { MatCheckbox } from "@angular/material/checkbox";
import { TextInputComponent } from "../../../generic components/input/input.component.";
import { NgSelectModule } from "@ng-select/ng-select";
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-editproduct',
  standalone: true,
  imports: [ActionButtonComponent, MatCheckbox, TextInputComponent, NgSelectModule, ReactiveFormsModule, CommonModule ],
  templateUrl: './editproduct.html',
  styleUrl: './editproduct.scss',
})
export class Editproduct implements OnInit {
  formGroup: FormGroup;

  Linea: Linea[] = [];
  Marca: Marca[] = [];
  UnidadMedida: UnidadMedida[] = [];

  private IDProducto: number | undefined;
  private product: getproductDto | undefined;

  constructor(private router: Router, private catalogs: CatalogsService,
  private route: ActivatedRoute, private productService: ProductsService, private dialog: MatDialog,  ) {
        this.formGroup = new FormGroup({
          codigo: new FormControl('', [makeRequired]),
          nombre: new FormControl('', [makeRequired]),
          linea: new FormControl('', [makeRequired]),
          marca: new FormControl('', [makeRequired]),
          unidadMedida: new FormControl('', [makeRequired]),
          claveSAT: new FormControl('', [makeRequired]),
          sinClaveSAT: new FormControl(false),
        });

        this.catalogs.getProductLines().subscribe((response: ResponseGet<Linea[]>) => {
          this.Linea = response.data;
        });

        this.catalogs.getProductBrands().subscribe((response: ResponseGet<Marca[]>) => {
          this.Marca = response.data;
        });

        this.catalogs.getUnitMeasurement().subscribe((response: ResponseGet<UnidadMedida[]>) => {
          this.UnidadMedida = response.data;
        });
    }

    ngOnInit(){
      this.IDProducto = parseInt(this.route.snapshot.paramMap.get('IDProducto') ?? '');
      if (this.IDProducto){
        this.loadProductData();
      }
    }



    loadProductData(){
      if (this.IDProducto) {
        this.productService.getProduct(this.IDProducto).subscribe(resp => {
          this.product = resp.data;
          if(this.product){
            this.formGroup.patchValue({
              codigo: this.product.codigo,
              nombre: this.product.nombre,
              claveSAT: this.product.claveSAT,
              linea: this.product.linea?.id,
              marca: this. product.marca?.id,
              unidadMedida: this.product.unidadMedida?.id
            });
          }
        });
      }
    }

    onSubmit(){
      if (this.formGroup.invalid){
        this.formGroup.markAllAsTouched();
      }

      if(this.IDProducto === undefined){
        return;

      }
        const updateProductDto = {
          IDProducto: this.IDProducto,
          Codigo: this.formGroup.value.codigo,
          Nombre: this.formGroup.value.nombre,
          IDLinea: this.formGroup.value.linea,
          IDMarca: this.formGroup.value.marca,
          IDUnidadMedida: this.formGroup.value.unidadMedida,
          ClaveSAT: this.formGroup.value.claveSAT,
        };

        this.productService.editProduct(updateProductDto).subscribe(
          (response) => {
            console.log('Producto actualizado correctamente', response);
            this.router.navigate(['administrador/productos']);
          },
          (error) => {
            console.error('Error al actualizar producto', error);
          });
      }
}
