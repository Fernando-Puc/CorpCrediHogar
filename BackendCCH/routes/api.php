<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\EmpresasController;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

//Empresas
Route::get('catalogs/empresas/', [EmpresasController::class, 'Obtenerempresas']);
Route::post('catalogs/crearempresa/', [EmpresasController::class, 'CrearEmpresa']);
Route::put('catalogs/actualizarempresa/{id}', [EmpresasController::class, 'ActualizarEmpresa']);
Route::delete('catalogs/eliminarempresa/{id}', [EmpresasController::class, 'EliminarEmpresa']);
