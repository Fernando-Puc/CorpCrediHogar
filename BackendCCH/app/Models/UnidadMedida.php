<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class UnidadMedida extends Model
{
    protected $table = 'unidades_medida';
    protected $primaryKey = 'IDUnidadMedida';
    protected $fillable = [
        'Nombre',
        'Activo',
    ];

    protected $keyTipe = 'int';
    public $timestamps = true;
}
