import { CommonModule } from "@angular/common";
import { ChangeDetectorRef, Component, OnInit } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { ActionButtonComponent } from "../../../generic components/actionButton/actionButton.component";
import { SafeHtmlPipe } from "../../../../core/shared/shared/pipes/safeHtml.pipe";
import { getproductsDto } from "../../../../core/models/products";
import { chevronLeftIcon, chevronRightIcon, editIcon, eyeIcon, trashIcon } from "../../../../core/shared/shared/constants/icons.constants";
import { Router } from "@angular/router";
import { ProductsService } from "../../../../core/services/products.service";


@Component({
  selector: 'app-productoslist',

  standalone: true,

  imports: [
    CommonModule,
    FormsModule,
    ActionButtonComponent,
    SafeHtmlPipe
  ],

  templateUrl: './productoslist.html',

  styleUrl: './productoslist.scss'
})
export class Productoslist implements OnInit {
  products: getproductsDto[] = [];
  filteredProducts: getproductsDto[] = [];
  pageIndex: number = 0;
  pageSize: number = 15;
  productCount: number = 0;
  numberOfPages: number = 0;
  searchTerm: string = '';
  isresult: boolean = true;
  isloading: boolean = true;
  paginationIcons = { left: chevronLeftIcon, right: chevronRightIcon };

  actionIcons = [ eyeIcon, editIcon, trashIcon];

  constructor( private router: Router, private service: ProductsService, private changeDetectorRef: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.getAllProducts();
  }

  getAllProducts(): void {
    this.isloading = true;
    this.service.getProducts().subscribe({
      next: response => {
        const productsData: getproductsDto[] = Array.isArray(response.data) ? response.data: [];
        this.products = [...productsData].sort(
          ( productA: getproductsDto, productB: getproductsDto) => {
            const codigoA = String(productA.codigo ?? '');
            const codigoB = String(productB.codigo ?? '');
            return codigoA.localeCompare(codigoB, undefined,
              { numeric: true, sensitivity: 'base'}
            );
          });

        this.filteredProducts = [...this.products];
        this.pageIndex = 0;
        this.isresult = this.products.length > 0;
        this.isloading = false;
        this.updatePagination();
        this.changeDetectorRef.markForCheck();
      },

      error: error => {
        this.products = [];
        this.filteredProducts = [];
        this.pageIndex = 0;
        this.productCount = 0;
        this.numberOfPages = 0;
        this.isresult = false;
        this.isloading = false;
        this.changeDetectorRef.markForCheck();
      }
    });
  }
  updatePagination(): void {
    this.productCount = this.filteredProducts.length;
    this.numberOfPages = this.productCount > 0 ?
      Math.ceil( this.productCount / this.pageSize): 0;
    if ( this.numberOfPages > 0 && this.pageIndex >= this.numberOfPages) {
      this.pageIndex = this.numberOfPages - 1;
    }
    if (this.numberOfPages === 0) {
      this.pageIndex = 0;
    }
  }

  filterProducts(term: string): void {
    const normalizedTerm = term.trim().toLowerCase();
    if (!normalizedTerm) {
      this.filteredProducts = [...this.products];
      this.pageIndex = 0;
      this.updatePagination();
      return;
    }

    this.filteredProducts = this.products.filter(product => {
        const productValues = [
          product.codigo,
          product.nombre,
          product.linea?.nombre,
          product.marca?.nombre,
          product.unidadMedida?.nombre,
          product.claveSAT
        ];
        return productValues.some(value => {
          return String(value ?? '').toLowerCase()
            .includes(normalizedTerm);
        });
      });

    this.pageIndex = 0;
    this.updatePagination();
  }


  onSearch(): void {
    this.filterProducts(this.searchTerm);
  }


  onInputChange(): void {
    if (!this.searchTerm.trim()) {
      this.filteredProducts = [
        ...this.products
      ];
      this.pageIndex = 0;
      this.updatePagination();
    }
  }

  getPagedData(): getproductsDto[] {
    const start = this.pageIndex * this.pageSize;
    const end = start + this.pageSize;
    let productsPage = this.filteredProducts.slice( start, end);
    if (productsPage.length < this.pageSize) {
      const emptyProductsCount = this.pageSize - productsPage.length;
      const emptyProducts =
        Array.from({length: emptyProductsCount}, () => ({} as getproductsDto));
      productsPage = productsPage.concat( emptyProducts);
    }
    return productsPage;
  }

  nextPage(): void {
    if ( this.pageIndex < this.numberOfPages - 1) {
      this.pageIndex++;
    }
  }

  previousPage(): void {
    if (this.pageIndex > 0) {
      this.pageIndex--;
    }

  }

  navigateToAddNew(): void {
    this.router.navigate(['administrador/createproducts']);
  }


  navigateToEditProduct(
    id: number): void {
      this.router.navigate(['/dashboard/edit-product', id]);
  }
}
