<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Compras;
use App\Models\CompraDetalle;
use App\Models\Existencias;
use App\Helpers\ResponseHelper;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;
use App\Models\CostoProductoEmpresa;
use App\Models\Almacenes;


class ComprasController extends Controller
{
    //Obtener Compras
    public function ObtenerCompras()
    {
        $compras = Compras::with('proveedor')
            ->orderByDesc('FechaRegistro')
            ->orderByDesc('IDCompra')
            ->get();

        return ResponseHelper::success($compras, 'Compras obtenidas correctamente');
    }

    //Ver Compra
    public function VerCompra($id)
    {
        $compra = Compras::with(['proveedor', 'detalle.producto.unidadMedida', 'detalle.almacen'])
            ->findOrFail($id);

        $compraFormateada = [
            'IDCompra' => $compra->IDCompra,
            'Serie' => $compra->Serie,
            'Folio' => $compra->Folio,
            'IDProveedor' => $compra->IDProveedor,
            'FechaRegistro' => $compra->FechaRegistro,
            'Concepto' => $compra->Concepto,
            'TotalProductos' => (float) $compra->TotalProductos,
            'Subtotal' => (float) $compra->Subtotal,
            'Descuentos' => (float) $compra->Descuentos,
            'Impuestos' => (float) $compra->Impuestos,
            'Total' => (float) $compra->Total,
            'Estado' => $compra->Estado,
            'proveedor' => $compra->proveedor ? [
                'Codigo' => $compra->proveedor->Codigo,
                'Nombre' => $compra->proveedor->Nombre,
                'RFC' => $compra->proveedor->RFC,
            ] : null,
            'movimientos' => $compra->detalle->map(fn($d) => [
                'IDMovimiento' => $d->IDMovimiento,
                'IDProducto' => $d->IDProducto,
                'IDAlmacen' => $d->IDAlmacen,
                'CodigoProducto' => $d->producto?->Codigo,
                'NombreProducto' => $d->producto?->Nombre,
                'UnidadMedidaProducto' => $d->producto?->unidadMedida?->Nombre,
                'CodigoAlmacen' => $d->almacen?->Codigo,
                'NombreAlmacen' => $d->almacen?->Nombre,
                'Cantidad' => (float) $d->Cantidad,
                'Precio' => (float) $d->Precio,
                'DescuentoPorcentaje' => (float) $d->DescuentoPorcentaje,
                'TasaIVA' => (float) $d->TasaIVA,
                'Neto' => (float) $d->Neto,
                'Descuento' => (float) $d->Descuento,
                'IVA' => (float) $d->IVA,
                'Total' => (float) $d->Total,
            ])->values(),
        ];

        return ResponseHelper::success($compraFormateada, 'Detalles de compra obtenidos correctamente');
    }


    // Actualizar costos generales por producto y empresa
    private function ActualizarCostoEmpresa(
        int $IDProducto,
        int $IDAlmacen,
        float $cantidadCompra,
        float $costoUnitario
    ) {
        // Obtener la empresa del almacén seleccionado.
        $almacen = Almacenes::findOrFail($IDAlmacen);

        $IDEmpresa = $almacen->IDEmpresa;

        // Bloquear el producto para evitar actualizaciones simultáneas.
        DB::table('productos')
            ->where('IDProducto', $IDProducto)
            ->lockForUpdate()
            ->first();

        // Bloquear las existencias del producto en todos los almacenes
        // pertenecientes a la misma empresa.
        $existenciasEmpresa = Existencias::where('IDProducto', $IDProducto)
            ->whereHas('almacen', function ($query) use ($IDEmpresa) {
                $query->where('IDEmpresa', $IDEmpresa);
            })
            ->lockForUpdate()
            ->get();

        // Calcular la cantidad total antes de agregar la compra.
        $cantidadActual = (float) $existenciasEmpresa->sum('Existencia');

        // Obtener o crear el registro de costos de la empresa.
        $costo = CostoProductoEmpresa::where('IDProducto', $IDProducto)
            ->where('IDEmpresa', $IDEmpresa)
            ->lockForUpdate()
            ->first();

        if (!$costo) {
            $costo = new CostoProductoEmpresa([
                'IDProducto' => $IDProducto,
                'IDEmpresa' => $IDEmpresa,
                'CostoPromedio' => 0,
                'UltimoCosto' => 0,
            ]);
        }

        $costoPromedioActual = (float) $costo->CostoPromedio;

        $nuevaCantidad = $cantidadActual + $cantidadCompra;

        // Calcular costo promedio ponderado de toda la empresa.
        $nuevoCostoPromedio = $nuevaCantidad > 0
            ? (
                ($cantidadActual * $costoPromedioActual)
                + ($cantidadCompra * $costoUnitario)
            ) / $nuevaCantidad
            : 0;

        $costo->CostoPromedio = round($nuevoCostoPromedio, 4);
        $costo->UltimoCosto = round($costoUnitario, 4);
        $costo->UltimaActualizacion = now();

        $costo->save();
    }


