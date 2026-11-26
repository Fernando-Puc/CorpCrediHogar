<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CostoProductoEmpresa extends Model
{
    protected $table = 'costos_producto_empresa';

    protected $primaryKey = 'IDCosto';

    protected $fillable = [
        'IDProducto',
        'IDEmpresa',
        'CostoPromedio',
        'UltimoCosto',
        'UltimaActualizacion',
    ];

    protected $casts = [
        'UltimaActualizacion' => 'datetime',
    ];

    public function producto()
    {
        return $this->belongsTo(
            Productos::class,
            'IDProducto',
            'IDProducto'
        );
    }

    public function empresa()
    {
        return $this->belongsTo(
            Empresas::class,
            'IDEmpresa',
            'IDEmpresa'
        );
    }
}
