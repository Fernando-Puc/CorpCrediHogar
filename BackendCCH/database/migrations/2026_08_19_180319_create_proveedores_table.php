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
        Schema::create('proveedores', function (Blueprint $table) {
            $table->id('IDProveedor');
            $table->string('Codigo');
            $table->string('Nombre');
            $table->string('RFC');
            $table->unsignedBigInteger('IDDomicilio');
            $table->date('FechaRegistro');
            $table->boolean('Activo')->default(true);
            $table->timestamps();

            $table->foreign('IDDomicilio')->references('IDDomicilio')->on('domicilios');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('proveedores');
    }
};
