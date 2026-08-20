<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Proveedores;
use App\Models\Domicilios;
use App\Helpers\ResponseHelper;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;

class ProveedoresController extends Controller
{
    //Obtener Proveedores
    public function ObtenerProveedores()
    {
        $proveedores = Proveedores::with([
            'domicilio'
        ])->get();

        $proveedoresFormateados = $proveedores->map(function ($proveedor) {
            return [
                'IDProveedor' => $proveedor->IDProveedor,
                'Codigo' => $proveedor->Codigo,
                'Nombre' => $proveedor->Nombre,
                'RFC' => $proveedor->RFC,

                'domicilio' => [
                    'id' => $proveedor->domicilio?->IDDomicilio,
                    'pais' => $proveedor->domicilio?->Pais,
                    'codigoPostal' => $proveedor->domicilio?->CodigoPostal,
                    'estado' => $proveedor->domicilio?->Estado,
                    'municipio' => $proveedor->domicilio?->Municipio,
                    'ciudad' => $proveedor->domicilio?->Ciudad,
                    'colonia' => $proveedor->domicilio?->Colonia,
                    'calle' => $proveedor->domicilio?->Calle,
                    'numInterior' => $proveedor->domicilio?->NumInterior,
                    'numExterior' => $proveedor->domicilio?->NumExterior,
                ],

                'FechaRegistro' => $proveedor->FechaRegistro,
                'Activo' => $proveedor->Activo,
            ];
        });

        return ResponseHelper::success(
            $proveedoresFormateados,
            'Proveedores obtenidos correctamente'
        );
    }


    //Crear Proveedor
    public function CrearProveedor(Request $request)
    {
        $validator = Validator::make(
            $request->all(),
            [
                //Proveedor
                'Codigo' => 'required|string|max:255|unique:proveedores,Codigo',
                'Nombre' => 'required|string|max:255',
                'RFC' => 'required|string|max:255',

                //Domicilio
                'domicilio.Pais' => 'required|string|max:255',
                'domicilio.CodigoPostal' => 'required|string|max:255',
                'domicilio.Estado' => 'required|string|max:255',
                'domicilio.Municipio' => 'required|string|max:255',
                'domicilio.Ciudad' => 'required|string|max:255',
                'domicilio.Colonia' => 'required|string|max:255',
                'domicilio.Calle' => 'required|string|max:255',
                'domicilio.NumInterior' => 'required|string|max:255',
                'domicilio.NumExterior' => 'required|string|max:255',
            ]
        );

        if ($validator->fails()) {
            return ResponseHelper::error(
                $validator->errors()->first(),
                400
            );
        }

        try {
            $proveedor = DB::transaction(function () use ($request) {
                //Crear domicilio
                $domicilio = new Domicilios();
                $domicilio->Pais = $request->input('domicilio.Pais');
                $domicilio->CodigoPostal = $request->input('domicilio.CodigoPostal');
                $domicilio->Estado = $request->input('domicilio.Estado');
                $domicilio->Municipio = $request->input('domicilio.Municipio');
                $domicilio->Ciudad = $request->input('domicilio.Ciudad');
                $domicilio->Colonia = $request->input('domicilio.Colonia');
                $domicilio->Calle = $request->input('domicilio.Calle');
                $domicilio->NumInterior = $request->input('domicilio.NumInterior');
                $domicilio->NumExterior = $request->input('domicilio.NumExterior');

                $domicilio->save();


                //Crear proveedor
                $proveedor = new Proveedores();
                $proveedor->Codigo = $request->input('Codigo');
                $proveedor->Nombre = $request->input('Nombre');
                $proveedor->RFC = $request->input('RFC');
                $proveedor->IDDomicilio = $domicilio->IDDomicilio;
                $proveedor->FechaRegistro = now()->toDateString();
                $proveedor->Activo = true;
                $proveedor->save();
                $proveedor->load('domicilio');
                return $proveedor;
            });


            return ResponseHelper::success(
                $proveedor,
                'Proveedor registrado exitosamente',
                201
            );
        } catch (\Exception $e) {

            return ResponseHelper::error(
                'Error al registrar el proveedor: ' . $e->getMessage(),
                500
            );
        }
    }
    //Actualizar Proveedor
    public function ActualizarProveedor(Request $request, $id)
    {
        $proveedor = Proveedores::with('domicilio')->find($id);
        if (!$proveedor) {
            return ResponseHelper::error('Proveedor no encontrado', 404);
        }
        $validator = Validator::make(
            $request->all(),
            [
                //Proveedor
                'Codigo' => [
                    'required',
                    'string',
                    'max:255',
                    Rule::unique('proveedores', 'Codigo')->ignore($proveedor->IDProveedor, 'IDProveedor'),
                ],

                'Nombre' => 'required|string|max:255',
                'RFC' => 'required|string|max:255',

                //Domicilio
                'domicilio.Pais' => 'required|string|max:255',
                'domicilio.CodigoPostal' => 'required|string|max:255',
                'domicilio.Estado' => 'required|string|max:255',
                'domicilio.Municipio' => 'required|string|max:255',
                'domicilio.Ciudad' => 'required|string|max:255',
                'domicilio.Colonia' => 'required|string|max:255',
                'domicilio.Calle' => 'required|string|max:255',
                'domicilio.NumInterior' => 'required|string|max:255',
                'domicilio.NumExterior' => 'required|string|max:255',
            ]
        );

        if ($validator->fails()) {
            return ResponseHelper::error($validator->errors()->first(), 400);
        }

        try {
            DB::transaction(function () use ($request, $proveedor) {
                //Actualizar Domicilio
                $domicilio = $proveedor->domicilio;
                if (!$domicilio) {
                    throw new \Exception(
                        'El proveedor no tiene un domicilio asociado'
                    );
                }

                $domicilio->Pais = $request->input('domicilio.Pais');
                $domicilio->CodigoPostal = $request->input('domicilio.CodigoPostal');
                $domicilio->Estado = $request->input('domicilio.Estado');
                $domicilio->Municipio = $request->input('domicilio.Municipio');
                $domicilio->Ciudad = $request->input('domicilio.Ciudad');
                $domicilio->Colonia = $request->input('domicilio.Colonia');
                $domicilio->Calle = $request->input('domicilio.Calle');
                $domicilio->NumInterior = $request->input('domicilio.NumInterior');
                $domicilio->NumExterior = $request->input('domicilio.NumExterior');
                $domicilio->save();

                //Actualizar Proveedor
                $proveedor->Codigo = $request->input('Codigo');
                $proveedor->Nombre = $request->input('Nombre');
                $proveedor->RFC = $request->input('RFC');
                $proveedor->save();
            });

            $proveedor->load('domicilio');

            return ResponseHelper::success($proveedor, 'Proveedor actualizado correctamente');
        } catch (\Exception $e) {
            return ResponseHelper::error('Error al actualizar el proveedor: ' . $e->getMessage(), 500);
        }
    }

