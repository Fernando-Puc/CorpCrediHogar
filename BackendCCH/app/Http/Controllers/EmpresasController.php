<?php

namespace App\Http\Controllers;
use App\Models\Empresas;
use App\Helpers\ResponseHelper;

class EmpresasController extends Controller
{
    //Obtener todas las empresas
    public function ObtenerEmpresas()
    {
        $empresas = Empresas::all();

        return ResponseHelper::success($empresas, 'Empresas obtenidas correctamente');

    }
}