    //Registrar Compra
    public function CrearCompra(Request $request)
    {
        $validator = Validator::make(
            $request->all(),
            [
                //Compras

                'Serie' => 'required|string|max:255',
                'Folio' => 'required|string|max:255',
                'IDProveedor' => 'required|integer',
                'Concepto' => 'required|string|max:255',

                //movimientos
                'movimientos' => 'required|array|min:1',
                'movimientos.*.IDProducto' => 'required|integer|exists:productos,IDProducto',
                'movimientos.*.IDAlmacen' => 'required|integer|exists:almacenes,IDAlmacen',
                'movimientos.*.Cantidad' => 'required|numeric|gt:0',
                'movimientos.*.Precio' => 'required|numeric|min:0',
                'movimientos.*.DescuentoPorcentaje' => 'nullable|numeric|min:0|max:100',
                'movimientos.*.TasaIVA' => 'nullable|numeric|min:0|max:1',
            ]
        );

        if ($validator->fails()) {
            return ResponseHelper::error($validator->errors()->first(), 400);
        }

        //Folio y Serie Unicos de una compra
        $duplicada = Compras::where('Folio', $request->input('Folio'))->where('Serie', $request->input('Serie'))->exists();

        if ($duplicada) {
            return ResponseHelper::error('El folio y serie ya existen en una compra', 400);
        }

        try {
            $compra = DB::transaction(function () use ($request) {
                $compra = Compras::create([
                    'Serie' => $request->input('Serie'),
                    'Folio' => $request->input('Folio'),
                    'IDProveedor' => $request->input('IDProveedor'),
                    'FechaRegistro' => now()->toDateString(),
                    'Concepto' => $request->input('Concepto'),
                    'Estado' => 'Registrada',
                ]);

                $totalProductos = 0;
                $subtotal = 0;
                $descuentos = 0;
                $impuestos = 0;

                foreach ($request->input('movimientos') as $m) {
                    $tasa = $m['TasaIVA'] ?? 0.16;
                    $pct = $m['DescuentoPorcentaje'] ?? 0;

                    //Calculo de neto, descuento e IVA
                    $neto = round($m['Cantidad'] * $m['Precio'], 2);
                    $descuento = round($neto * ($pct / 100), 2);
                    $iva = round(($neto - $descuento) * $tasa, 2);

                    CompraDetalle::create([
                        'IDCompra' => $compra->IDCompra,
                        'IDProducto' => $m['IDProducto'],
                        'IDAlmacen' => $m['IDAlmacen'],
                        'Cantidad' => $m['Cantidad'],
                        'Precio' => $m['Precio'],
                        'DescuentoPorcentaje' => $pct,
                        'TasaIVA' => $tasa,
                        'Neto' => $neto,
                        'Descuento' => $descuento,
                        'IVA' => $iva,
                        'Total' => $neto - $descuento + $iva,
                    ]);


                    // Costo real por unidad con descuento y sin IVA.
                    $costoUnitario = ($neto - $descuento) / $m['Cantidad'];

                    // Actualizar costo promedio y último costo por empresa.
                    $this->ActualizarCostoEmpresa(
                        (int) $m['IDProducto'],
                        (int) $m['IDAlmacen'],
                        (float) $m['Cantidad'],
                        (float) $costoUnitario
                    );

                    // Buscar existencia del producto en el almacén.
                    $existencia = Existencias::where('IDAlmacen', $m['IDAlmacen'])
                        ->where('IDProducto', $m['IDProducto'])
                        ->lockForUpdate()
                        ->first();

                    if (!$existencia) {
                        $existencia = new Existencias([
                            'IDAlmacen' => $m['IDAlmacen'],
                            'IDProducto' => $m['IDProducto'],
                            'Existencia' => 0,
                        ]);
                    }

                    // Incrementar únicamente las unidades del almacén.
                    $existencia->Existencia =
                        (float) $existencia->Existencia + (float) $m['Cantidad'];

                    $existencia->UltimaActualizacion = now();
                    $existencia->save();

                    $totalProductos += $m['Cantidad'];
                    $subtotal += $neto;
                    $descuentos += $descuento;
                    $impuestos += $iva;
                }

                $compra->update([
                    'TotalProductos' => $totalProductos,
                    'Subtotal' => $subtotal,
                    'Descuentos' => $descuentos,
                    'Impuestos' => $impuestos,
                    'Total' => $subtotal - $descuentos + $impuestos,
                ]);

                return $compra;
            });

            $compra->load('detalle');

            return ResponseHelper::success($compra, 'Compra registrada exitosamente', 201);
        } catch (\Exception $e) {
            return ResponseHelper::error('Error al registrar la compra: ' . $e->getMessage(), 500);
        }
    }


