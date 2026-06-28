<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\EmpresasController;

Route::get('/', function () {
    return view('welcome');
});

//Empresas

Route::get('catalogs/empresas/', [EmpresasController::class, 'Obtenerempresas']);
