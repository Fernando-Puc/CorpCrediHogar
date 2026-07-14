<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Helpers\ResponseHelper;
use App\Models\UnidadMedida;
use Illuminate\Support\Facades\Validator;

class UnidadMedidaController extends Controller
{
    //Obtener Unidades de Medida
    public function ObtenerUnidades()
    {
        $unidadmedida = UnidadMedida::all();
        return ResponseHelper::success($unidadmedida, 'Unidades de medida obtenidos correctamente');
    }

    //Crear Unidades de Medida
    public function CrearUnidadMedida(Request $request)
    {
        $validator = Validator::make(
            $request->all(),
            [
                'Nombre' => 'required|string|max:255|unique:unidades_medida,Nombre',
            ]
        );

        if ($validator->fails()) {
            return ResponseHelper::error($validator->errors()->first(), 400);
        }

        $unidadmedida = new UnidadMedida();
        $unidadmedida->Nombre = $request->input('Nombre');
        $unidadmedida->Activo = true;

        if ($unidadmedida->save()) {
            return ResponseHelper::success($unidadmedida, 'Unidad de medida creada correctamente', 201);
        } else {
            return ResponseHelper::error('Error al crear linea', 500);
        }
    }

    //Actualizar Unidad de Medida
    public  function ActualizarUnidad(Request $request, $id)
    {
        $unidadmedida = UnidadMedida::find($id);

        if (!$unidadmedida) {
            return ResponseHelper::error('Unidad de medida no encontrada', 404);
        }

        $validator = Validator::make($request->all(), [
            'Nombre' => 'required|string|max:255|unique:unidades_medida,Nombre,' . $id . ',IDUnidadMedida'
        ]);

        if ($validator->fails()) {
            return ResponseHelper::error($validator->errors()->first(), 400);
        }

        $unidadmedida->Nombre = $request->input('Nombre');

        if ($unidadmedida->save()) {
            return ResponseHelper::success($unidadmedida, 'Unidad de medida actualizada correctamente');
        }

        return ResponseHelper::error('Error al actualizar unidad de medida', 500);
    }

    //Eliminar Unidad de Medida
    public function EliminarUnidad($id)
    {

        $unidadmedida = UnidadMedida::findorFail($id);
        $unidadmedida->delete();

        return ResponseHelper::success($unidadmedida, 'Unidad de medida eliminada correctamente');
    }
}
