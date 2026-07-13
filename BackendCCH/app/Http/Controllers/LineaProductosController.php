<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Helpers\ResponseHelper;
use App\Models\Lineas;
use Illuminate\Support\Facades\Validator;

class LineaProductosController extends Controller
{
    //Obtener Linea de Productos
    public function ObtenerLineas()
    {
        $lineas = Lineas::all();
        return ResponseHelper::success($lineas, 'Lineas de producto obtenidas correctamente');
    }

    // Crear línea de productos
    public function CrearLinea(Request $request)
    {
        $validator = Validator::make(
            $request->all(),
            [
                'Nombre' => 'required|string|max:255|unique:linea_productos,Nombre',
            ]
        );

        if ($validator->fails()) {
            return ResponseHelper::error($validator->errors()->first(), 400);
        }

        $linea = new Lineas();
        $linea->Nombre = $request->input('Nombre');
        $linea->Activo = true;

        if ($linea->save()) {
            return ResponseHelper::success($linea, 'Línea o clasificación creada exitosamente', 201);
        } else {
            return ResponseHelper::error('Error al crear línea', 500);
        }
    }

    //Actualizar Linea
    public function ActualizarLinea(Request $request, $id)
    {
        $linea = Lineas::find($id);

        if (!$linea) {
            return ResponseHelper::error('Linea no encontrada', 404);
        }

        $validator = Validator::make($request->all(), [
            'Nombre' => 'required|string|max:255|unique:linea_productos,Nombre,' . $id . ',IDLinea'
        ]);

        if ($validator->fails()) {
            return ResponseHelper::error($validator->errors()->first(), 400);
        }

        $linea->Nombre = $request->input('Nombre');

        if ($linea->save()) {
            return ResponseHelper::success($linea, 'Linea actualizada correctamente');
        }

        return ResponseHelper::error('Error al actualizar linea', 500);
    }

    //Eliminar Linea
    public function EliminarLinea($id)
    {
        $linea = Lineas::findorFail($id);
        $linea->delete();

        return ResponseHelper::success($linea, 'Linea eliminada correctamente');
    }
}
