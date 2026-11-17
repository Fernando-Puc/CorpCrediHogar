import { Component, inject } from '@angular/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { LoadingService } from '../../../core/services/loading.service';

@Component({
  selector: 'app-loading-overlay',
  standalone: true,
  imports: [MatProgressSpinnerModule],
  template: `
    @if (loading.cargando()) {
      <div class="overlay">
        <mat-spinner diameter="56"></mat-spinner>
      </div>
    }
  `,
  styles: [`
    .overlay {
      position: fixed;
      inset: 0;
      z-index: 2000;
      display: flex;
      align-items: center;
      justify-content: center;
      background: rgba(255, 255, 255, 0.6);
      backdrop-filter: blur(2px);
    }

    mat-spinner {
      --mdc-circular-progress-active-indicator-color: #d40101;
    }
  `],
})
export class LoadingOverlay {
  loading = inject(LoadingService);
}
