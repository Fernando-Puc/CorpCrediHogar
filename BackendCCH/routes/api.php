<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\EmpresasController;
use App\Http\Controllers\LineaProductosController;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

//Empresas
Route::get('catalogs/empresas/', [EmpresasController::class, 'Obtenerempresas']);
Route::post('catalogs/crearempresa/', [EmpresasController::class, 'CrearEmpresa']);
Route::put('catalogs/actualizarempresa/{id}', [EmpresasController::class, 'ActualizarEmpresa']);
Route::delete('catalogs/eliminarempresa/{id}', [EmpresasController::class, 'EliminarEmpresa']);

//Lineas o clasificación de productos
Route::get('catalogs/lineas/', [LineaProductosController::class, 'ObtenerLineas']);
Route::post('catalogs/crearlinea/', [LineaProductosController::class, 'CrearLinea']);
Route::put('catalogs/actualizarlinea/{id}', [LineaProductosController::class, 'ActualizarLinea']);
Route::delete('catalogs/eliminarlinea/{id}', [LineaProductosController::class, 'EliminarLinea']);