    // Revertir movimiento de compra
    private function RevertirMovimientos(Compras $compra)
    {
        foreach ($compra->detalle()->orderByDesc('IDMovimiento')->get() as $d) {

            // Obtener la empresa correspondiente al almacén.
            $almacen = Almacenes::where('IDAlmacen', $d->IDAlmacen)
                ->lockForUpdate()
                ->firstOrFail();

            $IDEmpresa = $almacen->IDEmpresa;

            // Buscar la existencia del producto en el almacén.
            $existencia = Existencias::where('IDProducto', $d->IDProducto)
                ->where('IDAlmacen', $d->IDAlmacen)
                ->lockForUpdate()
                ->first();

            // Comprobar que exista el registro.
            if (!$existencia) {
                throw new \Exception(
                    'No existe el registro de existencias del producto en el almacén.'
                );
            }

            // Comprobar que el almacén tenga suficiente cantidad.
            if ((float) $existencia->Existencia < (float) $d->Cantidad) {
                throw new \Exception(
                    'La existencia actual no alcanza para modificar o cancelar la compra.'
                );
            }

            // Obtener el costo general del producto y empresa.
            $costo = CostoProductoEmpresa::where('IDProducto', $d->IDProducto)
                ->where('IDEmpresa', $IDEmpresa)
                ->lockForUpdate()
                ->first();

            if (!$costo) {
                throw new \Exception(
                    'No se encontró el costo del producto para la empresa seleccionada.'
                );
            }

            // Obtener la existencia total de la empresa antes de revertir.
            $cantidadActualEmpresa = (float) Existencias::where(
                'IDProducto',
                $d->IDProducto
            )
                ->whereHas('almacen', function ($query) use ($IDEmpresa) {
                    $query->where('IDEmpresa', $IDEmpresa);
                })
                ->sum('Existencia');

            // Calcular el costo unitario de la compra.
            $costoUnitario = $d->Cantidad > 0
                ? ((float) $d->Neto - (float) $d->Descuento) / (float) $d->Cantidad
                : 0;

            // Revertir la cantidad del almacén.
            $existencia->Existencia =
                (float) $existencia->Existencia - (float) $d->Cantidad;

            $existencia->UltimaActualizacion = now();
            $existencia->save();

            // Calcular la existencia total después de revertir.
            $nuevaCantidadEmpresa = $cantidadActualEmpresa - (float) $d->Cantidad;

            // Revertir el costo promedio general de la empresa.
            $costoPromedioActual = (float) $costo->CostoPromedio;

            if ($nuevaCantidadEmpresa > 0) {

                $nuevoCostoPromedio = (
                    ($cantidadActualEmpresa * $costoPromedioActual)
                    - ((float) $d->Cantidad * $costoUnitario)
                ) / $nuevaCantidadEmpresa;

                $costo->CostoPromedio = round($nuevoCostoPromedio, 4);
            } else {

                $costo->CostoPromedio = 0;
            }

            // Buscar la compra válida más reciente, sin importar el almacén.
            // Se excluye la compra que estamos revirtiendo.
            $ultimaCompra = DB::table('compra_detalle')
                ->join(
                    'compras',
                    'compra_detalle.IDCompra',
                    '=',
                    'compras.IDCompra'
                )
                ->join(
                    'almacenes',
                    'compra_detalle.IDAlmacen',
                    '=',
                    'almacenes.IDAlmacen'
                )
                ->where('compra_detalle.IDProducto', $d->IDProducto)
                ->where('almacenes.IDEmpresa', $IDEmpresa)
                ->where('compras.IDCompra', '!=', $compra->IDCompra)
                ->whereRaw('LOWER(compras.Estado) != ?', ['cancelada'])
                ->where('compra_detalle.Cantidad', '>', 0)
                ->orderByDesc('compras.FechaRegistro')
                ->orderByDesc('compras.IDCompra')
                ->orderByDesc('compra_detalle.IDMovimiento')
                ->select(
                    'compra_detalle.Neto',
                    'compra_detalle.Descuento',
                    'compra_detalle.Cantidad'
                )
                ->first();

            // Actualizar último costo.
            $costo->UltimoCosto = $ultimaCompra
                ? round(
                    (
                        (float) $ultimaCompra->Neto
                        - (float) $ultimaCompra->Descuento
                    ) / (float) $ultimaCompra->Cantidad,
                    4
                )
                : 0;

            $costo->UltimaActualizacion = now();
            $costo->save();
        }
    }


