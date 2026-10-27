<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Compras extends Model
{
    protected $table = 'compras';
    protected $primaryKey = 'IDCompra';

    protected $fillable = [
        'Serie',
        'Folio',
        'IDProveedor',
        'FechaRegistro',
        'Concepto',
        'TotalProductos',
        'Subtotal',
        'Descuentos',
        'Impuestos',
        'Total',
        'Estado',
    ];

    public function detalle()
    {
        return $this->hasMany(CompraDetalle::class, 'IDCompra', 'IDCompra');
    }
}
