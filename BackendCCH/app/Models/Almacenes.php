<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Almacenes extends Model
{
    protected $table = 'almacenes';
    protected $primaryKey = 'IDAlmacen';
    public $timestamps = true;
    protected $fillable = [
        'IDEmpresa',
        'IDSucursal',
        'Codigo',
        'Nombre',
        'FechaRegistro',
        'Activo',
    ];

    public function empresa()
    {
        return $this->belongsTo(Empresas::class, 'IDEmpresa', 'IDEmpresa');
    }

    public function sucursal()
    {
        return $this->belongsTo(Sucursales::class, 'IDSucursal', 'IDSucursal');
    }
}
