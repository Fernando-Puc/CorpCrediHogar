
import { CommonModule } from '@angular/common';
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { SafeHtmlPipe } from '../../../../../core/shared/shared/pipes/safeHtml.pipe';
import { getproductsDto } from '../../../../../core/models/products';
import { ExistenciaDto, ExistenciaView } from '../../../../../core/models/existences';
import { Empresas } from '../../../../../core/models/catalogs';
import { chevronLeftIcon, chevronRightIcon } from '../../../../../core/shared/shared/constants/icons.constants';
import { ProductsService } from '../../../../../core/services/products.service';
import { ExistencesService } from '../../../../../core/services/existence.service';
import { CatalogsService } from '../../../../../core/services/catalogs.service';
import { MatDialog } from '@angular/material/dialog';
import { Viewcosthistory } from '../viewcosthistory/viewcosthistory';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-existenciaslist',
  imports: [FormsModule, CommonModule, NgSelectModule, SafeHtmlPipe, MatIconModule],
  templateUrl: './existenciaslist.html',
  styleUrl: './existenciaslist.scss',
})
export class Existenceslist implements OnInit {
  products: getproductsDto[] = [];
  companies: Empresas[] = [];

  existences: ExistenciaView[] = [];
  filteredExistences: ExistenciaView[] = [];

  selectedProductId: number | null = null;
  selectedCompanyId: number | null = null;
  selectedExistence: ExistenciaView | null = null;

  pageIndex: number = 0;
  pageSize: number = 15;
  existenceCount: number = 0;
  numberOfPages: number = 0;

  searchTerm: string = '';
  totalExistence: number = 0;

  isresult: boolean = false;
  isloading: boolean = true;
  errorMessage: string = '';

  paginationIcons = {
    left: chevronLeftIcon,
    right: chevronRightIcon
  };

  constructor(
    private productService: ProductsService,
    private service: ExistencesService,
    private catalogsService: CatalogsService,
    private changeDetectorRef: ChangeDetectorRef,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.getAllProducts();
  }

  getAllProducts(): void {
    this.isloading = true;

    this.productService.getProducts().subscribe({
      next: response => {
        this.products = Array.isArray(response.data) ? [...response.data] : [];
        this.getAllCompanies();
      },
      error: () => {
        this.products = [];
        this.errorMessage = 'No fue posible obtener los productos';
        this.isloading = false;
        this.changeDetectorRef.markForCheck();
      }
    });
  }

  getAllCompanies(): void {
    this.catalogsService.getCompanies().subscribe({
      next: response => {
        this.companies = Array.isArray(response.data) ? [...response.data] : [];
        this.isloading = false;
        this.changeDetectorRef.markForCheck();
      },
      error: () => {
        this.companies = [];
        this.errorMessage = 'No fue posible obtener las empresas';
        this.isloading = false;
        this.changeDetectorRef.markForCheck();
      }
    });
  }

  onProductChange(): void {
    this.resetExistences();

    if (!this.selectedProductId || !this.selectedCompanyId) {
      this.isresult = false;
      return;
    }

    this.getAllExistences();
  }

  onCompanyChange(): void {
    this.resetExistences();

    if (!this.selectedProductId || !this.selectedCompanyId) {
      this.isresult = false;
      return;
    }

    this.getAllExistences();
  }

  resetExistences(): void {
    this.existences = [];
    this.filteredExistences = [];
    this.selectedExistence = null;
    this.searchTerm = '';
    this.totalExistence = 0;
    this.pageIndex = 0;
    this.existenceCount = 0;
    this.numberOfPages = 0;
    this.errorMessage = '';
  }