    //crea los movimientos, actualiza las existencias, calcula costos y actualiza totales de la compra.
    private function AplicarMovimientos(Compras $compra, array $movimientos)
    {
        $totalProductos = 0;
        $subtotal = 0;
        $descuentos = 0;
        $impuestos = 0;

        foreach ($movimientos as $m) {
            $tasa = $m['TasaIVA'] ?? 0.16;
            $pct = $m['DescuentoPorcentaje'] ?? 0;

            $neto = round($m['Cantidad'] * $m['Precio'], 2);
            $descuento = round($neto * ($pct / 100), 2);
            $iva = round(($neto - $descuento) * $tasa, 2);

            CompraDetalle::create([
                'IDCompra' => $compra->IDCompra,
                'IDProducto' => $m['IDProducto'],
                'IDAlmacen' => $m['IDAlmacen'],
                'Cantidad' => $m['Cantidad'],
                'Precio' => $m['Precio'],
                'DescuentoPorcentaje' => $pct,
                'TasaIVA' => $tasa,
                'Neto' => $neto,
                'Descuento' => $descuento,
                'IVA' => $iva,
                'Total' => $neto - $descuento + $iva,
            ]);


            // Costo real por unidad con descuento y sin IVA.
            $costoUnitario = ($neto - $descuento) / $m['Cantidad'];

            // Actualizar costo promedio y último costo por empresa.
            $this->ActualizarCostoEmpresa(
                (int) $m['IDProducto'],
                (int) $m['IDAlmacen'],
                (float) $m['Cantidad'],
                (float) $costoUnitario
            );

            // Buscar existencia del producto en el almacén.
            $existencia = Existencias::where('IDAlmacen', $m['IDAlmacen'])
                ->where('IDProducto', $m['IDProducto'])
                ->lockForUpdate()
                ->first();

            if (!$existencia) {
                $existencia = new Existencias([
                    'IDAlmacen' => $m['IDAlmacen'],
                    'IDProducto' => $m['IDProducto'],
                    'Existencia' => 0,
                ]);
            }

            // Incrementar únicamente las unidades del almacén.
            $existencia->Existencia =
                (float) $existencia->Existencia + (float) $m['Cantidad'];

            $existencia->UltimaActualizacion = now();
            $existencia->save();

            $totalProductos += $m['Cantidad'];
            $subtotal += $neto;
            $descuentos += $descuento;
            $impuestos += $iva;
        }

        $compra->update([
            'TotalProductos' => $totalProductos,
            'Subtotal' => $subtotal,
            'Descuentos' => $descuentos,
            'Impuestos' => $impuestos,
            'Total' => $subtotal - $descuentos + $impuestos,
        ]);
    }

    //Cancelar Compra
    public function CancelarCompra($id)
    {
        $compra = Compras::with('detalle')->find($id);

        if (!$compra) {
            return ResponseHelper::error('Compra no encontrada', 400);
        }

        if (strtolower($compra->Estado) === 'cancelada') {
            return ResponseHelper::error('La compra ya esta cancelada', 400);
        }

        try {
            DB::transaction(function () use ($compra) {
                $this->RevertirMovimientos($compra);
                $compra->update(['Estado' => 'cancelada']);
            });

            $compra->load('detalle');

            return ResponseHelper::success($compra, 'Compra cancelada correctamente');
        } catch (\Exception $e) {
            return ResponseHelper::error($e->getMessage(), 400);
        }
    }

