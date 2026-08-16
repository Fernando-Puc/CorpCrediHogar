import { NumberFormatPipe } from './../../../../../core/shared/shared/pipes/numberFormat.pipe';
import { CommonModule } from '@angular/common';
import { Component, ChangeDetectorRef, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActionButtonComponent } from '../../../../generic components/actionButton/actionButton.component';
import { SafeHtmlPipe } from '../../../../../core/shared/shared/pipes/safeHtml.pipe';
import { chevronLeftIcon, editIcon, trailerIcon, trashIcon } from '../../../../../core/shared/shared/constants/icons.constants';
import { CatalogsService } from '../../../../../core/services/catalogs.service';
import { MatDialog } from '@angular/material/dialog';
import { UnidadMedida } from '../../../../../core/models/catalogs';
import { Createumedida } from '../createumedida/createumedida';
import { Editumedida } from '../editumedida/editumedida';
import { ConfirmDeleteComponent } from '../../../../dialog/confirm-delete/confirm-delete.component';
import { DELETE_DIALOG_UMEDIDA } from '../../../../../core/models/dialog';


@Component({
  selector: 'app-umedidalist',
  imports: [FormsModule, CommonModule, ActionButtonComponent, SafeHtmlPipe],
  templateUrl: './umedidalist.html',
  styleUrl: './umedidalist.scss',
})
export class Umedidalist implements OnInit {
  units: UnidadMedida[] = [];
  filteredUnits: UnidadMedida[] = [];
  pageIndex: number = 0;
  pageSize: number = 15;
  unitCount: number = 0;
  numberOfPages: number = 0;
  searchTerm: string = '';
  isresult: boolean = true;
  isloading: boolean = true;
  paginationIcons= {left: chevronLeftIcon, right: chevronLeftIcon};
  actionIcons= [editIcon, trashIcon];

  constructor(private service: CatalogsService, private changeDetectorRef: ChangeDetectorRef, private dialog: MatDialog){}

  ngOnInit(): void{
    this.getAllUnits();
  }

  getAllUnits(): void{
    this.isloading = true;
    this.service.getUnitMeasurement().subscribe({
      next: response => {
        const unitData: UnidadMedida[] = Array.isArray(response.data) ? response.data: [];
        this.units = [...unitData].sort(
          (unitA: UnidadMedida, unitB: UnidadMedida) => {
            const idA = String(unitA.IDUnidadMedida ?? '');
            const idB = String(unitB.IDUnidadMedida ?? '');
            return idA.localeCompare(idB, undefined,
              {numeric: true, sensitivity: 'base'}
            );
          });

          this.filteredUnits= [...this.units];
          this.pageIndex = 0;
          this.isresult = this.units.length > 0;
          this.isloading = false;
          this.updatePagination();
          this.changeDetectorRef.markForCheck();
      },

      error: error => {
        this.units = [];
        this.filteredUnits = [];
        this.pageIndex = 0;
        this.unitCount = 0;
        this.numberOfPages = 0;
        this.isresult = false;
        this.isloading = false;
        this.changeDetectorRef.markForCheck();
      }
    });
  }

      updatePagination(): void{
      this.unitCount = this.filteredUnits.length;
      this.numberOfPages = this.unitCount > 0 ?
        Math.ceil(this.unitCount / this.pageSize): 0;
      if (this.numberOfPages > 0 && this.pageSize >= this.numberOfPages){
        this.pageIndex = this.numberOfPages -1;
      }
      if (this.numberOfPages === 0){
        this.pageIndex = 0;
      }
    }


    filterUnits(term: string): void{
      const normalizedTerm = term.trim().toLocaleLowerCase();
      if(!normalizedTerm){
        this.filteredUnits = [...this.units];
        this.pageIndex = 0;
        this.updatePagination();
        return;
      }
      this.filteredUnits = this.units.filter(unit =>{
        const unitValues= [
          unit.IDUnidadMedida,
          unit.Nombre,
        ];
        return unitValues.some(value => {
          return String(value ?? '').toLowerCase().includes(normalizedTerm);
        });
      });
      this.pageIndex = 0;
      this.updatePagination();
    }

    onSearch():void{
      if(!this.searchTerm.trim()){
        this.filteredUnits = [
          ...this.units
        ];
        this.pageIndex = 0;
        this.updatePagination();
      }
    }

    onInputChange(): void{
      if(!this.searchTerm.trim()){
        this.filteredUnits = [
          ...this.units
        ];
        this.pageIndex = 0;
        this.updatePagination();
      }
    }

    getPagedData(): UnidadMedida[]{
      const start = this.pageIndex * this.pageSize;
      const end = start + this.pageSize;
      let unitsPage = this.filteredUnits.slice(start, end);
      if(unitsPage.length < this.pageSize){
        const emptyunitsCount = this.pageSize - unitsPage.length;
        const emptycounts = Array.from({length: emptyunitsCount}, () => ({} as UnidadMedida));
      }
      return unitsPage;
    }

    nextPage(): void{
      if (this.pageIndex < this.numberOfPages -1){
        this.pageIndex++;
      }
    }

    previousPage(): void{
      if (this.pageIndex>0){
        this.pageIndex--;
      }
    }


    navigateToAddNew(): void{
      const dialogRef = this.dialog.open(Createumedida, {
        width: '600px',
        disableClose: true,
      });

      dialogRef.afterClosed().subscribe(result => {
        if(result){
          this.getAllUnits();
        }
      });
    }

    editUnit(IDUnidadMedida: number): void{
      const dialogref = this.dialog.open(Editumedida, {
        width: '600px',
        height: 'auto',
        disableClose: true,

        data: {
          IDUnidadMedida: IDUnidadMedida
        }
      });
      dialogref.afterClosed().subscribe(resp => {
        if(resp){
          this.getAllUnits();
        }
      });
    }

    deleteUnit(IDUnidadMedida: number): void{
      const dialogRef = this.dialog.open(ConfirmDeleteComponent, {
        width: '30',
        data: DELETE_DIALOG_UMEDIDA,
        disableClose: true
      });

      dialogRef.afterClosed().subscribe(result=>{
        if(result){
          this.service.deleteUMeasurement(IDUnidadMedida).subscribe({
            next:() => {
              this.getAllUnits();
            },
            error:() => {}
          });
        }
      })
    }
}


