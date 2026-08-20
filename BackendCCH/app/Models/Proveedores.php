<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Proveedores extends Model
{
    protected $table = 'proveedores';
    protected $primaryKey = 'IDProveedor';
    protected $fillable = [
        'Codigo',
        'Nombre',
        'RFC',
        'IDDomicilio',
        'FechaRegistro',
        'Activo',
    ];

    public function domicilio()
    {
        return $this->belongsTo(Domicilios::class, 'IDDomicilio', 'IDDomicilio');
    }
}
