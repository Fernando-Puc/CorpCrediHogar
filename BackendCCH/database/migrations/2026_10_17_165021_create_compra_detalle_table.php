<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('compra_detalle', function (Blueprint $table) {
            $table->id('IDMovimiento');
            $table->unsignedBigInteger('IDCompra');
            $table->unsignedBigInteger('IDProducto');
            $table->unsignedBigInteger('IDAlmacen');
            $table->decimal('Cantidad', 10, 2);
            $table->decimal('Precio', 12, 4);
            $table->decimal('DescuentoPorcentaje', 5, 2)->default(0);
            $table->decimal('TasaIVA', 5, 4)->default(0.16);
            $table->decimal('Neto', 12, 2);
            $table->decimal('Descuento', 12, 2)->default(0);
            $table->decimal('IVA', 12, 2);
            $table->decimal('Total', 12, 2);
            $table->timestamps();

            $table->foreign('IDCompra')->references('IDCompra')->on('compras');
            $table->foreign('IDProducto')->references('IDProducto')->on('productos');
            $table->foreign('IDAlmacen')->references('IDAlmacen')->on('almacenes');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('compra_detalle');
    }
};
