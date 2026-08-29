<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class CodigoPostal extends Model
{
    protected $table = 'codigos_postales';

    protected $fillable = ['cp', 'estado', 'municipio', 'ciudad', 'zona'];

    protected $primaryKey = 'id';

    public function colonias(): HasMany
    {
        return $this->hasMany(Colonia::class, 'cp', 'cp');
    }
}
