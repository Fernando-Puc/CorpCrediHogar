<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Productos extends Model
{
    protected $table = 'productos';
    protected $primaryKey = 'IDProducto';
    protected $fillable = [
        'Codigo',
        'Nombre',
        'IDLinea',
        'IDMarca',
        'IDUnidadMedida',
        'ClaveSAT',
        'FechaRegistro',
        'Activo',
    ];

    public function linea()
    {
        return $this->belongsTo(Lineas::class, 'IDLinea', 'IDLinea');
    }

    public function marca()
    {
        return $this->belongsTo(Marcas::class, 'IDMarca', 'IDMarca');
    }

    public function unidadMedida()
    {
        return $this->belongsTo(UnidadMedida::class, 'IDUnidadMedida', 'IDUnidadMedida');
    }
}
