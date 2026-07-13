<?php

namespace App\Models;
use Illuminate\Database\Eloquent\Model;

class Lineas extends Model
{
    protected $table = 'linea_productos';

    protected $primaryKey = 'IDLinea';

    protected $fillable= [
        'Nombre',
        'Activo',
    ];

    protected $keyType = 'int';
    public $timestamps = true;
}
