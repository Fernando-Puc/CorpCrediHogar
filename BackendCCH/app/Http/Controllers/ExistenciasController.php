<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Helpers\ResponseHelper;
use App\Models\Existencias;
use Illuminate\Support\Facades\Validator;
use App\Models\CostoProductoEmpresa;

class ExistenciasController extends Controller
{

    // Obtener Existencias
    public function ObtenerExistencias(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'IDProducto' => 'nullable|integer|exists:productos,IDProducto',
            'IDAlmacen' => 'nullable|integer|exists:almacenes,IDAlmacen',
            'IDEmpresa' => 'nullable|integer|exists:empresas,IDEmpresa',
            'buscar' => 'nullable|string|max:100',
        ]);

        if ($validator->fails()) {
            return ResponseHelper::error($validator->errors()->first(), 400);
        }

        $existencias = Existencias::with([
            'producto.unidadMedida',
            'almacen.empresa'
        ])
            ->when($request->filled('IDAlmacen'), function ($query) use ($request) {
                $query->where('IDAlmacen', $request->input('IDAlmacen'));
            })
            ->when($request->filled('buscar'), function ($query) use ($request) {
                $buscar = $request->input('buscar');

                $query->whereHas('producto', function ($q) use ($buscar) {
                    $q->where('Codigo', 'like', "%{$buscar}%")
                        ->orWhere('Nombre', 'like', "%{$buscar}%");
                });
            })
            ->when($request->filled('IDProducto'), function ($query) use ($request) {
                $query->where('IDProducto', $request->input('IDProducto'));
            })
            ->when($request->filled('IDEmpresa'), function ($query) use ($request) {
                $query->whereHas('almacen', function ($q) use ($request) {
                    $q->where('IDEmpresa', $request->input('IDEmpresa'));
                });
            })
            ->orderBy('IDAlmacen')
            ->orderBy('IDProducto')
            ->get();

        // Calcular costos y existencia total por empresa
        if ($request->filled('IDProducto') && $request->filled('IDEmpresa')) {

            // Existencia total en todos los almacenes de la empresa.
            $existenciaTotal = Existencias::where('IDProducto', $request->input('IDProducto'))
                ->whereHas('almacen', function ($query) use ($request) {
                    $query->where('IDEmpresa', $request->input('IDEmpresa'));
                })
                ->sum('Existencia');

            // Consultar los costos generales del producto y empresa.
            $costoEmpresa = CostoProductoEmpresa::where(
                'IDProducto',
                $request->input('IDProducto')
            )
                ->where(
                    'IDEmpresa',
                    $request->input('IDEmpresa')
                )
                ->first();

            $costoPromedio = $costoEmpresa
                ? (float) $costoEmpresa->CostoPromedio
                : 0;

            $ultimoCosto = $costoEmpresa
                ? (float) $costoEmpresa->UltimoCosto
                : 0;

            // Agregar el resumen a los registros.
            $existencias->each(function ($item) use (
                $existenciaTotal,
                $costoPromedio,
                $ultimoCosto
            ) {
                $item->ExistenciaTotalEmpresa = $existenciaTotal;
                $item->CostoPromedioEmpresa = $costoPromedio;
                $item->UltimoCostoEmpresa = $ultimoCosto;
            });
        }

        return ResponseHelper::success(
            $existencias,
            'Existencias obtenidas correctamente'
        );
    }


    // Ver Existencia
    public function VerExistencia($id)
    {
        $existencia = Existencias::with([
            'producto.unidadMedida',
            'almacen'
        ])->find($id);

        if (!$existencia) {
            return ResponseHelper::error('Existencia no encontrada', 404);
        }

        return ResponseHelper::success(
            $existencia,
            'Detalles de existencia obtenidos correctamente'
        );
    }
}
