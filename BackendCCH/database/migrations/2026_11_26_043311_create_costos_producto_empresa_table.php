
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('costos_producto_empresa', function (Blueprint $table) {
            $table->id('IDCosto');

            $table->unsignedBigInteger('IDProducto');
            $table->unsignedBigInteger('IDEmpresa');
            $table->decimal('CostoPromedio', 12, 4)->default(0);
            $table->decimal('UltimoCosto', 12, 4)->default(0);
            $table->timestamp('UltimaActualizacion')->nullable();
            $table->timestamps();
            $table->foreign('IDProducto')
                ->references('IDProducto')
                ->on('productos');

            $table->foreign('IDEmpresa')
                ->references('IDEmpresa')
                ->on('empresas');

            $table->unique(
                ['IDProducto', 'IDEmpresa'],
                'uq_producto_empresa'
            );
        });

        // Obtener los costos actuales agrupados por producto y empresa.
        $costos = DB::table('existencias')
            ->join('almacenes', 'existencias.IDAlmacen', '=', 'almacenes.IDAlmacen')
            ->select(
                'existencias.IDProducto',
                'almacenes.IDEmpresa'
            )
            ->selectRaw('SUM(existencias.Existencia) as ExistenciaTotal')
            ->selectRaw('SUM(existencias.Existencia * existencias.CostoPromedio) as ValorInventario')
            ->groupBy(
                'existencias.IDProducto',
                'almacenes.IDEmpresa'
            )
            ->get();

        foreach ($costos as $item) {

            $existenciaTotal = (float) $item->ExistenciaTotal;

            // Costo promedio ponderado de todos los almacenes.
            $costoPromedio = $existenciaTotal > 0
                ? round((float) $item->ValorInventario / $existenciaTotal, 4)
                : 0;

            // Buscar la compra más reciente del producto en la empresa.
            $ultimaCompra = DB::table('compra_detalle')
                ->join('compras', 'compra_detalle.IDCompra', '=', 'compras.IDCompra')
                ->join('almacenes', 'compra_detalle.IDAlmacen', '=', 'almacenes.IDAlmacen')
                ->where('compra_detalle.IDProducto', $item->IDProducto)
                ->where('almacenes.IDEmpresa', $item->IDEmpresa)
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

            $ultimoCosto = $ultimaCompra
                ? round(
                    ((float) $ultimaCompra->Neto - (float) $ultimaCompra->Descuento)
                        / (float) $ultimaCompra->Cantidad,
                    4
                )
                : 0;

            DB::table('costos_producto_empresa')->insert([
                'IDProducto' => $item->IDProducto,
                'IDEmpresa' => $item->IDEmpresa,
                'CostoPromedio' => $costoPromedio,
                'UltimoCosto' => $ultimoCosto,
                'UltimaActualizacion' => now(),
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }
    }

    public function down(): void
    {
        Schema::dropIfExists('costos_producto_empresa');
    }
};
