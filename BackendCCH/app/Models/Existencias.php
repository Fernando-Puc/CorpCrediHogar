<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Existencias extends Model
{
    protected $table = 'existencias';
    protected $primaryKey = 'IDExistencia';

    protected $fillable = [
        'IDProducto',
        'IDAlmacen',
        'Existencia',
        'CostoPromedio',
        'UltimoCosto',
        'UltimaActualizacion',
    ];

    protected $casts = [
        'UltimaActualizacion' => 'datetime',
    ];

    public function producto()
    {
        return $this->belongsTo(Productos::class, 'IDProducto', 'IDProducto');
    }

    public function almacen()
    {
        return $this->belongsTo(Almacenes::class, 'IDAlmacen', 'IDAlmacen');
    }
}
