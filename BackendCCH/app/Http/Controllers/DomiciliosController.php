<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Helpers\ResponseHelper;
use App\Models\Domicilios;
use Illuminate\Support\Facades\Validator;

class DomiciliosController extends Controller
{
    //Obtener Domicilios
    public function ObtenerDomicilios()
    {
        $domicilios = Domicilios::all();
        return ResponseHelper::success($domicilios, 'Domicilios obtenidos correctamente');
    }


    //Crear Domicilio
    public function CrearDomicilio(Request $request)
    {
        $validator = Validator::make(
            $request->all(),
            [
                'Pais' => 'required|string|max:255|',
                'CodigoPostal' => 'required|string|max:255|',
                'Estado' => 'required|string|max:255|',
                'Municipio' => 'required|string|max:255|',
                'Ciudad' => 'required|string|max:255|',
                'Colonia' => 'required|string|max:255|',
                'Calle' => 'required|string|max:255|',
                'NumInterior' => 'required|string|max:255|',
                'NumExterior' => 'required|string|max:255|',
            ]
        );

        if ($validator->fails()) {
            return ResponseHelper::error($validator->errors()->first(), 400);
        }

        $domicilio = new Domicilios();
        $domicilio->Pais = $request->input('Pais');
        $domicilio->CodigoPostal = $request->input('CodigoPostal');
        $domicilio->Estado = $request->input('Estado');
        $domicilio->Municipio = $request->input('Municipio');
        $domicilio->Ciudad = $request->input('Ciudad');
        $domicilio->Colonia = $request->input('Colonia');
        $domicilio->Calle = $request->input('Calle');
        $domicilio->NumInterior = $request->input('NumInterior');
        $domicilio->NumExterior = $request->input('NumExterior');

        if ($domicilio->save()) {
            return ResponseHelper::success($domicilio, 'Domicilio Registrado exitosamente', 201);
        } else {
            return ResponseHelper::error('Error al registrar el domicilio', 500);
        }
    }

    //Actualizar Domicilio
    public function ActualizarDomicilio(Request $request, $id)
    {
        $domicilio = Domicilios::find($id);

        if (!$domicilio) {
            return ResponseHelper::error('Domicilio no encontrado', 404);
        }

        $validator = Validator::make($request->all(), [
            'Pais' => 'required|string|max:255|',
            'CodigoPostal' => 'required|string|max:255|',
            'Estado' => 'required|string|max:255|',
            'Municipio' => 'required|string|max:255|',
            'Ciudad' => 'required|string|max:255|',
            'Colonia' => 'required|string|max:255|',
            'Calle' => 'required|string|max:255|',
            'NumInterior' => 'required|string|max:255|',
            'NumExterior' => 'required|string|max:255|',
        ]);

        if ($validator->fails()) {
            return ResponseHelper::error($validator->errors()->first(), 400);
        }

        $domicilio->Pais = $request->input('Pais');
        $domicilio->CodigoPostal = $request->input('CodigoPostal');
        $domicilio->Estado = $request->input('Estado');
        $domicilio->Municipio = $request->input('Municipio');
        $domicilio->Ciudad = $request->input('Ciudad');
        $domicilio->Colonia = $request->input('Colonia');
        $domicilio->Calle = $request->input('Calle');
        $domicilio->NumInterior = $request->input('NumInterior');
        $domicilio->NumExterior = $request->input('NumExterior');

        if ($domicilio->save()) {
            return ResponseHelper::success($domicilio, 'Domicilio actualizado correctamente');
        }

        return ResponseHelper::error('Error al actualizar el domicilio', 500);
    }

    //Ver Domicilio
    public function VerDomicilio($id)
    {
        $domicilio = Domicilios::find($id);
        $domicilioFormateado = [
            'IDDomicilio' => $domicilio->IDDomicilio,
            'Pais' => $domicilio->Pais,
            'CodigoPostal' => $domicilio->CodigoPostal,
            'Estado' => $domicilio->Estado,
            'Municipio' => $domicilio->Municipio,
            'Ciudad' => $domicilio->Ciudad,
            'Colonia' => $domicilio->Colonia,
            'Calle' => $domicilio->Calle,
            'NumInterior' => $domicilio->NumInterior,
            'NumExterior' => $domicilio->NumExterior
        ];
        return ResponseHelper::success($domicilioFormateado, "Detalles del domicilio obtenidos correctamente");
    }

    //Eliminar Domicilio
    public function EliminarDomicilio($id)
    {
        $domicilio = Domicilios::findOrFail($id);
        $domicilio->delete();

        return ResponseHelper::success($domicilio, 'Domicilio eliminado correctamente');
    }
}
