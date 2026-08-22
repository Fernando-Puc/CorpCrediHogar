<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('codigos_postales', function (Blueprint $table) {
            $table->id();
            $table->char('cp', 5)->unique();
            $table->string('estado', 100);
            $table->string('municipio', 150);
            $table->string('ciudad', 150)->nullable();
            $table->string('zona', 30)->nullable(); // Urbano / Rural / Semiurbano
            $table->timestamps();

            $table->index('estado');
            $table->index('municipio');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('codigos_postales');
    }
};
