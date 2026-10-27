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
        Schema::create('compras', function (Blueprint $table) {
            $table->id('IDCompra');
            $table->string('Serie', 10);
            $table->string('Folio');
            $table->unsignedBigInteger('IDProveedor');
            $table->date('FechaRegistro');
            $table->string('Concepto');
            $table->decimal('TotalProductos', 10, 2)->default(0);
            $table->decimal('Subtotal', 12, 2)->default(0);
            $table->decimal('Descuentos', 12, 2)->default(0);
            $table->decimal('Impuestos', 12, 2)->default(0);
            $table->decimal('Total', 12, 2)->default(0);
            $table->enum('Estado', ['registrada', 'cancelada'])->default('registrada');
            $table->timestamps();

            $table->unique(['Serie', 'Folio']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('compras');
    }
};
