<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\EmpresasController;
use App\Http\Controllers\LineaProductosController;
use App\Http\Controllers\MarcaProductosController;
use App\Http\Controllers\UnidadMedidaController;
use App\Http\Controllers\ProductosController;
use App\Http\Controllers\DomiciliosController;
use App\Http\Controllers\ProveedoresController;
use App\Http\Controllers\DomicilioController;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

//Empresas
Route::get('catalogs/empresas/', [EmpresasController::class, 'Obtenerempresas']);
Route::post('catalogs/crearempresa/', [EmpresasController::class, 'CrearEmpresa']);
Route::put('catalogs/actualizarempresa/{id}', [EmpresasController::class, 'ActualizarEmpresa']);
Route::delete('catalogs/eliminarempresa/{id}', [EmpresasController::class, 'EliminarEmpresa']);
Route::get('catalogs/verempresa/{id}', [EmpresasController::class, 'verEmpresa']);

//Lineas o clasificación de productos
Route::get('catalogs/lineas/', [LineaProductosController::class, 'ObtenerLineas']);
Route::post('catalogs/crearlinea/', [LineaProductosController::class, 'CrearLinea']);
Route::put('catalogs/actualizarlinea/{id}', [LineaProductosController::class, 'ActualizarLinea']);
Route::delete('catalogs/eliminarlinea/{id}', [LineaProductosController::class, 'EliminarLinea']);
Route::get('catalogs/verlinea/{id}', [LineaProductosController::class, 'verLinea']);

//Marcas de Productos
Route::get('catalogs/marcas/', [MarcaProductosController::class, 'ObtenerMarcas']);
Route::post('catalogs/crearmarca/', [MarcaProductosController::class, 'CrearMarca']);
Route::put('catalogs/actualizarmarca/{id}', [MarcaProductosController::class, 'ActualizarMarca']);
Route::delete('catalogs/eliminarmarca/{id}', [MarcaProductosController::class, 'EliminarMarca']);
Route::get('catalogs/vermarca/{id}', [MarcaProductosController::class, 'verMarca']);

//Unidades de Medida
Route::get('catalogs/umedida/', [UnidadMedidaController::class, 'ObtenerUnidades']);
Route::post('catalogs/crearunidad', [UnidadMedidaController::class, 'CrearUnidadMedida']);
Route::put('catalogs/actualizarunidad/{id}', [UnidadMedidaController::class, 'ActualizarUnidad']);
Route::delete('catalogs/eliminarunidad/{id}', [UnidadMedidaController::class, 'EliminarUnidad']);
Route::get('catalogs/verunidad/{id}', [UnidadMedidaController::class, 'VerUnidadMedida']);

//Catálogo de productos
Route::get('catalogs/productos/', [ProductosController::class, 'ObtenerProductos']);
Route::post('catalogs/registrarproducto', [ProductosController::class, 'CrearProducto']);
Route::put('catalogs/actualizarproducto/{id}', [ProductosController::class, 'ActualizarProducto']);
Route::delete('catalogs/eliminarproducto/{id}', [ProductosController::class, 'EliminarProducto']);
Route::get('catalogs/verproducto/{id}', [ProductosController::class, 'VerProducto']);

//Catalogo de Domicilios
Route::get('catalogs/domicilios/', [DomiciliosController::class, 'ObtenerDomicilios']);
Route::post('catalogs/registrardomicilio', [DomiciliosController::class, 'CrearDomicilio']);
Route::put('catalogs/actualizardomicilio/{id}', [DomiciliosController::class, 'ActualizarDomicilio']);
Route::get('catalogs/verdomicilio/{id}', [DomiciliosController::class, 'VerDomicilio']);
Route::delete('catalogs/eliminardomicilio/{id}', [DomiciliosController::class, 'EliminarDomicilio']);

//Catálogo de Proveedores
Route::get('catalogs/proveedores', [ProveedoresController::class, 'ObtenerProveedores']);
Route::post('catalogs/crearproveedor', [ProveedoresController::class, 'CrearProveedor']);
Route::put('catalogs/actualizarproveedor/{id}', [ProveedoresController::class, 'ActualizarProveedor']);
Route::get('catalogs/verproveedor/{id}', [ProveedoresController::class, 'VerProveedor']);
Route::delete('catalogs/eliminarproveedor/{id}', [ProveedoresController::class, 'EliminarProveedor']);

//Catálogo de domicilios
Route::get('catalogs/codigopostal/{cp}', [DomicilioController::class, 'buscarPorCP']);
