<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Colonia extends Model
{
    protected $table = 'colonias';

    public $timestamps = false;

    protected $fillable = ['cp', 'nombre', 'tipo'];

    public function codigoPostal(): BelongsTo
    {
        return $this->belongsTo(CodigoPostal::class, 'cp', 'cp');
    }
}
