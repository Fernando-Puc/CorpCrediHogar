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
        Schema::create('domicilios', function (Blueprint $table) {
            $table->id('IDDomicilio');
            $table->string('Pais');
            $table->string('CodigoPostal');
            $table->string('Estado');
            $table->string('Municipio');
            $table->string('Ciudad');
            $table->String('Colonia');
            $table->String('Calle');
            $table->String('NumInterior');
            $table->String('NumExterior');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('domicilios');
    }
};
