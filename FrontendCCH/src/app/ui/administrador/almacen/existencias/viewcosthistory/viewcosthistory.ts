import { CommonModule } from '@angular/common';
import { Component, OnInit, ChangeDetectorRef, Inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { HistorialCostoDto } from '../../../../../core/models/existences';
import { ExistencesService } from '../../../../../core/services/existence.service';

@Component({
  selector: 'app-viewcosthistory',
  imports: [CommonModule, MatDialogModule, MatButtonModule],
  templateUrl: './viewcosthistory.html',
  styleUrl: './viewcosthistory.scss',
})
export class Viewcosthistory implements OnInit {
  public history: HistorialCostoDto[] = [];
  public productName = '';
  public productModel = '';
  public loading = true;
  public errorMessage = '';

  constructor(@Inject(MAT_DIALOG_DATA)
  public data: { IDProducto: number; IDEmpresa: number; NombreProducto: string; ModeloProducto: string},

  private existenceService: ExistencesService, private ChangeDetectorRef: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.productName = this.data.NombreProducto;
    this.productModel = this.data.ModeloProducto;
    this.getCostHistory();
  }

  getCostHistory(): void{
    this.loading = true;

    this.existenceService.getCostHistory(
      this.data.IDProducto, this.data.IDEmpresa).subscribe({
        next: (response) => {
          this.history = response.data || [];
          this.loading = false;
          this.ChangeDetectorRef.markForCheck();
        },
        error: (error) => {
          console.error('Error al consultar el historial: ', error);
          this.errorMessage = 'No fue posible consultar el historial de costos.';
          this.loading = false;
          this.ChangeDetectorRef.markForCheck();
        }
      });
  }
}
