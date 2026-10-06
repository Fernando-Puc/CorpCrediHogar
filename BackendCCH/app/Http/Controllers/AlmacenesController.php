<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Helpers\ResponseHelper;
use App\Models\Almacenes;
use Illuminate\Support\Facades\Validator;

class AlmacenesController extends Controller
{
    //obtener almacenes registrados
    public function ObtenerAlmacenes()
    {
        $almacenes = Almacenes::with([
            'empresa',
            'sucursal'
        ])->get();

        $almacenesFormateados = $almacenes->map(function ($almacen) {
            return [
                'IDAlmacen' => $almacen->IDAlmacen,
                'Codigo' => $almacen->Codigo,
                'Nombre' => $almacen->Nombre,
                'empresa' => [
                    'IDEmpresa' => $almacen->empresa?->IDEmpresa,
                    'Folio' => $almacen->empresa?->Folio,
                    'Nombre' => $almacen->empresa?->Nombre
                ],
                'sucursal' => [
                    'IDSucursal' => $almacen->sucursal?->IDSucursal,
                    'Codigo' => $almacen->sucursal?->Codigo,
                    'Nombre' => $almacen->sucursal?->Nombre
                ],

                'FechaRegistro'  => $almacen->FechaRegistro,
                'Activo' => $almacen->Activo,
            ];
        });

        return ResponseHelper::success($almacenesFormateados, 'Catálogo de almacenes obtenido correctamente');
    }

    //Ver Almacen
    public function VerAlmacen($id)
    {
        $almacen = Almacenes::with('empresa', 'sucursal')->findOrFail($id);
        $almacenFormateado = [
            'IDAlmacen' => $almacen->IDAlmacen,
            'Codigo' => $almacen->Codigo,
            'Nombre' => $almacen->Nombre,
            'empresa' => [
                'IDEmpresa' => $almacen->empresa?->IDEmpresa,
                'Folio' => $almacen->empresa?->Folio,
                'Nombre' => $almacen->empresa?->Nombre
            ],
            'sucursal' => [
                'IDSucursal' => $almacen->sucursal?->IDSucursal,
                'Codigo' => $almacen->sucursal?->Codigo,
                'Nombre' => $almacen->sucursal?->Nombre
            ],

            'FechaRegistro'  => $almacen->FechaRegistro,
            'Activo' => $almacen->Activo,
        ];

        return ResponseHelper::success($almacenFormateado, "Detalles del almacen obtenidos correctamente");
    }

    //Crear Sucursal
    public function CrearAlmacen(Request $request)
    {
        $validator = Validator::make(
            $request->all(),
            [
                'IDEmpresa' => 'required|exists:empresas,IDEmpresa',
                'IDSucursal' => 'required|exists:sucursales,IDSucursal',
                'Codigo' => 'required|string|max:100|unique:almacenes,Codigo',
                'Nombre' => 'required|string|max:255'
            ]
        );

        if ($validator->fails()) {
            return ResponseHelper::error($validator->errors()->first(), 400);
        }

        $almacen = new Almacenes();
        $almacen->IDEmpresa = $request->input('IDEmpresa');
        $almacen->IDSucursal = $request->input('IDSucursal');
        $almacen->Codigo = $request->input('Codigo');
        $almacen->Nombre = $request->input('Nombre');
        $almacen->FechaRegistro = now()->toDateString();
        $almacen->Activo = true;

        if ($almacen->save()) {
            return ResponseHelper::success($almacen, 'Almacen registrado exitosamente', 201);
        } else {
            return ResponseHelper::error('Error al registrar el almacen', 500);
        }
    }


    //Actualizar almacen
    public function ActualizarAlmacen(Request $request, $id)
    {
        $almacen = Almacenes::find($id);

        if (!$almacen) {
            return ResponseHelper::error('Almacen no encontrado', 404);
        }

        $validator = Validator::make($request->all(), [

            'Codigo' => 'required|string|max:100|unique:almacenes,Codigo',
            'Nombre' => 'required|string|max:255'
        ]);

        if ($validator->fails()) {
            return ResponseHelper::error($validator->errors()->first(), 400);
        }

        $almacen->Codigo = $request->input('Codigo');
        $almacen->Nombre = $request->input('Nombre');

        if ($almacen->save()) {
            return ResponseHelper::success($almacen, 'Almacen actualizado correctamente');
        }

        return ResponseHelper::error('Error al actualizar el almacen', 500);
    }

    //Eliminar Almacen
    public function EliminarAlmacen($id)
    {
        $almacen = Almacenes::findOrFail($id);
        $almacen->delete();

        return ResponseHelper::success('Almacen eliminado correctamente');
    }
}
