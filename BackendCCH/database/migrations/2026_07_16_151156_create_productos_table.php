<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('productos', function (Blueprint $table) {
            $table->id('IDProducto');
            $table->string('Codigo');
            $table->string('Nombre');
            $table->unsignedBigInteger('IDLinea');
            $table->unsignedBigInteger('IDMarca');
            $table->unsignedBigInteger('IDUnidadMedida');
            $table->string('ClaveSAT');
            $table->date('FechaRegistro');
            $table->boolean('Activo')->default(true);
            $table->timestamps();

            $table->foreign('IDLinea')->references('IDLinea')->on('linea_productos');
            $table->foreign('IDMarca')->references('IDMarca')->on('marca_productos');
            $table->foreign('IDUnidadMedida')->references('IDUnidadMedida')->on('unidades_medida');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('productos');
    }
};
