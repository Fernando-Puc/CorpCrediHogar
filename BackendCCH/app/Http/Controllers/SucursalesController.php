<?php

namespace App\Http\Controllers;

use App\Models\Sucursales;
use Illuminate\Http\Request;
use App\Helpers\ResponseHelper;
use App\Models\Domicilios;
use Illuminate\Support\facades\DB;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;

class SucursalesController extends Controller
{
    //Obtener Sucursales Registrados
    public function ObtenerSucursales()
    {
        $sucursales = Sucursales::with([
            'domicilio'
        ])->get();

        $sucursalesFormateadas = $sucursales->map(function ($sucursal) {
            return [
                'IDSucursal' => $sucursal->IDSucursal,
                'Codigo' => $sucursal->Codigo,
                'Nombre' => $sucursal->Nombre,
                'FechaRegistro' => $sucursal->FechaRegistro,
                'Activo' => $sucursal->Activo,
                'domicilios' => [
                    'IDDomicilio' => $sucursal->domicilio?->IDDomicilio,
                    'Pais' => $sucursal->domicilio?->Pais,
                    'CodigoPostal' => $sucursal->domicilio?->CodigoPostal,
                    'Estado' => $sucursal->domicilio?->Estado,
                    'Municipio' => $sucursal->domicilio?->Municipio,
                    'Ciudad' => $sucursal->domicilio?->Ciudad,
                    'Colonia' => $sucursal->domicilio?->Colonia,
                    'Calle' => $sucursal->domicilio?->Calle,
                    'NumInterior' => $sucursal->domicilio->NumInterior,
                    'NumExterior' => $sucursal->domicilio->NumExterior,
                ],
            ];
        });

        return ResponseHelper::success($sucursalesFormateadas, 'Catálogo de sucursales obtenido correctamente');
    }

    public function VerSucursal($id)
    {
        $sucursal = Sucursales::with('domicilio')->findOrFail($id);
        $sucursalFormateado = [
            'IDSucursal' => $sucursal->IDSucursal,
            'Codigo' => $sucursal->Codigo,
            'Nombre' => $sucursal->Nombre,
            'domicilios' => [
                'IDDomicilio' => $sucursal->domicilio?->IDDomicilio,
                'Pais' => $sucursal->domicilio?->Pais,
                'CodigoPostal' => $sucursal->domicilio?->CodigoPostal,
                'Estado' => $sucursal->domicilio?->Estado,
                'Municipio' => $sucursal->domicilio?->Municipio,
                'Ciudad' => $sucursal->domicilio?->Ciudad,
                'Colonia' => $sucursal->domicilio?->Colonia,
                'Calle' => $sucursal->domicilio?->Calle,
                'NumInterior' => $sucursal->domicilio->NumInterior,
                'NumExterior' => $sucursal->domicilio->NumExterior,
            ],
            'FechaRegistro' => $sucursal->FechaRegistro,
            'Activo' => $sucursal->Activo,
        ];

        return ResponseHelper::success($sucursalFormateado, "Detalles de sucursal obtenidos correctamente.");
    }

    //Crear Sucursal
    public function CrearSucursal(Request $request)
    {
        $validator = Validator::make(
            $request->all(),
            [
                //Sucursal
                'Codigo' => 'required|string|max:255|unique:sucursales,Codigo',
                'Nombre' => 'required|string|max:255',

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
            $sucursal = DB::transaction(function () use ($request) {
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

                //Crear Sucursal
                $sucursal = new Sucursales();
                $sucursal->Codigo = $request->input('Codigo');
                $sucursal->Nombre = $request->input('Nombre');
                $sucursal->IDDomicilio = $domicilio->IDDomicilio;
                $sucursal->FechaRegistro = now()->toDateString();
                $sucursal->Activo = true;
                $sucursal->save();
                $sucursal->load('domicilio');
                return $sucursal;
            });

            return ResponseHelper::success($sucursal, 'sucursal registrada exitosamente', 201);
        } catch (\Exception $e) {
            return ResponseHelper::error('Error al registrar la sucursal: ' . $e->getMessage(), 500);
        }
    }

    //Actualizar sucursal
    public function ActualizarSucursal(Request $request, $id)
    {
        $sucursal = Sucursales::with('domicilio')->find($id);
        if (!$sucursal) {
            return ResponseHelper::error('Sucursal no encontrada', 404);
        }
        $validator = Validator::make(
            $request->all(),
            [
                //Sucursal
                'Codigo' => [
                    'required',
                    'string',
                    'max:255',
                    Rule::unique('sucursales', 'Codigo')->ignore($sucursal->IDSucursal, 'IDSucursal'),
                ],

                'Nombre' => 'required|string|max:255',

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
            return ResponseHelper::error($validator->errors()->first() . 400);
        }

        try {
            DB::transaction(function () use ($request, $sucursal) {
                //Actualizar domicilio
                $domicilio = $sucursal->domicilio;
                if (!$domicilio) {
                    throw new \Exception('La sucursal no tiene un domicilio asociado');
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

                //Actualizar Sucursal

                $sucursal->Codigo = $request->input('Codigo');
                $sucursal->Nombre = $request->input('Nombre');
                $sucursal->IDDomicilio = $domicilio->IDDomicilio;
                $sucursal->FechaRegistro = now()->toDateString();
                $sucursal->Activo = true;
                $sucursal->save();
            });

            $sucursal->load('domicilio');

            return ResponseHelper::success($sucursal, 'Sucursal actualizado correctamente');
        } catch (\Exception $e) {
            return ResponseHelper::error('Error al actualizar la sucursal: ' . $e->getMessage(), 500);
        }
    }

    //Eliminar Sucursal
    public function EliminarSucursal($id)
    {
        $sucursal = Sucursales::find($id);

        if (!$sucursal) {
            return ResponseHelper::error('sucursal no encontrada', 404);
        }

        try {
            DB::transaction(function () use ($sucursal) {
                $IDDomicilio = $sucursal->IDDomicilio;
                $sucursal->delete();
                $domicilioEnUso = Sucursales::where(
                    'IDDomicilio',
                    $IDDomicilio
                )->exists();

                //Si el domicilio no se usa, se elimina
                if (!$domicilioEnUso) {
                    $domicilio = Domicilios::find($IDDomicilio);
                    if ($domicilio) {
                        $domicilio->delete();
                    }
                }
            });

            return ResponseHelper::success($sucursal, 'Sucursal eliminada correctamente');
        } catch (\Exception $e) {
            return ResponseHelper::error('Error al eliminar la sucursal:' . $e->getMessage(), 500);
        }
    }
}
