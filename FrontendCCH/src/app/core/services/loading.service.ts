import { Injectable, signal, computed } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class LoadingService {
  private peticiones = signal(0);
  cargando = computed(() => this.peticiones() > 0);

  mostrar() {
    this.peticiones.update(n => n + 1);
  }

  ocultar() {
    this.peticiones.update(n => Math.max(0, n - 1));
  }
}
