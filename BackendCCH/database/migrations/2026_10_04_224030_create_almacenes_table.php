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
        Schema::create('almacenes', function (Blueprint $table) {
            $table->id('IDAlmacen');
            $table->unsignedBigInteger('IDEmpresa');
            $table->unsignedBigInteger('IDSucursal');
            $table->string('Codigo')->unique();
            $table->string('Nombre');
            $table->string('FechaRegistro');
            $table->string('Activo')->default(true);
            $table->timestamps();

            $table->foreign('IDEmpresa')->references('IDEmpresa')->on('empresas');
            $table->foreign('IDSucursal')->references('IDSucursal')->on('sucursales');
            $table->unique(['IDEmpresa', 'IDSucursal']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('almacenes');
    }
};
