<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Sucursales extends Model
{
    protected $table = 'sucursales';
    protected $primaryKey = 'IDSucursal';

    protected $fillable = [
        'Codigo',
        'Nombre',
        'IDEmpresa',
        'IDDomicilio',
        'FechaRegistro',
        'Activo',
    ];

    public function empresa()
    {
        return $this->belongsTo(Empresas::class, 'IDEmpresa', 'IDEmpresa');
    }

    public function domicilio()
    {
        return $this->belongsTo(Domicilios::class, 'IDDomicilio', 'IDDomicilio');
    }

    protected $keyType = 'int';
    public $timestamps = true;
}
