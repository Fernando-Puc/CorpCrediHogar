<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('colonias', function (Blueprint $table) {
            $table->id();
            $table->char('cp', 5);
            $table->string('nombre', 150);
            $table->string('tipo', 60)->nullable(); // Colonia, Fraccionamiento, Unidad habitacional, etc.

            $table->index('cp');
            $table->foreign('cp')->references('cp')->on('codigos_postales')->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('colonias');
    }
};
