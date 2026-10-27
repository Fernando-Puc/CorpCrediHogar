<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('existencias', function (Blueprint $table) {
            $table->id('IDExistencia');
            $table->unsignedBigInteger('IDProducto');
            $table->unsignedBigInteger('IDAlmacen');
            $table->decimal('Existencia', 10, 2)->default(0);
            $table->decimal('CostoPromedio', 12, 4)->default(0);
            $table->decimal('UltimoCosto', 12, 4)->default(0);
            $table->timestamp('UltimaActualizacion')->nullable();
            $table->timestamps();

            $table->foreign('IDProducto')->references('IDProducto')->on('productos');
            $table->foreign('IDAlmacen')->references('IDAlmacen')->on('almacenes');
            $table->unique(['IDAlmacen', 'IDProducto']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('existencias');
    }
};
