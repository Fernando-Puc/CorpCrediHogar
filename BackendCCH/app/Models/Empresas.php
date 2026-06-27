<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Empresas extends Model
{
    protected $table = 'empresas';

    protected $prymaryKey= 'IDEmpresa';

    protected $fillable= [
        'Folio',
        'Nombre',
    ];

    protected $keyType = 'int';
    public $timestamps = true;

}
