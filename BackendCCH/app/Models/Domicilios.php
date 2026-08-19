<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Domicilios extends Model
{
    protected $table = 'domicilios';
    protected $primaryKey = 'IDDomicilio';
    protected $fillable = [
        'Pais',
        'CodigoPostal',
        'Estado',
        'Municipio',
        'Ciudad',
        'Colonia',
        'Calle',
        'NumInterior',
        'NumExterior',
    ];

    protected $keyType = 'int';
    public $timestamps = true;
}
