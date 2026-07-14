<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Marcas extends Model
{
    protected $table = 'marca_productos';
    protected $primaryKey = 'IDMarca';
    protected $fillable = [
        'Nombre',
        'Activo',
    ];
    protected $keyType = 'int';
    public $timestamps = true;
}
