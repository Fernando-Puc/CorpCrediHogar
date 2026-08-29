<?php

namespace App\Http\Controllers;
use App\Http\Controllers\Controller;

use App\Models\CodigoPostal;
use Illuminate\Http\JsonResponse;

class DomicilioController extends Controller
{
    public function buscarPorCP(string $cp): JsonResponse
    {
        if (!preg_match('/^\d{5}$/', $cp)) {
            return response()->json(['message' => 'El CP debe tener 5 dígitos'], 422);
        }
        $codigoPostal = CodigoPostal::with('colonias')->where('cp', $cp)->first();

        if (!$codigoPostal) {
            return response()->json(['message' => 'CP no encontrado'], 404);
        }
        return response()->json([
            'data' => [
                'cp' => $codigoPostal->cp,
                'estado' => $codigoPostal->estado,
                'municipio' => $codigoPostal->municipio,
                'ciudad' => $codigoPostal->ciudad ?? $codigoPostal->municipio,
                'colonias' => $codigoPostal->colonias->pluck('nombre')->unique()->values(),
            ],
        ]);
    }
}