    //Ver Proveedor
    public function VerProveedor($id)
    {
        $proveedor = Proveedores::with('domicilio')->find($id);
        if (!$proveedor) {
            return ResponseHelper::error('Proveedor no encontrado', 404);
        }
        $proveedorFormateado = [
            'IDProveedor' => $proveedor->IDProveedor,
            'Codigo' => $proveedor->Codigo,
            'Nombre' => $proveedor->Nombre,
            'RFC' => $proveedor->RFC,
            'domicilio' => [
                'IDDomicilio' => $proveedor->domicilio?->IDDomicilio,
                'Pais' => $proveedor->domicilio?->Pais,
                'CodigoPostal' => $proveedor->domicilio?->CodigoPostal,
                'Estado' => $proveedor->domicilio?->Estado,
                'Municipio' => $proveedor->domicilio?->Municipio,
                'Ciudad' => $proveedor->domicilio?->Ciudad,
                'Colonia' => $proveedor->domicilio?->Colonia,
                'Calle' => $proveedor->domicilio?->Calle,
                'NumInterior' => $proveedor->domicilio?->NumInterior,
                'NumExterior' => $proveedor->domicilio?->NumExterior,
            ],
            'FechaRegistro' => $proveedor->FechaRegistro,
            'Activo' => $proveedor->Activo,
        ];

        return ResponseHelper::success($proveedorFormateado, 'Detalles del proveedor obtenidos correctamente');
    }

    //Eliminar Proveedor
    public function EliminarProveedor($id)
    {
        $proveedor = Proveedores::find($id);

        if (!$proveedor) {
            return ResponseHelper::error('Proveedor no encontrado', 404);
        }

        try {
            DB::transaction(function () use ($proveedor) {
                $IDDomicilio = $proveedor->IDDomicilio;
                $proveedor->delete();
                $domicilioEnUso = Proveedores::where(
                    'IDDomicilio',
                    $IDDomicilio
                )->exists();

                //Si no se usa se elimina
                if (!$domicilioEnUso) {
                    $domicilio = Domicilios::find($IDDomicilio);
                    if ($domicilio) {
                        $domicilio->delete();
                    }
                }
            });

            return ResponseHelper::success($proveedor, 'Proveedor eliminado correctamente');
        } catch (\Exception $e) {
            return ResponseHelper::error('Error al eliminar el proveedor: ' . $e->getMessage(), 500);
        }
    }
}
