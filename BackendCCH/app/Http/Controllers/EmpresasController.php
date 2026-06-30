<?php

namespace App\Http\Controllers;
use App\Models\Empresas;
use App\Helpers\ResponseHelper;
use Illuminate\Support\Facades\Validator;
use Illuminate\Http\Request;

class EmpresasController extends Controller
{
    //Obtener todas las empresas
    public function ObtenerEmpresas()
    {
        $empresas = Empresas::all();
        return ResponseHelper::success($empresas, 'Empresas obtenidas correctamente');
    }

    //Crear una empresa
    public function CrearEmpresa(Request $request)
    {
        $validator = Validator::make($request->all(),
        [
            'Folio' => 'required|string|max:255|unique:empresas,Folio',
            'Nombre' => 'required|string|max:255|unique:empresas,Nombre'
        ]);

        if ($validator->fails()){
            return ResponseHelper::error($validator->errors()->first(), 400);
        }

        $empresa = new Empresas();
        $empresa-> Folio = $request->input('Folio');
        $empresa-> Nombre = $request->input('Nombre');

        if ($empresa->save()){
            return ResponseHelper::success($empresa, 'Empresa creada exitosamente', 201);
        }else{
            return ResponseHelper::error ('Error al crear empresa', 500);
        }
    }

    //Actualizar empresa
    public function ActualizarEmpresa(Request $request, $id)
    {
        $empresa = Empresas::find($id);

        if (!$empresa) {
            return ResponseHelper::error('Empresa no encontrada', 404);
        }

        $validator = Validator::make($request->all(), [
            'Folio' => 'required|string|max:255|unique:empresas,Folio,' . $id . ',IDEmpresa',
            'Nombre' => 'required|string|max:255|unique:empresas,Nombre,' . $id . ',IDEmpresa'
        ]);

        if ($validator->fails()) {
            return ResponseHelper::error($validator->errors()->first(), 400);
        }

        $empresa->Folio = $request->input('Folio');
        $empresa->Nombre = $request->input('Nombre');

        if ($empresa->save()) {
            return ResponseHelper::success($empresa, 'Empresa actualizada correctamente');
        }

        return ResponseHelper::error('Error al actualizar empresa', 500);
    }


    //Eliminar empresa

    public function EliminarEmpresa($id)
    {
        $empresa = Empresas::findOrFail($id);
        $empresa->delete();

        Return ResponseHelper::success($empresa, 'Empresa eliminiada correctamente');
    }
}