    //Actualizar Compra (encabezado y movimientos)
    public function ActualizarCompra(Request $request, $id)
    {
        $compra = Compras::find($id);

        if (!$compra) {
            return ResponseHelper::error('Compra no encontrada', 404);
        }

        if (strtolower($compra->Estado) === 'cancelada') {
            return ResponseHelper::error('No se puede modificar una compra cancelada', 400);
        }

        $validator = Validator::make($request->all(), [
            'Serie' => 'required|string|max:255',
            'Folio' => 'required|string|max:255',
            'IDProveedor' => 'required|integer',
            'FechaRegistro' => 'required|date',
            'Concepto' => 'required|string|max:255',

            'movimientos' => 'required|array|min:1',
            'movimientos.*.IDProducto' => 'required|integer|exists:productos,IDProducto',
            'movimientos.*.IDAlmacen' => 'required|integer|exists:almacenes,IDAlmacen',
            'movimientos.*.Cantidad' => 'required|numeric|gt:0',
            'movimientos.*.Precio' => 'required|numeric|min:0',
            'movimientos.*.DescuentoPorcentaje' => 'nullable|numeric|min:0|max:100',
            'movimientos.*.TasaIVA' => 'nullable|numeric|min:0|max:1',
        ]);

        if ($validator->fails()) {
            return ResponseHelper::error($validator->errors()->first(), 400);
        }

        //Serie y folio únicos, ignorando esta misma compra
        $duplicada = Compras::where('Folio', $request->input('Folio'))
            ->where('Serie', $request->input('Serie'))
            ->where('IDCompra', '!=', $compra->IDCompra)
            ->exists();

        if ($duplicada) {
            return ResponseHelper::error('El folio y serie ya existen en otra compra', 400);
        }

        try {
            DB::transaction(function () use ($compra, $request) {
                $this->RevertirMovimientos($compra);

                CompraDetalle::where('IDCompra', $compra->IDCompra)->delete();

                $compra->update($request->only([
                    'Serie',
                    'Folio',
                    'IDProveedor',
                    'FechaRegistro',
                    'Concepto',
                ]));

                $this->AplicarMovimientos($compra, $request->input('movimientos'));
            });

            $compra->load('detalle');

            return ResponseHelper::success($compra, 'Compra actualizada correctamente');
        } catch (\Exception $e) {
            return ResponseHelper::error($e->getMessage(), 400);
        }
    }

    //Eliminar Compra en caso de estar cancelada
    public function EliminarCompra($id)
    {
        $compra = Compras::find($id);

        if (!$compra) {
            return ResponseHelper::error('Compra no encontrada', 404);
        }

        if (strtolower($compra->Estado) !== 'cancelada') {
            return ResponseHelper::error('Solo se puede eliminar la compra si está cancelada.');
        }

        try {
            DB::transaction(function () use ($compra) {
                CompraDetalle::where('IDCompra', $compra->IDCompra)->delete();
                $compra->delete();
            });

            return ResponseHelper::success(null, 'Compra eliminada correctamente');
        } catch (\Exception $e) {
            return ResponseHelper::error('Error al eliminar la compra: ' . $e->getMessage(), 500);
        }
    }

    //Historial de costos de un producto por empresa
    public function HistorialCostos(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'IDProducto' => 'required|integer|exists:productos,IDProducto',
            'IDEmpresa' => 'required|integer|exists:empresas,IDEmpresa',
        ]);

        if ($validator->fails()) {
            return ResponseHelper::error($validator->errors()->first(), 400);
        }

        $historial = DB::table('compra_detalle')
            ->join('compras', 'compra_detalle.IDCompra', '=', 'compras.IDCompra')
            ->join('almacenes', 'compra_detalle.IDAlmacen', '=', 'almacenes.IDAlmacen')
            ->leftJoin('proveedores', 'compras.IDProveedor', '=', 'proveedores.IDProveedor')
            ->where('compra_detalle.IDProducto', $request->input('IDProducto'))
            ->where('almacenes.IDEmpresa', $request->input('IDEmpresa'))
            ->whereRaw('LOWER(compras.Estado) != ?', ['cancelada'])
            ->select(
                'compra_detalle.IDMovimiento',
                'compras.FechaRegistro',
                'compras.Serie',
                'compras.Folio',
                'proveedores.Nombre as NombreProveedor',
                'almacenes.Nombre as NombreAlmacen',
                'compra_detalle.Precio',
                'compra_detalle.DescuentoPorcentaje',
                'compra_detalle.Cantidad',
                'compra_detalle.Neto',
                'compra_detalle.Descuento'
            )
            ->orderByDesc('compras.FechaRegistro')
            ->orderByDesc('compra_detalle.IDMovimiento')
            ->get()
            ->map(function ($item) {
                $item->CostoUnitario = $item->Cantidad > 0
                    ? round(($item->Neto - $item->Descuento) / $item->Cantidad, 4)
                    : 0;

                return $item;
            });

        return ResponseHelper::success($historial, 'Historial de costos obtenido correctamente');
    }
}
