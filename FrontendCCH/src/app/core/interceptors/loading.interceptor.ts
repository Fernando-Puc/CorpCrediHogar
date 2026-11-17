import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { finalize } from 'rxjs';
import { LoadingService } from '../services/loading.service';

const METODOS = ['POST', 'PUT', 'PATCH', 'DELETE'];

export const loadingInterceptor: HttpInterceptorFn = (req, next) => {
  if (!METODOS.includes(req.method)) {
    return next(req);
  }

  const loading = inject(LoadingService);
  loading.mostrar();

  return next(req).pipe(finalize(() => loading.ocultar()));
};
