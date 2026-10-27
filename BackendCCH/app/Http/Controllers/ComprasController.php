<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Compras;
use App\Models\CompraDetalle;
use App\Models\Existencias;
use App\Helpers\ResponseHelper;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;

class ComprasController extends Controller
{
    //Obtener Compras
    public function ObtenerCompras()
    {
        $compras = Compras::orderByDesc('FechaRegistro')->orderByDesc('IDCompra')->get();

        return ResponseHelper::success($compras, 'Compras obtenidas correctamente');
    }

    //Ver Compra
    public function VerCompra($id)
    {
        $compra = Compras::with(['detalle.producto', 'detalle.almacen'])->findOrFail($id);

        return ResponseHelper::success($compra, 'Detalles de compra obtenidos correctamente');
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
                'FechaRegistro' => 'required|date',
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
                    'FechaRegistro' => $request->input('FechaRegistro'),
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

                    //Costo real por unidad con descuento y sin iva.

                    $costoUnitario = ($neto - $descuento) / $m['Cantidad'];

                    //Funcion para bloquear la filapara que dos compras simultaneas no pisen el promedio.
                    $existencia = Existencias::where('IDAlmacen', $m['IDAlmacen'])
                        ->Where('IDProducto', $m['IDProducto'])->lockForUpdate()->first();

                    if (!$existencia) {
                        $existencia = new Existencias([
                            'IDAlmacen' => $m['IDAlmacen'],
                            'IDProducto' => $m['IDProducto'],
                            'Existencia' => 0,
                            'CostoPromedio' => 0,
                            'UltimoCosto' => 0,
                        ]);
                    }

                    $cantidadActual = (float) $existencia->Existencia;
                    $nuevaCantidad = $cantidadActual + $m['Cantidad'];

                    $existencia->CostoPromedio = round(
                        (($cantidadActual * (float) $existencia->CostoPromedio) + ($m['Cantidad'] * $costoUnitario)) / $nuevaCantidad,
                        4
                    );

                    $existencia->UltimoCosto = round($costoUnitario, 4);
                    $existencia->Existencia = $nuevaCantidad;
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

    //Revertir movimiento de compra
    private function RevertirMovimientos(Compras $compra)
    {
        foreach ($compra->detalle()->orderByDesc('IDMovimiento')->get() as $d) {
            $posterior = CompraDetalle::where('IDProducto', $d->IDProducto)
                ->where('IDAlmacen', $d->IDAlmacen)
                ->where('IDMovimiento', '>', $d->IDMovimiento)
                ->where('IDCompra', '!=', $compra->IDCompra)
                ->whereHas('compra', fn($q) => $q->where('Estado', '!=', 'cancelada'))
                ->exists();

            if ($posterior) {
                throw new \Exception('Existen compras posteriores de este producto en el mismo almacén. Cancelar o editar primero las más recientes');
            }

            $existencia = Existencias::where('IDProducto', $d->IDProducto)
                ->where('IDAlmacen', $d->IDAlmacen)
                ->lockForUpdate()
                ->first();

            //La existencia debe alcanzar para revertir
            if (!$existencia || (float) $existencia->Existencia < (float) $d->Cantidad) {
                throw new \Exception('La existencia actual no alcanza para modificar la compra, el producto ya tuvo movimientos');
            }

            $costoUnitario = ($d->Neto - $d->Descuento) / $d->Cantidad;
            $restante = (float) $existencia->Existencia - (float) $d->Cantidad;

            //revertir costo promedio
            $existencia->CostoPromedio = $restante > 0
                ? round((((float) $existencia->Existencia * (float) $existencia->CostoPromedio) - ($d->Cantidad * $costoUnitario)) / $restante, 4)
                : 0;

            //Ultimo costo de la compra anterior, en caso de que haya.

            $anterior = CompraDetalle::where('IDProducto', $d->IDProducto)
                ->where('IDAlmacen', $d->IDAlmacen)
                ->where('IDMovimiento', '<', $d->IDMovimiento)
                ->where('IDCompra', '!=', $compra->IDCompra)
                ->whereHas('compra', fn($q) => $q->where('Estado', '!=', 'cancelada'))
                ->orderByDesc('IDMovimiento')
                ->first();

            $existencia->UltimoCosto = $anterior
                ? round(($anterior->Neto - $anterior->Descuento) / $anterior->Cantidad, 4)
                : 0;

            $existencia->Existencia = $restante;
            $existencia->UltimaActualizacion = now();
            $existencia->save();
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

            $costoUnitario = ($neto - $descuento) / $m['Cantidad'];

            $existencia = Existencias::where('IDAlmacen', $m['IDAlmacen'])
                ->where('IDProducto', $m['IDProducto'])
                ->lockForUpdate()
                ->first();

            if (!$existencia) {
                $existencia = new Existencias([
                    'IDAlmacen' => $m['IDAlmacen'],
                    'IDProducto' => $m['IDProducto'],
                    'Existencia' => 0,
                    'CostoPromedio' => 0,
                    'UltimoCosto' => 0,
                ]);
            }

            $cantidadActual = (float) $existencia->Existencia;
            $nuevaCantidad = $cantidadActual + $m['Cantidad'];

            $existencia->CostoPromedio = round(
                (($cantidadActual * (float) $existencia->CostoPromedio) + ($m['Cantidad'] * $costoUnitario)) / $nuevaCantidad,
                4
            );

            $existencia->UltimoCosto = round($costoUnitario, 4);
            $existencia->Existencia = $nuevaCantidad;
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
}
