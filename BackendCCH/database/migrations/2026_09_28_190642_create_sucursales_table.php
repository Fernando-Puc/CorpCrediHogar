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
        Schema::create('sucursales', function (Blueprint $table) {
            $table->id('IDSucursal');
            $table->string('Codigo');
            $table->string('Nombre');
            $table->unsignedBigInteger('IDDomicilio');
            $table->date('FechaRegistro');
            $table->boolean('Activo')->default(true);
            $table->timestamps();

            $table->foreign('IDDomicilio')->references('IDDomicilio')->on('domicilios');
            $table->unique(['Codigo']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('sucursales');
    }
};
