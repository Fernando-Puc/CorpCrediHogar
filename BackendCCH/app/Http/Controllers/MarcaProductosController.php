<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Helpers\ResponseHelper;
use App\Models\Marcas;
use Illuminate\Support\Facades\Validator;

class MarcaProductosController extends Controller
{
    //Obtener marcas de Productos
    public function ObtenerMarcas()
    {
        $marcas = Marcas::all();
        return ResponseHelper::success($marcas, 'Marcas de productos obtenidas correctamente');
    }

    //Crear Marcas de Productos
    public function CrearMarca(Request $request)
    {
        $validator = Validator::make(
            $request->all(),
            [
                'Nombre' => 'required|string|max:255|unique:marca_productos,Nombre',
            ]
        );

        if ($validator->fails()) {
            return ResponseHelper::error($validator->errors()->first(), 400);
        }

        $marca = new Marcas();
        $marca->Nombre = $request->input('Nombre');
        $marca->Activo = true;

        if ($marca->save()) {
            return ResponseHelper::success($marca, 'Marca creada correctamente', 201);
        } else {
            return ResponseHelper::error('Error al crear la marca', 500);
        }
    }

    //Actualizar Marcas
    public function ActualizarMarca(Request $request, $id)
    {
        $marca = Marcas::find($id);

        if (!$marca) {
            return ResponseHelper::error('Marca no encontrada', 404);
        }

        $validator = Validator::make(
            $request->all(),
            [
                'Nombre' => 'required|string|max:255|unique:marca_productos,Nombre,' . $id . ',IDMarca'
            ]
        );

        if ($validator->fails()) {
            return ResponseHelper::error($validator->errors()->first(), 400);
        }

        $marca->Nombre = $request->input('Nombre');

        if ($marca->save()) {
            return ResponseHelper::success($marca, 'Marca actualizada correctamente');
        }

        return ResponseHelper::error('Error al actualizar marca', 500);
    }

    //Eliminar Marca
    public function EliminarMarca($id)
    {
        $marca = Marcas::findOrFail($id);
        $marca->delete();

        return ResponseHelper::success($marca, 'Marca eliminada correctmaente');
    }
}
