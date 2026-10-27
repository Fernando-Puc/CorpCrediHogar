<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CompraDetalle extends Model
{
    protected $table = 'compra_detalle';
    protected $primaryKey = 'IDMovimiento';

    protected $fillable = [
        'IDCompra',
        'IDProducto',
        'IDAlmacen',
        'Cantidad',
        'Precio',
        'DescuentoPorcentaje',
        'TasaIVA',
        'Neto',
        'Descuento',
        'IVA',
        'Total',
    ];

    public function compra()
    {
        return $this->belongsTo(Compras::class, 'IDCompra', 'IDCompra');
    }

    public function producto()
    {
        return $this->belongsTo(Productos::class, 'IDProducto', 'IDProducto');
    }

    public function almacen()
    {
        return $this->belongsTo(Almacenes::class, 'IDAlmacen', 'IDAlmacen');
    }
}