  getAllExistences(): void {
    if (!this.selectedProductId || !this.selectedCompanyId) return;

    this.isloading = true;
    this.errorMessage = '';

    this.service.getExistences(
      this.selectedProductId,
      this.selectedCompanyId
    ).subscribe({
      next: response => {
        const data: ExistenciaDto[] = Array.isArray(response.data)
          ? [...response.data]
          : [];

        this.existences = data.map(existence => ({
          ...existence,
          CodigoAlmacen: existence.almacen?.Codigo ?? '',
          NombreAlmacen: existence.almacen?.Nombre ?? ''
        }));

        this.filteredExistences = [...this.existences];

        this.totalExistence = this.existences.length > 0
          ? Number(this.existences[0].ExistenciaTotalEmpresa ?? 0)
          : 0;

        this.selectedExistence = this.existences.length > 0
          ? this.existences[0]
          : null;

        this.pageIndex = 0;
        this.isresult = this.existences.length > 0;
        this.isloading = false;

        this.updatePagination();
        this.changeDetectorRef.markForCheck();
      },
      error: () => {
        this.resetExistences();
        this.isresult = false;
        this.errorMessage = 'No fue posible obtener las existencias';
        this.isloading = false;
        this.changeDetectorRef.markForCheck();
      }
    });
  }

  selectWarehouse(existence: ExistenciaView): void {
    this.selectedExistence = existence;
    this.changeDetectorRef.markForCheck();
  }

  updatePagination(): void {
    this.existenceCount = this.filteredExistences.length;

    this.numberOfPages = this.existenceCount > 0
      ? Math.ceil(this.existenceCount / this.pageSize)
      : 0;

    if (this.numberOfPages === 0) {
      this.pageIndex = 0;
    }
  }

  filterExistences(term: string): void {
    const normalizedTerm = term.trim().toLowerCase();

    if (!normalizedTerm) {
      this.filteredExistences = [...this.existences];
      this.pageIndex = 0;
      this.updatePagination();
      return;
    }

    this.filteredExistences = this.existences.filter(existence => {
      const existenceValues = [
        existence.CodigoAlmacen,
        existence.NombreAlmacen,
        existence.Existencia,
        existence.CostoPromedio,
        existence.UltimoCosto,
        existence.UltimaActualizacion
      ];

      return existenceValues.some(value =>
        String(value ?? '').toLowerCase().includes(normalizedTerm)
      );
    });

    this.pageIndex = 0;
    this.updatePagination();
  }

  onSearch(): void {
    this.filterExistences(this.searchTerm);
  }

  onInputChange(): void {
    if (!this.searchTerm.trim()) {
      this.filteredExistences = [...this.existences];
      this.pageIndex = 0;
      this.updatePagination();
    }
  }

  getPagedData(): ExistenciaView[] {
    const start = this.pageIndex * this.pageSize;
    const end = start + this.pageSize;

    let existencesPage = this.filteredExistences.slice(start, end);

    if (existencesPage.length < this.pageSize) {
      const emptyCount = this.pageSize - existencesPage.length;

      const emptyExistences = Array.from(
        { length: emptyCount },
        () => ({} as ExistenciaView)
      );

      existencesPage = existencesPage.concat(emptyExistences);
    }

    return existencesPage;
  }

  nextPage(): void {
    if (this.pageIndex < this.numberOfPages - 1) {
      this.pageIndex++;
    }
  }

  previousPage(): void {
    if (this.pageIndex > 0) {
      this.pageIndex--;
    }
  }

  searchProduct = (term: string, item: getproductsDto): boolean => {
    return `${item.codigo} ${item.nombre}`
      .toLowerCase()
      .includes(term.trim().toLowerCase());
  };

  searchCompany = (term: string, item: Empresas): boolean => {
    return `${item.Folio} ${item.Nombre}`
      .toLowerCase()
      .includes(term.trim().toLowerCase());
  };

  openCostHistory(): void {
    if(!this.selectedProductId || !this.selectedCompanyId){
      return;
    }

    const product = this.products.find(
      item => item.IDProducto === this.selectedProductId
    );

    this.dialog.open(Viewcosthistory, {
      width: '1100px',
      maxWidth: '95vw',
      data: {
        IDProducto: this.selectedProductId,
        IDEmpresa: this.selectedCompanyId,
        NombreProducto: product?.nombre || '',
        ModeloProducto: product?.codigo || ''
      }
    });
  }
}
